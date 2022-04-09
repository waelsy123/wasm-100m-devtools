"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const console_helpers_js_2 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.it)('doesn’t break when global `eval` is overwritten', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        let messages;
        await (0, helper_js_1.step)('navigate to the Console tab', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.step)('enter code that overwrites eval', async () => {
            await (0, helper_js_1.pasteText)(`
        const foo = 'fooValue';
        globalThis.eval = 'non-function';
      `);
            await frontend.keyboard.press('Enter');
            // Wait for the console to be usable again.
            await frontend.waitForFunction(() => {
                return document.querySelectorAll('.console-user-command-result').length === 1;
            });
        });
        await (0, helper_js_1.step)('enter a code snippet', async () => {
            await (0, helper_js_1.pasteText)('foo;');
            await frontend.keyboard.press('Enter');
        });
        // Wait for the console to be usable again.
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 2;
        });
        await (0, helper_js_1.step)('retrieve the console log', async () => {
            messages = await (0, console_helpers_js_2.getCurrentConsoleMessages)();
        });
        await (0, helper_js_1.step)('check that the expected output is logged', async () => {
            chai_1.assert.deepEqual(messages, [
                '\'non-function\'',
                '\'fooValue\'',
            ]);
        });
    });
});
//# sourceMappingURL=console-eval-fake_test.js.map