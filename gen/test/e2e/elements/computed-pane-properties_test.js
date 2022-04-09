"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
(0, mocha_extensions_js_1.describe)('The Computed pane', async () => {
    beforeEach(async function () {
        await (0, helper_js_1.goToResource)('elements/simple-styled-page.html');
        await (0, elements_helpers_js_1.navigateToSidePane)('Computed');
        await (0, elements_helpers_js_1.waitForElementsComputedSection)();
        // Note that navigating to the computed pane moved focus away from the
        // elements pane. Restore it.
        await (0, elements_helpers_js_1.focusElementsTree)();
    });
    (0, mocha_extensions_js_1.it)('can display the CSS properties of the selected element', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        // Select the H1 element and wait for the computed pane to change.
        let content = await (0, elements_helpers_js_1.getContentOfComputedPane)();
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForComputedPaneChange)(content);
        await (0, elements_helpers_js_1.waitForElementsComputedSection)();
        const h1Properties = await (0, elements_helpers_js_1.getAllPropertiesFromComputedPane)();
        chai_1.assert.strictEqual(h1Properties.length, 10, 'There should be 10 computed properties on the H1 element');
        const colorProperty = h1Properties.find(property => property && property.name === 'color');
        chai_1.assert.exists(colorProperty, 'H1 element should have a color computed property');
        chai_1.assert.deepEqual(colorProperty, {
            name: 'color',
            value: 'rgb(255, 0, 102)',
        });
        // Select the H2 element by pressing down again.
        content = await (0, elements_helpers_js_1.getContentOfComputedPane)();
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForComputedPaneChange)(content);
        await (0, elements_helpers_js_1.waitForElementsComputedSection)();
        const h2Properties = await (0, elements_helpers_js_1.getAllPropertiesFromComputedPane)();
        chai_1.assert.strictEqual(h2Properties.length, 11, 'There should be 11 computed properties on the H2 element');
        const backgroundProperty = h2Properties.find(property => property && property.name === 'background-color');
        chai_1.assert.exists(backgroundProperty, 'H2 element should have a background-color computed property');
        chai_1.assert.deepEqual(backgroundProperty, {
            name: 'background-color',
            value: 'rgb(255, 215, 0)',
        });
    });
    (0, mocha_extensions_js_1.it)('can display inherited CSS properties of the selected element', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        // Select the H1 element and wait for the computed pane to change.
        const content = await (0, elements_helpers_js_1.getContentOfComputedPane)();
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForComputedPaneChange)(content);
        await (0, elements_helpers_js_1.toggleShowAllComputedProperties)();
        await (0, elements_helpers_js_1.waitForElementsComputedSection)();
        const getAlignContentProperty = async () => {
            const allH1Properties = await (0, elements_helpers_js_1.getAllPropertiesFromComputedPane)();
            const prop = allH1Properties.find(property => property && property.name === 'align-content');
            return prop;
        };
        const alignContentProperty = await (0, helper_js_1.waitForFunction)(getAlignContentProperty);
        chai_1.assert.exists(alignContentProperty, 'H1 element should display the inherited align-content computed property');
        chai_1.assert.deepEqual(alignContentProperty, {
            name: 'align-content',
            value: 'normal',
        });
    });
});
//# sourceMappingURL=computed-pane-properties_test.js.map