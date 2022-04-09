"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleRecordingWithKeyboad = exports.createAProfile = exports.navigateToProfilerTab = exports.STOP_PROFILING_BUTTON = exports.START_PROFILING_BUTTON = void 0;
const helper_js_1 = require("../../shared/helper.js");
const settings_helpers_js_1 = require("./settings-helpers.js");
exports.START_PROFILING_BUTTON = 'button[aria-label="Start CPU profiling"]';
exports.STOP_PROFILING_BUTTON = 'button[aria-label="Stop CPU profiling"]';
async function navigateToProfilerTab() {
    await (0, helper_js_1.goToResource)('profiler/default.html');
    await (0, settings_helpers_js_1.openPanelViaMoreTools)('JavaScript Profiler');
    await (0, helper_js_1.waitFor)('[aria-label="JavaScript Profiler panel"]');
    await (0, helper_js_1.waitFor)('.profile-launcher-view');
}
exports.navigateToProfilerTab = navigateToProfilerTab;
async function createAProfile() {
    await (0, helper_js_1.click)(exports.START_PROFILING_BUTTON);
    // Once we start profiling the button should change to be stop
    await (0, helper_js_1.waitFor)(exports.STOP_PROFILING_BUTTON);
    await (0, helper_js_1.click)(exports.STOP_PROFILING_BUTTON);
    // The launcher view should disappear
    await (0, helper_js_1.waitForNone)('.profile-launcher-view');
    // the detail information should appear
    await (0, helper_js_1.waitFor)('#profile-views');
}
exports.createAProfile = createAProfile;
async function toggleRecordingWithKeyboad() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const modifierKey = helper_js_1.platform === 'mac' ? 'Meta' : 'Control';
    await frontend.keyboard.down(modifierKey);
    await frontend.keyboard.press('E');
    await frontend.keyboard.up(modifierKey);
}
exports.toggleRecordingWithKeyboad = toggleRecordingWithKeyboad;
//# sourceMappingURL=profiler-helpers.js.map