"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const quick_open_helpers_js_1 = require("../helpers/quick_open-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
// Flaky test
mocha_extensions_js_1.describe.skip('[crbug.com/1198160]: Snippet creation', () => {
    (0, mocha_extensions_js_1.it)('can show newly created snippets show up in command menu', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, sources_helpers_js_1.openSnippetsSubPane)();
        await (0, sources_helpers_js_1.createNewSnippet)('New snippet');
        await (0, quick_open_helpers_js_1.openCommandMenu)();
        await (0, quick_open_helpers_js_1.showSnippetsAutocompletion)();
        chai_1.assert.deepEqual(await (0, quick_open_helpers_js_1.getAvailableSnippets)(), [
            'New snippet\u200B',
        ]);
        await (0, helper_js_1.typeText)('New ');
        chai_1.assert.deepEqual(await (0, quick_open_helpers_js_1.getAvailableSnippets)(), [
            'New snippet\u200B',
        ]);
        await (0, helper_js_1.typeText)('w');
        chai_1.assert.deepEqual(await (0, quick_open_helpers_js_1.getAvailableSnippets)(), []);
        await frontend.keyboard.press('Backspace');
        chai_1.assert.deepEqual(await (0, quick_open_helpers_js_1.getAvailableSnippets)(), [
            'New snippet\u200B',
        ]);
    });
});
// Flaky test (likely further bit-rotted by CM6 transition)
mocha_extensions_js_1.describe.skip('[crbug.com/1198160]: Expression evaluation', () => {
    const message = '"Hello"';
    beforeEach(async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, sources_helpers_js_1.openSnippetsSubPane)();
        await (0, sources_helpers_js_1.createNewSnippet)('New snippet');
        await (0, helper_js_1.typeText)(`(x => {debugger})(${message});`);
        await (0, sources_helpers_js_1.runSnippet)();
        const functionParameterElement = await (0, helper_js_1.waitFor)('.cm-js-def');
        const parameterElementPosition = await functionParameterElement.evaluate(elem => {
            const { x, y, right } = elem.getBoundingClientRect();
            return { x, y, right };
        });
        await frontend.mouse.move(parameterElementPosition.x, parameterElementPosition.y);
        await frontend.mouse.down();
        await frontend.mouse.move(parameterElementPosition.right, parameterElementPosition.y);
        await frontend.mouse.up();
    });
    afterEach(async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.reload();
    });
    (0, mocha_extensions_js_1.it)('evaluates a selected expression in the console', async () => {
        await (0, sources_helpers_js_1.evaluateSelectedTextInConsole)();
        // Prevent flakyness by awaiting some time for the text to be evaluated
        await (0, helper_js_1.timeout)(200);
        const messages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
        chai_1.assert.deepEqual(messages, [
            message,
        ]);
    });
    (0, mocha_extensions_js_1.it)('adds an expression to watches', async () => {
        await (0, sources_helpers_js_1.addSelectedTextToWatches)();
        const watchExpressions = await (0, sources_helpers_js_1.getWatchExpressionsValues)();
        chai_1.assert.deepEqual(watchExpressions, [
            message,
        ]);
    });
});
(0, mocha_extensions_js_1.describe)('Snippet evaluation', () => {
    (0, mocha_extensions_js_1.it)('highlights the correct line when a snippet throws an error', async () => {
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, sources_helpers_js_1.openSnippetsSubPane)();
        await (0, sources_helpers_js_1.createNewSnippet)('throwing', `
      (function foo() {
        throw new Error('kaboom');
      })();`);
        await (0, sources_helpers_js_1.runSnippet)();
        const errorLine = await (0, helper_js_1.waitFor)('.cm-waveUnderline');
        const text = await errorLine.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, 'throw new Error(\'kaboom\');');
    });
});
//# sourceMappingURL=snippets_test.js.map