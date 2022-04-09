"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async function () {
    beforeEach(async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.evaluate('{ navigator.clipboard.writeText = (data) => { globalThis._clipboardData = data; }};');
    });
    const RESULT_SELECTOR = '.console-message-text';
    (0, mocha_extensions_js_1.it)('can copy contents for strings', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('\'string\\ncontent\'\n');
        await (0, console_helpers_js_1.clickOnContextMenu)(RESULT_SELECTOR, 'Copy string contents');
        const copiedContent = await frontend.evaluate('globalThis._clipboardData');
        chai_1.assert.deepEqual(copiedContent, 'string\ncontent');
    });
    (0, mocha_extensions_js_1.it)('can copy strings as JS literals', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('\'string\\ncontent\'\n');
        await (0, console_helpers_js_1.clickOnContextMenu)(RESULT_SELECTOR, 'Copy string as JavaScript literal');
        const copiedContent = await frontend.evaluate('globalThis._clipboardData');
        chai_1.assert.deepEqual(copiedContent, '\'string\\ncontent\'');
    });
    (0, mocha_extensions_js_1.it)('can copy strings as JSON literals', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('\'string\\ncontent\'\n');
        await (0, console_helpers_js_1.clickOnContextMenu)(RESULT_SELECTOR, 'Copy string as JSON literal');
        const copiedContent = await frontend.evaluate('globalThis._clipboardData');
        chai_1.assert.deepEqual(copiedContent, '"string\\ncontent"');
    });
    (0, mocha_extensions_js_1.it)('can copy numbers', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('500\n');
        await (0, console_helpers_js_1.clickOnContextMenu)(RESULT_SELECTOR, 'Copy number');
        const copiedContent = await frontend.evaluate('globalThis._clipboardData');
        chai_1.assert.deepEqual(copiedContent, '500');
    });
    (0, mocha_extensions_js_1.it)('can copy bigints', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('500n\n');
        await (0, console_helpers_js_1.clickOnContextMenu)(RESULT_SELECTOR, 'Copy bigint');
        const copiedContent = await frontend.evaluate('globalThis._clipboardData');
        chai_1.assert.deepEqual(copiedContent, '500n');
    });
    (0, mocha_extensions_js_1.it)('can copy booleans', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('true\n');
        await (0, console_helpers_js_1.clickOnContextMenu)(RESULT_SELECTOR, 'Copy boolean');
        const copiedContent = await frontend.evaluate('globalThis._clipboardData');
        chai_1.assert.deepEqual(copiedContent, 'true');
    });
    (0, mocha_extensions_js_1.it)('can copy undefined', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('undefined\n');
        await (0, console_helpers_js_1.clickOnContextMenu)(RESULT_SELECTOR, 'Copy undefined');
        const copiedContent = await frontend.evaluate('globalThis._clipboardData');
        chai_1.assert.deepEqual(copiedContent, 'undefined');
    });
});
//# sourceMappingURL=console-context-menu_test.js.map