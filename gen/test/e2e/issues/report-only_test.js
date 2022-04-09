"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('The Issues tab report-only issues', async () => {
    (0, mocha_extensions_js_1.it)('should report the violation as blocked', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        await (0, issues_helpers_js_1.assertStatus)('blocked');
    });
    (0, mocha_extensions_js_1.it)('should report the violation as report-only', async () => {
        await (0, helper_js_1.goToResource)('network/csp-report-only.rawresponse');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        await (0, issues_helpers_js_1.assertStatus)('report-only');
    });
});
//# sourceMappingURL=report-only_test.js.map