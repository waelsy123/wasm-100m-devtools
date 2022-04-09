"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const application_helpers_js_1 = require("../helpers/application-helpers.js");
const SESSION_STORAGE_SELECTOR = '[aria-label="Session Storage"].parent';
let DOMAIN_SELECTOR;
describe('The Application Tab', async () => {
    before(async () => {
        DOMAIN_SELECTOR = `${SESSION_STORAGE_SELECTOR} + ol > [aria-label="https://localhost:${(0, helper_js_1.getTestServerPort)()}"]`;
    });
    it('shows Session Storage keys and values', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('navigate to session-storage resource and open Application tab', async () => {
            await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'session-storage');
        });
        await (0, helper_js_1.step)('open the domain storage', async () => {
            await (0, application_helpers_js_1.doubleClickSourceTreeItem)(SESSION_STORAGE_SELECTOR);
            await (0, application_helpers_js_1.doubleClickSourceTreeItem)(DOMAIN_SELECTOR);
        });
        await (0, helper_js_1.step)('check that storage data values are correct', async () => {
            const dataGridRowValues = await (0, application_helpers_js_1.getStorageItemsData)(['key', 'value']);
            chai_1.assert.deepEqual(dataGridRowValues, [
                {
                    key: 'firstKey',
                    value: 'firstValue',
                },
                {
                    key: 'secondKey',
                    value: '{"field":"complexValue","primitive":2}',
                },
            ]);
        });
    });
});
//# sourceMappingURL=session-storage_test.js.map