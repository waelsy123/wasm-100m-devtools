"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCacheDisabled = exports.setPersistLog = exports.waitForSelectedRequestChange = exports.selectRequestByName = exports.getSelectedRequestName = exports.getAllRequestNames = exports.waitForSomeRequestsToAppear = exports.navigateToNetworkTab = void 0;
const helper_js_1 = require("../../shared/helper.js");
const REQUEST_LIST_SELECTOR = '.network-log-grid .data';
/**
 * Select the Network tab in DevTools
 */
async function navigateToNetworkTab(testName) {
    await (0, helper_js_1.goToResource)(`network/${testName}`);
    await (0, helper_js_1.click)('#tab-network');
    // Make sure the network tab is shown on the screen
    await (0, helper_js_1.waitFor)('.network-log-grid');
}
exports.navigateToNetworkTab = navigateToNetworkTab;
/**
 * Wait until a certain number of requests are shown in the request list.
 * @param numberOfRequests The expected number of requests to wait for.
 * @param selector Optional. The selector to use to get the list of requests.
 */
async function waitForSomeRequestsToAppear(numberOfRequests) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const requests = await getAllRequestNames();
        return requests.length >= numberOfRequests && Boolean(requests.map(name => name ? name.trim() : '').join(''));
    });
}
exports.waitForSomeRequestsToAppear = waitForSomeRequestsToAppear;
async function getAllRequestNames() {
    const requests = await (0, helper_js_1.$$)(REQUEST_LIST_SELECTOR + ' .name-column');
    return await Promise.all(requests.map(request => request.evaluate(r => r.childNodes[1].textContent)));
}
exports.getAllRequestNames = getAllRequestNames;
async function getSelectedRequestName() {
    const request = await (0, helper_js_1.waitFor)(REQUEST_LIST_SELECTOR + ' tr.selected .name-column');
    return await request.evaluate(node => {
        return node && node.childNodes[1].textContent;
    });
}
exports.getSelectedRequestName = getSelectedRequestName;
async function selectRequestByName(name, clickOptions) {
    const selector = REQUEST_LIST_SELECTOR + ' .name-column';
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    // Finding he click position is done in a single frontend.evaluate call
    // to make sure the element still exists after finding the element.
    // If this were done outside of evaluate code, it would be possible for an
    // element to be removed from the dom between the $$(.selector) call and the
    // click(element) call.
    const rect = await frontend.evaluate((name, selector) => {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            if (element.childNodes[1].textContent === name) {
                const { left, top, width, height } = element.getBoundingClientRect();
                return { left, top, width, height };
            }
        }
        return null;
    }, name, selector);
    if (rect) {
        const x = rect.left + rect.width * 0.5;
        const y = rect.top + rect.height * 0.5;
        await frontend.mouse.click(x, y, clickOptions);
    }
}
exports.selectRequestByName = selectRequestByName;
async function waitForSelectedRequestChange(initialRequestName) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const name = await getSelectedRequestName();
        return name !== initialRequestName;
    });
}
exports.waitForSelectedRequestChange = waitForSelectedRequestChange;
async function setPersistLog(persist) {
    await (0, helper_js_1.setCheckBox)('[aria-label="Preserve log"]', persist);
}
exports.setPersistLog = setPersistLog;
async function setCacheDisabled(disabled) {
    await (0, helper_js_1.setCheckBox)('[aria-label="Disable cache"]', disabled);
}
exports.setCacheDisabled = setCacheDisabled;
//# sourceMappingURL=network-helpers.js.map