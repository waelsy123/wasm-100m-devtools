"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForAnimationContent = exports.navigateToSiteWithAnimation = exports.waitForAnimationsPanelToLoad = void 0;
const helper_js_1 = require("../../shared/helper.js");
const settings_helpers_js_1 = require("./settings-helpers.js");
async function waitForAnimationsPanelToLoad() {
    // Open panel and wait for content
    await (0, settings_helpers_js_1.openPanelViaMoreTools)('Animations');
    await (0, helper_js_1.waitFor)('div[aria-label="Animations panel"]');
    await (0, helper_js_1.waitFor)('div.animations-timeline');
}
exports.waitForAnimationsPanelToLoad = waitForAnimationsPanelToLoad;
async function navigateToSiteWithAnimation() {
    // Navigate to a website with an animation
    await (0, helper_js_1.goToResource)('animations/default.html');
}
exports.navigateToSiteWithAnimation = navigateToSiteWithAnimation;
async function waitForAnimationContent() {
    const firstAnimationPreviewSelector = '.animation-buffer-preview[aria-label="Animation Preview 1"]';
    await (0, helper_js_1.waitFor)(firstAnimationPreviewSelector);
    await (0, helper_js_1.click)(firstAnimationPreviewSelector);
    await (0, helper_js_1.waitFor)('.animation-node-row');
    await (0, helper_js_1.waitFor)('svg.animation-ui');
}
exports.waitForAnimationContent = waitForAnimationContent;
//# sourceMappingURL=animations-helpers.js.map