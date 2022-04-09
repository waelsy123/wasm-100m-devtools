"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
/* eslint-disable no-console */
(0, mocha_extensions_js_1.describe)('The Console\'s error stack formatting', () => {
    (0, mocha_extensions_js_1.it)('picks up custom exception names ending with \'Error\' and symbolizes stack traces according to source maps', async () => {
        await (0, helper_js_1.goToResource)('sources/error-with-sourcemap.html');
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.showVerboseMessages)();
        await (0, helper_js_1.waitForFunction)(async () => {
            const messages = await (0, console_helpers_js_1.getStructuredConsoleMessages)();
            if (messages.length !== 1) {
                return false;
            }
            const [{ message }] = messages;
            return /^MyError.*error-with-sourcemap.ts:6/.test(message.replace('\n', ''));
        });
    });
    (0, mocha_extensions_js_1.it)('correctly symbolizes stack traces with async frames for anonymous functions', async () => {
        await (0, helper_js_1.goToResource)('console/error-with-async-frame.html');
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.showVerboseMessages)();
        await (0, helper_js_1.waitForFunction)(async () => {
            const messages = await (0, console_helpers_js_1.getStructuredConsoleMessages)();
            if (messages.length !== 1) {
                return false;
            }
            const [{ message }] = messages;
            return message === `Error
    at foo (async.js:2:46)
    at async async.js:3:21`;
        });
    });
});
//# sourceMappingURL=console-error-stack_test.js.map