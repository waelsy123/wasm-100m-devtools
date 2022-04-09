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
    (0, mocha_extensions_js_1.it)('shows cookies even when navigating to an unreachable page (crbug.com/1047348)', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // This sets a new cookie foo=bar
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cookies');
        await (0, helper_js_1.goToResource)('network/unreachable.rawresponse');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        const dataGridRowValues = await (0, application_helpers_js_1.getStorageItemsData)(['name', 'value']);
        chai_1.assert.deepEqual(dataGridRowValues, [
            {
                name: 'urlencoded',
                value: 'Hello%2BWorld!',
            },
            {
                name: '__Host-foo3',
                value: 'bar',
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
    });
    (0, mocha_extensions_js_1.it)('shows a preview of the cookie value (crbug.com/462370)', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // This sets a new cookie foo=bar
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cookies');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        await (0, application_helpers_js_1.selectCookieByName)('foo');
        await (0, helper_js_1.waitForFunction)(async () => {
            const previewValueNode = await (0, helper_js_1.waitFor)('.cookie-preview-widget-cookie-value');
            const previewValue = await previewValueNode.evaluate(e => e.textContent);
            return previewValue === 'bar';
        });
    });
    (0, mocha_extensions_js_1.it)('shows cookie partition key', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // This sets a new cookie foo=bar
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cookies');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        const dataGridRowValues1 = await (0, application_helpers_js_1.getStorageItemsData)(['partitionKey']);
        chai_1.assert.deepEqual(dataGridRowValues1, [
            {
                partitionKey: '',
            },
            {
                partitionKey: 'https://localhost',
            },
            {
                partitionKey: '',
            },
            {
                partitionKey: '',
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('can also show the urldecoded value (crbug.com/997625)', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // This sets a new cookie foo=bar
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cookies');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        await (0, helper_js_1.waitFor)('.cookies-table .data-grid-data-grid-node');
        await (0, helper_js_1.click)('.cookies-table .data-grid-data-grid-node');
        await (0, application_helpers_js_1.selectCookieByName)('urlencoded');
        await (0, helper_js_1.waitForFunction)(async () => {
            const previewValueNode = await (0, helper_js_1.waitFor)('.cookie-preview-widget-cookie-value');
            const previewValue = await previewValueNode.evaluate(e => e.textContent);
            return previewValue === 'Hello%2BWorld!';
        });
        await (0, helper_js_1.click)('[aria-label="Show URL decoded"]');
        await (0, helper_js_1.waitForFunction)(async () => {
            const previewValueNode = await (0, helper_js_1.waitFor)('.cookie-preview-widget-cookie-value');
            const previewValue = await previewValueNode.evaluate(e => e.textContent);
            return previewValue === 'Hello+World!';
        });
    });
    (0, mocha_extensions_js_1.it)('clears the preview value when clearing cookies (crbug.com/1086462)', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // This sets a new cookie foo=bar
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cookies');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        await (0, application_helpers_js_1.selectCookieByName)('foo');
        // Select a cookie first
        await (0, helper_js_1.waitForFunction)(async () => {
            const previewValueNode1 = await (0, helper_js_1.waitFor)('.cookie-preview-widget-cookie-value');
            const previewValue1 = await previewValueNode1.evaluate(e => e.textContent);
            return previewValue1 === 'bar';
        });
        await (0, application_helpers_js_1.clearStorageItems)();
        // Make sure that the preview resets
        await (0, helper_js_1.waitForFunction)(async () => {
            const previewValueNode2 = await (0, helper_js_1.waitFor)('.empty-view');
            const previewValue2 = await previewValueNode2.evaluate(e => e.textContent);
            return previewValue2.match(/Select a cookie to preview its value/);
        });
    });
    (0, mocha_extensions_js_1.it)('only clear currently visible cookies (crbug.com/978059)', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // This sets a new cookie foo=bar
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'cookies');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(COOKIES_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        const dataGridRowValues1 = await (0, application_helpers_js_1.getStorageItemsData)(['name']);
        chai_1.assert.deepEqual(dataGridRowValues1, [
            {
                name: 'urlencoded',
            },
            {
                name: '__Host-foo3',
            },
            {
                name: 'foo2',
            },
            {
                name: 'foo',
            },
        ]);
        await (0, application_helpers_js_1.filterStorageItems)('foo2');
        await (0, application_helpers_js_1.clearStorageItems)();
        await (0, application_helpers_js_1.clearStorageItemsFilter)();
        const dataGridRowValues2 = await (0, application_helpers_js_1.getStorageItemsData)(['name']);
        chai_1.assert.deepEqual(dataGridRowValues2, [
            {
                name: '__Host-foo3',
            },
            {
                name: 'urlencoded',
            },
            {
                name: 'foo',
            },
        ]);
    });
});
//# sourceMappingURL=cookies_test.js.map