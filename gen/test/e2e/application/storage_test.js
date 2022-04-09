"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const application_helpers_js_1 = require("../helpers/application-helpers.js");
// The parent suffix makes sure we wait for the Cookies item to have children before trying to click it.
const COOKIES_SELECTOR = '[aria-label="Cookies"].parent';
const STORAGE_SELECTOR = '[aria-label="Storage"]';
const CLEAR_SITE_DATA_BUTTON_SELECTOR = '#storage-view-clear-button';
const INCLUDE_3RD_PARTY_COOKIES_SELECTOR = '[aria-label="including third-party cookies"]';
let DOMAIN_SELECTOR;
(0, mocha_extensions_js_1.describe)('The Application Tab', async () => {
    before(async () => {
        DOMAIN_SELECTOR = `${COOKIES_SELECTOR} + ol > [aria-label="https://localhost:${(0, helper_js_1.getTestServerPort)()}"]`;
    });
    afterEach(async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        const cookies = await target.cookies();
        await target.deleteCookie(...cookies);
    });
    (0, mocha_extensions_js_1.it)('deletes only first party cookies when clearing site data', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cross-origin-cookies');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        const dataGridRowValuesBefore = await (0, helper_js_1.waitForFunction)(async () => {
            const data = await (0, application_helpers_js_1.getStorageItemsData)(['name', 'value']);
            return data.length ? data : undefined;
        });
        chai_1.assert.sameDeepMembers(dataGridRowValuesBefore, [
            {
                name: 'third_party',
                value: 'test',
            },
            {
                name: 'foo2',
                value: 'bar',
            },
            {
                name: 'foo',
                value: 'bar',
            },
        ]);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(STORAGE_SELECTOR);
        await (0, helper_js_1.click)(CLEAR_SITE_DATA_BUTTON_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        const dataGridRowValuesAfter = await (0, helper_js_1.waitForFunction)(async () => {
            const data = await (0, application_helpers_js_1.getStorageItemsData)(['name', 'value']);
            return data.length ? data : undefined;
        });
        chai_1.assert.sameDeepMembers(dataGridRowValuesAfter, [{
                name: 'third_party',
                value: 'test',
            }]);
    });
    (0, mocha_extensions_js_1.it)('deletes first and third party cookies when clearing site data with the flag enabled', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // This sets a new cookie foo=bar
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cross-origin-cookies');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        const dataGridRowValuesBefore = await (0, helper_js_1.waitForFunction)(async () => {
            const data = await (0, application_helpers_js_1.getStorageItemsData)(['name', 'value']);
            return data.length ? data : undefined;
        });
        chai_1.assert.sameDeepMembers(dataGridRowValuesBefore, [
            {
                name: 'third_party',
                value: 'test',
            },
            {
                name: 'foo2',
                value: 'bar',
            },
            {
                name: 'foo',
                value: 'bar',
            },
        ]);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(STORAGE_SELECTOR);
        await (0, helper_js_1.click)(INCLUDE_3RD_PARTY_COOKIES_SELECTOR);
        await (0, helper_js_1.click)(CLEAR_SITE_DATA_BUTTON_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        await (0, helper_js_1.waitForFunction)(async () => {
            const data = await (0, application_helpers_js_1.getStorageItemsData)(['name', 'value']);
            return data.length === 0;
        });
    });
    (0, mocha_extensions_js_1.describe)('the Storage pane', async function () {
        // The tests in this suite are particularly slow, as they perform a lot of actions
        this.timeout(20000);
        beforeEach(async () => {
            const { target } = (0, helper_js_1.getBrowserAndPages)();
            await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'storage-quota');
            await (0, application_helpers_js_1.doubleClickSourceTreeItem)(STORAGE_SELECTOR);
        });
        (0, mocha_extensions_js_1.it)('clear button clears storage correctly', async () => {
            const { target } = (0, helper_js_1.getBrowserAndPages)();
            await target.evaluate(async () => {
                const array = [];
                for (let i = 0; i < 20000; i++) {
                    array.push(i % 10);
                }
                // @ts-ignore
                await new Promise(resolve => createDatabase(resolve, 'Database1'));
                // @ts-ignore
                await new Promise(resolve => createObjectStore(resolve, 'Database1', 'Store1', 'id', true));
                // @ts-ignore
                await new Promise(resolve => addIDBValue(resolve, 'Database1', 'Store1', { key: 1, value: array }, ''));
            });
            await (0, application_helpers_js_1.waitForQuotaUsage)(quota => quota > 20000);
            await (0, helper_js_1.click)(CLEAR_SITE_DATA_BUTTON_SELECTOR, { clickOptions: { delay: 250 } });
            await (0, application_helpers_js_1.waitForQuotaUsage)(quota => quota === 0);
        });
        (0, mocha_extensions_js_1.it)('reports storage correctly, including the pie chart legend', async () => {
            const { target } = (0, helper_js_1.getBrowserAndPages)();
            await target.evaluate(async () => {
                const array = [];
                for (let i = 0; i < 20000; i++) {
                    array.push(i % 10);
                }
                // @ts-ignore
                await new Promise(resolve => createDatabase(resolve, 'Database1'));
                // @ts-ignore
                await new Promise(resolve => createObjectStore(resolve, 'Database1', 'Store1', 'id', true));
                // @ts-ignore
                await new Promise(resolve => addIDBValue(resolve, 'Database1', 'Store1', { key: 1, value: array }, ''));
            });
            await (0, application_helpers_js_1.waitForQuotaUsage)(quota => quota > 20000);
            const rows = await (0, application_helpers_js_1.getPieChartLegendRows)();
            // Only assert that the legend entries are correct.
            chai_1.assert.strictEqual(rows.length, 2);
            chai_1.assert.strictEqual(rows[0][2], 'IndexedDB');
            chai_1.assert.strictEqual(rows[1][2], 'Total');
        });
    });
});
//# sourceMappingURL=storage_test.js.map