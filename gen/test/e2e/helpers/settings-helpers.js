"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePreferenceInSettingsTab = exports.openSettingsTab = exports.openPanelViaMoreTools = void 0;
const helper_js_1 = require("../../shared/helper.js");
const openPanelViaMoreTools = async (panelTitle, isLocalized = false) => {
    // Head to the triple dot menu.
    const tripleDotMenuText = isLocalized ? 'Ĉúŝt́ôḿîźê án̂d́ ĉón̂t́r̂ól̂ D́êv́T̂óôĺŝ' : 'Customize and control DevTools';
    const tripleDotMenu = await (0, helper_js_1.waitForAria)(tripleDotMenuText);
    await (0, helper_js_1.click)(tripleDotMenu);
    const moreToolsText = isLocalized ? 'M̂ór̂é t̂óôĺŝ' : 'More tools';
    // Open the “More Tools” option.
    const moreTools = await (0, helper_js_1.waitForAria)(`${moreToolsText}[role="menuitem"]`);
    await moreTools.hover();
    // Click the desired menu item
    const menuItem = await (0, helper_js_1.waitForAria)(`${panelTitle}[role="menuitem"]`);
    await (0, helper_js_1.click)(menuItem);
    const panelText = isLocalized ? 'p̂án̂él̂' : 'panel';
    // Wait for the corresponding panel to appear.
    await (0, helper_js_1.waitForAria)(`${panelTitle} ${panelText}[role="tabpanel"]`);
};
exports.openPanelViaMoreTools = openPanelViaMoreTools;
const openSettingsTab = async (tabTitle) => {
    const gearIconSelector = '.toolbar-button[aria-label="Settings"]';
    const settingsMenuSelector = `.tabbed-pane-header-tab[aria-label="${tabTitle}"]`;
    const panelSelector = `.view-container[aria-label="${tabTitle} panel"]`;
    // Click on the Settings Gear toolbar icon.
    await (0, helper_js_1.click)(gearIconSelector);
    // Click on the Settings tab and wait for the panel to appear.
    await (0, helper_js_1.waitFor)(settingsMenuSelector);
    await (0, helper_js_1.click)(settingsMenuSelector);
    await (0, helper_js_1.waitFor)(panelSelector);
};
exports.openSettingsTab = openSettingsTab;
const togglePreferenceInSettingsTab = async (label) => {
    await (0, exports.openSettingsTab)('Preferences');
    const selector = `[aria-label="${label}"`;
    await (0, helper_js_1.scrollElementIntoView)(selector);
    const preference = await (0, helper_js_1.waitFor)(selector);
    const value = await preference.evaluate(checkbox => checkbox.checked);
    await (0, helper_js_1.click)(preference);
    await (0, helper_js_1.waitForFunction)(async () => {
        const newValue = await preference.evaluate(checkbox => checkbox.checked);
        return newValue !== value;
    });
    await (0, helper_js_1.click)('.dialog-close-button');
};
exports.togglePreferenceInSettingsTab = togglePreferenceInSettingsTab;
//# sourceMappingURL=settings-helpers.js.map