"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const webaudio_helpers_js_1 = require("../helpers/webaudio-helpers.js");
(0, mocha_extensions_js_1.describe)('The WebAudio Panel', async () => {
    // Crashes Puppeteer if the assertion fails
    mocha_extensions_js_1.it.skip('[crbug.com/1086519]: Listens for audio contexts', async () => {
        await (0, webaudio_helpers_js_1.waitForTheWebAudioPanelToLoad)();
        await (0, webaudio_helpers_js_1.navigateToSiteWithAudioContexts)();
        await (0, webaudio_helpers_js_1.waitForWebAudioContent)();
    });
});
//# sourceMappingURL=webaudio_test.js.map