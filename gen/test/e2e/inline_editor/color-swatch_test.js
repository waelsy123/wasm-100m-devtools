"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
async function goToTestPageAndSelectTestElement(path = 'inline_editor/default.html') {
    await (0, helper_js_1.goToResource)(path);
    await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
    await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
    await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"inspected">\u200BInspected div\u200B</div>\u200B');
}
async function assertColorSwatch(container, expectedColor) {
    if (!container) {
        chai_1.assert.fail('Container not found');
    }
    const swatch = await (0, elements_helpers_js_1.getColorSwatch)(container, 0);
    chai_1.assert.isTrue(Boolean(swatch), 'Color swatch found');
    const color = await (0, elements_helpers_js_1.getColorSwatchColor)(container, 0);
    chai_1.assert.strictEqual(color, expectedColor, 'Color swatch has the right color');
}
async function assertNoColorSwatch(container) {
    if (!container) {
        chai_1.assert.fail('Container not found');
    }
    const swatch = await (0, elements_helpers_js_1.getColorSwatch)(container, 0);
    chai_1.assert.isUndefined(swatch, 'No color swatch found');
}
(0, mocha_extensions_js_1.describe)('The color swatch', async () => {
    (0, mocha_extensions_js_1.it)('is displayed for color properties in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'color', 'red');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'color');
        await assertColorSwatch(property, 'red');
    });
    (0, mocha_extensions_js_1.it)('is displayed for color properties in the Computed pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.navigateToSidePane)('Computed');
        await (0, elements_helpers_js_1.waitForElementsComputedSection)();
        const property = await (0, elements_helpers_js_1.getPropertyFromComputedPane)('color');
        await assertColorSwatch(property, 'rgb(255, 0, 0)');
    });
    (0, mocha_extensions_js_1.it)('is not displayed for non-color properties in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'margin', '10px');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'margin');
        await assertNoColorSwatch(property);
    });
    (0, mocha_extensions_js_1.it)('is not displayed for non-color properties that have color-looking values in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'animation-name', 'black');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'animation-name');
        await assertNoColorSwatch(property);
    });
    (0, mocha_extensions_js_1.it)('is not displayed for color properties that have color-looking values in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'background', 'url(red green blue.jpg)');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'background');
        await assertNoColorSwatch(property);
    });
    (0, mocha_extensions_js_1.it)('is displayed for var() functions that compute to colors in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'background-color', 'var(--variable)');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'background-color');
        await assertColorSwatch(property, 'blue');
    });
    (0, mocha_extensions_js_1.it)('is not displayed for var() functions that have color-looking names but do not compute to colors in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'border-color', 'var(--red)');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'border-color');
        await assertNoColorSwatch(property);
    });
    (0, mocha_extensions_js_1.it)('is displayed for color-looking custom properties in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', '--variable', 'blue');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', '--variable');
        await assertColorSwatch(property, 'blue');
    });
    (0, mocha_extensions_js_1.it)('supports shift-clicking for color properties in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'color', 'red');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'color');
        if (!property) {
            chai_1.assert.fail('Property not found');
        }
        await (0, elements_helpers_js_1.shiftClickColorSwatch)(property, 0);
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'color', 'rgb(255 0 0)');
    });
    (0, mocha_extensions_js_1.it)('supports shift-clicking for color properties in the Computed pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.navigateToSidePane)('Computed');
        await (0, elements_helpers_js_1.waitForElementsComputedSection)();
        const property = await (0, elements_helpers_js_1.getPropertyFromComputedPane)('color');
        if (!property) {
            chai_1.assert.fail('Property not found');
        }
        await (0, elements_helpers_js_1.waitForPropertyValueInComputedPane)('color', 'rgb(255, 0, 0)');
        await (0, elements_helpers_js_1.shiftClickColorSwatch)(property, 0);
        await (0, elements_helpers_js_1.waitForPropertyValueInComputedPane)('color', 'hsl(0deg 100% 50%)');
    });
    (0, mocha_extensions_js_1.it)('supports shift-clicking for colors next to var() functions', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'background-color', 'var(--variable)');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'background-color');
        if (!property) {
            chai_1.assert.fail('Property not found');
        }
        await (0, elements_helpers_js_1.shiftClickColorSwatch)(property, 0);
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'background-color', 'rgb(0 0 255)');
    });
    (0, mocha_extensions_js_1.it)('is updated when the color value is updated in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'color', 'red');
        let property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'color');
        await assertColorSwatch(property, 'red');
        await (0, elements_helpers_js_1.editCSSProperty)('#inspected', 'color', 'blue');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'color', 'blue');
        property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'color');
        await assertColorSwatch(property, 'blue');
    });
    (0, mocha_extensions_js_1.it)('is updated for a var() function when the customer property value changes in the Styles pane', async () => {
        await goToTestPageAndSelectTestElement('inline_editor/var-chain.html');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', '--bar', 'var(--baz)');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'color', 'var(--bar)');
        let barProperty = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', '--bar');
        let colorProperty = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'color');
        await assertColorSwatch(barProperty, 'red');
        await assertColorSwatch(colorProperty, 'red');
        await (0, elements_helpers_js_1.editCSSProperty)('#inspected', '--baz', 'blue');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', '--baz', 'blue');
        barProperty = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', '--bar');
        colorProperty = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#inspected', 'color');
        await assertColorSwatch(barProperty, 'blue');
        await assertColorSwatch(colorProperty, 'blue');
    });
});
//# sourceMappingURL=color-swatch_test.js.map