"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfTabExistsInDrawer = exports.tabExistsInDrawer = exports.tabExistsInMainPanel = exports.TAB_HEADER_SELECTOR = exports.DRAWER_PANEL_SELECTOR = exports.MAIN_PANEL_SELECTOR = exports.MOVE_TO_MAIN_PANEL_SELECTOR = exports.MOVE_TO_DRAWER_SELECTOR = exports.clickOnContextMenuItemFromTab = exports.navigateToCrossToolIntegrationSite = exports.prepareForCrossToolScenario = void 0;
const helper_js_1 = require("../../shared/helper.js");
async function prepareForCrossToolScenario() {
    await navigateToCrossToolIntegrationSite();
    await (0, helper_js_1.closeAllCloseableTabs)();
}
exports.prepareForCrossToolScenario = prepareForCrossToolScenario;
async function navigateToCrossToolIntegrationSite() {
    await (0, helper_js_1.goToResource)('cross_tool/default.html');
}
exports.navigateToCrossToolIntegrationSite = navigateToCrossToolIntegrationSite;
async function clickOnContextMenuItemFromTab(tabId, menuItemSelector) {
    // Find the selected node, right click.
    const selectedNode = await (0, helper_js_1.waitFor)(tabId);
    await (0, helper_js_1.click)(selectedNode, { clickOptions: { button: 'right' } });
    // Click on the context menu option
    await (0, helper_js_1.click)(menuItemSelector);
}
exports.clickOnContextMenuItemFromTab = clickOnContextMenuItemFromTab;
exports.MOVE_TO_DRAWER_SELECTOR = '[aria-label="Move to bottom"]';
exports.MOVE_TO_MAIN_PANEL_SELECTOR = '[aria-label="Move to top"]';
exports.MAIN_PANEL_SELECTOR = 'div[class*="main-tabbed-pane"][slot*="insertion-point-main"]';
exports.DRAWER_PANEL_SELECTOR = 'div[class*="drawer-tabbed-pane"][slot*="insertion-point-sidebar"]';
exports.TAB_HEADER_SELECTOR = 'div[class*="tabbed-pane-header"]';
async function tabExistsInMainPanel(tabId) {
    const mainPanel = await (0, helper_js_1.waitFor)(exports.MAIN_PANEL_SELECTOR);
    await (0, helper_js_1.waitFor)(tabId, mainPanel);
}
exports.tabExistsInMainPanel = tabExistsInMainPanel;
async function tabExistsInDrawer(tabId) {
    const drawer = await (0, helper_js_1.waitFor)(exports.DRAWER_PANEL_SELECTOR);
    await (0, helper_js_1.waitFor)(tabId, drawer);
}
exports.tabExistsInDrawer = tabExistsInDrawer;
const checkIfTabExistsInDrawer = async (tabId) => {
    const drawer = await (0, helper_js_1.waitFor)(exports.DRAWER_PANEL_SELECTOR);
    const header = await (0, helper_js_1.waitFor)(exports.TAB_HEADER_SELECTOR, drawer);
    const tab = await header.$(tabId);
    return Boolean(tab);
};
exports.checkIfTabExistsInDrawer = checkIfTabExistsInDrawer;
//# sourceMappingURL=cross-tool-helper.js.map