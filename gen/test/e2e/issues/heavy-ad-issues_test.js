"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Heavy Ad issue', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.goToResource)('empty.html');
    });
    (0, mocha_extensions_js_1.it)('should display correct information', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                'code': 'HeavyAdIssue',
                'details': {
                    'heavyAdIssueDetails': {
                        'resolution': 'HeavyAdBlocked',
                        'reason': 'NetworkTotalLimit',
                        'frame': { frameId: 'main' },
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
            const issue2 = {
                'code': 'HeavyAdIssue',
                'details': {
                    'heavyAdIssueDetails': {
                        'resolution': 'HeavyAdWarning',
                        'reason': 'CpuPeakLimit',
                        'frame': { frameId: 'main' },
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue2);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('An ad on your site has exceeded resource limits');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('2 resources', issueElement);
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            ['Limit exceeded', 'Resolution Status', 'Frame URL'],
            ['Network limit', 'Removed', /.*/],
            ['CPU peak limit', 'Warned', /.*/],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
});
//# sourceMappingURL=heavy-ad-issues_test.js.map