"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickOnFunctionLink = exports.waitForSourceLinkAndFollowIt = exports.navigateToPerformanceSidebarTab = exports.retrieveSelectedAndExpandedActivityItems = exports.getTotalTimeFromSummary = exports.stopRecording = exports.startRecording = exports.navigateToCallTreeTab = exports.navigateToBottomUpTab = exports.navigateToSummaryTab = exports.searchForComponent = exports.navigateToPerformanceTab = exports.TOTAL_TIME_SELECTOR = exports.ACTIVITY_COLUMN_SELECTOR = exports.CALL_TREE_SELECTOR = exports.BOTTOM_UP_SELECTOR = exports.SUMMARY_TAB_SELECTOR = exports.STOP_BUTTON_SELECTOR = exports.RECORD_BUTTON_SELECTOR = void 0;
const helper_js_1 = require("../../shared/helper.js");
exports.RECORD_BUTTON_SELECTOR = '[aria-label="Record"]';
exports.STOP_BUTTON_SELECTOR = '[aria-label="Stop"]';
exports.SUMMARY_TAB_SELECTOR = '[aria-label="Summary"]';
exports.BOTTOM_UP_SELECTOR = '[aria-label="Bottom-Up"]';
exports.CALL_TREE_SELECTOR = '[aria-label="Call Tree"]';
exports.ACTIVITY_COLUMN_SELECTOR = '.activity-column.disclosure';
exports.TOTAL_TIME_SELECTOR = 'div:nth-child(1) > div.vbox.timeline-details-chip-body > div:nth-child(1) > div.timeline-details-view-row-value';
async function navigateToPerformanceTab(testName) {
    if (testName) {
        await (0, helper_js_1.goToResource)(`performance/${testName}.html`);
    }
    // Click on the tab.
    await (0, helper_js_1.click)('#tab-timeline');
    // Make sure the landing page is shown.
    await (0, helper_js_1.waitFor)('.timeline-landing-page');
}
exports.navigateToPerformanceTab = navigateToPerformanceTab;
async function searchForComponent(frontend, searchEntry) {
    await frontend.keyboard.down('Control');
    await frontend.keyboard.press('KeyF');
    await frontend.keyboard.up('Control');
    await frontend.keyboard.type(searchEntry);
    await frontend.keyboard.press('Enter');
}
exports.searchForComponent = searchForComponent;
async function navigateToSummaryTab() {
    await (0, helper_js_1.click)(exports.SUMMARY_TAB_SELECTOR);
}
exports.navigateToSummaryTab = navigateToSummaryTab;
async function navigateToBottomUpTab() {
    await (0, helper_js_1.click)(exports.BOTTOM_UP_SELECTOR);
}
exports.navigateToBottomUpTab = navigateToBottomUpTab;
async function navigateToCallTreeTab() {
    await (0, helper_js_1.click)(exports.CALL_TREE_SELECTOR);
}
exports.navigateToCallTreeTab = navigateToCallTreeTab;
async function startRecording() {
    await (0, helper_js_1.click)(exports.RECORD_BUTTON_SELECTOR);
    // Wait for the button to turn to its stop state.
    await (0, helper_js_1.waitFor)(exports.STOP_BUTTON_SELECTOR);
}
exports.startRecording = startRecording;
async function stopRecording() {
    await (0, helper_js_1.click)(exports.STOP_BUTTON_SELECTOR);
    // Make sure the timeline details panel appears. It's a sure way to assert
    // that a recording is actually displayed as some of the other elements in
    // the timeline remain in the DOM even after the recording has been cleared.
    await (0, helper_js_1.waitFor)('.timeline-details-chip-body');
}
exports.stopRecording = stopRecording;
async function getTotalTimeFromSummary() {
    const pieChartTotal = await (0, helper_js_1.waitFor)('.pie-chart-total');
    const totalText = await pieChartTotal.evaluate(node => node.textContent);
    return parseInt(totalText, 10);
}
exports.getTotalTimeFromSummary = getTotalTimeFromSummary;
async function retrieveSelectedAndExpandedActivityItems(frontend) {
    const treeItems = await frontend.$$('.expanded > td.activity-column,.selected > td.activity-column');
    const tree = [];
    for (const item of treeItems) {
        tree.push(await frontend.evaluate(el => el.innerText.split('\n')[0], item));
    }
    return tree;
}
exports.retrieveSelectedAndExpandedActivityItems = retrieveSelectedAndExpandedActivityItems;
async function navigateToPerformanceSidebarTab(tabName) {
    await (0, helper_js_1.click)(`[aria-label="${tabName}"]`);
}
exports.navigateToPerformanceSidebarTab = navigateToPerformanceSidebarTab;
async function waitForSourceLinkAndFollowIt() {
    const link = await (0, helper_js_1.waitFor)('.devtools-link');
    await (0, helper_js_1.click)(link);
    await (0, helper_js_1.waitFor)('.panel[aria-label="sources"]');
}
exports.waitForSourceLinkAndFollowIt = waitForSourceLinkAndFollowIt;
async function clickOnFunctionLink() {
    const link = await (0, helper_js_1.waitFor)('.timeline-details.devtools-link');
    await (0, helper_js_1.click)(link);
}
exports.clickOnFunctionLink = clickOnFunctionLink;
//# sourceMappingURL=performance-helpers.js.map