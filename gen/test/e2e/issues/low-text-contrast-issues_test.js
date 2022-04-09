"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Low contrast issues', async () => {
    (0, mocha_extensions_js_1.it)('should report low contrast issues', async () => {
        await (0, helper_js_1.enableExperiment)('contrastIssues');
        await (0, helper_js_1.goToResource)('elements/low-contrast.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueTitle = 'Users may have difficulties reading text content due to insufficient color contrast';
        await (0, issues_helpers_js_1.assertIssueTitle)(issueTitle);
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('3 elements', issueElement);
        const expectedTableRows = [
            [
                'Element',
                'Contrast ratio',
                'Minimum AA ratio',
                'Minimum AAA ratio',
                'Text size',
                'Text weight',
            ],
            [
                'div#el1',
                '1',
                '4.5',
                '7',
                '16px',
                '400',
            ],
            [
                'span#el2',
                '1',
                '4.5',
                '7',
                '16px',
                '400',
            ],
            [
                'span#el3',
                '1.49',
                '4.5',
                '7',
                '16px',
                '400',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
});
//# sourceMappingURL=low-text-contrast-issues_test.js.map