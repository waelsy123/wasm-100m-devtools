"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForVSCodeShortcutPreset = exports.waitForEmptyShortcutInput = exports.clickShortcutDeleteButton = exports.clickShortcutResetButton = exports.clickShortcutCancelButton = exports.clickShortcutConfirmButton = exports.clickAddShortcutLink = exports.shortcutInputValues = exports.shortcutsForAction = exports.editShortcutListItem = exports.getShortcutListItemElement = exports.selectKeyboardShortcutPreset = exports.CONTROL_ALT_C_SHORTCUT_INPUT_TEXT = exports.CONSOLE_SHORTCUT_DISPLAY_TEXT = exports.CONSOLE_SHORTCUT_INPUT_TEXT = exports.CONTROL_2_SHORTCUT_DISPLAY_TEXT = exports.CONTROL_1_CONTROL_2_CHORD_DISPLAY_TEXT = exports.CONTROL_1_CONTROL_2_SHORTCUT_DISPLAY_TEXT = exports.CONTROL_2_SHORTCUT_INPUT_TEXT = exports.CONTROL_1_CONTROL_2_CHORD_INPUT_TEXT = exports.CONTROL_1_CONTROL_2_SHORTCUT_INPUTS_TEXT = exports.VS_CODE_PAUSE_SHORTCUTS = exports.VS_CODE_SHORTCUTS_QUICK_OPEN_TEXT = exports.VS_CODE_SETTINGS_SHORTCUTS = exports.VS_CODE_SHORTCUTS_SHORTCUTS = exports.SHORTCUT_CHORD_TIMEOUT = exports.ADD_SHORTCUT_LINK_TEXT = void 0;
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const CANCEL_BUTTON_SELECTOR = '[aria-label="Discard changes"]';
const CONFIRM_BUTTON_SELECTOR = '[aria-label="Confirm changes"]';
const DELETE_BUTTON_SELECTOR = '[aria-label="Remove shortcut"]';
const EDIT_BUTTON_SELECTOR = '[aria-label="Edit shortcut"]';
const RESET_BUTTON_SELECTOR = '[aria-label="Reset shortcuts for action"]';
const SHORTCUT_DISPLAY_SELECTOR = '.keybinds-shortcut';
const SHORTCUT_INPUT_SELECTOR = '.keybinds-editing input';
const SHORTCUT_SELECT_TEXT = 'DevTools (Default)Visual Studio Code';
exports.ADD_SHORTCUT_LINK_TEXT = 'Add a shortcut';
exports.SHORTCUT_CHORD_TIMEOUT = 1000;
exports.VS_CODE_SHORTCUTS_SHORTCUTS = ['CtrlKCtrlS'];
exports.VS_CODE_SETTINGS_SHORTCUTS = ['Shift?', 'Ctrl,'];
exports.VS_CODE_SHORTCUTS_QUICK_OPEN_TEXT = 'ShortcutsCtrl + K Ctrl + SSettings';
exports.VS_CODE_PAUSE_SHORTCUTS = ['Ctrl\\', 'F5', 'ShiftF5'];
exports.CONTROL_1_CONTROL_2_SHORTCUT_INPUTS_TEXT = ['Ctrl + 1', 'Ctrl + 2'];
exports.CONTROL_1_CONTROL_2_CHORD_INPUT_TEXT = ['Ctrl + 1 Ctrl + 2'];
exports.CONTROL_2_SHORTCUT_INPUT_TEXT = ['Ctrl + 2'];
exports.CONTROL_1_CONTROL_2_SHORTCUT_DISPLAY_TEXT = ['Ctrl1', 'Ctrl2'];
exports.CONTROL_1_CONTROL_2_CHORD_DISPLAY_TEXT = ['Ctrl1Ctrl2'];
exports.CONTROL_2_SHORTCUT_DISPLAY_TEXT = ['Ctrl2'];
exports.CONSOLE_SHORTCUT_INPUT_TEXT = ['Ctrl + `'];
exports.CONSOLE_SHORTCUT_DISPLAY_TEXT = ['Ctrl`'];
exports.CONTROL_ALT_C_SHORTCUT_INPUT_TEXT = ['Ctrl + Alt + C'];
if (helper_js_1.platform === 'mac') {
    exports.VS_CODE_SHORTCUTS_SHORTCUTS = ['⌘ K⌘ S'];
    exports.VS_CODE_SETTINGS_SHORTCUTS = ['⇧ ?', '⌘ ,'];
    exports.VS_CODE_SHORTCUTS_QUICK_OPEN_TEXT = 'Shortcuts⌘ K ⌘ SSettings';
    exports.VS_CODE_PAUSE_SHORTCUTS = ['F5', '⇧ F5', '⌘ \\'];
    exports.CONTROL_1_CONTROL_2_SHORTCUT_INPUTS_TEXT = ['Ctrl 1', 'Ctrl 2'];
    exports.CONTROL_1_CONTROL_2_CHORD_INPUT_TEXT = ['Ctrl 1 Ctrl 2'];
    exports.CONTROL_2_SHORTCUT_INPUT_TEXT = ['Ctrl 2'];
    exports.CONTROL_1_CONTROL_2_SHORTCUT_DISPLAY_TEXT = exports.CONTROL_1_CONTROL_2_SHORTCUT_INPUTS_TEXT;
    exports.CONTROL_1_CONTROL_2_CHORD_DISPLAY_TEXT = ['Ctrl 1Ctrl 2'];
    exports.CONTROL_2_SHORTCUT_DISPLAY_TEXT = exports.CONTROL_2_SHORTCUT_INPUT_TEXT;
    exports.CONSOLE_SHORTCUT_INPUT_TEXT = ['Ctrl `'];
    exports.CONSOLE_SHORTCUT_DISPLAY_TEXT = exports.CONSOLE_SHORTCUT_INPUT_TEXT;
    exports.CONTROL_ALT_C_SHORTCUT_INPUT_TEXT = ['Ctrl ⌥ C'];
}
const selectKeyboardShortcutPreset = async (option) => {
    const presetSelectElement = await (0, helper_js_1.waitForElementWithTextContent)(SHORTCUT_SELECT_TEXT);
    await (0, helper_js_1.selectOption)(presetSelectElement, option);
};
exports.selectKeyboardShortcutPreset = selectKeyboardShortcutPreset;
const getShortcutListItemElement = async (shortcutText) => {
    const textMatches = await (0, helper_js_1.$$textContent)(shortcutText);
    let titleElement;
    for (const matchingElement of textMatches) {
        // some actions have the same name as categories, so we have to make sure we've got the right one
        if (await matchingElement.evaluate(element => element.matches('.keybinds-action-name'))) {
            titleElement = matchingElement;
            break;
        }
    }
    if (!titleElement) {
        chai_1.assert.fail('shortcut element not found');
    }
    const listItemElement = await titleElement.getProperty('parentElement');
    return listItemElement.asElement();
};
exports.getShortcutListItemElement = getShortcutListItemElement;
const editShortcutListItem = async (shortcutText) => {
    const listItemElement = await (0, exports.getShortcutListItemElement)(shortcutText);
    await (0, helper_js_1.click)(listItemElement);
    await (0, helper_js_1.waitFor)(EDIT_BUTTON_SELECTOR, listItemElement);
    await (0, helper_js_1.click)(EDIT_BUTTON_SELECTOR, { root: listItemElement });
    await (0, helper_js_1.waitFor)(RESET_BUTTON_SELECTOR);
};
exports.editShortcutListItem = editShortcutListItem;
const shortcutsForAction = async (shortcutText) => {
    const listItemElement = await (0, exports.getShortcutListItemElement)(shortcutText);
    if (!listItemElement) {
        chai_1.assert.fail(`Could not find shortcut item with text ${shortcutText}`);
    }
    const shortcutElements = await listItemElement.$$(SHORTCUT_DISPLAY_SELECTOR);
    const shortcutElementsTextContent = await Promise.all(shortcutElements.map(element => element.getProperty('textContent')));
    return Promise.all(shortcutElementsTextContent.map(async (textContent) => textContent ? await textContent.jsonValue() : []));
};
exports.shortcutsForAction = shortcutsForAction;
const shortcutInputValues = async () => {
    const shortcutInputs = await (0, helper_js_1.$$)(SHORTCUT_INPUT_SELECTOR);
    if (!shortcutInputs.length) {
        chai_1.assert.fail('shortcut input not found');
    }
    const shortcutValues = await Promise.all(shortcutInputs.map(async (input) => input.getProperty('value')));
    return Promise.all(shortcutValues.map(async (value) => value ? await value.jsonValue() : []));
};
exports.shortcutInputValues = shortcutInputValues;
const clickAddShortcutLink = async () => {
    const addShortcutLinkTextMatches = await (0, helper_js_1.waitForElementsWithTextContent)(exports.ADD_SHORTCUT_LINK_TEXT);
    let addShortcutLinkElement;
    // the link container and the link have the same textContent, but only the latter has a click handler
    for (const matchingElement of addShortcutLinkTextMatches) {
        if (await matchingElement.evaluate(element => element.matches('[role="link"]'))) {
            addShortcutLinkElement = matchingElement;
            break;
        }
    }
    if (!addShortcutLinkElement) {
        chai_1.assert.fail('could not find add shortcut link');
    }
    await (0, helper_js_1.click)(addShortcutLinkElement);
};
exports.clickAddShortcutLink = clickAddShortcutLink;
const clickShortcutConfirmButton = async () => {
    await (0, helper_js_1.click)(CONFIRM_BUTTON_SELECTOR);
};
exports.clickShortcutConfirmButton = clickShortcutConfirmButton;
const clickShortcutCancelButton = async () => {
    await (0, helper_js_1.click)(CANCEL_BUTTON_SELECTOR);
};
exports.clickShortcutCancelButton = clickShortcutCancelButton;
const clickShortcutResetButton = async () => {
    await (0, helper_js_1.click)(RESET_BUTTON_SELECTOR);
};
exports.clickShortcutResetButton = clickShortcutResetButton;
const clickShortcutDeleteButton = async (index) => {
    const deleteButtons = await (0, helper_js_1.$$)(DELETE_BUTTON_SELECTOR);
    if (deleteButtons.length <= index) {
        chai_1.assert.fail(`shortcut delete button #${index} not found`);
    }
    await (0, helper_js_1.click)(deleteButtons[index]);
};
exports.clickShortcutDeleteButton = clickShortcutDeleteButton;
const waitForEmptyShortcutInput = async () => {
    await (0, helper_js_1.waitForFunction)(async () => {
        const shortcutInputs = await (0, helper_js_1.$$)(SHORTCUT_INPUT_SELECTOR);
        const shortcutInputValues = await Promise.all(shortcutInputs.map(input => input.getProperty('value')));
        const shortcutInputValueStrings = await Promise.all(shortcutInputValues.map(value => value ? value.jsonValue() : {}));
        return shortcutInputValueStrings.includes('');
    });
};
exports.waitForEmptyShortcutInput = waitForEmptyShortcutInput;
const waitForVSCodeShortcutPreset = async () => {
    // wait for a shortcut that vsCode has but the default preset does not
    await (0, helper_js_1.waitForElementWithTextContent)(exports.VS_CODE_SHORTCUTS_SHORTCUTS.join(''));
};
exports.waitForVSCodeShortcutPreset = waitForVSCodeShortcutPreset;
//# sourceMappingURL=settings-shortcuts-helpers.js.map