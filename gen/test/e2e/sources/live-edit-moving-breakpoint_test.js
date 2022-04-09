"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('Live edit', async () => {
    (0, mocha_extensions_js_1.it)('moves the breakpoint after reload when changes are not persisted', async () => {
        const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('live-edit-moving-breakpoint.js', 'live-edit-moving-breakpoint.html');
        await (0, helper_js_1.step)('add two newlines to the script', async () => {
            const editorContent = await (0, helper_js_1.waitFor)('.cm-content');
            const markerLine = await (0, helper_js_1.$textContent)('// Insertion marker for newline.', editorContent);
            (0, helper_js_1.assertNotNullOrUndefined)(markerLine);
            // Place the caret at the end of the marker line by clicking in the middle of the
            // line element and then pressing 'End'.
            await (0, helper_js_1.click)(markerLine);
            await frontend.keyboard.press('End');
            await frontend.keyboard.press('Enter');
            await frontend.keyboard.press('Enter');
        });
        await (0, helper_js_1.step)('save the script and wait for the save to go through', async () => {
            await (0, helper_js_1.pressKey)('s', { control: true });
            await (0, helper_js_1.waitFor)('[aria-label="live-edit-moving-breakpoint.js"]');
        });
        await (0, helper_js_1.step)('set a breakpoint in the "await" line', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 9);
        });
        await (0, helper_js_1.step)('reload the page and verify that the breakpoint has moved', async () => {
            await (0, sources_helpers_js_1.reloadPageAndWaitForSourceFile)(frontend, target, 'live-edit-moving-breakpoint.js');
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('live-edit-moving-breakpoint.js', 'live-edit-moving-breakpoint.html');
            // TODO(crbug.com/1216904): Flip this assumption once crbug.com/1216904 is fixed.
            //     We currently expect the bugged state to make sure the test keeps running
            //     and is maintained.
            chai_1.assert.isTrue(await (0, sources_helpers_js_1.isBreakpointSet)(9));
            chai_1.assert.isFalse(await (0, sources_helpers_js_1.isBreakpointSet)(7));
        });
    });
});
//# sourceMappingURL=live-edit-moving-breakpoint_test.js.map