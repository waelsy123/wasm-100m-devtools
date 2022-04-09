"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.startCaptureCSSOverview = exports.openCSSOverviewPanelFromMoreTools = exports.cssOverviewPanelContentIsLoaded = exports.cssOverviewTabDoesNotExist = exports.cssOverviewTabExists = exports.navigateToCssOverviewTab = void 0;
const helper_js_1 = require("../../shared/helper.js");
const settings_helpers_js_1 = require("./settings-helpers.js");
const CSS_OVERVIEW_PANEL_CONTENT = '.view-container[aria-label="CSS Overview panel"]';
const CSS_OVERVIEW_TAB_SELECTOR = '#tab-cssoverview';
const CSS_OVERVIEW_PANEL_TITLE = 'CSS Overview';
const CSS_OVERVIEW_CAPTURE_BUTTON_SELECTOR = '.start-capture';
const CSS_OVERVIEW_COMPLETED_VIEW_SELECTOR = '.overview-completed-view';
async function navigateToCssOverviewTab() {
    const cssOverviewTab = await (0, helper_js_1.$)(CSS_OVERVIEW_TAB_SELECTOR);
    if (!cssOverviewTab) {
        await openCSSOverviewPanelFromMoreTools();
    }
    else {
        await (0, helper_js_1.click)(CSS_OVERVIEW_TAB_SELECTOR);
        await cssOverviewPanelContentIsLoaded();
    }
}
exports.navigateToCssOverviewTab = navigateToCssOverviewTab;
async function cssOverviewTabExists() {
    await (0, helper_js_1.waitFor)(CSS_OVERVIEW_TAB_SELECTOR);
}
exports.cssOverviewTabExists = cssOverviewTabExists;
async function cssOverviewTabDoesNotExist() {
    await (0, helper_js_1.waitForNone)(CSS_OVERVIEW_TAB_SELECTOR);
}
exports.cssOverviewTabDoesNotExist = cssOverviewTabDoesNotExist;
async function cssOverviewPanelContentIsLoaded() {
    await (0, helper_js_1.waitFor)(CSS_OVERVIEW_PANEL_CONTENT);
}
exports.cssOverviewPanelContentIsLoaded = cssOverviewPanelContentIsLoaded;
async function openCSSOverviewPanelFromMoreTools() {
    await (0, settings_helpers_js_1.openPanelViaMoreTools)(CSS_OVERVIEW_PANEL_TITLE);
    await cssOverviewTabExists();
    await cssOverviewPanelContentIsLoaded();
}
exports.openCSSOverviewPanelFromMoreTools = openCSSOverviewPanelFromMoreTools;
async function startCaptureCSSOverview() {
    const captureButton = await (0, helper_js_1.waitFor)(CSS_OVERVIEW_CAPTURE_BUTTON_SELECTOR);
    await captureButton.click();
    await (0, helper_js_1.waitFor)(CSS_OVERVIEW_COMPLETED_VIEW_SELECTOR);
}
exports.startCaptureCSSOverview = startCaptureCSSOverview;
//# sourceMappingURL=css-overview-helpers.js.map