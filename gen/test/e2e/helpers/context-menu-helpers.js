"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertSubMenuItemsText = exports.findSubMenuEntryItem = exports.assertTopLevelContextMenuItemsText = exports.platformSpecificTextForSubMenuEntryItem = void 0;
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
function platformSpecificTextForSubMenuEntryItem(text) {
    /**
     * On Mac the context menu adds the ▶ icon to the sub menu entry points in the
     * context menu, but on Linux/Windows it uses an image. So if we're running on
     * Mac, we append the search text with the icon, else we do not.
     */
    return helper_js_1.platform === 'mac' ? `${text}▶` : text;
}
exports.platformSpecificTextForSubMenuEntryItem = platformSpecificTextForSubMenuEntryItem;
async function assertTopLevelContextMenuItemsText(expectedOptions) {
    const contextMenu = await (0, helper_js_1.$)('.soft-context-menu');
    if (!contextMenu) {
        chai_1.assert.fail('Could not find context menu.');
    }
    const allItems = await (0, helper_js_1.$$)('.soft-context-menu > .soft-context-menu-item');
    const allItemsText = await Promise.all(allItems.map(item => item.evaluate(div => div.textContent)));
    chai_1.assert.deepEqual(allItemsText, expectedOptions);
}
exports.assertTopLevelContextMenuItemsText = assertTopLevelContextMenuItemsText;
async function findSubMenuEntryItem(text) {
    const textToSearchFor = platformSpecificTextForSubMenuEntryItem(text);
    const matchingElement = await (0, helper_js_1.$textContent)(textToSearchFor);
    if (!matchingElement) {
        const allItems = await (0, helper_js_1.$$)('.soft-context-menu > .soft-context-menu-item');
        const allItemsText = await Promise.all(allItems.map(item => item.evaluate(div => div.textContent)));
        chai_1.assert.fail(`Could not find "${text}" option on context menu. Found items: ${allItemsText.join(' | ')}`);
    }
    return matchingElement;
}
exports.findSubMenuEntryItem = findSubMenuEntryItem;
async function assertSubMenuItemsText(subMenuText, expectedOptions) {
    const subMenuEntryItem = await findSubMenuEntryItem(subMenuText);
    if (!subMenuEntryItem) {
        const allItems = await (0, helper_js_1.$$)('.soft-context-menu > .soft-context-menu-item');
        const allItemsText = await Promise.all(allItems.map(item => item.evaluate(div => div.textContent)));
        chai_1.assert.fail(`Could not find "${subMenuText}" option on context menu. Found items: ${allItemsText.join(' | ')}`);
    }
    await subMenuEntryItem.hover();
    await (0, helper_js_1.waitForFunction)(async () => {
        const menus = await (0, helper_js_1.$$)('.soft-context-menu');
        // Wait for the main menu + the sub menu to be in the DOM
        return menus.length === 2;
    });
    const allMenus = await (0, helper_js_1.$$)('.soft-context-menu');
    // Each submenu is rendered as a separate context menu and is appended to
    // the DOM after the main context menu, hence the array index.
    const subMenuElement = allMenus[1];
    if (!subMenuElement) {
        chai_1.assert.fail(`Could not find sub menu for ${subMenuText}`);
    }
    const subMenuItems = await (0, helper_js_1.$$)('.soft-context-menu-item', subMenuElement);
    const subMenuItemsText = await Promise.all(subMenuItems.map(item => item.evaluate(div => div.textContent)));
    chai_1.assert.deepEqual(subMenuItemsText, expectedOptions);
}
exports.assertSubMenuItemsText = assertSubMenuItemsText;
//# sourceMappingURL=context-menu-helpers.js.map