"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../../shared/helper.js");
const mocha_extensions_js_1 = require("../../../shared/mocha-extensions.js");
const performance_helpers_js_1 = require("../../helpers/performance-helpers.js");
async function expandAndCheckActivityTree(frontend, expectedActivities) {
    let index = 0;
    let parentItem = undefined;
    do {
        await (0, helper_js_1.waitForFunction)(async () => {
            if (parentItem) {
                parentItem.evaluate(e => e.scrollIntoView());
            }
            const treeItem = await (0, helper_js_1.$)('.data-grid-data-grid-node.selected.revealed .activity-name');
            if (!treeItem) {
                return false;
            }
            const treeItemText = await frontend.evaluate(el => el.innerText, treeItem);
            if (expectedActivities[index] === treeItemText) {
                parentItem = treeItem;
                return true;
            }
            return false;
        });
        index++;
        await frontend.keyboard.press('ArrowRight');
        await frontend.keyboard.press('ArrowRight');
    } while (index < expectedActivities.length);
}
(0, mocha_extensions_js_1.describe)('The Performance panel', async function () {
    (0, mocha_extensions_js_1.it)('is able to record performance', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('navigate to the Performance tab', async () => {
            await (0, performance_helpers_js_1.navigateToPerformanceTab)('wasm/profiling');
        });
        await (0, helper_js_1.step)('open up the console', async () => {
            await frontend.keyboard.press('Escape');
            await (0, helper_js_1.waitFor)('.console-searchable-view');
        });
        await (0, helper_js_1.step)('click the record button', async () => {
            await (0, performance_helpers_js_1.startRecording)();
        });
        await (0, helper_js_1.step)('reload the page', async () => {
            await target.reload();
        });
        await (0, helper_js_1.step)('navigate to console-filter.html and get console messages', async () => {
            await (0, helper_js_1.waitFor)('.console-message-text .source-code');
        });
        await (0, helper_js_1.step)('stop the recording', async () => {
            await (0, performance_helpers_js_1.stopRecording)();
        });
        await (0, helper_js_1.step)('check that the recording finished successfully', async () => {
            await (0, helper_js_1.waitFor)(performance_helpers_js_1.SUMMARY_TAB_SELECTOR);
            await (0, helper_js_1.waitFor)(performance_helpers_js_1.BOTTOM_UP_SELECTOR);
            await (0, helper_js_1.waitFor)(performance_helpers_js_1.CALL_TREE_SELECTOR);
        });
    });
});
(0, mocha_extensions_js_1.describe)('The Performance panel', async function () {
    // These tests have lots of waiting which might take more time to execute
    this.timeout(20000);
    beforeEach(async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('navigate to the Performance tab and uplaod performance profile', async () => {
            await (0, performance_helpers_js_1.navigateToPerformanceTab)('wasm/profiling');
            const uploadProfileHandle = await (0, helper_js_1.waitFor)('input[type=file]');
            chai_1.assert.isNotNull(uploadProfileHandle, 'unable to upload the performance profile');
            await uploadProfileHandle.uploadFile('test/e2e/resources/performance/wasm/mainWasm_profile.json');
        });
        await (0, helper_js_1.step)('search for "mainWasm"', async () => {
            await (0, performance_helpers_js_1.searchForComponent)(frontend, 'mainWasm');
        });
    });
    // Link to wasm function is broken in profiling tab
    mocha_extensions_js_1.it.skip('[crbug.com/1125986] is able to inspect how long a wasm function takes to execute', async () => {
        await (0, helper_js_1.step)('check that the total time is more than zero', async () => {
            const totalTime = await (0, performance_helpers_js_1.getTotalTimeFromSummary)();
            chai_1.assert.isAbove(totalTime, 0, 'total time for "mainWasm" is not above zero');
        });
        await (0, helper_js_1.step)('click on the function link', async () => {
            await (0, performance_helpers_js_1.clickOnFunctionLink)();
        });
        // TODO(almuthanna): this step will be added once the bug crbug.com/1125986 is solved
        await (0, helper_js_1.step)('check that the system has navigated to the Sources tab with the "mainWasm" function highlighted', async () => {
            // step pending
        });
    });
    (0, mocha_extensions_js_1.it)(' is able to display the execution time for a wasm function', async () => {
        await (0, helper_js_1.step)('check that the Summary tab shows more than zero total time for "mainWasm"', async () => {
            const totalTime = await (0, performance_helpers_js_1.getTotalTimeFromSummary)();
            chai_1.assert.isAbove(totalTime, 0, 'mainWasm function execution time is displayed incorrectly');
        });
    });
    (0, mocha_extensions_js_1.it)('is able to inspect the call stack for a wasm function from the bottom up', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        const expectedActivities = ['mainWasm', 'js-to-wasm::i', '(anonymous)', 'Run Microtasks'];
        await (0, helper_js_1.step)('navigate to the Bottom Up tab', async () => {
            await (0, performance_helpers_js_1.navigateToBottomUpTab)();
        });
        await (0, helper_js_1.step)('expand the tree for the "mainWasm" activity and check that it displays the correct values', async () => {
            const timelineTree = await (0, helper_js_1.$)('.timeline-tree-view');
            const rootActivity = await (0, helper_js_1.waitForElementWithTextContent)(expectedActivities[0], timelineTree);
            if (!rootActivity) {
                chai_1.assert.fail(`Could not find ${expectedActivities[0]} in frontend.`);
            }
            await rootActivity.click();
            await expandAndCheckActivityTree(frontend, expectedActivities);
        });
    });
    (0, mocha_extensions_js_1.it)('is able to inspect the call stack for a wasm function from the call tree', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        const expectedActivities = [
            'Run Microtasks',
            '(anonymous)',
            'js-to-wasm::i',
            'mainWasm',
            'wasm-to-js::l-imports.getTime',
            'getTime',
        ];
        await (0, helper_js_1.step)('navigate to the Call Tree tab', async () => {
            await (0, performance_helpers_js_1.navigateToCallTreeTab)();
        });
        await (0, helper_js_1.step)('expand the tree for the "Run Microtasks" activity and check that it displays the correct values', async () => {
            const timelineTree = await (0, helper_js_1.$)('.timeline-tree-view');
            const rootActivity = await (0, helper_js_1.waitForElementWithTextContent)(expectedActivities[0], timelineTree);
            if (!rootActivity) {
                chai_1.assert.fail(`Could not find ${expectedActivities[0]} in frontend.`);
            }
            await rootActivity.click();
            await expandAndCheckActivityTree(frontend, expectedActivities);
        });
    });
});
//# sourceMappingURL=performance_profiling_test.js.map