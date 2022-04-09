"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const chai_1 = require("chai");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const emulation_helpers_js_1 = require("../helpers/emulation-helpers.js");
const emulation_helpers_js_2 = require("../helpers/emulation-helpers.js");
const DUO_VERTICAL_SPANNED_WIDTH = '1114';
const DUO_VERTICAL_WIDTH = '540';
(0, mocha_extensions_js_1.describe)('Dual screen mode', async () => {
    beforeEach(async function () {
        await (0, emulation_helpers_js_1.startEmulationWithDualScreenFlag)();
    });
    (0, mocha_extensions_js_1.it)('User can toggle between single and dual screenmodes for a dual screen device', async () => {
        await (0, emulation_helpers_js_1.selectDualScreen)();
        await (0, emulation_helpers_js_1.clickToggleButton)();
        const widthDual = await (0, emulation_helpers_js_1.getWidthOfDevice)();
        (0, chai_1.assert)(widthDual === DUO_VERTICAL_SPANNED_WIDTH);
        await (0, emulation_helpers_js_1.clickToggleButton)();
        const widthSingle = await (0, emulation_helpers_js_1.getWidthOfDevice)();
        (0, chai_1.assert)(widthSingle === DUO_VERTICAL_WIDTH);
    });
    (0, mocha_extensions_js_1.it)('User may not click toggle dual screen button for a non-dual screen device', async () => {
        await (0, emulation_helpers_js_1.selectNonDualScreenDevice)();
        // toggle button should not be found
        const toggleButton = await (0, emulation_helpers_js_2.selectToggleButton)();
        const element = toggleButton.asElement();
        const hidden = element ? element.evaluate(x => x.classList.contains('hidden')) : false;
        (0, chai_1.assert)(hidden);
    });
});
//# sourceMappingURL=dual-screen_test.js.map