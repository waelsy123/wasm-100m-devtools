"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('Issue links in the console tab', async () => {
    // Skipping the test for now as the backend functionality was reverted.
    mocha_extensions_js_1.it.skip('[crbug.com/1241860] should reveal the right issue', async () => {
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, helper_js_1.goToResource)('issues/cors-issue-2.html');
        const issueLinkIcon = await (0, helper_js_1.waitFor)('devtools-issue-link-icon');
        const devtoolsIcon = await (0, helper_js_1.waitFor)('devtools-icon', issueLinkIcon);
        // There are several TypeErrors in the console, we don't care which one we get.
        const issueTitleFromLink = await (0, helper_js_1.waitForFunction)(async () => {
            const title = await devtoolsIcon.evaluate(el => el.title);
            const titleStart = 'Click to open the issue tab and show issue: ';
            if (title.startsWith(titleStart)) {
                return title.substr(titleStart.length);
            }
            return undefined;
        });
        issueLinkIcon.click();
        const selectedIssueTitleElement = await (0, helper_js_1.waitFor)('li.issue.expanded.selected');
        const selectedIssueTitle = await selectedIssueTitleElement.evaluate(el => el.textContent);
        // The '1' is the number of issues aggregated.
        chai_1.assert.strictEqual(selectedIssueTitle, `1${issueTitleFromLink}`);
    });
});
//# sourceMappingURL=issue-links_test.js.map