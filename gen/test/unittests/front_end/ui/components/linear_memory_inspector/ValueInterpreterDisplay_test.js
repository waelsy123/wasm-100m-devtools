// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as LinearMemoryInspector from '../../../../../../front_end/ui/components/linear_memory_inspector/linear_memory_inspector.js';
import { dispatchClickEvent, getElementsWithinComponent, getElementWithinComponent, getEventPromise, renderElementIntoDOM } from '../../../helpers/DOMHelpers.js';
import { describeWithLocale } from '../../../helpers/EnvironmentHelpers.js';
export const DISPLAY_JUMP_TO_POINTER_BUTTON_SELECTOR = '[data-jump]';
const { assert } = chai;
describeWithLocale('ValueInterpreterDisplay', () => {
    const combinationsForNumbers = [
        { endianness: "Little Endian" /* Little */, signed: true },
        { endianness: "Little Endian" /* Little */, signed: false },
        { endianness: "Big Endian" /* Big */, signed: false },
        { endianness: "Big Endian" /* Big */, signed: true },
    ];
    function testNumberFormatCombinations(baseData, combinations) {
        const expectedIntValue = 20;
        const expectedFloatValue = -234.03;
        for (let i = 0; i < combinations.length; ++i) {
            const { endianness, signed } = combinations[i];
            let expectedValue;
            const isLittleEndian = endianness === "Little Endian" /* Little */;
            const view = new DataView(baseData.buffer);
            switch (baseData.type) {
                case "Integer 8-bit" /* Int8 */:
                    expectedValue = signed ? -expectedIntValue : expectedIntValue;
                    signed ? view.setInt8(0, expectedValue) : view.setInt8(0, expectedValue);
                    break;
                case "Integer 16-bit" /* Int16 */:
                    expectedValue = signed ? -expectedIntValue : expectedIntValue;
                    signed ? view.setInt16(0, expectedValue, isLittleEndian) : view.setUint16(0, expectedValue, isLittleEndian);
                    break;
                case "Integer 32-bit" /* Int32 */:
                    expectedValue = signed ? -expectedIntValue : expectedIntValue;
                    signed ? view.setInt32(0, expectedValue, isLittleEndian) : view.setUint32(0, expectedValue, isLittleEndian);
                    break;
                case "Integer 64-bit" /* Int64 */:
                    expectedValue = signed ? -expectedIntValue : expectedIntValue;
                    signed ? view.setBigInt64(0, BigInt(expectedValue), isLittleEndian) :
                        view.setBigUint64(0, BigInt(expectedValue), isLittleEndian);
                    break;
                case "Float 32-bit" /* Float32 */:
                    expectedValue = expectedFloatValue;
                    view.setFloat32(0, expectedValue, isLittleEndian);
                    break;
                case "Float 64-bit" /* Float64 */:
                    expectedValue = expectedFloatValue;
                    view.setFloat64(0, expectedValue, isLittleEndian);
                    break;
                case "Pointer 32-bit" /* Pointer32 */:
                    expectedValue = '0x' + expectedIntValue.toString(16);
                    view.setInt32(0, expectedIntValue, isLittleEndian);
                    break;
                case "Pointer 64-bit" /* Pointer64 */:
                    expectedValue = '0x' + expectedIntValue.toString(16);
                    view.setBigUint64(0, BigInt(expectedIntValue), isLittleEndian);
                    break;
                default:
                    throw new Error(`Unknown type ${baseData.type}`);
            }
            const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.format({ ...baseData, ...combinations[i] });
            assert.strictEqual(actualValue, expectedValue.toString());
        }
    }
    it('correctly formats signed/unsigned and endianness for Integer 8-bit (decimal)', () => {
        const formatData = {
            buffer: new ArrayBuffer(1),
            type: "Integer 8-bit" /* Int8 */,
            mode: "dec" /* Decimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats signed/unsigned and endianness for Integer 16-bit (decimal)', () => {
        const formatData = {
            buffer: new ArrayBuffer(2),
            type: "Integer 16-bit" /* Int16 */,
            mode: "dec" /* Decimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats signed/unsigned and endianness for Integer 32-bit (decimal)', () => {
        const formatData = {
            buffer: new ArrayBuffer(4),
            type: "Integer 32-bit" /* Int32 */,
            mode: "dec" /* Decimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats signed/unsigned and endianness for Integer 64-bit (decimal)', () => {
        const formatData = {
            buffer: new ArrayBuffer(8),
            type: "Integer 64-bit" /* Int64 */,
            mode: "dec" /* Decimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats endianness for Float 32-bit (decimal)', () => {
        const formatData = {
            buffer: new ArrayBuffer(4),
            type: "Float 32-bit" /* Float32 */,
            mode: "dec" /* Decimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats endianness for Float 64-bit (decimal)', () => {
        const formatData = {
            buffer: new ArrayBuffer(8),
            type: "Float 64-bit" /* Float64 */,
            mode: "dec" /* Decimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats endianness for Pointer 32-bit', () => {
        const formatData = {
            buffer: new ArrayBuffer(4),
            type: "Pointer 32-bit" /* Pointer32 */,
            mode: "hex" /* Hexadecimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats endianness for Pointer 64-bit', () => {
        const formatData = {
            buffer: new ArrayBuffer(8),
            type: "Pointer 64-bit" /* Pointer64 */,
            mode: "hex" /* Hexadecimal */,
        };
        testNumberFormatCombinations(formatData, combinationsForNumbers);
    });
    it('correctly formats floats in decimal mode', () => {
        const expectedFloat = 341.34;
        const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.formatFloat(expectedFloat, "dec" /* Decimal */);
        assert.strictEqual(actualValue, '341.34');
    });
    it('correctly formats floats in scientific mode', () => {
        const expectedFloat = 341.34;
        const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.formatFloat(expectedFloat, "sci" /* Scientific */);
        assert.strictEqual(actualValue, '3.41e+2');
    });
    it('correctly formats integers in decimal mode', () => {
        const expectedInteger = 120;
        const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.formatInteger(expectedInteger, "dec" /* Decimal */);
        assert.strictEqual(actualValue, '120');
    });
    it('correctly formats integers in hexadecimal mode', () => {
        const expectedInteger = 16;
        const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.formatInteger(expectedInteger, "hex" /* Hexadecimal */);
        assert.strictEqual(actualValue, '0x10');
    });
    it('returns N/A for negative hex numbers', () => {
        const negativeInteger = -16;
        const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.formatInteger(negativeInteger, "hex" /* Hexadecimal */);
        assert.strictEqual(actualValue, 'N/A');
    });
    it('correctly formats integers in octal mode', () => {
        const expectedInteger = 16;
        const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.formatInteger(expectedInteger, "oct" /* Octal */);
        assert.strictEqual(actualValue, '20');
    });
    it('returns N/A for negative octal numbers', () => {
        const expectedInteger = -16;
        const actualValue = LinearMemoryInspector.ValueInterpreterDisplayUtils.formatInteger(expectedInteger, "oct" /* Octal */);
        assert.strictEqual(actualValue, 'N/A');
    });
    it('renders pointer values in LinearMemoryInspector.ValueInterpreterDisplayUtils.ValueTypes', () => {
        const component = new LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay();
        const array = [1, 132, 172, 71, 43, 12, 12, 66];
        component.data = {
            buffer: new Uint8Array(array).buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set([
                "Pointer 32-bit" /* Pointer32 */,
                "Pointer 64-bit" /* Pointer64 */,
            ]),
            memoryLength: array.length,
        };
        renderElementIntoDOM(component);
        const dataValues = getElementsWithinComponent(component, '[data-value]', HTMLDivElement);
        assert.lengthOf(dataValues, 2);
        const actualValues = Array.from(dataValues).map(x => x.innerText);
        const expectedValues = ['0x47AC8401', '0x420C0C2B47AC8401'];
        assert.deepStrictEqual(actualValues, expectedValues);
    });
    it('renders value in selected LinearMemoryInspector.ValueInterpreterDisplayUtils.ValueTypes', () => {
        const component = new LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay();
        const array = [1, 132, 172, 71];
        component.data = {
            buffer: new Uint8Array(array).buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set([
                "Integer 16-bit" /* Int16 */,
                "Float 32-bit" /* Float32 */,
            ]),
            memoryLength: array.length,
        };
        renderElementIntoDOM(component);
        const dataValues = getElementsWithinComponent(component, '[data-value]', HTMLSpanElement);
        assert.lengthOf(dataValues, 3);
        const actualValues = Array.from(dataValues).map(x => x.innerText);
        const expectedValues = ['33793', '-31743', '88328.01'];
        assert.deepStrictEqual(actualValues, expectedValues);
    });
    it('renders only unsigned values for Octal and Hexadecimal representation', () => {
        const component = new LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay();
        const array = [0xC8, 0xC9, 0xCA, 0XCB];
        component.data = {
            buffer: new Uint8Array(array).buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set([
                "Integer 8-bit" /* Int8 */,
                "Integer 16-bit" /* Int16 */,
                "Integer 32-bit" /* Int32 */,
            ]),
            valueTypeModes: new Map([
                [
                    "Integer 8-bit" /* Int8 */,
                    "oct" /* Octal */,
                ],
                [
                    "Integer 16-bit" /* Int16 */,
                    "hex" /* Hexadecimal */,
                ],
                [
                    "Integer 32-bit" /* Int32 */,
                    "dec" /* Decimal */,
                ],
            ]),
            memoryLength: array.length,
        };
        renderElementIntoDOM(component);
        const dataValues = getElementsWithinComponent(component, '[data-value]', HTMLSpanElement);
        assert.lengthOf(dataValues, 4);
        const actualValues = Array.from(dataValues).map(x => x.innerText);
        const expectedValues = ['310', '0xC9C8', '3419064776', '-875902520'];
        assert.deepStrictEqual(actualValues, expectedValues);
    });
    it('triggers a value changed event on selecting a new mode', async () => {
        const component = new LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay();
        const array = [1, 132, 172, 71];
        const oldMode = "dec" /* Decimal */;
        const newMode = "sci" /* Scientific */;
        const mapping = LinearMemoryInspector.ValueInterpreterDisplayUtils.getDefaultValueTypeMapping();
        mapping.set("Float 32-bit" /* Float32 */, oldMode);
        component.data = {
            buffer: new Uint8Array(array).buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set([
                "Float 32-bit" /* Float32 */,
            ]),
            valueTypeModes: mapping,
            memoryLength: array.length,
        };
        const input = getElementWithinComponent(component, '[data-mode-settings]', HTMLSelectElement);
        assert.strictEqual(input.value, oldMode);
        input.value = newMode;
        const eventPromise = getEventPromise(component, 'valuetypemodechanged');
        const changeEvent = new Event('change');
        input.dispatchEvent(changeEvent);
        const event = await eventPromise;
        assert.deepEqual(event.data, { type: "Float 32-bit" /* Float32 */, mode: newMode });
    });
    it('triggers an event on jumping to an address from a 32-bit pointer', async () => {
        const component = new LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay();
        const array = [1, 0, 0, 0];
        component.data = {
            buffer: new Uint8Array(array).buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set([
                "Pointer 32-bit" /* Pointer32 */,
            ]),
            memoryLength: array.length,
        };
        renderElementIntoDOM(component);
        const button = getElementWithinComponent(component, DISPLAY_JUMP_TO_POINTER_BUTTON_SELECTOR, HTMLButtonElement);
        const eventPromise = getEventPromise(component, 'jumptopointeraddress');
        dispatchClickEvent(button);
        const event = await eventPromise;
        assert.deepEqual(event.data, 1);
    });
    it('triggers an event on jumping to an address from a 64-bit pointer', async () => {
        const component = new LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay();
        const array = [1, 0, 0, 0, 0, 0, 0, 0];
        component.data = {
            buffer: new Uint8Array(array).buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set([
                "Pointer 64-bit" /* Pointer64 */,
            ]),
            memoryLength: array.length,
        };
        renderElementIntoDOM(component);
        const button = getElementWithinComponent(component, DISPLAY_JUMP_TO_POINTER_BUTTON_SELECTOR, HTMLButtonElement);
        const eventPromise = getEventPromise(component, 'jumptopointeraddress');
        dispatchClickEvent(button);
        const event = await eventPromise;
        assert.deepEqual(event.data, 1);
    });
    it('renders a disabled jump-to-address button if address is invalid', () => {
        const component = new LinearMemoryInspector.ValueInterpreterDisplay.ValueInterpreterDisplay();
        const array = [8, 0, 0, 0, 0, 0, 0, 0];
        component.data = {
            buffer: new Uint8Array(array).buffer,
            endianness: "Little Endian" /* Little */,
            valueTypes: new Set([
                "Pointer 32-bit" /* Pointer32 */,
                "Pointer 64-bit" /* Pointer64 */,
            ]),
            memoryLength: array.length,
        };
        renderElementIntoDOM(component);
        const buttons = getElementsWithinComponent(component, DISPLAY_JUMP_TO_POINTER_BUTTON_SELECTOR, HTMLButtonElement);
        assert.lengthOf(buttons, 2);
        assert.isTrue(buttons[0].disabled);
        assert.isTrue(buttons[1].disabled);
    });
});
//# sourceMappingURL=ValueInterpreterDisplay_test.js.map