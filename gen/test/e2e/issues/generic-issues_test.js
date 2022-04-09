"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Cross-origin portal post message issue', async () => {
    (0, mocha_extensions_js_1.it)('should display correct information', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Cross-origin portal post messages are blocked on your site');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 resource', issueElement);
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            ['Frame'],
            [`https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/issues/cross-origin-portal-post.html`],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should handle multiple issue correctly', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post-2.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Cross-origin portal post messages are blocked on your site');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('2 resources', issueElement);
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            ['Frame'],
            [`https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/issues/cross-origin-portal-post-2.html`],
            [`https://devtools.xorigin.test:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/issues/cross-origin-portal-post.html`],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should remove issue on update', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Cross-origin portal post messages are blocked on your site');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, helper_js_1.waitForNone)(issues_helpers_js_1.ISSUE);
    });
});
//# sourceMappingURL=generic-issues_test.js.map