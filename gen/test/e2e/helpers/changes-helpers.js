"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForNewChanges = exports.getChangesList = exports.openChangesPanelAndNavigateTo = void 0;
const helper_js_1 = require("../../shared/helper.js");
const quick_open_helpers_js_1 = require("../helpers/quick_open-helpers.js");
const PANEL_ROOT_SELECTOR = 'div[aria-label="Changes panel"]';
async function openChangesPanelAndNavigateTo(testName) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.goToResource)(`changes/${testName}.html`);
    await (0, quick_open_helpers_js_1.openCommandMenu)();
    await frontend.keyboard.type('changes');
    await frontend.keyboard.press('Enter');
    await (0, helper_js_1.waitFor)(PANEL_ROOT_SELECTOR);
}
exports.openChangesPanelAndNavigateTo = openChangesPanelAndNavigateTo;
async function getChangesList() {
    const root = await (0, helper_js_1.waitFor)(PANEL_ROOT_SELECTOR);
    const items = await (0, helper_js_1.$$)('.tree-element-title', root);
    return Promise.all(items.map(node => {
        return node.evaluate(node => node.textContent);
    }));
}
exports.getChangesList = getChangesList;
async function waitForNewChanges(initialChanges) {
    let newChanges = [];
    return (0, helper_js_1.waitForFunction)(async () => {
        newChanges = await getChangesList();
        return newChanges.length !== initialChanges.length;
    });
}
exports.waitForNewChanges = waitForNewChanges;
//# sourceMappingURL=changes-helpers.js.map