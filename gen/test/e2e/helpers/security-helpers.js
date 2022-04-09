"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.openSecurityPanelFromCommandMenu = exports.openSecurityPanelFromMoreTools = exports.closeSecurityTab = exports.navigateToSecurityTab = exports.securityPanelContentIsLoaded = exports.securityTabDoesNotExist = exports.securityTabExists = void 0;
const helper_js_1 = require("../../shared/helper.js");
const quick_open_helpers_js_1 = require("./quick_open-helpers.js");
const settings_helpers_js_1 = require("./settings-helpers.js");
const SECURITY_PANEL_CONTENT = '.view-container[aria-label="Security panel"]';
const SECURITY_TAB_SELECTOR = '#tab-security';
const SECURITY_PANEL_TITLE = 'Security';
async function securityTabExists() {
    await (0, helper_js_1.waitFor)(SECURITY_TAB_SELECTOR);
}
exports.securityTabExists = securityTabExists;
async function securityTabDoesNotExist() {
    await (0, helper_js_1.waitForNone)(SECURITY_TAB_SELECTOR);
}
exports.securityTabDoesNotExist = securityTabDoesNotExist;
async function securityPanelContentIsLoaded() {
    await (0, helper_js_1.waitFor)(SECURITY_PANEL_CONTENT);
}
exports.securityPanelContentIsLoaded = securityPanelContentIsLoaded;
async function navigateToSecurityTab() {
    await (0, helper_js_1.click)(SECURITY_TAB_SELECTOR);
    await securityPanelContentIsLoaded();
}
exports.navigateToSecurityTab = navigateToSecurityTab;
async function closeSecurityTab() {
    await (0, helper_js_1.closePanelTab)(SECURITY_TAB_SELECTOR);
    await securityTabDoesNotExist();
}
exports.closeSecurityTab = closeSecurityTab;
async function openSecurityPanelFromMoreTools() {
    await (0, settings_helpers_js_1.openPanelViaMoreTools)(SECURITY_PANEL_TITLE);
    await securityTabExists();
    await securityPanelContentIsLoaded();
}
exports.openSecurityPanelFromMoreTools = openSecurityPanelFromMoreTools;
async function openSecurityPanelFromCommandMenu() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, quick_open_helpers_js_1.openCommandMenu)();
    await (0, helper_js_1.typeText)('Show Security');
    await frontend.keyboard.press('Enter');
    await securityTabExists();
    await securityPanelContentIsLoaded();
}
exports.openSecurityPanelFromCommandMenu = openSecurityPanelFromCommandMenu;
//# sourceMappingURL=security-helpers.js.map