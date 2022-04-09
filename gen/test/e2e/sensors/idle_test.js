"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('Idle Emulation on Sensors panel', () => {
    beforeEach(async () => {
        await (0, helper_js_1.step)('opening sensors panel', async () => {
            await (0, settings_helpers_js_1.openPanelViaMoreTools)('Sensors');
        });
    });
    before(async () => {
        await (0, helper_js_1.step)('overriding permissions with \'idle-detection\'', async () => {
            // IdleDetector switched permission from 'notifications' to
            // 'idle-detection', but 'idle-detection' is not in the @types/puppeteer
            // package, so `as 'notifications'` needed for TypeScript.
            await (0, helper_js_1.overridePermissions)(['idle-detection']);
        });
    });
    after(async () => {
        await (0, helper_js_1.step)('clearing permissions override', async () => {
            await (0, helper_js_1.clearPermissionsOverride)();
        });
    });
    async function getState() {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        return await target.evaluate(() => {
            const state = document.getElementById('state');
            return state ? state.innerText : '';
        });
    }
    async function waitForState(state) {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.step)(`Waiting for state \'${state}\'`, async () => {
            await target.waitForFunction((_state) => {
                const stateEl = document.getElementById('state');
                return _state === (stateEl ? stateEl.innerText : '');
            }, {}, state);
        });
    }
    (0, mocha_extensions_js_1.it)('includes UI for emulating an idle state', async () => {
        const select = await (0, helper_js_1.waitFor)('.idle-section select');
        const actual = await select.evaluate(node => node.textContent);
        const expected = [
            'No idle emulation',
            'User active, screen unlocked',
            'User active, screen locked',
            'User idle, screen unlocked',
            'User idle, screen locked',
        ].join('');
        chai_1.assert.deepEqual(actual, expected);
    });
    (0, mocha_extensions_js_1.it)('changing idle state emulation causes change of the IdleDetector state', async () => {
        await (0, helper_js_1.step)('opening idle-detector.html', async () => {
            await (0, helper_js_1.goToResource)('sensors/idle-detector.html');
        });
        const select = await (0, helper_js_1.waitFor)('.idle-section select');
        // InitialState can be idle as well.
        const initialState = await getState();
        // Emulate Idle states and verify IdleDetector updates state accordingly.
        await (0, helper_js_1.selectOption)(select, '{"isUserActive":false,"isScreenUnlocked":false}');
        await waitForState('Idle state: idle, locked.');
        await (0, helper_js_1.selectOption)(select, '{"isUserActive":true,"isScreenUnlocked":false}');
        await waitForState('Idle state: active, locked.');
        await (0, helper_js_1.selectOption)(select, '{"isUserActive":true,"isScreenUnlocked":true}');
        await waitForState('Idle state: active, unlocked.');
        await (0, helper_js_1.selectOption)(select, '{"isUserActive":false,"isScreenUnlocked":true}');
        await waitForState('Idle state: idle, unlocked.');
        // Remove Idle emulation and verify IdleDetector is in initial state.
        await (0, helper_js_1.selectOption)(select, 'none');
        await waitForState(initialState);
    });
});
//# sourceMappingURL=idle_test.js.map