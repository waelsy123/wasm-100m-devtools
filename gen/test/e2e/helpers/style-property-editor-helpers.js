"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickPropertyButton = exports.clickStylePropertyEditorButton = void 0;
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
async function clickStylePropertyEditorButton(title, editorElement) {
    const gridEditorButtons = await (0, helper_js_1.$$)(`[title="${title}"]`);
    chai_1.assert.deepEqual(gridEditorButtons.length, 1);
    const gridEditorButton = gridEditorButtons[0];
    gridEditorButton.click();
    await (0, helper_js_1.waitFor)(editorElement);
}
exports.clickStylePropertyEditorButton = clickStylePropertyEditorButton;
async function clickPropertyButton(selector) {
    await (0, helper_js_1.waitFor)(selector);
    const buttons = await (0, helper_js_1.$$)(selector);
    chai_1.assert.strictEqual(buttons.length, 1);
    const button = buttons[0];
    button.click();
}
exports.clickPropertyButton = clickPropertyButton;
//# sourceMappingURL=style-property-editor-helpers.js.map