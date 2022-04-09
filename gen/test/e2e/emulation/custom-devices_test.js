"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const emulation_helpers_js_1 = require("../helpers/emulation-helpers.js");
const ADD_DEVICE_BUTTON_SELECTOR = '#custom-device-add-button';
const FOCUSED_DEVICE_NAME_FIELD_SELECTOR = '#custom-device-name-field:focus';
const EDITOR_ADD_BUTTON_SELECTOR = '.editor-buttons > button:first-child';
const FOCUSED_SELECTOR = '*:focus';
async function elementTextContent(element) {
    return await element.evaluate(node => node.textContent || '');
}
async function targetTextContent(selector) {
    const { target } = (0, helper_js_1.getBrowserAndPages)();
    const handle = await target.waitForSelector(selector);
    if (!handle) {
        chai_1.assert.fail(`targetTextContent: could not find element for ${selector}`);
    }
    return elementTextContent(handle);
}
(0, mocha_extensions_js_1.describe)('Custom devices', async () => {
    beforeEach(async function () {
        await (0, emulation_helpers_js_1.reloadDockableFrontEnd)();
        await (0, helper_js_1.goToResource)('emulation/custom-ua-ch.html');
        await (0, helper_js_1.waitFor)('.tabbed-pane-left-toolbar');
        await (0, emulation_helpers_js_1.openDeviceToolbar)();
    });
    (0, mocha_extensions_js_1.it)('can add and then edit a custom device with UA-CH emulation', async () => {
        await (0, emulation_helpers_js_1.selectEdit)();
        const add = await (0, helper_js_1.waitFor)(ADD_DEVICE_BUTTON_SELECTOR);
        await (0, helper_js_1.click)(add);
        await (0, helper_js_1.waitFor)(FOCUSED_DEVICE_NAME_FIELD_SELECTOR);
        await (0, helper_js_1.typeText)('Test device');
        await (0, helper_js_1.tabForward)(); // Focus width.
        await (0, helper_js_1.tabForward)(); // Focus height.
        await (0, helper_js_1.tabForward)(); // Focus DPR.
        await (0, helper_js_1.typeText)('1.0');
        await (0, helper_js_1.tabForward)(); // Focus UA string.
        await (0, helper_js_1.typeText)('Test device browser 1.0');
        await (0, helper_js_1.tabForward)(); // Focus device type.
        await (0, helper_js_1.tabForward)(); // Focus folder.
        await (0, helper_js_1.pressKey)('Enter');
        await (0, helper_js_1.tabForward)(); // Focus help button
        await (0, helper_js_1.tabForward)(); // Focus brand browser.
        await (0, helper_js_1.typeText)('Test browser');
        await (0, helper_js_1.tabForward)(); // Focus brand version.
        await (0, helper_js_1.typeText)('1.0');
        await (0, helper_js_1.tabForward)(); // Focus delete button.
        await (0, helper_js_1.tabForward)(); // Focus Add brand button.
        await (0, helper_js_1.pressKey)('Space');
        await (0, helper_js_1.typeText)('Friendly Dragon');
        await (0, helper_js_1.tabForward)(); //  Focus second row brand version.
        await (0, helper_js_1.typeText)('1.1');
        await (0, helper_js_1.tabForward)(); // Focus second row delete button.
        await (0, helper_js_1.tabForward)(); // Focus Add browser button.
        await (0, helper_js_1.tabForward)(); // Focus full version.
        await (0, helper_js_1.typeText)('1.1.2345');
        await (0, helper_js_1.tabForward)(); // Focus platform.
        await (0, helper_js_1.typeText)('Cyborg');
        await (0, helper_js_1.tabForward)(); // Focus platform version.
        await (0, helper_js_1.typeText)('C-1');
        await (0, helper_js_1.tabForward)(); // Focus architecture.
        await (0, helper_js_1.typeText)('Bipedal');
        await (0, helper_js_1.tabForward)(); // Focus device model.
        await (0, helper_js_1.typeText)('C-1-Gardener');
        await (0, helper_js_1.tabForward)(); // Focus add button.
        const finishAdd = await (0, helper_js_1.waitFor)(FOCUSED_SELECTOR);
        const finishAddText = await elementTextContent(finishAdd);
        chai_1.assert.strictEqual(finishAddText, 'Add');
        await (0, helper_js_1.click)(finishAdd);
        // Select the device in the menu.
        await (0, emulation_helpers_js_1.selectTestDevice)();
        // Reload the test page, and verify things working.
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.reload();
        void (0, elements_helpers_js_1.waitForDomNodeToBeVisible)('#res-dump-done');
        chai_1.assert.strictEqual(await targetTextContent('#res-ua'), 'Test device browser 1.0');
        chai_1.assert.strictEqual(await targetTextContent('#res-mobile'), 'true');
        chai_1.assert.strictEqual(await targetTextContent('#res-num-brands'), '2');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-0-name'), 'Test browser');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-0-version'), '1.0');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-1-name'), 'Friendly Dragon');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-1-version'), '1.1');
        chai_1.assert.strictEqual(await targetTextContent('#res-platform'), 'Cyborg');
        chai_1.assert.strictEqual(await targetTextContent('#res-platform-version'), 'C-1');
        chai_1.assert.strictEqual(await targetTextContent('#res-architecture'), 'Bipedal');
        chai_1.assert.strictEqual(await targetTextContent('#res-model'), 'C-1-Gardener');
        chai_1.assert.strictEqual(await targetTextContent('#res-ua-full-version'), '1.1.2345');
        // Focus the first item in the device list, which should be the custom entry,
        // and then click the edit button that should appear.
        const firstDevice = await (0, helper_js_1.waitFor)('.devices-list-item');
        await firstDevice.focus();
        const editButton = await (0, helper_js_1.waitFor)('.toolbar-button[aria-label="Edit"]');
        await editButton.click();
        // Make sure the device name field is what's focused.
        await (0, helper_js_1.waitFor)(FOCUSED_DEVICE_NAME_FIELD_SELECTOR);
        // Skip over to the version field.
        for (let i = 0; i < 15; ++i) {
            if (i === 7) {
                await (0, helper_js_1.pressKey)('ArrowRight');
            }
            await (0, helper_js_1.tabForward)();
        }
        // Change the value.
        await (0, helper_js_1.typeText)('1.1.5');
        // Save the changes.
        await (0, helper_js_1.pressKey)('Enter');
        // Reload the test page, and verify things working.
        await target.reload();
        void (0, elements_helpers_js_1.waitForDomNodeToBeVisible)('#res-dump-done');
        chai_1.assert.strictEqual(await targetTextContent('#res-ua'), 'Test device browser 1.0');
        chai_1.assert.strictEqual(await targetTextContent('#res-mobile'), 'true');
        chai_1.assert.strictEqual(await targetTextContent('#res-num-brands'), '2');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-0-name'), 'Test browser');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-0-version'), '1.0');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-1-name'), 'Friendly Dragon');
        chai_1.assert.strictEqual(await targetTextContent('#res-brand-1-version'), '1.1');
        chai_1.assert.strictEqual(await targetTextContent('#res-platform'), 'Cyborg');
        chai_1.assert.strictEqual(await targetTextContent('#res-platform-version'), 'C-1');
        chai_1.assert.strictEqual(await targetTextContent('#res-architecture'), 'Bipedal');
        chai_1.assert.strictEqual(await targetTextContent('#res-model'), 'C-1-Gardener');
        chai_1.assert.strictEqual(await targetTextContent('#res-ua-full-version'), '1.1.5');
    });
    (0, mocha_extensions_js_1.it)('can add and properly display a device with a custom resolution', async () => {
        await (0, emulation_helpers_js_1.selectEdit)();
        const add = await (0, helper_js_1.waitFor)(ADD_DEVICE_BUTTON_SELECTOR);
        await (0, helper_js_1.click)(add);
        await (0, helper_js_1.waitFor)(FOCUSED_DEVICE_NAME_FIELD_SELECTOR);
        await (0, helper_js_1.typeText)('Prime numbers');
        await (0, helper_js_1.tabForward)(); // Focus width.
        await (0, helper_js_1.typeText)('863');
        await (0, helper_js_1.tabForward)(); // Focus height.
        await (0, helper_js_1.typeText)('1223');
        await (0, helper_js_1.tabForward)(); // Focus DPR.
        await (0, helper_js_1.typeText)('1.0');
        await (0, helper_js_1.tabForward)(); // Focus UA string.
        await (0, helper_js_1.typeText)('Test device browser 1.0');
        const finishAdd = await (0, helper_js_1.waitFor)(EDITOR_ADD_BUTTON_SELECTOR);
        const finishAddText = await elementTextContent(finishAdd);
        chai_1.assert.strictEqual(finishAddText, 'Add');
        await (0, helper_js_1.click)(finishAdd);
        // Select the device in the menu.
        await (0, emulation_helpers_js_1.selectDevice)('Prime numbers');
        const zoomButton = await (0, helper_js_1.waitForAria)('Zoom');
        chai_1.assert.strictEqual(await elementTextContent(zoomButton), '51%');
        // Check fit-to-window text.
        await (0, emulation_helpers_js_1.clickZoomDropDown)();
        const fitButton = await (0, helper_js_1.waitFor)('[aria-label*="Fit to window"]');
        chai_1.assert.strictEqual(await elementTextContent(fitButton), 'Fit to window (51%)');
        chai_1.assert.strictEqual(await elementTextContent(zoomButton), '51%');
        const zoomTo100Button = await (0, helper_js_1.waitFor)('[aria-label*="100%"]');
        await (0, helper_js_1.click)(zoomTo100Button);
        chai_1.assert.strictEqual(await elementTextContent(fitButton), 'Fit to window (51%)');
        chai_1.assert.strictEqual(await elementTextContent(zoomButton), '100%');
    });
});
//# sourceMappingURL=custom-devices_test.js.map