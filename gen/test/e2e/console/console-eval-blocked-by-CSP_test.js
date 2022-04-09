"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async function () {
    (0, mocha_extensions_js_1.it)('eval in console succeeds for pages with no CSP', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.pasteText)('eval("1+1")');
        await frontend.keyboard.press('Enter');
        await (0, helper_js_1.step)('wait for the result to appear in the console', async () => {
            await (0, helper_js_1.waitForFunction)(async () => {
                const results = await (0, helper_js_1.$$)('.console-user-command-result');
                return results.length === 1;
            });
        });
        await (0, helper_js_1.step)('get the result text from the console', async () => {
            const evaluateResult = await frontend.evaluate(() => {
                return document.querySelectorAll('.console-user-command-result')[0].textContent;
            });
            chai_1.assert.strictEqual(evaluateResult, '2', 'Eval result was not correct');
        });
    });
    (0, mocha_extensions_js_1.it)('eval in console fails for pages with CSP that blocks eval', async () => {
        await (0, helper_js_1.goToResource)('console/CSP-blocks-eval.html');
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.pasteText)('eval("1+1")');
        await frontend.keyboard.press('Enter');
        await (0, helper_js_1.step)('wait for the result to appear in the console', async () => {
            await frontend.waitForFunction(() => {
                return document.querySelectorAll('.console-user-command-result').length === 1;
            });
        });
        await (0, helper_js_1.step)('get the result text from the console', async () => {
            const evaluateResult = await frontend.evaluate(() => {
                return document.querySelectorAll('.console-user-command-result')[0].textContent;
            });
            chai_1.assert.include(evaluateResult || '', '\'unsafe-eval\' is not an allowed source of script', 'Didn\'t find expected CSP error message');
        });
    });
});
//# sourceMappingURL=console-eval-blocked-by-CSP_test.js.map