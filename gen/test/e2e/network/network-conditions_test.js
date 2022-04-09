"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const network_helpers_js_1 = require("../helpers/network-helpers.js");
(0, mocha_extensions_js_1.describe)('The Network Tab', async function () {
    beforeEach(async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('empty.html');
    });
    async function openNetworkConditions(sectionClassName) {
        const networkConditionsButton = await (0, helper_js_1.waitForAria)('More network conditions…');
        await networkConditionsButton.click();
        return await (0, helper_js_1.waitFor)(sectionClassName);
    }
    async function assertDisabled(checkbox, expected) {
        const disabled = await checkbox.evaluate(el => el.disabled);
        chai_1.assert.strictEqual(disabled, expected);
    }
    async function assertChecked(checkbox, expected) {
        const checked = await checkbox.evaluate(el => el.checked);
        chai_1.assert.strictEqual(checked, expected);
    }
    async function getUserAgentMetadataFromTarget(target) {
        const getUserAgentMetaData = async () => {
            const nav = navigator;
            return {
                brands: nav.userAgentData.brands,
                mobile: nav.userAgentData.mobile,
                ...(await nav.userAgentData.getHighEntropyValues([
                    'uaFullVersion',
                    'architecture',
                    'model',
                    'platform',
                    'platformVersion',
                ])),
            };
        };
        const getUserAgentMetaDataStr = `(${getUserAgentMetaData.toString()})()`;
        return await target.evaluate(getUserAgentMetaDataStr);
    }
    (0, mocha_extensions_js_1.it)('can change accepted content encodings', async () => {
        const section = await openNetworkConditions('.network-config-accepted-encoding');
        const autoCheckbox = await (0, helper_js_1.waitForAria)('Use browser default', section);
        const deflateCheckbox = await (0, helper_js_1.waitForAria)('deflate', section);
        const gzipCheckbox = await (0, helper_js_1.waitForAria)('gzip', section);
        const brotliCheckbox = await (0, helper_js_1.waitForAria)('br', section);
        await brotliCheckbox.evaluate(el => el.scrollIntoView(true));
        await assertChecked(autoCheckbox, true);
        await assertChecked(deflateCheckbox, true);
        await assertChecked(gzipCheckbox, true);
        await assertChecked(brotliCheckbox, true);
        await assertDisabled(autoCheckbox, false);
        await assertDisabled(deflateCheckbox, true);
        await assertDisabled(gzipCheckbox, true);
        await assertDisabled(brotliCheckbox, true);
        await autoCheckbox.click();
        await assertChecked(autoCheckbox, false);
        await assertChecked(deflateCheckbox, true);
        await assertChecked(gzipCheckbox, true);
        await assertChecked(brotliCheckbox, true);
        await assertDisabled(autoCheckbox, false);
        await assertDisabled(deflateCheckbox, false);
        await assertDisabled(gzipCheckbox, false);
        await assertDisabled(brotliCheckbox, false);
        await brotliCheckbox.click();
        await assertChecked(autoCheckbox, false);
        await assertChecked(deflateCheckbox, true);
        await assertChecked(gzipCheckbox, true);
        await assertChecked(brotliCheckbox, false);
        await assertDisabled(autoCheckbox, false);
        await assertDisabled(deflateCheckbox, false);
        await assertDisabled(gzipCheckbox, false);
        await assertDisabled(brotliCheckbox, false);
        await autoCheckbox.click();
        await assertChecked(autoCheckbox, true);
        await assertChecked(deflateCheckbox, true);
        await assertChecked(gzipCheckbox, true);
        await assertChecked(brotliCheckbox, false);
        await assertDisabled(autoCheckbox, false);
        await assertDisabled(deflateCheckbox, true);
        await assertDisabled(gzipCheckbox, true);
        await assertDisabled(brotliCheckbox, true);
    });
    (0, mocha_extensions_js_1.it)('can override userAgentMetadata', async () => {
        const { target, browser } = (0, helper_js_1.getBrowserAndPages)();
        const fullVersion = (await browser.version()).split('/')[1];
        const majorVersion = fullVersion.split('.', 1)[0];
        const fixedVersionUAValue = 'Mozilla/5.0 (Linux; U; Android 4.0.2; en-us; Galaxy Nexus Build/ICL53F) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30';
        const dynamicVersionUAValue = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36'.replace('%s', fullVersion);
        const noMetadataVersionUAValue = 'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko';
        const fixedVersionUserAgentMetadataExpected = {
            'brands': [
                { 'brand': 'Not A;Brand', 'version': '99' },
                { 'brand': 'Chromium', 'version': majorVersion },
                { 'brand': 'Google Chrome', 'version': majorVersion },
            ],
            'uaFullVersion': fullVersion,
            'platform': 'Android',
            'platformVersion': '4.0.2',
            'architecture': '',
            'model': 'Galaxy Nexus',
            'mobile': true,
        };
        const dynamicVersionUserAgentMetadataExpected = {
            'brands': [
                { 'brand': 'Not A;Brand', 'version': '99' },
                { 'brand': 'Chromium', 'version': majorVersion },
                { 'brand': 'Google Chrome', 'version': majorVersion },
            ],
            'uaFullVersion': fullVersion,
            'platform': 'Windows',
            'platformVersion': '10.0',
            'architecture': 'x86',
            'model': '',
            'mobile': false,
        };
        const noMetadataVersionUserAgentMetadataExpected = {
            'brands': [],
            'mobile': false,
            'uaFullVersion': '',
            'platform': '',
            'platformVersion': '',
            'architecture': '',
            'model': '',
        };
        const section = await openNetworkConditions('.network-config-ua');
        const autoCheckbox = await (0, helper_js_1.waitForAria)('Use browser default', section);
        const uaDropdown = await (0, helper_js_1.waitForAria)('User agent', section);
        await assertChecked(autoCheckbox, true);
        await autoCheckbox.click();
        await assertChecked(autoCheckbox, false);
        await uaDropdown.click();
        await uaDropdown.select(fixedVersionUAValue);
        await uaDropdown.click();
        const fixedVersionUserAgentMetadata = await getUserAgentMetadataFromTarget(target);
        chai_1.assert.deepEqual(fixedVersionUserAgentMetadata, fixedVersionUserAgentMetadataExpected);
        await uaDropdown.click();
        await uaDropdown.select(dynamicVersionUAValue);
        await uaDropdown.click();
        const dynamicVersionUserAgentMetadata = await getUserAgentMetadataFromTarget(target);
        chai_1.assert.deepEqual(dynamicVersionUserAgentMetadata, dynamicVersionUserAgentMetadataExpected);
        await uaDropdown.click();
        await uaDropdown.select(noMetadataVersionUAValue);
        await uaDropdown.click();
        const noMetadataVersionUserAgentMetadata = await getUserAgentMetadataFromTarget(target);
        chai_1.assert.deepEqual(noMetadataVersionUserAgentMetadata, noMetadataVersionUserAgentMetadataExpected);
    });
    (0, mocha_extensions_js_1.it)('restores default userAgentMetadata', async () => {
        const { target, browser } = (0, helper_js_1.getBrowserAndPages)();
        const fullVersion = (await browser.version()).split('/')[1];
        const customUAValue = `Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${fullVersion} Mobile Safari/537.36`;
        const section = await openNetworkConditions('.network-config-ua');
        const autoCheckbox = await (0, helper_js_1.waitForAria)('Use browser default', section);
        const uaDropdown = await (0, helper_js_1.waitForAria)('User agent', section);
        await assertChecked(autoCheckbox, true);
        const defaultUserAgentMetadata = await getUserAgentMetadataFromTarget(target);
        await autoCheckbox.click();
        await assertChecked(autoCheckbox, false);
        await uaDropdown.click();
        await uaDropdown.select(customUAValue);
        await uaDropdown.click();
        const customUserAgentMetadata = await getUserAgentMetadataFromTarget(target);
        chai_1.assert.notDeepEqual(defaultUserAgentMetadata, customUserAgentMetadata);
        await autoCheckbox.click();
        await assertChecked(autoCheckbox, true);
        const restoredUserAgentMetadata = await getUserAgentMetadataFromTarget(target);
        chai_1.assert.deepEqual(defaultUserAgentMetadata, restoredUserAgentMetadata);
    });
    (0, mocha_extensions_js_1.it)('can apply customized userAgentMetadata', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        const section = await openNetworkConditions('.network-config-ua');
        const autoCheckbox = await (0, helper_js_1.waitForAria)('Use browser default', section);
        const uaDropdown = await (0, helper_js_1.waitForAria)('User agent', section);
        await assertChecked(autoCheckbox, true);
        await autoCheckbox.click();
        await assertChecked(autoCheckbox, false);
        // Choose "Custom..." UA, Move focus to UA string and enter test value
        await uaDropdown.select('custom');
        const userAgent = await (0, helper_js_1.waitForAria)('Enter a custom user agent');
        await userAgent.click();
        await userAgent.type('Test User Agent String');
        await (0, helper_js_1.tabForward)(); // focus help button
        await (0, helper_js_1.pressKey)('Space'); // open client hints section
        await (0, helper_js_1.tabForward)(); // focus help link
        await (0, helper_js_1.tabForward)(); // focus brand name
        await (0, helper_js_1.typeText)('Test Brand 1');
        await (0, helper_js_1.tabForward)(); // focus brand version
        await (0, helper_js_1.typeText)('99');
        await (0, helper_js_1.tabForward)(); // focus delete brand button
        await (0, helper_js_1.tabForward)(); // focus add brand button
        await (0, helper_js_1.pressKey)('Enter'); // add a second brand
        await (0, helper_js_1.typeText)('Test Brand 2');
        await (0, helper_js_1.tabForward)(); // focus brand version
        await (0, helper_js_1.typeText)('100');
        await (0, helper_js_1.tabForward)(); // focus delete brand button
        await (0, helper_js_1.tabForward)(); // focus add brand button
        await (0, helper_js_1.pressKey)('Enter'); // add a third brand
        await (0, helper_js_1.typeText)('Test Brand 3');
        await (0, helper_js_1.tabForward)(); // focus brand version
        await (0, helper_js_1.typeText)('101');
        await (0, helper_js_1.tabForward)(); // focus delete brand button
        await (0, helper_js_1.tabForward)(); // focus add brand button
        await (0, helper_js_1.tabForward)(); // focus browser full version
        await (0, helper_js_1.typeText)('99.99');
        await (0, helper_js_1.tabForward)(); // focus platform name
        await (0, helper_js_1.typeText)('Test Platform');
        await (0, helper_js_1.tabForward)(); // focus platform version
        await (0, helper_js_1.typeText)('10');
        await (0, helper_js_1.tabForward)(); // focus architecture
        await (0, helper_js_1.typeText)('Test Architecture');
        await (0, helper_js_1.tabForward)(); // focus device model
        await (0, helper_js_1.typeText)('Test Model');
        await (0, helper_js_1.tabForward)(); // focus mobile checkbox
        await (0, helper_js_1.pressKey)('Space');
        await (0, helper_js_1.tabForward)(); // focus update button
        await (0, helper_js_1.pressKey)('Enter');
        const userAgentMetadata = await getUserAgentMetadataFromTarget(target);
        chai_1.assert.deepEqual(userAgentMetadata, {
            'brands': [
                { 'brand': 'Test Brand 1', 'version': '99' },
                { 'brand': 'Test Brand 2', 'version': '100' },
                { 'brand': 'Test Brand 3', 'version': '101' },
            ],
            'uaFullVersion': '99.99',
            'platform': 'Test Platform',
            'platformVersion': '10',
            'architecture': 'Test Architecture',
            'model': 'Test Model',
            'mobile': true,
        });
        // Delete a brand
        const brand = await (0, helper_js_1.waitForAria)('Brand 1', section); // move focus back to first brand
        await brand.click();
        await (0, helper_js_1.tabForward)(); // focus brand version
        await (0, helper_js_1.tabForward)(); // focus delete brand button
        await (0, helper_js_1.pressKey)('Enter');
        // Edit a value
        const platformVersion = await (0, helper_js_1.waitForAria)('Platform version', section);
        await platformVersion.click();
        await (0, helper_js_1.typeText)('11');
        // Update
        await (0, helper_js_1.tabForward)(); // focus architecture
        await (0, helper_js_1.tabForward)(); // focus device model
        await (0, helper_js_1.tabForward)(); // focus mobile checkbox
        await (0, helper_js_1.tabForward)(); // focus update button
        await (0, helper_js_1.pressKey)('Enter');
        const updatedUserAgentMetadata = await getUserAgentMetadataFromTarget(target);
        chai_1.assert.deepEqual(updatedUserAgentMetadata, {
            'brands': [
                { 'brand': 'Test Brand 2', 'version': '100' },
                { 'brand': 'Test Brand 3', 'version': '101' },
            ],
            'uaFullVersion': '99.99',
            'platform': 'Test Platform',
            'platformVersion': '1011',
            'architecture': 'Test Architecture',
            'model': 'Test Model',
            'mobile': true,
        });
    });
});
//# sourceMappingURL=network-conditions_test.js.map