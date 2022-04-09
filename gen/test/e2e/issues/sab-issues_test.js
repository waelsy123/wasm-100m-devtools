"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('SAB issues test', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.goToResource)('issues/sab-issue.rawresponse');
    });
    (0, mocha_extensions_js_1.it)('should display SharedArrayBuffer violations with the correct affected resources', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const issueElement = await (0, issues_helpers_js_1.getAndExpandSpecificIssueByTitle)('SharedArrayBuffer usage is restricted to cross-origin isolated sites');
        chai_1.assert.isNotNull(issueElement);
        if (issueElement) {
            const section = await (0, issues_helpers_js_1.getResourcesElement)('violation', issueElement);
            const text = await section.label.evaluate(el => el.textContent);
            chai_1.assert.strictEqual(text, '2 violations');
            await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
            const expectedTableRows = [
                ['Source Location', 'Trigger', 'Status'],
                ['corp-frame.rawresponse:1', 'Instantiation', /warning|blocked/],
                ['corp-frame.rawresponse:1', 'Transfer', /warning|blocked/],
            ];
            await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
        }
    });
});
//# sourceMappingURL=sab-issues_test.js.map