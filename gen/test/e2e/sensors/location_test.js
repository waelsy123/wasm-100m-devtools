"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('Location emulation on Sensors panel', () => {
    beforeEach(async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Sensors');
    });
    (0, mocha_extensions_js_1.it)('includes UI for emulating a location', async () => {
        const select = await (0, helper_js_1.waitFor)('.geo-fields select');
        const actual = await select.evaluate(node => node.textContent);
        const expected = [
            'No override',
            'Berlin',
            'London',
            'Moscow',
            'Mountain View',
            'Mumbai',
            'San Francisco',
            'Shanghai',
            'São Paulo',
            'Tokyo',
            'Other…',
            'Location unavailable',
        ].join('');
        chai_1.assert.deepEqual(actual, expected);
    });
});
//# sourceMappingURL=location_test.js.map