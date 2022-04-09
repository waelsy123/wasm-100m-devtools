"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const quick_open_helpers_js_1 = require("../helpers/quick_open-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
const settings_shortcuts_helpers_js_1 = require("../helpers/settings-shortcuts-helpers.js");
(0, mocha_extensions_js_1.describe)('Shortcuts Settings tab', async () => {
    (0, mocha_extensions_js_1.it)('should update when the shortcuts preset is changed ', async () => {
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.selectKeyboardShortcutPreset)('vsCode');
        await (0, settings_shortcuts_helpers_js_1.waitForVSCodeShortcutPreset)();
        const shortcutsShortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Shortcuts');
        const settingsShortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Settings');
        const pauseShortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Pause script execution');
        chai_1.assert.deepStrictEqual(shortcutsShortcuts, settings_shortcuts_helpers_js_1.VS_CODE_SHORTCUTS_SHORTCUTS);
        chai_1.assert.deepStrictEqual(settingsShortcuts, settings_shortcuts_helpers_js_1.VS_CODE_SETTINGS_SHORTCUTS);
        chai_1.assert.deepStrictEqual(pauseShortcuts, settings_shortcuts_helpers_js_1.VS_CODE_PAUSE_SHORTCUTS);
    });
    (0, mocha_extensions_js_1.it)('should apply new shortcuts when the preset is changed', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.selectKeyboardShortcutPreset)('vsCode');
        await (0, settings_shortcuts_helpers_js_1.waitForVSCodeShortcutPreset)();
        // close the settings dialog
        await frontend.keyboard.press('Escape');
        // use a newly-enabled shortcut to open the command menu
        await frontend.keyboard.press('F1');
        await (0, helper_js_1.waitFor)(quick_open_helpers_js_1.QUICK_OPEN_SELECTOR);
        // make sure the command menu reflects the new shortcuts
        await frontend.keyboard.type('Shortcuts');
        const shortcutsItemText = await (0, quick_open_helpers_js_1.getSelectedItemText)();
        chai_1.assert.strictEqual(shortcutsItemText, settings_shortcuts_helpers_js_1.VS_CODE_SHORTCUTS_QUICK_OPEN_TEXT);
    });
    (0, mocha_extensions_js_1.it)('should allow users to open the shortcut editor and view the current shortcut', async () => {
        await (0, helper_js_1.enableExperiment)('keyboardShortcutEditor');
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.editShortcutListItem)('Show Console');
        const shortcutInputsText = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputsText, settings_shortcuts_helpers_js_1.CONSOLE_SHORTCUT_INPUT_TEXT);
    });
    (0, mocha_extensions_js_1.it)('should allow users to open the shortcut editor and change and add shortcuts', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.enableExperiment)('keyboardShortcutEditor');
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.editShortcutListItem)('Show Console');
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('1');
        await frontend.keyboard.up('Control');
        await (0, settings_shortcuts_helpers_js_1.clickAddShortcutLink)();
        await (0, settings_shortcuts_helpers_js_1.waitForEmptyShortcutInput)();
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('2');
        await frontend.keyboard.up('Control');
        const shortcutInputsText = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputsText, settings_shortcuts_helpers_js_1.CONTROL_1_CONTROL_2_SHORTCUT_INPUTS_TEXT);
        await (0, settings_shortcuts_helpers_js_1.clickShortcutConfirmButton)();
        await (0, helper_js_1.waitForNoElementsWithTextContent)(settings_shortcuts_helpers_js_1.ADD_SHORTCUT_LINK_TEXT);
        const shortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Show Console');
        chai_1.assert.deepStrictEqual(shortcuts, settings_shortcuts_helpers_js_1.CONTROL_1_CONTROL_2_SHORTCUT_DISPLAY_TEXT);
    });
    (0, mocha_extensions_js_1.it)('should allow users to open the shortcut editor and delete and reset shortcuts', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.enableExperiment)('keyboardShortcutEditor');
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.editShortcutListItem)('Show Console');
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('1');
        await frontend.keyboard.up('Control');
        await (0, settings_shortcuts_helpers_js_1.clickAddShortcutLink)();
        await (0, settings_shortcuts_helpers_js_1.waitForEmptyShortcutInput)();
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('2');
        await frontend.keyboard.up('Control');
        const shortcutInputsText = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputsText, settings_shortcuts_helpers_js_1.CONTROL_1_CONTROL_2_SHORTCUT_INPUTS_TEXT);
        await (0, settings_shortcuts_helpers_js_1.clickShortcutDeleteButton)(0);
        let shortcutInputTextAfterDeletion;
        await (0, helper_js_1.waitForFunction)(async () => {
            shortcutInputTextAfterDeletion = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
            return shortcutInputTextAfterDeletion.length === 1;
        });
        chai_1.assert.deepStrictEqual(shortcutInputTextAfterDeletion, settings_shortcuts_helpers_js_1.CONTROL_2_SHORTCUT_INPUT_TEXT);
        await (0, settings_shortcuts_helpers_js_1.clickShortcutResetButton)();
        const shortcutInputTextAfterReset = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputTextAfterReset, settings_shortcuts_helpers_js_1.CONSOLE_SHORTCUT_INPUT_TEXT);
        await (0, settings_shortcuts_helpers_js_1.clickShortcutConfirmButton)();
        await (0, helper_js_1.waitForNoElementsWithTextContent)(settings_shortcuts_helpers_js_1.ADD_SHORTCUT_LINK_TEXT);
        const shortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Show Console');
        chai_1.assert.deepStrictEqual(shortcuts, settings_shortcuts_helpers_js_1.CONSOLE_SHORTCUT_DISPLAY_TEXT);
    });
    (0, mocha_extensions_js_1.it)('should allow users to cancel an edit and discard their changes to shortcuts', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.enableExperiment)('keyboardShortcutEditor');
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.editShortcutListItem)('Show Console');
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('1');
        await frontend.keyboard.up('Control');
        await (0, settings_shortcuts_helpers_js_1.clickAddShortcutLink)();
        await (0, settings_shortcuts_helpers_js_1.waitForEmptyShortcutInput)();
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('2');
        await frontend.keyboard.up('Control');
        const shortcutInputsText = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputsText, settings_shortcuts_helpers_js_1.CONTROL_1_CONTROL_2_SHORTCUT_INPUTS_TEXT);
        await (0, settings_shortcuts_helpers_js_1.clickShortcutCancelButton)();
        await (0, helper_js_1.waitForNoElementsWithTextContent)(settings_shortcuts_helpers_js_1.ADD_SHORTCUT_LINK_TEXT);
        const shortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Show Console');
        chai_1.assert.deepStrictEqual(shortcuts, settings_shortcuts_helpers_js_1.CONSOLE_SHORTCUT_DISPLAY_TEXT);
    });
    (0, mocha_extensions_js_1.it)('should allow users to set a multi-keypress shortcut (chord)', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.enableExperiment)('keyboardShortcutEditor');
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.editShortcutListItem)('Show Console');
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('1');
        await frontend.keyboard.up('Control');
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('2');
        await frontend.keyboard.up('Control');
        const shortcutInputsText = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputsText, settings_shortcuts_helpers_js_1.CONTROL_1_CONTROL_2_CHORD_INPUT_TEXT);
        await (0, settings_shortcuts_helpers_js_1.clickShortcutConfirmButton)();
        await (0, helper_js_1.waitForNoElementsWithTextContent)(settings_shortcuts_helpers_js_1.ADD_SHORTCUT_LINK_TEXT);
        const shortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Show Console');
        chai_1.assert.deepStrictEqual(shortcuts, settings_shortcuts_helpers_js_1.CONTROL_1_CONTROL_2_CHORD_DISPLAY_TEXT);
    });
    (0, mocha_extensions_js_1.it)('should display the physical key that is pressed rather than special characters', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.enableExperiment)('keyboardShortcutEditor');
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.editShortcutListItem)('Show Console');
        await frontend.keyboard.down('Control');
        await frontend.keyboard.down('Alt');
        await frontend.keyboard.press('c');
        await frontend.keyboard.up('Alt');
        await frontend.keyboard.up('Control');
        const shortcutInputsText = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputsText, settings_shortcuts_helpers_js_1.CONTROL_ALT_C_SHORTCUT_INPUT_TEXT);
    });
    // Flaky test
    mocha_extensions_js_1.it.skip('[crbug.com/1149346]: should allow users to set a new shortcut after the chord timeout', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.enableExperiment)('keyboardShortcutEditor');
        await (0, settings_helpers_js_1.openSettingsTab)('Shortcuts');
        await (0, settings_shortcuts_helpers_js_1.editShortcutListItem)('Show Console');
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('1');
        await frontend.keyboard.up('Control');
        await (0, helper_js_1.timeout)(settings_shortcuts_helpers_js_1.SHORTCUT_CHORD_TIMEOUT);
        await frontend.keyboard.down('Control');
        await frontend.keyboard.press('2');
        await frontend.keyboard.up('Control');
        const shortcutInputsText = await (0, settings_shortcuts_helpers_js_1.shortcutInputValues)();
        chai_1.assert.deepStrictEqual(shortcutInputsText, settings_shortcuts_helpers_js_1.CONTROL_2_SHORTCUT_INPUT_TEXT);
        await (0, settings_shortcuts_helpers_js_1.clickShortcutConfirmButton)();
        await (0, helper_js_1.waitForNoElementsWithTextContent)(settings_shortcuts_helpers_js_1.ADD_SHORTCUT_LINK_TEXT);
        const shortcuts = await (0, settings_shortcuts_helpers_js_1.shortcutsForAction)('Show Console');
        chai_1.assert.deepStrictEqual(shortcuts, settings_shortcuts_helpers_js_1.CONTROL_2_SHORTCUT_DISPLAY_TEXT);
    });
});
//# sourceMappingURL=shortcut_settings_test.js.map