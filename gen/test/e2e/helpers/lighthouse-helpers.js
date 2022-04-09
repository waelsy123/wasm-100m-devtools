"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGenerateReportButtonDisabled = exports.navigateToLighthouseTab = void 0;
const helper_js_1 = require("../../shared/helper.js");
async function navigateToLighthouseTab(path) {
    await (0, helper_js_1.goToResource)(path);
    await (0, helper_js_1.click)('#tab-lighthouse');
    // Make sure the lighthouse start view is shown
    await (0, helper_js_1.waitFor)('.lighthouse-start-view');
}
exports.navigateToLighthouseTab = navigateToLighthouseTab;
async function isGenerateReportButtonDisabled() {
    const button = await (0, helper_js_1.waitFor)('.lighthouse-start-view .primary-button');
    return button.evaluate(element => element.disabled);
}
exports.isGenerateReportButtonDisabled = isGenerateReportButtonDisabled;
//# sourceMappingURL=lighthouse-helpers.js.map