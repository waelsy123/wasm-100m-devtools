"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
async function goToTestPageAndSelectTestElement(path = 'inline_editor/fontEditor.html') {
    await (0, helper_js_1.goToResource)(path);
    await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
    await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
}
async function openFontEditorForInlineStyle() {
    const fontEditorButton = await (0, elements_helpers_js_1.getElementStyleFontEditorButton)();
    if (!fontEditorButton) {
        throw new Error('Missing font editor button in the element style section');
    }
    await fontEditorButton.click();
    await (0, helper_js_1.waitFor)('.font-selector-section');
}
(0, mocha_extensions_js_1.describe)('The font editor', async function () {
    beforeEach(async function () {
        await (0, helper_js_1.enableExperiment)('fontEditor');
        await goToTestPageAndSelectTestElement();
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#inspected', 'color', 'red');
    });
    (0, mocha_extensions_js_1.it)('icon is displayed for sections containing font properties', async () => {
        const fontEditorButtons = await (0, elements_helpers_js_1.getFontEditorButtons)();
        const hiddenFontEditorButtons = await (0, elements_helpers_js_1.getHiddenFontEditorButtons)();
        chai_1.assert.deepEqual(fontEditorButtons.length, 5);
        chai_1.assert.deepEqual(hiddenFontEditorButtons.length, 2);
    });
    (0, mocha_extensions_js_1.it)('opens when button is clicked', async () => {
        await openFontEditorForInlineStyle();
    });
    (0, mocha_extensions_js_1.it)('is properly applying font family changes to the style section', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await openFontEditorForInlineStyle();
        const fontFamilySelector = await (0, helper_js_1.waitFor)('[aria-label="Font Family"]');
        await fontFamilySelector.focus();
        await frontend.keyboard.press('a');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('element.style', 'font-family', 'Arial');
    });
    (0, mocha_extensions_js_1.it)('is properly applying slider input changes to the style section', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await openFontEditorForInlineStyle();
        const fontSizeSliderInput = await (0, helper_js_1.waitFor)('[aria-label="font-size Slider Input"]');
        await fontSizeSliderInput.focus();
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('element.style', 'font-size', '11px');
    });
    (0, mocha_extensions_js_1.it)('is properly applying text input changes to the style section', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await openFontEditorForInlineStyle();
        const fontSizeTextInput = await (0, helper_js_1.waitFor)('[aria-label="font-size Text Input"]');
        await fontSizeTextInput.focus();
        await frontend.keyboard.press('ArrowUp');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('element.style', 'font-size', '11px');
    });
    (0, mocha_extensions_js_1.it)('is properly applying selector key values to the style section', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await openFontEditorForInlineStyle();
        const fontWeightSelectorInput = await (0, helper_js_1.waitFor)('[aria-label="font-weight Key Value Selector"]');
        await fontWeightSelectorInput.focus();
        await frontend.keyboard.press('i');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('element.style', 'font-weight', 'inherit');
    });
    (0, mocha_extensions_js_1.it)('is properly converting units and applying changes to the styles section', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await openFontEditorForInlineStyle();
        const fontSizeUnitInput = await (0, helper_js_1.waitFor)('[aria-label="font-size Unit Input"]');
        await fontSizeUnitInput.focus();
        await frontend.keyboard.press('e');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('element.style', 'font-size', '0.6em');
    });
    (0, mocha_extensions_js_1.it)('computed font list is being generated correctly', async () => {
        await openFontEditorForInlineStyle();
        await (0, helper_js_1.waitFor)('[value="testFont"]');
    });
});
//# sourceMappingURL=font-editor_test.js.map