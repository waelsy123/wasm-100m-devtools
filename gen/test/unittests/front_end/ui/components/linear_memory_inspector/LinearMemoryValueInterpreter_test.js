// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as LinearMemoryInspector from '../../../../../../front_end/ui/components/linear_memory_inspector/linear_memory_inspector.js';
import { getElementWithinComponent, getEventPromise, renderElementIntoDOM } from '../../../helpers/DOMHelpers.js';
import { describeWithLocale } from '../../../helpers/EnvironmentHelpers.js';
const { assert } = chai;
const DISPLAY_SELECTOR = 'devtools-linear-memory-inspector-interpreter-display';
const SETTINGS_SELECTOR = 'devtools-linear-memory-inspector-interpreter-settings';
const TOOLBAR_SELECTOR = '.settings-toolbar';
export const ENDIANNESS_SELECTOR = '[data-endianness]';
function assertSettingsRenders(component) {
    const settings = getElementWithinComponent(component, SETTINGS_SELECTOR, LinearMemoryInspector.ValueInterpreterSettings.ValueInterpreterSettings);
    assert.isNotNull(settings);
}
function assertDisplayRenders(component) {
    const display = getElementWithinComponent(component, DISPLAY_SELECTOR, LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay);
    assert.isNotNull(display);
}
function clickSettingsButton(component) {
    const settingsButton = getElementWithinComponent(component, '[data-settings]', HTMLButtonElement);
    settingsButton.click();
}
describeWithLocale('LinearMemoryValueInterpreter', () => {
    function setUpComponent() {
        const buffer = new Uint8Array([34, 234, 12, 3]).buffer;
        const component = new LinearMemoryInspector.LinearMemoryValueInterpreter.LinearMemoryValueInterpreter();
        component.data = {
            value: buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set(["Integer 8-bit" /* Int8 */]),
            memoryLength: buffer.byteLength,
        };
        renderElementIntoDOM(component);
        return component;
    }
    it('renders the settings toolbar', () => {
        const component = setUpComponent();
        const settingsToolbar = getElementWithinComponent(component, TOOLBAR_SELECTOR, HTMLDivElement);
        assert.isNotNull(settingsToolbar);
    });
    it('renders value display as default', () => {
        const component = setUpComponent();
        assertDisplayRenders(component);
    });
    it('switches between value display and value settings', () => {
        const component = setUpComponent();
        assertDisplayRenders(component);
        clickSettingsButton(component);
        assertSettingsRenders(component);
    });
    it('listens on TypeToggleEvents', async () => {
        const component = setUpComponent();
        clickSettingsButton(component);
        const settings = getElementWithinComponent(component, SETTINGS_SELECTOR, LinearMemoryInspector.ValueInterpreterSettings.ValueInterpreterSettings);
        const eventPromise = getEventPromise(component, 'valuetypetoggled');
        const expectedType = "Float 64-bit" /* Float64 */;
        const expectedChecked = true;
        const typeToggleEvent = new LinearMemoryInspector.ValueInterpreterSettings.TypeToggleEvent(expectedType, expectedChecked);
        settings.dispatchEvent(typeToggleEvent);
        const event = await eventPromise;
        assert.strictEqual(event.data.type, expectedType);
        assert.strictEqual(event.data.checked, expectedChecked);
    });
    it('renders the endianness options', () => {
        const component = setUpComponent();
        const input = getElementWithinComponent(component, ENDIANNESS_SELECTOR, HTMLSelectElement);
        assert.deepEqual(input.value, "Little Endian" /* Little */);
        const options = input.querySelectorAll('option');
        const endiannessSettings = Array.from(options).map(option => option.value);
        assert.deepEqual(endiannessSettings, [
            "Little Endian" /* Little */,
            "Big Endian" /* Big */,
        ]);
    });
    it('triggers an event on changing endianness', async () => {
        const component = setUpComponent();
        const input = getElementWithinComponent(component, ENDIANNESS_SELECTOR, HTMLSelectElement);
        const eventPromise = getEventPromise(component, 'endiannesschanged');
        const changeEvent = new Event('change');
        input.dispatchEvent(changeEvent);
        const event = await eventPromise;
        assert.deepEqual(event.data, "Little Endian" /* Little */);
    });
});
//# sourceMappingURL=LinearMemoryValueInterpreter_test.js.map