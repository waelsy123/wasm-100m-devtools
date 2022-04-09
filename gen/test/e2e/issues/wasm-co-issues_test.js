"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Wasm cross-origin sharing issue', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.goToResourceWithCustomHost)('a.devtools.test', 'issues/wasm-co-sharing.html');
    });
    // Disabled until wasm module sharing is reenabled.
    mocha_extensions_js_1.it.skip('[crbug.com/1247980] should appear when cross-origin sharing a wasm module', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Share WebAssembly modules only between same-origin environments');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('module', issueElement);
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 module');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Wasm Module URL',
                'Source Origin',
                'Target Origin',
                'Status',
            ],
            [
                /.*a.devtools.test.*wasm/,
                /.*a.devtools.test.*/,
                /.*b.devtools.test.*/,
                /warning|blocked/,
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
});
//# sourceMappingURL=wasm-co-issues_test.js.map