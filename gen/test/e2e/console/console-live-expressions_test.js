"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', () => {
    (0, mocha_extensions_js_1.it)('commits live expression with Enter', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_CREATE_LIVE_EXPRESSION_SELECTOR);
        const consolePin = await (0, helper_js_1.waitFor)('.console-pin');
        await (0, helper_js_1.waitFor)('.cm-editor.cm-focused', consolePin);
        await (0, helper_js_1.typeText)('1 + 2 + 3');
        const editorUnfocusedPromise = (0, helper_js_1.waitForNone)('.cm-editor.cm-focused', consolePin);
        await frontend.keyboard.press('Enter');
        await editorUnfocusedPromise;
    });
});
//# sourceMappingURL=console-live-expressions_test.js.map