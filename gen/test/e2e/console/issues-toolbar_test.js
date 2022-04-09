"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.it)('shows the toolbar button for no issue correctly', async () => {
        // Navigate to page which causes no issues.
        await (0, helper_js_1.goToResource)('empty.html');
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.waitForIssueButtonLabel)('No Issues');
    });
    (0, mocha_extensions_js_1.it)('shows the toolbar button for one issue correctly', async () => {
        // Navigate to page which causes a CookieIssue.
        await (0, helper_js_1.goToResource)('console/cookie-issue.html');
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.waitForIssueButtonLabel)('1 Issue:');
    });
    (0, mocha_extensions_js_1.it)('shows the toolbar button for two issues correctly', async () => {
        // Navigate to page which causes two CookieIssue.
        await (0, helper_js_1.goToResource)('console/two-cookie-issues.html');
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.waitForIssueButtonLabel)('2 Issues:');
    });
    (0, mocha_extensions_js_1.it)('updates the toolbar button correctly', async () => {
        // Navigate to page which causes no issues.
        await (0, helper_js_1.goToResource)('empty.html');
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.waitForIssueButtonLabel)('No Issues');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(() => {
            // Trigger a CookieIssue.
            document.cookie = 'foo=bar;samesite=None';
        });
        await (0, console_helpers_js_1.waitForIssueButtonLabel)('1 Issue:');
    });
});
//# sourceMappingURL=issues-toolbar_test.js.map