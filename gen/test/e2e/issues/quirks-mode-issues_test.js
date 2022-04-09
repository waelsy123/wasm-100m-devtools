"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
const triggerQuirksModeIssueInIssuesTab = async (path) => {
    await (0, helper_js_1.goToResource)(path);
    await (0, issues_helpers_js_1.navigateToIssuesTab)();
    await (0, issues_helpers_js_1.expandIssue)();
    const issueTitle = 'Page layout may be unexpected due to Quirks Mode';
    await (0, issues_helpers_js_1.assertIssueTitle)(issueTitle);
    const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)(issueTitle);
    (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
    return issueElement;
};
(0, mocha_extensions_js_1.describe)('Quirks Mode issues', async () => {
    (0, mocha_extensions_js_1.it)('should report Quirks Mode issues', async () => {
        const issueElement = await triggerQuirksModeIssueInIssuesTab('elements/quirks-mode.html');
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 element', issueElement);
        const expectedTableRows = [
            [
                'Document in the DOM tree',
                'Mode',
                'URL',
            ],
            [
                'document',
                'Quirks Mode',
                `${(0, helper_js_1.getResourcesPath)()}/elements/quirks-mode.html`,
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should report Limited Quirks Mode issues', async () => {
        const issueElement = await triggerQuirksModeIssueInIssuesTab('elements/limited-quirks-mode.html');
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 element', issueElement);
        const expectedTableRows = [
            [
                'Document in the DOM tree',
                'Mode',
                'URL',
            ],
            [
                'document',
                'Limited Quirks Mode',
                `${(0, helper_js_1.getResourcesPath)()}/elements/limited-quirks-mode.html`,
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should report Quirks Mode issues in iframes', async () => {
        const issueElement = await triggerQuirksModeIssueInIssuesTab('elements/quirks-mode-iframes.html');
        const section = await (0, issues_helpers_js_1.getResourcesElement)('2 elements', issueElement);
        await (0, issues_helpers_js_1.waitForTableFromResourceSection)(section.content, table => {
            if (table.length !== 3) {
                return undefined;
            }
            if ((0, helper_js_1.matchStringArray)(table[0], [
                'Document in the DOM tree',
                'Mode',
                'URL',
            ]) !== true) {
                return undefined;
            }
            const [limitedQuirksMode, quirksMode] = table.slice(1).sort((rowA, rowB) => rowA[1].localeCompare(rowB[1]));
            if ((0, helper_js_1.matchStringArray)(limitedQuirksMode, [
                'document',
                'Limited Quirks Mode',
                `${(0, helper_js_1.getResourcesPath)()}/elements/limited-quirks-mode.html`,
            ]) !== true) {
                return undefined;
            }
            if ((0, helper_js_1.matchStringArray)(quirksMode, [
                'document',
                'Quirks Mode',
                `${(0, helper_js_1.getResourcesPath)()}/elements/quirks-mode.html`,
            ]) !== true) {
                return undefined;
            }
            return true;
        });
    });
});
//# sourceMappingURL=quirks-mode-issues_test.js.map