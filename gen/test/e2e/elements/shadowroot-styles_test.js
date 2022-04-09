"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
(0, mocha_extensions_js_1.describe)('The Elements Tab', async () => {
    (0, mocha_extensions_js_1.it)('can show styles in shadow roots', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('elements/shadow-roots.html');
        // Wait for the file to be loaded and selectors to be shown
        await (0, helper_js_1.waitFor)('.styles-selector');
        // Check to make sure we have the correct node selected after opening a file
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        // FIXME(crbug/1112692): Refactor test to remove the timeout.
        await (0, helper_js_1.timeout)(50);
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"host">\u200B…\u200B</div>\u200B');
        // Open the div (shows new nodes, but does not alter the selected node)
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"host">\u200B');
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('#shadow-root (open)');
        // Open the shadow root (shows new nodes, but does not alter the selected node)
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForChildrenOfSelectedElementNode)();
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('#shadow-root (open)');
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<style>\u200B .red { color: red; } \u200B</style>\u200B');
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"inner" class=\u200B"red">\u200Bhi!\u200B</div>\u200B');
        await (0, helper_js_1.waitForFunction)(async () => {
            const styleSections = await (0, helper_js_1.$$)('.styles-section');
            const numFound = styleSections.length;
            return numFound === 3;
        });
        const styleSections = await (0, helper_js_1.$$)('.styles-section');
        const selectorTexts = await Promise.all(styleSections.map(n => n.evaluate(node => node.textContent)));
        chai_1.assert.deepEqual(selectorTexts, [
            'element.style {}',
            '<style>.red {}',
            'user agent stylesheetdiv {}',
        ]);
    });
});
//# sourceMappingURL=shadowroot-styles_test.js.map