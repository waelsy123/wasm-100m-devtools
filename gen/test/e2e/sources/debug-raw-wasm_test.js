"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('Sources Tab', async function () {
    // The tests in this suite are particularly slow, as they perform a lot of actions
    this.timeout(10000);
    beforeEach(async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        (0, helper_js_1.installEventListener)(frontend, sources_helpers_js_1.DEBUGGER_PAUSED_EVENT);
    });
    (0, mocha_extensions_js_1.it)('shows the correct wasm source on load and reload', async () => {
        async function checkSources(frontend) {
            await (0, sources_helpers_js_1.waitForAdditionalSourceFiles)(frontend, 2);
            const capturedFileNames = await (0, sources_helpers_js_1.retrieveSourceFilesAdded)(frontend);
            chai_1.assert.deepEqual(capturedFileNames, ['/test/e2e/resources/sources/wasm/call-to-add-wasm.html', '/test/e2e/resources/sources/wasm/add.wasm']);
        }
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, sources_helpers_js_1.listenForSourceFilesAdded)(frontend);
        await (0, helper_js_1.goToResource)('sources/wasm/call-to-add-wasm.html');
        await checkSources(frontend);
        await (0, sources_helpers_js_1.clearSourceFilesAdded)(frontend);
        await target.reload();
        await checkSources(frontend);
    });
    (0, mocha_extensions_js_1.it)('can add a breakpoint in raw wasm', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('add.wasm', 'wasm/call-to-add-wasm.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x023');
        const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameScriptLocation)('main();', target);
        chai_1.assert.deepEqual(scriptLocation, 'add.wasm:0x23');
    });
    (0, mocha_extensions_js_1.it)('hits two breakpoints that are set and activated separately', async function () {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        const fileName = 'add.wasm';
        await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)(fileName, 'wasm/call-to-add-wasm.html');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.0x027', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x027');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)('0x027'));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'add.wasm:0x27');
        });
        await (0, helper_js_1.step)('remove the breakpoint from the line 0x027', async () => {
            await (0, sources_helpers_js_1.removeBreakpointForLine)(frontend, '0x027');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => !(await (0, sources_helpers_js_1.isBreakpointSet)('0x027')));
        await (0, sources_helpers_js_1.checkBreakpointDidNotActivate)();
        await (0, helper_js_1.step)('add a breakpoint to line No.0x028', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x028');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)('0x028'));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'add.wasm:0x28');
        });
    });
    (0, mocha_extensions_js_1.it)('shows variable value in popover', async function () {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        const fileName = 'add.wasm';
        await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('add.wasm', 'wasm/call-to-add-wasm.html');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.0x023', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x023');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.step)('hover over the $var0 in line No.0x023', async () => {
            const pausedPosition = await (0, helper_js_1.waitForFunction)(async () => {
                const element = await (0, helper_js_1.$)('.cm-executionLine .token-variable');
                if (element && await element.evaluate(e => e.isConnected)) {
                    return element;
                }
                return undefined;
            });
            await pausedPosition.hover();
        });
        await (0, helper_js_1.step)('check that popover with value 0 appears', async () => {
            const popover = await (0, helper_js_1.waitFor)('[data-stable-name-for-test="object-popover-content"]');
            const value = await (0, helper_js_1.waitFor)('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
            chai_1.assert.strictEqual(value, '0');
        });
    });
    (0, mocha_extensions_js_1.it)('cannot set a breakpoint on non-breakable line in raw wasm', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('add.wasm', 'wasm/call-to-add-wasm.html');
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getNonBreakableLines)(), [
            0x000,
            0x020,
            0x04b,
        ]);
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getBreakpointDecorators)(), []);
        // Line 3 is breakable.
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x023');
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getBreakpointDecorators)(), [0x023]);
    });
    (0, mocha_extensions_js_1.it)('is able to step with state', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        const fileName = 'stepping-with-state.wasm';
        await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('stepping-with-state.wasm', 'wasm/stepping-with-state.html');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.0x060', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x060');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)('0x060'));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'stepping-with-state.wasm:0x60');
        });
        await (0, helper_js_1.step)('step two times through the code', async () => {
            await (0, sources_helpers_js_1.stepThroughTheCode)();
            await (0, sources_helpers_js_1.stepThroughTheCode)();
        });
        await (0, helper_js_1.step)('check that the variables in the scope view show the correct values', async () => {
            const localScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 3);
            chai_1.assert.deepEqual(localScopeValues, [
                '$var0: i32 {value: 42}',
                '$var1: i32 {value: 8}',
                '$var2: i32 {value: 5}',
            ]);
        });
        await (0, helper_js_1.step)('remove the breakpoint from the line 0x060', async () => {
            await (0, sources_helpers_js_1.removeBreakpointForLine)(frontend, '0x060');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.0x048', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x048');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)('0x048'));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'stepping-with-state.wasm:0x48');
        });
        await (0, helper_js_1.step)('step two times through the code', async () => {
            await (0, sources_helpers_js_1.stepThroughTheCode)();
            await (0, sources_helpers_js_1.stepThroughTheCode)();
        });
        await (0, helper_js_1.step)('check that the variables in the scope view show the correct values', async () => {
            const localScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 2);
            chai_1.assert.deepEqual(localScopeValues, [
                '$var0: i32 {value: 50}',
                '$var1: i32 {value: 5}',
            ]);
        });
        await (0, helper_js_1.step)('resume script execution', async () => {
            await frontend.keyboard.press('F8');
            await (0, helper_js_1.waitFor)(sources_helpers_js_1.TURNED_OFF_PAUSE_BUTTON_SELECTOR);
        });
        await (0, sources_helpers_js_1.checkBreakpointDidNotActivate)();
    });
    // Flakey e2e test on Windows bot.
    mocha_extensions_js_1.it.skip('[crbug.com/1177714] is able to step with state in multi-threaded code in main thread', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        const fileName = 'stepping-with-state.wasm';
        await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('stepping-with-state.wasm', 'wasm/stepping-with-state-and-threads.html');
        });
        await (0, helper_js_1.step)('check that the main thread is selected', async () => {
            const selectedThreadElement = await (0, helper_js_1.waitFor)(sources_helpers_js_1.SELECTED_THREAD_SELECTOR);
            const selectedThreadName = await selectedThreadElement.evaluate(element => {
                return element.innerText;
            });
            chai_1.assert.strictEqual(selectedThreadName, 'Main', 'the Main thread is not active');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.0x060', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x060');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)('0x060'));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'stepping-with-state.wasm:0x60');
        });
        await (0, helper_js_1.step)('step two times through the code', async () => {
            await (0, sources_helpers_js_1.stepThroughTheCode)();
            await (0, sources_helpers_js_1.stepThroughTheCode)();
        });
        await (0, helper_js_1.step)('check that the variables in the scope view show the correct values', async () => {
            const localScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 3);
            chai_1.assert.deepEqual(localScopeValues, [
                '$var0: 42 {type: "i32", value: 42}',
                '$var1: 8 {type: "i32", value: 8}',
                '$var2: 5 {type: "i32", value: 5}',
            ]);
        });
        await (0, helper_js_1.step)('remove the breakpoint from the line 0x060', async () => {
            await (0, sources_helpers_js_1.removeBreakpointForLine)(frontend, '0x060');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.0x048', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, '0x048');
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)('0x048'));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'stepping-with-state.wasm:0x48');
        });
        await (0, helper_js_1.step)('check that the main thread is selected', async () => {
            const selectedThreadElement = await (0, helper_js_1.waitFor)(sources_helpers_js_1.SELECTED_THREAD_SELECTOR);
            const selectedThreadName = await selectedThreadElement.evaluate(element => {
                return element.innerText;
            });
            chai_1.assert.strictEqual(selectedThreadName, 'Main', 'the Main thread is not active');
        });
        await (0, helper_js_1.step)('step two times through the code', async () => {
            await (0, sources_helpers_js_1.stepThroughTheCode)();
            await (0, sources_helpers_js_1.stepThroughTheCode)();
        });
        await (0, helper_js_1.step)('check that the variables in the scope view show the correct values', async () => {
            const localScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 2);
            chai_1.assert.deepEqual(localScopeValues, [
                '$var0: 50 {type: "i32", value: 50}',
                '$var1: 5 {type: "i32", value: 5}',
            ]);
        });
        await (0, helper_js_1.step)('remove the breakpoint from the 8th line', async () => {
            await (0, sources_helpers_js_1.removeBreakpointForLine)(frontend, '0x048');
        });
        await (0, helper_js_1.step)('resume script execution', async () => {
            await frontend.keyboard.press('F8');
            await (0, helper_js_1.waitFor)(sources_helpers_js_1.TURNED_OFF_PAUSE_BUTTON_SELECTOR);
        });
        await (0, sources_helpers_js_1.checkBreakpointDidNotActivate)();
    });
    // Setting a breakpoint on a worker does not hit breakpoint until reloaded a couple of times.
    mocha_extensions_js_1.it.skip('[crbug.com/1134120] is able to step with state in multi-threaded code in worker thread', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        const fileName = 'stepping-with-state.wasm';
        await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)(fileName, 'wasm/stepping-with-state-and-threads.html');
        });
        await (0, helper_js_1.step)('check that the main thread is selected', async () => {
            const selectedThreadElement = await (0, helper_js_1.waitFor)(sources_helpers_js_1.SELECTED_THREAD_SELECTOR);
            const selectedThreadName = await selectedThreadElement.evaluate(element => {
                return element.innerText;
            });
            chai_1.assert.strictEqual(selectedThreadName, 'Main', 'the Main thread is not active');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.30', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 30);
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)(30));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'stepping-with-state.wasm:0x6d');
        });
        await (0, helper_js_1.step)('check that the worker thread is selected', async () => {
            const selectedThreadElement = await (0, helper_js_1.waitFor)(sources_helpers_js_1.SELECTED_THREAD_SELECTOR);
            const selectedThreadName = await selectedThreadElement.evaluate(element => {
                return element.innerText;
            });
            chai_1.assert.strictEqual(selectedThreadName, 'worker-stepping-with-state-and-threads.js', 'the worker thread is not active');
        });
        await (0, helper_js_1.step)('step two times through the code', async () => {
            await (0, sources_helpers_js_1.stepThroughTheCode)();
            await (0, sources_helpers_js_1.stepThroughTheCode)();
        });
        await (0, helper_js_1.step)('check that the variables in the scope view show the correct values', async () => {
            const localScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 1);
            chai_1.assert.deepEqual(localScopeValues, ['"": 42']);
        });
        await (0, helper_js_1.step)('remove the breakpoint from the 30th line', async () => {
            await (0, helper_js_1.click)((0, sources_helpers_js_1.sourceLineNumberSelector)(30));
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.13', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 13);
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, fileName);
        });
        await (0, helper_js_1.waitForFunction)(async () => await (0, sources_helpers_js_1.isBreakpointSet)(13));
        await (0, helper_js_1.step)('check that the code has paused on the breakpoint at the correct script location', async () => {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'stepping-with-state.wasm:0x50');
        });
        await (0, helper_js_1.step)('check that the worker thread is selected', async () => {
            const selectedThreadElement = await (0, helper_js_1.waitFor)(sources_helpers_js_1.SELECTED_THREAD_SELECTOR);
            const selectedThreadName = await selectedThreadElement.evaluate(element => {
                return element.innerText;
            });
            chai_1.assert.strictEqual(selectedThreadName, 'worker-stepping-with-state-and-threads.js', 'the worker thread is not active');
        });
        await (0, helper_js_1.step)('step two times through the code', async () => {
            await (0, sources_helpers_js_1.stepThroughTheCode)();
            await (0, sources_helpers_js_1.stepThroughTheCode)();
        });
        await (0, helper_js_1.step)('check that the variables in the scope view show the correct values', async () => {
            const localScopeValues = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 1);
            chai_1.assert.deepEqual(localScopeValues, ['"": 42']);
        });
        await (0, helper_js_1.step)('resume script execution', async () => {
            await frontend.keyboard.press('F8');
            await (0, helper_js_1.waitFor)(sources_helpers_js_1.TURNED_OFF_PAUSE_BUTTON_SELECTOR);
        });
        await (0, sources_helpers_js_1.checkBreakpointDidNotActivate)();
    });
});
(0, mocha_extensions_js_1.describe)('Raw-Wasm', async () => {
    (0, mocha_extensions_js_1.it)('displays correct location in Wasm source', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        // Have the target load the page.
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('callstack-wasm-to-js.wasm', 'wasm/callstack-wasm-to-js.html');
        // Go
        const fooPromise = target.evaluate('foo();'); // Don't await this, the target hits a debugger statement.
        // This page automatically enters debugging.
        const messageElement = await (0, helper_js_1.waitFor)('.paused-message');
        const statusMain = await (0, helper_js_1.waitFor)('.status-main', messageElement);
        if (!statusMain) {
            chai_1.assert.fail('Unable to find .status-main element');
        }
        const pauseMessage = await statusMain.evaluate(n => n.textContent);
        chai_1.assert.strictEqual(pauseMessage, 'Debugger paused');
        // Find second frame of call stack
        const titles = await (0, sources_helpers_js_1.getCallFrameNames)();
        const locations = await (0, sources_helpers_js_1.getCallFrameLocations)();
        chai_1.assert.isAbove(titles.length, 1);
        chai_1.assert.isAbove(locations.length, 1);
        chai_1.assert.strictEqual(titles[1], '$foo');
        chai_1.assert.strictEqual(locations[1], 'callstack-wasm-to-js.wasm:0x32');
        // Select second call frame.
        await (0, sources_helpers_js_1.switchToCallFrame)(2);
        // Wasm code for function call should be highlighted
        const codeLine = await (0, helper_js_1.waitFor)('.cm-executionLine');
        const codeText = await codeLine.evaluate(n => n.textContent);
        chai_1.assert.strictEqual(codeText, '    call $bar');
        // Resume the evaluation
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await fooPromise;
    });
});
//# sourceMappingURL=debug-raw-wasm_test.js.map