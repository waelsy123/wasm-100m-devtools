"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const EXPECTED_TEXT_CONTENT = '<div class=\u200B"div2">\u200B last child \u200B</div>\u200B';
(0, mocha_extensions_js_1.describe)('Element breadcrumbs', async () => {
    beforeEach(async function () {
        await (0, helper_js_1.goToResource)('elements/element-breadcrumbs.html');
        await (0, elements_helpers_js_1.waitForElementsStyleSection)();
        // Check to make sure we have the correct node selected after opening a file
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        // expand the tree and then navigate down to the target node
        await (0, elements_helpers_js_1.expandSelectedNodeRecursively)();
        const targetChildNode = await (0, helper_js_1.waitForElementWithTextContent)(EXPECTED_TEXT_CONTENT);
        await (0, helper_js_1.click)(targetChildNode);
        // double check we got to the node we expect
        await (0, elements_helpers_js_1.waitForSelectedTreeElementSelectorWithTextcontent)(EXPECTED_TEXT_CONTENT);
        await (0, elements_helpers_js_1.assertSelectedElementsNodeTextIncludes)('last child');
    });
    (0, mocha_extensions_js_1.it)('lists all the elements in the tree', async () => {
        const expectedCrumbsText = [
            'html',
            'body',
            'div#div1',
            'span#span1',
            'div.div2',
        ];
        const actualCrumbsText = await (0, elements_helpers_js_1.getBreadcrumbsTextContent)({ expectedNodeCount: expectedCrumbsText.length });
        chai_1.assert.deepEqual(actualCrumbsText, expectedCrumbsText);
    });
    (0, mocha_extensions_js_1.it)('correctly highlights the active node', async () => {
        // Wait for the crumbs to render with all the elements we expect.
        await (0, elements_helpers_js_1.getBreadcrumbsTextContent)({ expectedNodeCount: 5 });
        const selectedCrumbText = await (0, elements_helpers_js_1.getSelectedBreadcrumbTextContent)();
        chai_1.assert.strictEqual(selectedCrumbText, 'div.div2');
    });
});
//# sourceMappingURL=element-breadcrumbs_test.js.map