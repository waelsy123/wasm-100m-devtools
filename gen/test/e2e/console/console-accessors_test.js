"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.it)('correctly expands getters on string properties', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, console_helpers_js_1.typeIntoConsole)(frontend, 'new class ClassWithStringGetter { get x() { return 84 / 2; }}');
        await (0, helper_js_1.click)('.console-view-object-properties-section');
        await (0, helper_js_1.click)('.object-value-calculate-value-button');
        const value = await (0, helper_js_1.waitFor)('.object-value-number').then(e => e.evaluate(e => e.textContent));
        chai_1.assert.strictEqual(value, '42');
    });
    (0, mocha_extensions_js_1.it)('correctly expands getters on symbol properties', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, console_helpers_js_1.typeIntoConsole)(frontend, 'new class ClassWithSymbolGetter { get [Symbol("foo")]() { return 21 + 21; }}');
        await (0, helper_js_1.click)('.console-view-object-properties-section');
        await (0, helper_js_1.click)('.object-value-calculate-value-button');
        const value = await (0, helper_js_1.waitFor)('.object-value-number').then(e => e.evaluate(e => e.textContent));
        chai_1.assert.strictEqual(value, '42');
    });
    (0, mocha_extensions_js_1.it)('correctly expands private getters', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, console_helpers_js_1.typeIntoConsole)(frontend, 'new class ClassWithPrivateGetter { get #x() { return 21 << 1; }}');
        await (0, helper_js_1.click)('.console-view-object-properties-section');
        await (0, helper_js_1.click)('.object-value-calculate-value-button');
        const value = await (0, helper_js_1.waitFor)('.object-value-number').then(e => e.evaluate(e => e.textContent));
        chai_1.assert.strictEqual(value, '42');
    });
});
//# sourceMappingURL=console-accessors_test.js.map