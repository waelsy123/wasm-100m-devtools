"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const TARGET_SHOWN_ON_HOVER_SELECTOR = '.show-on-hover';
const TARGET_SHOWN_ON_FOCUS_SELECTOR = '.show-on-focus';
const TARGET_SHOWN_ON_TARGET_SELECTOR = '#show-on-target';
(0, mocha_extensions_js_1.describe)('The Elements tab', async () => {
    // Flaky test
    mocha_extensions_js_1.it.skipOnPlatforms(['mac'], '[crbug.com/1280763] can force :hover state for selected DOM node', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('elements/hover.html');
        await (0, elements_helpers_js_1.waitForElementsStyleSection)();
        await (0, helper_js_1.step)('Ensure the correct node is selected after opening a file', async () => {
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        });
        // FIXME(crbug/1112692): Refactor test to remove the timeout.
        await (0, helper_js_1.timeout)(50);
        await (0, helper_js_1.step)('Select div that we can focus', async () => {
            await frontend.keyboard.press('ArrowRight');
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"hover">\u200B…\u200B</div>\u200B');
        });
        await (0, elements_helpers_js_1.forcePseudoState)(':hover');
        await (0, elements_helpers_js_1.assertGutterDecorationForDomNodeExists)();
        await (0, elements_helpers_js_1.waitForDomNodeToBeVisible)(TARGET_SHOWN_ON_HOVER_SELECTOR);
        const displayComputedStyle = await (0, elements_helpers_js_1.getComputedStylesForDomNode)(TARGET_SHOWN_ON_HOVER_SELECTOR, 'display');
        chai_1.assert.strictEqual(displayComputedStyle, 'inline');
    });
    (0, mocha_extensions_js_1.it)('can force :target state for selected DOM node', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('elements/target.html');
        await (0, elements_helpers_js_1.waitForElementsStyleSection)();
        await (0, helper_js_1.step)('Ensure the correct node is selected after opening a file', async () => {
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        });
        // FIXME(crbug/1112692): Refactor test to remove the timeout.
        await (0, helper_js_1.timeout)(50);
        await (0, helper_js_1.step)('Select element that we can target', async () => {
            await frontend.keyboard.press('ArrowRight');
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<span id=\u200B"show-on-target">\u200BSome text here, only shown on :target\u200B</span>\u200B');
        });
        await (0, elements_helpers_js_1.forcePseudoState)(':target');
        await (0, elements_helpers_js_1.assertGutterDecorationForDomNodeExists)();
        await (0, elements_helpers_js_1.waitForDomNodeToBeVisible)(TARGET_SHOWN_ON_TARGET_SELECTOR);
        const displayComputedStyle = await (0, elements_helpers_js_1.getComputedStylesForDomNode)(TARGET_SHOWN_ON_TARGET_SELECTOR, 'display');
        chai_1.assert.strictEqual(displayComputedStyle, 'inline');
    });
    // Flaky test
    mocha_extensions_js_1.it.skipOnPlatforms(['mac'], '[crbug.com/1134593] can force :focus state for selected DOM node', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('elements/focus.html');
        await (0, elements_helpers_js_1.waitForElementsStyleSection)();
        await (0, helper_js_1.step)('Ensure the correct node is selected after opening a file', async () => {
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        });
        // FIXME(crbug/1112692): Refactor test to remove the timeout.
        await (0, helper_js_1.timeout)(50);
        await (0, helper_js_1.step)('Select div that we can focus', async () => {
            await frontend.keyboard.press('ArrowRight');
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"focus" tabindex=\u200B"0">\u200B…\u200B</div>\u200B');
        });
        await (0, elements_helpers_js_1.forcePseudoState)(':focus');
        await (0, elements_helpers_js_1.assertGutterDecorationForDomNodeExists)();
        await (0, elements_helpers_js_1.waitForDomNodeToBeVisible)(TARGET_SHOWN_ON_FOCUS_SELECTOR);
        const displayComputedStyle = await (0, elements_helpers_js_1.getComputedStylesForDomNode)(TARGET_SHOWN_ON_FOCUS_SELECTOR, 'display');
        chai_1.assert.strictEqual(displayComputedStyle, 'inline');
        const backgroundColorComputedStyle = await (0, elements_helpers_js_1.getComputedStylesForDomNode)('#focus', 'backgroundColor');
        chai_1.assert.strictEqual(backgroundColorComputedStyle, 'rgb(0, 128, 0)');
    });
    // Flaky test
    mocha_extensions_js_1.it.skipOnPlatforms(['mac'], '[crbug.com/1280763] can remove :focus state', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('elements/focus.html');
        await (0, elements_helpers_js_1.waitForElementsStyleSection)();
        await (0, helper_js_1.step)('Ensure the correct node is selected after opening a file', async () => {
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        });
        // FIXME(crbug/1112692): Refactor test to remove the timeout.
        await (0, helper_js_1.timeout)(50);
        await (0, helper_js_1.step)('Select div that we can focus', async () => {
            await frontend.keyboard.press('ArrowRight');
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"focus" tabindex=\u200B"0">\u200B…\u200B</div>\u200B');
        });
        await (0, elements_helpers_js_1.forcePseudoState)(':focus');
        await (0, elements_helpers_js_1.assertGutterDecorationForDomNodeExists)();
        await (0, elements_helpers_js_1.waitForDomNodeToBeVisible)(TARGET_SHOWN_ON_FOCUS_SELECTOR);
        const displayComputedStyle = await (0, elements_helpers_js_1.getComputedStylesForDomNode)(TARGET_SHOWN_ON_FOCUS_SELECTOR, 'display');
        chai_1.assert.strictEqual(displayComputedStyle, 'inline');
        const backgroundColorComputedStyle = await (0, elements_helpers_js_1.getComputedStylesForDomNode)('#focus', 'backgroundColor');
        chai_1.assert.strictEqual(backgroundColorComputedStyle, 'rgb(0, 128, 0)');
        await (0, elements_helpers_js_1.removePseudoState)(':focus');
        await (0, elements_helpers_js_1.waitForDomNodeToBeHidden)(TARGET_SHOWN_ON_FOCUS_SELECTOR);
        await (0, helper_js_1.debuggerStatement)(frontend);
        const hiddenDisplayStyle = await (0, elements_helpers_js_1.getComputedStylesForDomNode)(TARGET_SHOWN_ON_FOCUS_SELECTOR, 'display');
        chai_1.assert.strictEqual(hiddenDisplayStyle, 'none');
    });
});
//# sourceMappingURL=pseudo-states_test.js.map