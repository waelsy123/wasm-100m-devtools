"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageContents = exports.clearCoverageContent = exports.stopInstrumentingCoverage = exports.startInstrumentingCoverage = exports.navigateToCoverageTestSite = exports.waitForTheCoveragePanelToLoad = void 0;
const helper_js_1 = require("../../shared/helper.js");
const settings_helpers_js_1 = require("./settings-helpers.js");
const START_INSTRUMENTING_BUTTON = 'button[aria-label="Start instrumenting coverage and reload page"]';
const STOP_INSTRUMENTING_BUTTON = 'button[aria-label="Stop instrumenting coverage and show results"]';
async function waitForTheCoveragePanelToLoad() {
    // Open panel and wait for content
    await (0, settings_helpers_js_1.openPanelViaMoreTools)('Coverage');
    await (0, helper_js_1.waitFor)('div[aria-label="Coverage panel"]');
    await (0, helper_js_1.waitFor)('.coverage-results .landing-page');
}
exports.waitForTheCoveragePanelToLoad = waitForTheCoveragePanelToLoad;
async function navigateToCoverageTestSite() {
    await (0, helper_js_1.goToResource)('coverage/default.html');
}
exports.navigateToCoverageTestSite = navigateToCoverageTestSite;
async function startInstrumentingCoverage() {
    await (0, helper_js_1.waitFor)(START_INSTRUMENTING_BUTTON);
    await (0, helper_js_1.click)(START_INSTRUMENTING_BUTTON);
    await (0, helper_js_1.waitForNone)('.coverage-results .landing-page');
}
exports.startInstrumentingCoverage = startInstrumentingCoverage;
async function stopInstrumentingCoverage() {
    await (0, helper_js_1.click)(STOP_INSTRUMENTING_BUTTON);
    await (0, helper_js_1.waitForNone)('button[aria-label="Clear all"][disabled]');
}
exports.stopInstrumentingCoverage = stopInstrumentingCoverage;
async function clearCoverageContent() {
    await (0, helper_js_1.click)('button[aria-label="Clear all"]');
    await (0, helper_js_1.waitFor)('.coverage-results .landing-page');
}
exports.clearCoverageContent = clearCoverageContent;
async function getMessageContents() {
    const messageElement = await (0, helper_js_1.waitFor)('.coverage-results .landing-page .message');
    return messageElement.evaluate(node => node.innerText);
}
exports.getMessageContents = getMessageContents;
//# sourceMappingURL=coverage-helpers.js.map