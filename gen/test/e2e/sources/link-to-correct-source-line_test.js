"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('The Issues tab', async () => {
    // This test is failing on Windows.
    mocha_extensions_js_1.it.skip('[crbug.com/1157427]: should highlight a line in the Sources panel when the link is clicked', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        await (0, issues_helpers_js_1.revealViolatingSourcesLines)();
        await (0, sources_helpers_js_1.waitForHighlightedLineWhichIncludesText)('<script class="violating-script">');
    });
});
//# sourceMappingURL=link-to-correct-source-line_test.js.map