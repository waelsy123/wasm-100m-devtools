"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('Logging and preview of Trusted Types objects in the Console', async () => {
    (0, mocha_extensions_js_1.it)('Logging of Trusted Type HTML object', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.pasteText)(`policy = trustedTypes.createPolicy("generalPolicy", {
      createHTML: string => string
    });`);
        await frontend.keyboard.press('Enter');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 1;
        });
        await (0, helper_js_1.pasteText)('x = policy.createHTML("<foo>"); x');
        await frontend.keyboard.press('Enter');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 2;
        });
        await (0, helper_js_1.step)('get the result text from the console', async () => {
            const evaluateResult = await frontend.evaluate(() => {
                return document.querySelectorAll('.console-user-command-result')[1].textContent;
            });
            chai_1.assert.strictEqual(evaluateResult, 'TrustedHTML \'<foo>\'', 'Trusted Type log is not the expected.');
        });
    });
    (0, mocha_extensions_js_1.it)('Preview of Trusted Type HTML object', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('open the console tab and focus the prompt', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.pasteText)(`policy = trustedTypes.createPolicy("generalPolicy", {
      createHTML: string => string
    });`);
        await frontend.keyboard.press('Enter');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 1;
        });
        await (0, helper_js_1.pasteText)('x = policy.createHTML("<foo>")');
        await frontend.keyboard.press('Enter');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 2;
        });
        await (0, helper_js_1.pasteText)('x');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-eager-inner-preview').length === 1 &&
                document.querySelectorAll('.console-eager-inner-preview')[0].textContent;
        });
        await (0, helper_js_1.step)('Get the preview message', async () => {
            const evaluateResult = await frontend.evaluate(() => {
                return document.querySelectorAll('.console-eager-inner-preview')[0].textContent;
            });
            chai_1.assert.strictEqual(evaluateResult, 'TrustedHTML "<foo>"', 'Trusted Type preview is not the expected');
        });
    });
});
//# sourceMappingURL=console-trusted-types_test.js.map