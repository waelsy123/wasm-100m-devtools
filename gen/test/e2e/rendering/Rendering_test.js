"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('Rendering pane', () => {
    (0, mocha_extensions_js_1.it)('includes UI for simulating vision deficiencies', async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Rendering');
        const option = await (0, helper_js_1.waitFor)('option[value="achromatopsia"]');
        const actual = await option.evaluate(node => {
            const select = node.closest('select');
            return select ? select.textContent : '';
        });
        const expected = [
            'No emulation',
            'Blurred vision',
            'Protanopia',
            'Deuteranopia',
            'Tritanopia',
            'Achromatopsia',
        ].join('');
        chai_1.assert.deepEqual(actual, expected);
    });
    (0, mocha_extensions_js_1.it)('includes UI for emulating color-gamut media feature', async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Rendering');
        const option = await (0, helper_js_1.waitFor)('option[value="rec2020"]');
        const actual = await option.evaluate(node => {
            const select = node.closest('select');
            return select ? select.textContent : '';
        });
        const expected = [
            'No emulation',
            'color-gamut: srgb',
            'color-gamut: p3',
            'color-gamut: rec2020',
        ].join('');
        chai_1.assert.deepEqual(actual, expected);
    });
    (0, mocha_extensions_js_1.it)('includes UI for emulating prefers-contrast media feature', async function () {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Rendering');
        // TODO(sartang@microsoft.com): Remove this condition once feature is fully enabled
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        const hasSupport = await frontend.evaluate(() => {
            return window.matchMedia('(prefers-contrast)').media === '(prefers-contrast)';
        });
        if (!hasSupport) {
            // @ts-ignore
            this.skip();
        }
        const option = await (0, helper_js_1.waitFor)('option[value="custom"]');
        const actual = await option.evaluate(node => {
            const select = node.closest('select');
            return select ? select.textContent : '';
        });
        const expected = [
            'No emulation',
            'prefers-contrast: more',
            'prefers-contrast: less',
            'prefers-contrast: custom',
        ].join('');
        chai_1.assert.deepEqual(actual, expected);
    });
    (0, mocha_extensions_js_1.it)('includes UI for emulating auto dark mode', async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Rendering');
        await (0, helper_js_1.waitForAria)('Enable automatic dark mode[role="checkbox"]');
    });
});
//# sourceMappingURL=Rendering_test.js.map