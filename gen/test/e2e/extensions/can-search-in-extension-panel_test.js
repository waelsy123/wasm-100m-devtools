"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const extension_helpers_js_1 = require("../helpers/extension-helpers.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const helper_js_1 = require("../../shared/helper.js");
const PAGE_TITLE = 'TestPanel';
(0, mocha_extensions_js_1.describe)('Extension panels', async () => {
    // Test fails a lot on mac currently
    mocha_extensions_js_1.it.skipOnPlatforms(['mac'], '[crbug.com/1249774] can perform search actions', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        const page = new URL(`${(0, helper_js_1.getResourcesPath)()}/extensions/test_panel.html`).pathname;
        await extension.evaluate(async (title, page) => {
            window.searchEvents = [];
            const panel = await new Promise(r => window.chrome.devtools.panels.create('TestPanel', '', page, r));
            panel.onSearch.addListener((action, queryString) => window.searchEvents.push({ action, queryString }));
        }, PAGE_TITLE, page);
        await (0, helper_js_1.click)(`[aria-label=${PAGE_TITLE}]`);
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('F');
        await frontend.keyboard.up('Control');
        const search = await (0, helper_js_1.waitFor)('#search-input-field');
        await search.type('abc');
        const queries = await (0, helper_js_1.waitForFunction)(() => {
            return extension.evaluate(() => window.searchEvents.length > 0 ? window.searchEvents : undefined);
        });
        chai_1.assert.deepEqual(queries, [{ action: 'performSearch', queryString: 'abc' }]);
    });
});
//# sourceMappingURL=can-search-in-extension-panel_test.js.map