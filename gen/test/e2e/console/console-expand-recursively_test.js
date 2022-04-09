"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.it)('recursively expands objects', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, console_helpers_js_1.typeIntoConsole)(frontend, '({a: {x: 21}, b: {y: 42}})');
        // Expand the object node recursively
        await (0, console_helpers_js_1.clickOnContextMenu)('.console-view-object-properties-section', 'Expand recursively');
        const root = await (0, helper_js_1.waitFor)('.console-view-object-properties-section.expanded');
        // Ensure that both a and b are expanded.
        const [aChildren, bChildren] = await Promise.all([
            (0, helper_js_1.waitFor)('li[data-object-property-name-for-test="a"][aria-expanded=true] ~ ol.expanded', root),
            (0, helper_js_1.waitFor)('li[data-object-property-name-for-test="b"][aria-expanded=true] ~ ol.expanded', root),
        ]);
        // The x and y properties should be visible now.
        await Promise.all([
            (0, helper_js_1.waitFor)('li[data-object-property-name-for-test="x"]', aChildren),
            (0, helper_js_1.waitFor)('li[data-object-property-name-for-test="y"]', bChildren),
        ]);
        // The [[Prototype]] internal properties should not be expanded now.
        await Promise.all([
            (0, helper_js_1.waitFor)('li[data-object-property-name-for-test="[[Prototype]]"][aria-expanded=false]', aChildren),
            (0, helper_js_1.waitFor)('li[data-object-property-name-for-test="[[Prototype]]"][aria-expanded=false]', bChildren),
        ]);
    });
});
//# sourceMappingURL=console-expand-recursively_test.js.map