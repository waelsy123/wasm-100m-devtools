"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
// Flaky tests
mocha_extensions_js_1.describe.skip('[crbug.com/1149334]: Browser', async () => {
    (0, mocha_extensions_js_1.it)('can reload a website after all closeable tools are closed', async () => {
        // Navigate to website
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('cross_tool/default.html');
        // Open a few closeable panels
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Animations');
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Rendering');
        const messages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
        await (0, helper_js_1.closeAllCloseableTabs)();
        await target.reload();
        // Website logs the Date, so it shouldn't be the same
        const newMessages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
        chai_1.assert.notDeepEqual(messages, newMessages);
    });
    (0, mocha_extensions_js_1.it)('can navigate to a new website after all closeable tools are closed', async () => {
        // Navigate to website
        const targetUrl = 'cross_tool/default.html';
        const secondTargetUrl = 'cross_tool/site_with_errors.html';
        await (0, helper_js_1.goToResource)(targetUrl);
        // Open a few closeable panels
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Animations');
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Rendering');
        await (0, helper_js_1.closeAllCloseableTabs)();
        // Navigate to a different website
        await (0, helper_js_1.goToResource)(secondTargetUrl);
    });
});
//# sourceMappingURL=browser_test.js.map