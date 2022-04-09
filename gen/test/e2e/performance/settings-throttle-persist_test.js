"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const performance_helpers_js_1 = require("../helpers/performance-helpers.js");
(0, mocha_extensions_js_1.describe)('The Performance panel', async function () {
    // These tests reload panels repeatedly, which can take a longer time.
    this.timeout(20_000);
    beforeEach(async () => {
        await (0, performance_helpers_js_1.navigateToPerformanceTab)('empty');
        await openCaptureSettings('.timeline-settings-pane');
    });
    async function assertOption(select, expected) {
        chai_1.assert.strictEqual(await select.evaluate(el => el.selectedOptions.length), 1);
        chai_1.assert.strictEqual(await select.evaluate(el => el.selectedOptions[0].getAttribute('aria-label')), expected);
    }
    async function openCaptureSettings(sectionClassName) {
        const captureSettingsButton = await (0, helper_js_1.waitForAria)('Capture settings');
        await captureSettingsButton.click();
        return await (0, helper_js_1.waitFor)(sectionClassName);
    }
    (0, mocha_extensions_js_1.it)('can persist throttling conditions', async () => {
        // Start with no throttling, select an option "A".
        {
            const select = await (0, helper_js_1.waitFor)('select', await (0, helper_js_1.waitForAria)('Network conditions'));
            await assertOption(select, 'Disabled: No throttling');
            await select.select('Fast 3G');
            await assertOption(select, 'Presets: Fast 3G');
        }
        // Verify persistence for "A", select another option "B".
        await (0, helper_js_1.reloadDevTools)({ queryParams: { panel: 'timeline' } });
        {
            const select = await (0, helper_js_1.waitFor)('select', await (0, helper_js_1.waitForAria)('Network conditions'));
            await assertOption(select, 'Presets: Fast 3G');
            await select.select('Slow 3G');
            await assertOption(select, 'Presets: Slow 3G');
        }
        // Verify persistence for "B", disable throttling.
        await (0, helper_js_1.reloadDevTools)({ queryParams: { panel: 'timeline' } });
        {
            const select = await (0, helper_js_1.waitFor)('select', await (0, helper_js_1.waitForAria)('Network conditions'));
            await assertOption(select, 'Presets: Slow 3G');
            await select.select('No throttling');
            await assertOption(select, 'Disabled: No throttling');
        }
        // Verify persistence of disabled throttling.
        await (0, helper_js_1.reloadDevTools)({ queryParams: { panel: 'timeline' } });
        {
            const select = await (0, helper_js_1.waitFor)('select', await (0, helper_js_1.waitForAria)('Network conditions'));
            await assertOption(select, 'Disabled: No throttling');
        }
    });
});
//# sourceMappingURL=settings-throttle-persist_test.js.map