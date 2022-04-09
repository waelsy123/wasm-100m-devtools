"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('Sources Tab', async function () {
    (0, mocha_extensions_js_1.it)('shows correct preview for `object.foo` member expressions', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('popover.js', 'popover.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 5);
        const scriptEvaluation = target.evaluate('f1();');
        const lastElement = await (0, helper_js_1.waitFor)('.cm-executionLine > span:last-child');
        await lastElement.hover();
        const popover = await (0, helper_js_1.waitFor)('[data-stable-name-for-test="object-popover-content"]');
        const value = await (0, helper_js_1.waitFor)('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
        chai_1.assert.strictEqual(value, '1');
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await scriptEvaluation;
    });
    (0, mocha_extensions_js_1.it)('shows correct preview for `array[1].foo` member expressions', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('popover.js', 'popover.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 9);
        const scriptEvaluation = target.evaluate('f2();');
        const lastElement = await (0, helper_js_1.waitFor)('.cm-executionLine > span:last-child');
        await lastElement.hover();
        const popover = await (0, helper_js_1.waitFor)('[data-stable-name-for-test="object-popover-content"]');
        const value = await (0, helper_js_1.waitFor)('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
        chai_1.assert.strictEqual(value, '5');
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await scriptEvaluation;
    });
    (0, mocha_extensions_js_1.it)('shows correct preview for `array[i][0]` member expressions', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('popover.js', 'popover.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 13);
        const scriptEvaluation = target.evaluate('f3(3);');
        const lastElement = await (0, helper_js_1.waitFor)('.cm-executionLine > span:last-child');
        await lastElement.hover();
        const popover = await (0, helper_js_1.waitFor)('[data-stable-name-for-test="object-popover-content"]');
        const value = await (0, helper_js_1.waitFor)('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
        chai_1.assert.strictEqual(value, '42');
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await scriptEvaluation;
    });
    (0, mocha_extensions_js_1.it)('shows correct preview for `this.#x` member expressions in TypeScript', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('popover-typescript.ts', 'popover-typescript.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 5);
        const scriptEvaluation = target.evaluate('test();');
        const lastElement = await (0, helper_js_1.waitFor)('.cm-executionLine > span:last-child');
        await lastElement.hover();
        const popover = await (0, helper_js_1.waitFor)('[data-stable-name-for-test="object-popover-content"]');
        const value = await (0, helper_js_1.waitFor)('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
        chai_1.assert.strictEqual(value, '84');
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await scriptEvaluation;
    });
    (0, mocha_extensions_js_1.it)('shows correct preview for `this.#x` member expressions despite Terser minification', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('popover-terser.js', 'popover-terser.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 5);
        const scriptEvaluation = target.evaluate('test();');
        const lastElement = await (0, helper_js_1.waitFor)('.cm-executionLine > span:last-child');
        await lastElement.hover();
        const popover = await (0, helper_js_1.waitFor)('[data-stable-name-for-test="object-popover-content"]');
        const value = await (0, helper_js_1.waitFor)('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
        chai_1.assert.strictEqual(value, '21');
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await scriptEvaluation;
    });
});
//# sourceMappingURL=popover_test.js.map