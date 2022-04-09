"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const events_js_1 = require("../../conductor/events.js");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
(0, mocha_extensions_js_1.describe)('Assertions', async function () {
    (0, mocha_extensions_js_1.it)('console.assert', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('Check the evaluation results from console', async () => {
            await frontend.evaluate(() => {
                console.assert(false, 'expected failure 1');
            });
        });
        await (0, helper_js_1.goToResource)('cross_tool/default.html');
        chai_1.assert.ok(events_js_1.expectedErrors.some(error => error.includes('expected failure 1')));
    });
    (0, mocha_extensions_js_1.it)('console.error', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('Check the evaluation results from console', async () => {
            await frontend.evaluate(() => {
                function foo() {
                    console.error('expected failure 2');
                }
                foo();
            });
        });
        await (0, helper_js_1.goToResource)('cross_tool/default.html');
        chai_1.assert.ok(events_js_1.expectedErrors.some(error => error.includes('expected failure 2')));
    });
});
//# sourceMappingURL=assertion_test.js.map