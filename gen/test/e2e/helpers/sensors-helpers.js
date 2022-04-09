"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrientationValues = exports.getOrientationInputs = exports.getInputFieldValue = exports.setCustomOrientation = void 0;
const helper_js_1 = require("../../shared/helper.js");
async function setCustomOrientation() {
    const dropDown = await (0, helper_js_1.waitFor)('.orientation-fields select');
    void (0, helper_js_1.selectOption)(dropDown, 'custom');
}
exports.setCustomOrientation = setCustomOrientation;
async function getInputFieldValue(field) {
    return field.evaluate(input => input.value);
}
exports.getInputFieldValue = getInputFieldValue;
async function getOrientationInputs() {
    return (0, helper_js_1.waitForMany)('.orientation-axis-input-container input', 3);
}
exports.getOrientationInputs = getOrientationInputs;
async function getOrientationValues() {
    return Promise.all((await getOrientationInputs()).map(i => i.evaluate(i => parseInt(i.value, 10))));
}
exports.getOrientationValues = getOrientationValues;
//# sourceMappingURL=sensors-helpers.js.map