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
    (0, mocha_extensions_js_1.it)('is highlighting the syntax correctly', async () => {
        const componentsFormats = new Set();
        await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('syntax-highlighting.wasm', 'wasm/syntax-highlighting.html');
            // Wait for at least 1 keyword to show up, at which we know the highlighting has been applied.
            await (0, helper_js_1.waitFor)('.token-keyword');
        });
        await (0, helper_js_1.step)('check that variables have the correct class and has a different format', async () => {
            const expectedVariables = ['$add', '$p0', '$p1', '$p0', '$p1'];
            const variableNames = await Promise.all((await (0, helper_js_1.$$)('.token-variable')).map(elements => {
                return elements.evaluate(el => el.innerText);
            }));
            const variableColors = await Promise.all((await (0, helper_js_1.$$)('.token-variable')).map(elements => {
                return elements.evaluate(el => getComputedStyle(el).color);
            }));
            variableColors.forEach(element => {
                componentsFormats.add(element);
            });
            chai_1.assert.deepEqual(variableNames, expectedVariables, 'highlighed variables are incorrect');
            chai_1.assert.strictEqual(componentsFormats.size, 1, 'variables did not yield exactly one format');
        });
        await (0, helper_js_1.step)('check that keywords have the correct class and has a different format', async () => {
            const expectedKeywords = ['module', 'func', 'export', 'param', 'param', 'result', 'local.get', 'local.get', 'i32.add'];
            const keywordNames = await Promise.all((await (0, helper_js_1.$$)('.token-keyword')).map(elements => {
                return elements.evaluate(el => el.innerText);
            }));
            const keywordColors = await Promise.all((await (0, helper_js_1.$$)('.token-keyword')).map(elements => {
                return elements.evaluate(el => getComputedStyle(el).color);
            }));
            keywordColors.forEach(element => {
                componentsFormats.add(element);
            });
            chai_1.assert.deepEqual(keywordNames, expectedKeywords, 'highlighed keywords are incorrect');
            chai_1.assert.strictEqual(componentsFormats.size, 2, 'variables and keywords did not yield exactly two different formats');
        });
        await (0, helper_js_1.step)('check that comments have the correct class and has a different format', async () => {
            const expectedComments = ['(;0;)', '(;0;)', '(;1;)'];
            const commentNames = await Promise.all((await (0, helper_js_1.$$)('.token-comment')).map(elements => {
                return elements.evaluate(el => el.innerText);
            }));
            const commentColors = await Promise.all((await (0, helper_js_1.$$)('.token-comment')).map(elements => {
                return elements.evaluate(el => getComputedStyle(el).color);
            }));
            commentColors.forEach(element => {
                componentsFormats.add(element);
            });
            chai_1.assert.deepEqual(commentNames, expectedComments, 'highlighed comments are incorrect');
            chai_1.assert.strictEqual(componentsFormats.size, 3, 'variables, keywords and comments did not yield exactly three different formats');
        });
        await (0, helper_js_1.step)('check that strings have the correct class and has a different format', async () => {
            const expectedStrings = ['\"add\"'];
            const stringNames = await Promise.all((await (0, helper_js_1.$$)('.token-string')).map(elements => {
                return elements.evaluate(el => el.innerText);
            }));
            const stringColors = await Promise.all((await (0, helper_js_1.$$)('.token-string')).map(elements => {
                return elements.evaluate(el => getComputedStyle(el).color);
            }));
            stringColors.forEach(element => {
                componentsFormats.add(element);
            });
            chai_1.assert.deepEqual(stringNames, expectedStrings, 'highlighed strings are incorrect');
            chai_1.assert.strictEqual(componentsFormats.size, 4, 'variables, keywords, comments and strings did not yield exactly four different formats');
        });
    });
});
//# sourceMappingURL=syntax-highlighting_test.js.map