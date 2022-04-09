"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('IssueView', async () => {
    (0, mocha_extensions_js_1.it)('should be parented in issueTree when not groupedByCategory', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (await (0, issues_helpers_js_1.getGroupByCategoryChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByCategory)();
        }
        const issue = await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
        (0, helper_js_1.assertNotNullOrUndefined)(issue);
        const parent = await issue.evaluate(node => node.parentElement?.classList.contains('issue-category-body'));
        chai_1.assert.isFalse(parent);
    });
    (0, mocha_extensions_js_1.it)('should be parented in IssueCategoryView when groupedByCategory', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (!await (0, issues_helpers_js_1.getGroupByCategoryChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByCategory)();
        }
        const issue = await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
        (0, helper_js_1.assertNotNullOrUndefined)(issue);
        const parent = await issue.evaluate(node => node.parentElement?.classList.contains('issue-category-body'));
        chai_1.assert.isTrue(parent);
    });
    (0, mocha_extensions_js_1.it)('should reparent correctly after parent change', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (await (0, issues_helpers_js_1.getGroupByCategoryChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByCategory)();
        }
        let category = await (0, helper_js_1.$$)(issues_helpers_js_1.CATEGORY);
        chai_1.assert.isEmpty(category);
        const issue = await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
        (0, helper_js_1.assertNotNullOrUndefined)(issue);
        const parent = await issue.evaluate(node => node.parentElement?.classList.contains('issue-category-body'));
        chai_1.assert.isFalse(parent);
        await (0, issues_helpers_js_1.toggleGroupByCategory)();
        category = await (0, helper_js_1.$$)(issues_helpers_js_1.CATEGORY);
        chai_1.assert.isNotEmpty(category);
        const reparentedIssue = await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
        (0, helper_js_1.assertNotNullOrUndefined)(issue);
        const newParent = await reparentedIssue.evaluate(node => node.parentElement?.classList.contains('issue-category-body'));
        chai_1.assert.isTrue(newParent);
    });
});
//# sourceMappingURL=issue-view-reparent_test.js.map