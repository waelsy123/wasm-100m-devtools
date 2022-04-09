"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sensors_helpers_js_1 = require("../helpers/sensors-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('Orientation emulation on Sensors panel', () => {
    beforeEach(async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Sensors');
    });
    (0, mocha_extensions_js_1.it)('presets correct default values on Custom orientation selected', async () => {
        await (0, sensors_helpers_js_1.setCustomOrientation)();
        const actualOrientations = await (0, sensors_helpers_js_1.getOrientationValues)();
        const expectedOrientations = [0, 90, 0];
        chai_1.assert.deepEqual(actualOrientations, expectedOrientations);
    });
    (0, mocha_extensions_js_1.it)('allows negative alpha values', async () => {
        await (0, sensors_helpers_js_1.setCustomOrientation)();
        const alpha = (await (0, sensors_helpers_js_1.getOrientationInputs)())[0];
        await alpha.type('-1');
        const actualValue = (await (0, sensors_helpers_js_1.getOrientationValues)())[0];
        const expectedValue = -1;
        chai_1.assert.deepEqual(actualValue, expectedValue);
        await (0, helper_js_1.tabForward)();
        await (0, helper_js_1.waitForNone)('.error-input');
    });
});
//# sourceMappingURL=orientation_test.js.map