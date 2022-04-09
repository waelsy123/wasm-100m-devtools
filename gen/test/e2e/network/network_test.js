"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const network_helpers_js_1 = require("../helpers/network-helpers.js");
const SIMPLE_PAGE_REQUEST_NUMBER = 10;
const SIMPLE_PAGE_URL = `requests.html?num=${SIMPLE_PAGE_REQUEST_NUMBER}`;
async function getCategoryXHRFilter() {
    const filters = await (0, helper_js_1.waitFor)('.filter-bitset-filter');
    const categoryXHRFilter = await (0, helper_js_1.$textContent)('Fetch/XHR', filters);
    if (!categoryXHRFilter) {
        chai_1.assert.fail('Could not find category XHR filter to click.');
    }
    return categoryXHRFilter;
}
async function getThirdPartyFilter() {
    const filters = await (0, helper_js_1.waitFor)('.filter-bar');
    const thirdPartyFilter = await (0, helper_js_1.$textContent)('3rd-party requests', filters);
    if (!thirdPartyFilter) {
        chai_1.assert.fail('Could not find category third-party filter to click.');
    }
    return thirdPartyFilter;
}
(0, mocha_extensions_js_1.describe)('The Network Tab', async function () {
    // The tests here tend to take time because they wait for requests to appear in the request panel.
    this.timeout(5000);
    beforeEach(async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('empty.html');
        await (0, network_helpers_js_1.setCacheDisabled)(true);
        await (0, network_helpers_js_1.setPersistLog)(false);
    });
    // Flakey test
    mocha_extensions_js_1.it.skip('[crbug.com/1093287] displays requests', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)(SIMPLE_PAGE_URL);
        // Wait for all the requests to be displayed + 1 to account for the page itself.
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(SIMPLE_PAGE_REQUEST_NUMBER + 1);
        const expectedNames = [SIMPLE_PAGE_URL];
        for (let i = 0; i < SIMPLE_PAGE_REQUEST_NUMBER; i++) {
            expectedNames.push(`image.svg?id=${i}`);
        }
        const names = await (0, network_helpers_js_1.getAllRequestNames)();
        chai_1.assert.deepStrictEqual(names, expectedNames, 'The right request names should appear in the list');
    });
    // Flakey test
    mocha_extensions_js_1.it.skip('[crbug.com/1093287] can select requests', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)(SIMPLE_PAGE_URL);
        let selected = await (0, network_helpers_js_1.getSelectedRequestName)();
        chai_1.assert.isUndefined(selected, 'No request should be selected by default');
        await (0, network_helpers_js_1.selectRequestByName)(SIMPLE_PAGE_URL);
        await (0, network_helpers_js_1.waitForSelectedRequestChange)(selected);
        selected = await (0, network_helpers_js_1.getSelectedRequestName)();
        chai_1.assert.strictEqual(selected, SIMPLE_PAGE_URL, 'Selecting the first request should work');
        const lastRequestName = `image.svg?id=${SIMPLE_PAGE_REQUEST_NUMBER - 1}`;
        await (0, network_helpers_js_1.selectRequestByName)(lastRequestName);
        await (0, network_helpers_js_1.waitForSelectedRequestChange)(selected);
        selected = await (0, network_helpers_js_1.getSelectedRequestName)();
        chai_1.assert.strictEqual(selected, lastRequestName, 'Selecting the last request should work');
    });
    // Flakey test
    mocha_extensions_js_1.it.skip('[crbug.com/1093287] can persist requests', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)(SIMPLE_PAGE_URL);
        // Wait for all the requests to be displayed + 1 to account for the page itself, and get their names.
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(SIMPLE_PAGE_REQUEST_NUMBER + 1);
        const firstPageRequestNames = await (0, network_helpers_js_1.getAllRequestNames)();
        await (0, network_helpers_js_1.setPersistLog)(true);
        // Navigate to a new page, and wait for the same requests to still be there.
        await (0, helper_js_1.goTo)('about:blank');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(SIMPLE_PAGE_REQUEST_NUMBER + 1);
        const secondPageRequestNames = await (0, network_helpers_js_1.getAllRequestNames)();
        chai_1.assert.deepStrictEqual(secondPageRequestNames, firstPageRequestNames, 'The requests were persisted');
    });
    (0, mocha_extensions_js_1.it)('persists filters across a reload', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)(SIMPLE_PAGE_URL);
        let filterInput = await (0, helper_js_1.waitFor)('.filter-input-field.text-prompt');
        filterInput.focus();
        await (0, helper_js_1.typeText)('foo');
        let categoryXHRFilter = await getCategoryXHRFilter();
        await categoryXHRFilter.click();
        await (0, helper_js_1.reloadDevTools)({ selectedPanel: { name: 'network' } });
        filterInput = await (0, helper_js_1.waitFor)('.filter-input-field.text-prompt');
        const filterText = await filterInput.evaluate(x => x.innerText);
        chai_1.assert.strictEqual(filterText, 'foo');
        categoryXHRFilter = await getCategoryXHRFilter();
        const xhrHasSelectedClass = await categoryXHRFilter.evaluate(x => x.classList.contains('selected'));
        chai_1.assert.isTrue(xhrHasSelectedClass);
    });
    (0, mocha_extensions_js_1.it)('can show only third-party requests', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('third-party-resources.html');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        let names = await (0, network_helpers_js_1.getAllRequestNames)();
        /* assert.deepStrictEqual(names, [], 'The right request names should appear in the list'); */
        const thirdPartyFilter = await getThirdPartyFilter();
        await thirdPartyFilter.click();
        names = await (0, network_helpers_js_1.getAllRequestNames)();
        chai_1.assert.deepStrictEqual(names, ['external_image.svg'], 'The right request names should appear in the list');
    });
});
//# sourceMappingURL=network_test.js.map