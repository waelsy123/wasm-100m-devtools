"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
// TODO: Add a second node reveal test, where am issue is produced by an OOPIF
(0, mocha_extensions_js_1.describe)('The Issues tab', async () => {
    (0, mocha_extensions_js_1.it)('should reveal an element in the Elements panel when the node icon is clicked', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        await (0, issues_helpers_js_1.revealNodeInElementsPanel)();
        await (0, elements_helpers_js_1.waitForSelectedTreeElementSelectorWhichIncludesText)('alert("This should be blocked by CSP");');
    });
});
(0, mocha_extensions_js_1.describe)('The Elements panel', async () => {
    (0, mocha_extensions_js_1.it)('has a context menu link from an iframe to the corresponding frame details view', async () => {
        await (0, helper_js_1.goToResource)('application/main-frame.html');
        await (0, sources_helpers_js_1.clickOnContextMenu)('[aria-label="</iframe>"]', 'Show iframe details');
        await (0, helper_js_1.step)('Frame details report with correct title is shown', async () => {
            await (0, helper_js_1.waitForFunction)(async () => {
                const reportTitleNode = await (0, helper_js_1.waitFor)('.report-title');
                const reportTitle = await reportTitleNode.evaluate(e => e.textContent);
                return reportTitle === 'frameId (iframe.html)';
            });
        });
        await (0, helper_js_1.step)('The correct frame is selected in the sidebar', async () => {
            await (0, helper_js_1.waitFor)('[aria-label="frameId (iframe.html)"][aria-selected="true"]');
        });
    });
});
//# sourceMappingURL=reveal-correct-node_test.js.map