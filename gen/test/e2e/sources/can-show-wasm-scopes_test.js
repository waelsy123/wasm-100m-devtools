"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('Source Tab', async () => {
    (0, mocha_extensions_js_1.it)('shows and updates the module, local, and stack scope while pausing', async () => {
        const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
        const breakpointLine = '0x05f';
        const fileName = 'scopes.wasm';
        let moduleScopeValues;
        let localScopeValues;
        await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('scopes.wasm', 'wasm/scopes.html');
        });
        await (0, helper_js_1.step)(`add a breakpoint to line No.${breakpointLine}`, async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, breakpointLine);
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.step)('check that the module, local, and stack scope appear', async () => {
            const scopeNames = await (0, helper_js_1.waitForFunction)(async () => {
                const names = await (0, sources_helpers_js_1.getScopeNames)();
                return names.length === 3 ? names : undefined;
            });
            chai_1.assert.deepEqual(scopeNames, ['Expression', 'Local', 'Module']);
        });
        await (0, helper_js_1.step)('expand the module scope', async () => {
            await (0, helper_js_1.click)('[aria-label="Module"]');
        });
        await (0, helper_js_1.step)('check that the stack scope content is as expected', async () => {
            const stackScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Expression', 0, 0);
            chai_1.assert.deepEqual(stackScopeValues, [
                'stack: Stack\xA0{}',
            ]);
        });
        await (0, helper_js_1.step)('check that the local scope content is as expected', async () => {
            localScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 4);
            chai_1.assert.deepEqual(localScopeValues, [
                '$f32_var: f32 {value: 5.5}',
                '$f64_var: f64 {value: 2.23e-11}',
                '$i32: i32 {value: 42}',
                '$i64_var: i64 {value: 9221120237041090n}',
            ]);
        });
        await (0, helper_js_1.step)('check that the module scope content is as expected', async () => {
            moduleScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Module', 0, 4);
            // Remove occurrences of arrays.
            const formattedValues = moduleScopeValues.map((line) => {
                return line.replace(/\[[^\]]*\]/, '').trim();
            });
            chai_1.assert.deepEqual(formattedValues, [
                'functions: Functions\xA0{$foo: ƒ}',
                'globals: Globals\xA0{$imports.global: i32}',
                'instance: Instance\xA0{exports: {…}}',
                'memories: Memories',
                '$memory0: Memory(1)',
                'module: Module\xA0{}',
            ]);
        });
        await (0, helper_js_1.step)('step one time', async () => {
            await frontend.keyboard.press('F9');
            await (0, helper_js_1.waitFor)(sources_helpers_js_1.PAUSE_INDICATOR_SELECTOR);
        });
        await (0, helper_js_1.step)('check that the module scope content is as before', async () => {
            const currentModuleScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Module', 0, moduleScopeValues.length);
            chai_1.assert.deepEqual(currentModuleScopeValues, moduleScopeValues);
        });
        await (0, helper_js_1.step)('check that the local scope content is as before', async () => {
            const updatedLocalScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, localScopeValues.length);
            chai_1.assert.deepEqual(updatedLocalScopeValues, localScopeValues);
        });
        await (0, helper_js_1.step)('check that the stack scope content is updated to reflect the change', async () => {
            const stackScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Expression', 0, 1);
            chai_1.assert.deepEqual(stackScopeValues, [
                'stack: Stack\xA0{0: i32}',
            ]);
        });
        await (0, helper_js_1.step)('resume execution', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        });
    });
});
//# sourceMappingURL=can-show-wasm-scopes_test.js.map