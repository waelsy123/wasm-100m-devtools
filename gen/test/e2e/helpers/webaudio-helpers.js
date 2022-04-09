"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForWebAudioContent = exports.navigateToSiteWithAudioContexts = exports.waitForTheWebAudioPanelToLoad = void 0;
const helper_js_1 = require("../../shared/helper.js");
const settings_helpers_js_1 = require("./settings-helpers.js");
async function waitForTheWebAudioPanelToLoad() {
    // Open panel and wait for content
    await (0, settings_helpers_js_1.openPanelViaMoreTools)('WebAudio');
    await (0, helper_js_1.waitFor)('div[aria-label="WebAudio panel"]');
}
exports.waitForTheWebAudioPanelToLoad = waitForTheWebAudioPanelToLoad;
async function navigateToSiteWithAudioContexts() {
    // Navigate to a website with an audio context
    await (0, helper_js_1.goToResource)('webaudio/default.html');
}
exports.navigateToSiteWithAudioContexts = navigateToSiteWithAudioContexts;
async function waitForWebAudioContent() {
    await (0, helper_js_1.waitFor)('.web-audio-details-container');
    await (0, helper_js_1.waitFor)('.context-detail-container');
    await (0, helper_js_1.waitForNone)('.web-audio-landing-page');
}
exports.waitForWebAudioContent = waitForWebAudioContent;
//# sourceMappingURL=webaudio-helpers.js.map