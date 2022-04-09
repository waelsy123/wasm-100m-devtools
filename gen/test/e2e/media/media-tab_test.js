"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const media_helpers_js_1 = require("../helpers/media-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('Media Tab', () => {
    (0, mocha_extensions_js_1.it)('ensures video playback adds entry', async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Media');
        await (0, media_helpers_js_1.playMediaFile)('fisch.webm');
        const entryName = await (0, media_helpers_js_1.getPlayerButtonText)();
        chai_1.assert.strictEqual(entryName.length, 11);
    });
    (0, mocha_extensions_js_1.it)('ensures video playback adds entry for web worker', async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Media');
        await (0, helper_js_1.goToResource)('media/codec_worker.html');
        await (0, media_helpers_js_1.waitForPlayerButtonTexts)(4);
    });
});
//# sourceMappingURL=media-tab_test.js.map