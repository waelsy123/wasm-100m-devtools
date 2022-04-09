"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('The Issues tab categories checkbox', async () => {
    (0, mocha_extensions_js_1.it)('should group issues by associated categories when checked', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (!await (0, issues_helpers_js_1.getGroupByCategoryChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByCategory)();
        }
        await (0, issues_helpers_js_1.expandCategory)();
        await (0, issues_helpers_js_1.assertCategoryName)('Content Security Policy');
        await (0, issues_helpers_js_1.expandIssue)();
        await (0, issues_helpers_js_1.assertIssueTitle)('Content Security Policy blocks inline execution of scripts and stylesheets');
    });
    (0, mocha_extensions_js_1.it)('should use a flat list of issues when not checked', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (await (0, issues_helpers_js_1.getGroupByCategoryChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByCategory)();
        }
        await (0, issues_helpers_js_1.expandIssue)();
        await (0, issues_helpers_js_1.assertIssueTitle)('Content Security Policy blocks inline execution of scripts and stylesheets');
    });
});
//# sourceMappingURL=group-by-categories_test.js.map