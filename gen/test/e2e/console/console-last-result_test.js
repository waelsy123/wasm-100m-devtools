"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.it)('exposes the last evaluation using "$_"', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('turn off "Autocomplete from history"', async () => {
            await (0, console_helpers_js_1.navigateToConsoleTab)();
            await (0, console_helpers_js_1.turnOffHistoryAutocomplete)();
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.step)('enter "1+1" in console', async () => {
            await (0, console_helpers_js_1.typeIntoConsoleAndWaitForResult)(frontend, '1+1');
        });
        await (0, helper_js_1.step)('enter "$_" in console', async () => {
            await (0, console_helpers_js_1.typeIntoConsoleAndWaitForResult)(frontend, '$_');
        });
        await (0, helper_js_1.step)('check the evaluation results from console', async () => {
            const evaluateResults = await frontend.evaluate(() => {
                return Array.from(document.querySelectorAll('.console-user-command-result')).map(node => node.textContent);
            });
            chai_1.assert.deepEqual(evaluateResults, ['2', '2'], 'did not find expected output in the console');
        });
        await (0, helper_js_1.step)('enter "console.clear()" in console', async () => {
            await (0, console_helpers_js_1.typeIntoConsole)(frontend, 'console.clear();');
        });
        await (0, helper_js_1.step)('wait for the console to be cleared', async () => {
            await frontend.waitForFunction(() => {
                return document.querySelectorAll('.console-user-command-result').length === 1;
            });
        });
        await (0, helper_js_1.step)('enter "$_" in console', async () => {
            await (0, console_helpers_js_1.typeIntoConsoleAndWaitForResult)(frontend, '$_');
        });
        await (0, helper_js_1.step)('check the evaluation results from console', async () => {
            const evaluateResults = await frontend.evaluate(() => {
                return Array.from(document.querySelectorAll('.console-user-command-result')).map(node => node.textContent);
            });
            chai_1.assert.deepEqual(evaluateResults, ['undefined', 'undefined'], 'did not find expected output in the console');
        });
    });
});
//# sourceMappingURL=console-last-result_test.js.map