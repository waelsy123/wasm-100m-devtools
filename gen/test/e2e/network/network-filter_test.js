"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const network_helpers_js_1 = require("../helpers/network-helpers.js");
const SIMPLE_PAGE_REQUEST_NUMBER = 10;
const SIMPLE_PAGE_URL = `requests.html?num=${SIMPLE_PAGE_REQUEST_NUMBER}`;
const RESULTS = [
    `requests.html?num=${SIMPLE_PAGE_REQUEST_NUMBER}/test/e2e/resources/network`,
    ...Array.from({ length: SIMPLE_PAGE_REQUEST_NUMBER }, (_, i) => `image.svg?id=${i}/test/e2e/resources/network`),
];
async function elementTextContent(element) {
    return await element.evaluate(node => node.textContent || '');
}
async function checkboxIsChecked(element) {
    return await element.evaluate(node => node.checked);
}
async function clearFilter() {
    await (0, helper_js_1.click)(await (0, helper_js_1.waitFor)('.filter-input-clear-button'));
}
(0, mocha_extensions_js_1.describe)('The Network Tab', async function () {
    // One of these tests reloads panels repeatedly, which can take a longer time.
    this.timeout(20_000);
    beforeEach(async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)(SIMPLE_PAGE_URL);
    });
    (0, mocha_extensions_js_1.it)('can filter by text in the log view', async () => {
        await (0, helper_js_1.typeText)('9');
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(1);
        (0, chai_1.expect)(await elementTextContent(nodes[0])).to.equal(RESULTS[10]);
    });
    (0, mocha_extensions_js_1.it)('can match multiple requests by text in the log view', async () => {
        await (0, helper_js_1.typeText)('svg');
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(10);
    });
    (0, mocha_extensions_js_1.it)('can filter by regex in the log view', async () => {
        await (0, helper_js_1.typeText)('/8/');
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(1);
        (0, chai_1.expect)(await elementTextContent(nodes[0])).to.equal(RESULTS[9]);
    });
    (0, mocha_extensions_js_1.it)('can match multiple requests by regex in the log view', async () => {
        await (0, helper_js_1.typeText)('/.*/');
        let nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(11);
        await clearFilter();
        await (0, helper_js_1.typeText)('/.*\\..*/');
        nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(11);
        await clearFilter();
        await (0, helper_js_1.typeText)('/.*\\.svg/');
        nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(10);
    });
    (0, mocha_extensions_js_1.it)('can match no requests by regex in the log view', async () => {
        await (0, helper_js_1.typeText)('/NOTHINGTOMATCH/');
        await (0, helper_js_1.waitForNone)('.data-grid-data-grid-node > .name-column');
        await clearFilter();
        await (0, helper_js_1.typeText)('//');
        await (0, helper_js_1.waitForNone)('.data-grid-data-grid-node > .name-column');
    });
    // Mac doesn't consistently respect force-cache
    mocha_extensions_js_1.it.skipOnPlatforms(['mac'], '[crbug.com/1297070] can filter by cache status in the log view', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)(`requests.html?num=5&cache=no-store&nocache=${Math.random()}`);
        await (0, network_helpers_js_1.setPersistLog)(true);
        await (0, network_helpers_js_1.navigateToNetworkTab)(`requests.html?num=3&cache=force-cache&nocache=${Math.random()}`);
        await (0, helper_js_1.typeText)('-is:from-cache');
        let nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(7);
        await clearFilter();
        await (0, helper_js_1.typeText)('is:from-cache');
        nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(3);
        await (0, network_helpers_js_1.setPersistLog)(false);
    });
    (0, mocha_extensions_js_1.it)('require operator to filter by scheme', async () => {
        await (0, helper_js_1.typeText)('http');
        await (0, helper_js_1.waitForNone)('.data-grid-data-grid-node > .name-column');
        await (0, helper_js_1.typeText)('s');
        await (0, helper_js_1.waitForNone)('.data-grid-data-grid-node > .name-column');
        await (0, helper_js_1.typeText)('://');
        await (0, helper_js_1.waitForNone)('.data-grid-data-grid-node > .name-column');
        await clearFilter();
        await (0, helper_js_1.typeText)('scheme:https');
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(11);
    });
    (0, mocha_extensions_js_1.it)('require operator to filter by scheme', async () => {
        await (0, helper_js_1.typeText)('localhost');
        await (0, helper_js_1.waitForNone)('.data-grid-data-grid-node > .name-column');
        await clearFilter();
        await (0, helper_js_1.typeText)('domain:localhost');
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(11);
    });
    (0, mocha_extensions_js_1.it)('can filter by partial URL in the log view', async () => {
        await clearFilter();
        await (0, helper_js_1.typeText)(`https://localhost:${(0, helper_js_1.getTestServerPort)()}//`);
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(11);
    });
    (0, mocha_extensions_js_1.it)('can reverse filter text in the log view', async () => {
        await (0, helper_js_1.typeText)('-7');
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 10);
        const output = [...RESULTS];
        output.splice(8, 1);
        (0, chai_1.expect)(nodes.length).to.equal(output.length);
        for (let i = 0; i < 10; i++) {
            (0, chai_1.expect)(await elementTextContent(nodes[i])).to.equal(output[i]);
        }
    });
    (0, mocha_extensions_js_1.it)('can reverse filter regex in the log view', async () => {
        await (0, helper_js_1.typeText)('-/6/');
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 10);
        const output = [...RESULTS];
        output.splice(7, 1);
        (0, chai_1.expect)(nodes.length).to.equal(output.length);
        for (let i = 0; i < 10; i++) {
            (0, chai_1.expect)(await elementTextContent(nodes[i])).to.equal(output[i]);
        }
    });
    (0, mocha_extensions_js_1.it)('can invert text filters', async () => {
        const invertCheckbox = await (0, helper_js_1.waitForAria)('Invert');
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
        await (0, helper_js_1.typeText)('5');
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(true);
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 10);
        const output = [...RESULTS];
        output.splice(6, 1);
        (0, chai_1.expect)(nodes.length).to.equal(output.length);
        for (let i = 0; i < 10; i++) {
            (0, chai_1.expect)(await elementTextContent(nodes[i])).to.equal(output[i]);
        }
        // Cleanup
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
    });
    (0, mocha_extensions_js_1.it)('can invert regex filters', async () => {
        const invertCheckbox = await (0, helper_js_1.waitForAria)('Invert');
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
        await (0, helper_js_1.typeText)('/4/');
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(true);
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 10);
        const output = [...RESULTS];
        output.splice(5, 1);
        (0, chai_1.expect)(nodes.length).to.equal(output.length);
        for (let i = 0; i < 10; i++) {
            (0, chai_1.expect)(await elementTextContent(nodes[i])).to.equal(output[i]);
        }
        // Cleanup
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
    });
    (0, mocha_extensions_js_1.it)('can invert negated text filters', async () => {
        const invertCheckbox = await (0, helper_js_1.waitForAria)('Invert');
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
        await (0, helper_js_1.typeText)('-10');
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(true);
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(1);
        (0, chai_1.expect)(await elementTextContent(nodes[0])).to.equal(RESULTS[0]);
        // Cleanup
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
    });
    (0, mocha_extensions_js_1.it)('can invert negated regex filters', async () => {
        const invertCheckbox = await (0, helper_js_1.waitForAria)('Invert');
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
        await (0, helper_js_1.typeText)('-/10/');
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(true);
        const nodes = await (0, helper_js_1.waitForMany)('.data-grid-data-grid-node > .name-column', 1);
        (0, chai_1.expect)(nodes.length).to.equal(1);
        (0, chai_1.expect)(await elementTextContent(nodes[0])).to.equal(RESULTS[0]);
        // Cleanup
        await (0, helper_js_1.click)(invertCheckbox);
        (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
    });
    (0, mocha_extensions_js_1.it)('can persist the invert checkbox', async () => {
        // Start with invert disabled, then enable it.
        {
            const invertCheckbox = await (0, helper_js_1.waitForAria)('Invert');
            (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
            await (0, helper_js_1.click)(invertCheckbox);
            (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(true);
        }
        // Verify persistence when enabled.
        await (0, helper_js_1.reloadDevTools)({ queryParams: { panel: 'network' } });
        {
            const invertCheckbox = await (0, helper_js_1.waitForAria)('Invert');
            (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(true);
            await (0, helper_js_1.click)(invertCheckbox);
            (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
        }
        // Verify persistence when disabled.
        await (0, helper_js_1.reloadDevTools)({ queryParams: { panel: 'network' } });
        {
            const invertCheckbox = await (0, helper_js_1.waitForAria)('Invert');
            (0, chai_1.expect)(await checkboxIsChecked(invertCheckbox)).to.equal(false);
        }
    });
});
//# sourceMappingURL=network-filter_test.js.map