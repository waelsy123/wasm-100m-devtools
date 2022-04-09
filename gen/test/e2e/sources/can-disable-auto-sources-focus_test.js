"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
async function breakAndCheckFocusedPanel(expectedPanel) {
    const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.step)('navigate to a page and open the Sources tab', async () => {
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('click-breakpoint.js', 'click-breakpoint.html');
    });
    await (0, helper_js_1.step)('add a breakpoint to line No.4', async () => {
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 4);
    });
    await (0, helper_js_1.step)('navigate to the elements tab', async () => {
        await (0, elements_helpers_js_1.navigateToElementsTab)();
    });
    await (0, helper_js_1.step)('trigger a Debugger.paused event', async () => {
        target.evaluate('f2();');
    });
    await (0, helper_js_1.step)('wait for Debugger.paused event', async () => {
        await (0, helper_js_1.waitForFunction)(() => (0, helper_js_1.getPendingEvents)(frontend, sources_helpers_js_1.DEBUGGER_PAUSED_EVENT));
    });
    await (0, helper_js_1.step)(`check that we are in the ${expectedPanel} tab`, async () => {
        await (0, helper_js_1.waitFor)(`.panel[aria-label="${expectedPanel}"]`);
    });
}
describe('Sources Panel', async () => {
    beforeEach(async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        (0, helper_js_1.installEventListener)(frontend, sources_helpers_js_1.DEBUGGER_PAUSED_EVENT);
    });
    it('is not opened on Debugger.paused if autoFocusOnDebuggerPausedEnabled is false', async () => {
        await (0, helper_js_1.step)('toggle preference in settings tab', async () => {
            await (0, settings_helpers_js_1.togglePreferenceInSettingsTab)('Focus Sources panel when triggering a breakpoint');
        });
        // Note: This test checks if we *do not* switch panels after receiving
        // a Debugger.paused event. If this functionality that we are testing is not
        // working anymore, then this test may become flaky (sometimes we check before switching,
        // sometimes after switching to the sources panel).
        await breakAndCheckFocusedPanel('elements');
    });
    it('is opened on Debugger.pause if autoFocusOnDebuggerPausedEnabled is true (default)', async () => {
        await breakAndCheckFocusedPanel('sources');
    });
});
//# sourceMappingURL=can-disable-auto-sources-focus_test.js.map