"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
const issues_helpers_js_2 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('IssueView cache', async () => {
    (0, mocha_extensions_js_1.it)('should correctly update the issue', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        async function triggerIssue() {
            await target.evaluate(async () => {
                const url = new URL('./issues/acac-invalid.rawresponse', document.location.toString())
                    .toString()
                    .replace('localhost', 'devtools.oopif.test');
                try {
                    await fetch(url, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ geeting: 'hello' }),
                    });
                }
                catch (e) {
                }
                try {
                    await fetch(url, { credentials: 'include' });
                }
                catch (e) {
                }
            });
        }
        await triggerIssue();
        await (0, issues_helpers_js_2.navigateToIssuesTab)();
        async function waitForResources(numberOfAggregatedIssues, expectedTableRows) {
            await (0, issues_helpers_js_2.expandIssue)();
            const issueElement = await (0, issues_helpers_js_2.getIssueByTitle)('Ensure CORS requests include credentials only when allowed');
            (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
            const section = await (0, issues_helpers_js_1.getResourcesElement)('requests', issueElement, '.cors-issue-affected-resource-label');
            await (0, helper_js_1.waitForFunction)(async () => {
                const text = await section.label.evaluate(el => el.textContent);
                const expected = numberOfAggregatedIssues === 1 ? '1 request' : `${numberOfAggregatedIssues} requests`;
                return text === expected;
            });
            await (0, issues_helpers_js_2.ensureResourceSectionIsExpanded)(section);
            await (0, issues_helpers_js_2.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
            const adorner = await (0, helper_js_1.waitFor)('devtools-adorner');
            const count = await adorner.evaluate(el => el.textContent);
            chai_1.assert.strictEqual(count, `${numberOfAggregatedIssues}`);
        }
        const header = [
            'Request',
            'Status',
            'Preflight Request (if problematic)',
            'Access-Control-Allow-Credentials Header Value',
        ];
        const expectedRow1 = [
            'acac-invalid.rawresponse',
            'blocked',
            'acac-invalid.rawresponse',
            'false',
        ];
        const expectedRow2 = [
            'acac-invalid.rawresponse',
            'blocked',
            '',
            'false',
        ];
        await waitForResources(2, [header, expectedRow1, expectedRow2]);
        await (0, helper_js_1.setCheckBox)('[aria-label="Include third-party cookie issues"]', true);
        // Trigger issue again to see if resources are updated.
        await triggerIssue();
        await waitForResources(4, [header, expectedRow1, expectedRow2, expectedRow1, expectedRow2]);
    });
});
//# sourceMappingURL=issue-view-caching_test.js.map