"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
(0, mocha_extensions_js_1.describe)('The Elements tab', async () => {
    // Flaky test
    mocha_extensions_js_1.it.skip('[crbug.com/1071851]: can delete elements in the tree', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('elements/selection-after-delete.html');
        // Wait for the file to be loaded and selectors to be shown
        await (0, elements_helpers_js_1.waitForElementsStyleSection)();
        // Check to make sure we have the correct node selected after opening a file
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        await (0, elements_helpers_js_1.expandSelectedNodeRecursively)();
        // Wait for the expansion and select the final child in the tree.
        const child = await (0, helper_js_1.waitForElementWithTextContent)('child2');
        await (0, helper_js_1.click)(child);
        const expected = [
            '<div class=​"child3">\u200B</div>\u200B',
            '<div class=​"child1">\u200B</div>\u200B',
            '<div class=​"left">\u200B</div>\u200B',
            '<div id=​"testTreeContainer">\u200B</div>\u200B',
            '<body>\u200B</body>\u200B',
        ];
        // Start deleting and ensure that the selected child is the one expected.
        do {
            const nextVal = expected.shift() || '';
            const initialValue = await (0, elements_helpers_js_1.getContentOfSelectedNode)();
            await frontend.keyboard.press('Backspace');
            await (0, elements_helpers_js_1.waitForSelectedNodeChange)(initialValue);
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)(nextVal);
        } while (expected.length);
    });
});
//# sourceMappingURL=selection-after-delete_test.js.map