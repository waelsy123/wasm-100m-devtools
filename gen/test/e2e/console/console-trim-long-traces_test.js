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
    (0, mocha_extensions_js_1.it)('truncates long stack traces ', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        let messages;
        await (0, helper_js_1.step)('navigate to the Console tab', async () => {
            await (0, helper_js_1.click)(console_helpers_js_2.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.step)('enter code into the console that produces two stack traces, one short and and one long', async () => {
            await (0, helper_js_1.pasteText)(`
        function recursive(n) {
          if (n > 1) {
            return recursive(n-1);
          } else {
            return console.trace();
          }
        }
        recursive(10);
        recursive(50);
      `);
            await frontend.keyboard.press('Enter');
            // Wait for the console to be usable again.
            await frontend.waitForFunction((CONSOLE_SELECTOR) => {
                return document.querySelectorAll(CONSOLE_SELECTOR).length === 1;
            }, {}, console_helpers_js_2.CONSOLE_SELECTOR);
        });
        await (0, helper_js_1.step)('retrieve the console log', async () => {
            const container = await (0, helper_js_1.$$)(console_helpers_js_2.STACK_PREVIEW_CONTAINER);
            messages = await Promise.all(container.map(elements => {
                return elements.evaluate(el => el.innerText);
            }));
        });
        await (0, helper_js_1.step)('check that the first log is not truncated', async () => {
            const expectedLog = '\trecursive\t@\tVM11:6\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\t(anonymous)\t@\tVM11:9';
            chai_1.assert.strictEqual(messages[0], await (0, console_helpers_js_1.unifyLogVM)(messages[0], expectedLog));
        });
        await (0, helper_js_1.step)('check that the second log is truncated', async () => {
            const expectedLog = '\trecursive\t@\tVM11:6\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\trecursive\t@\tVM11:4\n' +
                '\tShow 21 more frames';
            chai_1.assert.strictEqual(messages[1], await (0, console_helpers_js_1.unifyLogVM)(messages[1], expectedLog));
        });
    });
});
//# sourceMappingURL=console-trim-long-traces_test.js.map