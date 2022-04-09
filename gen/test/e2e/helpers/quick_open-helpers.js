"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectedItemText = exports.closeDrawer = exports.getMenuItemTitleAtPosition = exports.getMenuItemAtPosition = exports.getAvailableSnippets = exports.showSnippetsAutocompletion = exports.openFileQuickOpen = exports.openCommandMenu = exports.QUICK_OPEN_SELECTOR = void 0;
const helper_js_1 = require("../../shared/helper.js");
exports.QUICK_OPEN_SELECTOR = '[aria-label="Quick open"]';
const QUICK_OPEN_ITEMS_SELECTOR = '.filtered-list-widget-item-wrapper';
const QUICK_OPEN_ITEM_TITLE_SELECTOR = '.filtered-list-widget-title';
const QUICK_OPEN_SELECTED_ITEM_SELECTOR = `${QUICK_OPEN_ITEMS_SELECTOR}.selected`;
const openCommandMenu = async () => {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    switch (helper_js_1.platform) {
        case 'mac':
            await frontend.keyboard.down('Meta');
            await frontend.keyboard.down('Shift');
            break;
        case 'linux':
        case 'win32':
            await frontend.keyboard.down('Control');
            await frontend.keyboard.down('Shift');
            break;
    }
    await frontend.keyboard.press('P');
    switch (helper_js_1.platform) {
        case 'mac':
            await frontend.keyboard.up('Meta');
            await frontend.keyboard.up('Shift');
            break;
        case 'linux':
        case 'win32':
            await frontend.keyboard.up('Control');
            await frontend.keyboard.up('Shift');
            break;
    }
    await (0, helper_js_1.waitFor)(exports.QUICK_OPEN_SELECTOR);
};
exports.openCommandMenu = openCommandMenu;
const openFileQuickOpen = async () => {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const modifierKey = helper_js_1.platform === 'mac' ? 'Meta' : 'Control';
    await frontend.keyboard.down(modifierKey);
    await frontend.keyboard.press('P');
    await frontend.keyboard.up(modifierKey);
    await (0, helper_js_1.waitFor)(exports.QUICK_OPEN_SELECTOR);
};
exports.openFileQuickOpen = openFileQuickOpen;
const showSnippetsAutocompletion = async () => {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    // Clear the `>` character, as snippets use a `!` instead
    await frontend.keyboard.press('Backspace');
    await (0, helper_js_1.typeText)('!');
};
exports.showSnippetsAutocompletion = showSnippetsAutocompletion;
async function getAvailableSnippets() {
    const quickOpenElement = await (0, helper_js_1.waitFor)(exports.QUICK_OPEN_SELECTOR);
    const snippetsDOMElements = await (0, helper_js_1.$$)(QUICK_OPEN_ITEMS_SELECTOR, quickOpenElement);
    const snippets = await Promise.all(snippetsDOMElements.map(elem => elem.evaluate(elem => elem.textContent)));
    return snippets;
}
exports.getAvailableSnippets = getAvailableSnippets;
async function getMenuItemAtPosition(position) {
    const quickOpenElement = await (0, helper_js_1.waitFor)(exports.QUICK_OPEN_SELECTOR);
    await (0, helper_js_1.waitFor)(QUICK_OPEN_ITEM_TITLE_SELECTOR);
    const itemsHandles = await (0, helper_js_1.$$)(QUICK_OPEN_ITEMS_SELECTOR, quickOpenElement);
    const item = itemsHandles[position];
    if (!item) {
        assert.fail(`Quick open: could not find item at position: ${position}.`);
    }
    return item;
}
exports.getMenuItemAtPosition = getMenuItemAtPosition;
async function getMenuItemTitleAtPosition(position) {
    const quickOpenElement = await (0, helper_js_1.waitFor)(exports.QUICK_OPEN_SELECTOR);
    await (0, helper_js_1.waitFor)(QUICK_OPEN_ITEM_TITLE_SELECTOR);
    const itemsHandles = await (0, helper_js_1.$$)(QUICK_OPEN_ITEM_TITLE_SELECTOR, quickOpenElement);
    const item = itemsHandles[position];
    if (!item) {
        assert.fail(`Quick open: could not find item at position: ${position}.`);
    }
    const title = await item.evaluate(elem => elem.textContent);
    return title;
}
exports.getMenuItemTitleAtPosition = getMenuItemTitleAtPosition;
const closeDrawer = async () => {
    const closeButtonSelector = '[aria-label="Close drawer"]';
    await (0, helper_js_1.waitFor)(closeButtonSelector);
    await (0, helper_js_1.click)(closeButtonSelector);
};
exports.closeDrawer = closeDrawer;
const getSelectedItemText = async () => {
    const quickOpenElement = await (0, helper_js_1.waitFor)(exports.QUICK_OPEN_SELECTOR);
    const selectedRow = await (0, helper_js_1.waitFor)(QUICK_OPEN_SELECTED_ITEM_SELECTOR, quickOpenElement);
    const textContent = await selectedRow.getProperty('textContent');
    if (!textContent) {
        assert.fail('Quick open: could not get selected item textContent');
    }
    return await textContent.jsonValue();
};
exports.getSelectedItemText = getSelectedItemText;
//# sourceMappingURL=quick_open-helpers.js.map