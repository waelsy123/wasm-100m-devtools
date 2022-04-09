"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('The Issues tab group by kind checkbox', async () => {
    (0, mocha_extensions_js_1.it)('should group issues by associated kinds when checked', async () => {
        await (0, helper_js_1.enableExperiment)('groupAndHideIssuesByKind');
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (!await (0, issues_helpers_js_1.getGroupByKindChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByKind)();
        }
        await (0, issues_helpers_js_1.expandKind)('.page-errors');
        const issue = await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
        const isParentedByKind = await issue.evaluate(node => node.parentElement?.classList.contains('issue-kind-body'));
        (0, helper_js_1.assertNotNullOrUndefined)(isParentedByKind);
        chai_1.assert.isTrue(isParentedByKind);
    });
    (0, mocha_extensions_js_1.it)('should display issues in the issueTree when not checked', async () => {
        await (0, helper_js_1.enableExperiment)('groupAndHideIssuesByKind');
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (await (0, issues_helpers_js_1.getGroupByKindChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByKind)();
        }
        const issue = await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
        const isParentedByKind = await issue.evaluate(node => node.parentElement?.classList.contains('issue-kind-body'));
        (0, helper_js_1.assertNotNullOrUndefined)(isParentedByKind);
        chai_1.assert.isFalse(isParentedByKind);
    });
});
//# sourceMappingURL=group-by-kind_test.js.map