"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const application_helpers_js_1 = require("../helpers/application-helpers.js");
const cross_tool_helper_js_1 = require("../helpers/cross-tool-helper.js");
const quick_open_helpers_js_1 = require("../helpers/quick_open-helpers.js");
const NETWORK_TAB_SELECTOR = '#tab-network';
const SERVICE_WORKER_ROW_SELECTOR = '[aria-label="Service Workers"]';
const TEST_HTML_FILE = 'service-worker-network';
const SERVICE_WORKER_NETWORK_SELECTOR = '[aria-label="Network requests"]';
(0, mocha_extensions_js_1.describe)('The Application Tab', async () => {
    (0, mocha_extensions_js_1.beforeEach)(async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, TEST_HTML_FILE);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(SERVICE_WORKER_ROW_SELECTOR);
    });
    (0, mocha_extensions_js_1.it)('Clicking on Network requests for service worker should open Network panel in drawer and closing should move it back', async () => {
        await (0, helper_js_1.step)('Click on network requests for service worker should open network panel in drawer', async () => {
            await (0, helper_js_1.click)(SERVICE_WORKER_NETWORK_SELECTOR);
            await (0, cross_tool_helper_js_1.tabExistsInDrawer)(NETWORK_TAB_SELECTOR);
        });
        await (0, helper_js_1.step)('Close drawer and network tab should move back to main panel', async () => {
            await (0, quick_open_helpers_js_1.closeDrawer)();
            await (0, cross_tool_helper_js_1.tabExistsInMainPanel)(NETWORK_TAB_SELECTOR);
        });
    });
});
//# sourceMappingURL=service-worker-network_test.js.map