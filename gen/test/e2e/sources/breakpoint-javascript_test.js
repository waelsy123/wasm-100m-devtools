"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
async function waitForTopCallFrameChanged(previousCallFrame, updatedCallFrame) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const actualTopCallFrame = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
        chai_1.assert.isTrue(actualTopCallFrame === previousCallFrame || actualTopCallFrame === updatedCallFrame);
        return actualTopCallFrame === updatedCallFrame;
    });
}
(0, mocha_extensions_js_1.describe)('The Sources Tab', async () => {
    (0, mocha_extensions_js_1.it)('sets and hits breakpoints in JavaScript', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('click-breakpoint.js', 'click-breakpoint.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 4);
        const scriptEvaluation = target.evaluate('f2();');
        const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
        chai_1.assert.deepEqual(scriptLocation, 'click-breakpoint.js:4');
        const breakpointHandle = await (0, helper_js_1.$)('label', await (0, helper_js_1.waitFor)('.breakpoint-hit'));
        const breakpointLocation = await breakpointHandle?.evaluate(label => label.textContent);
        chai_1.assert.deepEqual(breakpointLocation, scriptLocation);
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await scriptEvaluation;
    });
    (0, mocha_extensions_js_1.it)('stops at each breakpoint on resume (using F8) on target', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)('navigate to page', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('click-breakpoint.js', 'click-breakpoint.html');
        });
        await (0, helper_js_1.step)('add a breakpoint to line No.3, 4, and 9', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 3);
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 4);
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 9);
        });
        let scriptEvaluation;
        await (0, helper_js_1.step)('trigger evaluation of script', async () => {
            scriptEvaluation = target.evaluate('f2();');
        });
        await (0, helper_js_1.step)('wait for pause and check if we stopped at line 3', async () => {
            await (0, helper_js_1.waitForFunction)(() => (0, helper_js_1.getPendingEvents)(frontend, sources_helpers_js_1.DEBUGGER_PAUSED_EVENT));
            await (0, helper_js_1.waitFor)(sources_helpers_js_1.PAUSE_INDICATOR_SELECTOR);
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)();
            chai_1.assert.deepEqual(scriptLocation, 'click-breakpoint.js:3');
        });
        await (0, helper_js_1.step)('resume and wait until we have hit the next breakpoint (3->4)', async () => {
            await target.keyboard.press('F8');
            await waitForTopCallFrameChanged('click-breakpoint.js:3', 'click-breakpoint.js:4');
        });
        await (0, helper_js_1.step)('resume and wait until we have hit the next breakpoint (4->9)', async () => {
            await target.keyboard.press('F8');
            await waitForTopCallFrameChanged('click-breakpoint.js:4', 'click-breakpoint.js:9');
        });
        await (0, helper_js_1.step)('resume and wait until script finishes execution', async () => {
            await frontend.keyboard.press('F8');
            await scriptEvaluation;
        });
    });
});
//# sourceMappingURL=breakpoint-javascript_test.js.map