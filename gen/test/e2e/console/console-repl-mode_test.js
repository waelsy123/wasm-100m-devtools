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
    // The tests in this suite are particularly slow, as they perform a lot of actions
    this.timeout(10000);
    (0, mocha_extensions_js_1.it)('allows re-declaration of let variables', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        // To avoid races with the autosuggest box, which appears asynchronously to
        // typing, we need to:
        //   1. Type until the last character that causes a suggestion, waiting for
        //      the suggestion box to open. We need to start waiting for the box to
        //      open before we start typing to ensure we catch the opening.
        //   2. Hit escape to close the suggestion box, and wait for it to
        //      disappear. As above, we need to start waiting for it to disappear
        //      before we hit escape.
        //   3. Type the rest of the expression, where the characters don't cause
        //      additional suggestions. Suggestions from history behave differently
        //      and don't auto-complete on hitting enter, so they are irrelevant
        //      here even if they do show up.
        //   4. Hit enter
        //   5. Wait for the results to show up and verify them.
        const appearPromise = (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await (0, helper_js_1.typeText)('let');
        await appearPromise;
        const disappearPromise = (0, helper_js_1.waitForNone)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await frontend.keyboard.press('Escape');
        await disappearPromise;
        await (0, helper_js_1.typeText)(' x = 1;');
        await frontend.keyboard.press('Enter');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 1;
        });
        const appearPromise2 = (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await (0, helper_js_1.typeText)('let');
        await appearPromise2;
        const disappearPromise2 = (0, helper_js_1.waitForNone)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await frontend.keyboard.press('Escape');
        await disappearPromise2;
        await (0, helper_js_1.typeText)(' x = 2;');
        await frontend.keyboard.press('Enter');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 2;
        });
        const appearPromise3 = (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await (0, helper_js_1.typeText)('x');
        await appearPromise3;
        const disappearPromise3 = (0, helper_js_1.waitForNone)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await frontend.keyboard.press('Escape');
        await disappearPromise3;
        await frontend.keyboard.press('Enter');
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 3;
        });
        const evaluateResults = await frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.console-user-command-result')).map(node => node.textContent);
        });
        chai_1.assert.deepEqual(evaluateResults, ['undefined', 'undefined', '2']);
    });
});
//# sourceMappingURL=console-repl-mode_test.js.map