"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
const CONSOLE_MESSAGE_WRAPPER = '.console-message-stack-trace-wrapper';
const ADD_FILENAME_PATTERN_BUTTON = 'button[aria-label="Add filename pattern"]';
const ADD_BUTTON = '.editor-buttons .primary-button';
const CLOSE_SETTINGS_BUTTON = '.close-button[aria-label="Close"]';
const SHOW_MORE_LINK = '.show-all-link .link';
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.it)('shows messages with stack traces', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.goToResource)('console/stack-trace.html');
        await frontend.waitForSelector(CONSOLE_MESSAGE_WRAPPER);
        await (0, helper_js_1.click)(CONSOLE_MESSAGE_WRAPPER);
        const stack = await (0, helper_js_1.$)(console_helpers_js_1.STACK_PREVIEW_CONTAINER);
        const expected = [
            { text: '\nshown3 @ showMe.js:10', classes: {} },
            { text: '\nshown2 @ showMe.js:6', classes: {} },
            { text: '\nshown1 @ showMe.js:2', classes: {} },
            { text: '\n(anonymous) @ ignoreMe.js:21', classes: {} },
            { text: '\nPromise.then (async)', classes: {} },
            { text: '\nignoreListed4 @ ignoreMe.js:20', classes: {} },
            { text: '\nignoreListed3 @ ignoreMe.js:16', classes: {} },
            { text: '\nignoreListed2 @ ignoreMe.js:12', classes: {} },
            { text: '\nignoreListed1 @ ignoreMe.js:8', classes: {} },
            { text: '\n(anonymous) @ ignoreMe.js:5', classes: {} },
        ];
        await (0, helper_js_1.waitForFunction)(async () => {
            const stackTraceRows = await frontend.evaluate((stack) => {
                return Array.from(stack.querySelectorAll('tr'))
                    .map(node => ({ text: node.textContent, classes: node.classList }));
            }, stack);
            return JSON.stringify(stackTraceRows) === JSON.stringify(expected);
        });
    });
    (0, mocha_extensions_js_1.it)('shows messages with stack traces containing ignore-listed frames', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, settings_helpers_js_1.openSettingsTab)('Ignore List');
        await (0, helper_js_1.click)(ADD_FILENAME_PATTERN_BUTTON);
        await (0, helper_js_1.typeText)('ignoreMe.js');
        await (0, helper_js_1.click)(ADD_BUTTON);
        await (0, helper_js_1.click)(CLOSE_SETTINGS_BUTTON);
        await (0, helper_js_1.goToResource)('console/stack-trace.html');
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await frontend.waitForSelector(CONSOLE_MESSAGE_WRAPPER);
        await (0, helper_js_1.click)(CONSOLE_MESSAGE_WRAPPER);
        const stack = await (0, helper_js_1.$)(console_helpers_js_1.STACK_PREVIEW_CONTAINER);
        const expected = [
            { text: '\nshown3 @ showMe.js:10', classes: {} },
            { text: '\nshown2 @ showMe.js:6', classes: {} },
            { text: '\nshown1 @ showMe.js:2', classes: {} },
            { text: '\n(anonymous) @ ignoreMe.js:21', classes: { '0': 'hidden-row' } },
            { text: '\nPromise.then (async)', classes: { '0': 'hidden-row' } },
            { text: '\nignoreListed4 @ ignoreMe.js:20', classes: { '0': 'hidden-row' } },
            { text: '\nignoreListed3 @ ignoreMe.js:16', classes: { '0': 'hidden-row' } },
            { text: '\nignoreListed2 @ ignoreMe.js:12', classes: { '0': 'hidden-row' } },
            { text: '\nignoreListed1 @ ignoreMe.js:8', classes: { '0': 'hidden-row' } },
            { text: '\n(anonymous) @ ignoreMe.js:5', classes: { '0': 'hidden-row' } },
            { text: '\nShow 6 more frames', classes: { '0': 'show-all-link' } },
        ];
        await (0, helper_js_1.waitForFunction)(async () => {
            const stackTraceRows = await frontend.evaluate((stack) => {
                return Array.from(stack.querySelectorAll('tr'))
                    .map(node => ({ text: node.textContent, classes: node.classList }));
            }, stack);
            return JSON.stringify(stackTraceRows) === JSON.stringify(expected);
        });
        // assert that hidden rows are not shown initially
        let showHidden = stack ? await stack.evaluate(x => x.classList.contains('show-hidden-rows')) : null;
        chai_1.assert.strictEqual(showHidden, false);
        // assert that after clicking 'show all'-button, hidden rows are shown
        await (0, helper_js_1.click)(SHOW_MORE_LINK);
        showHidden = stack ? await stack.evaluate(x => x.classList.contains('show-hidden-rows')) : null;
        chai_1.assert.strictEqual(showHidden, true);
    });
});
//# sourceMappingURL=console-stack-trace_test.js.map