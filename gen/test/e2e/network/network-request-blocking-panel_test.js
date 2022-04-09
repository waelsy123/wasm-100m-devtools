"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const chai_2 = require("chai");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
const helper_js_1 = require("../../shared/helper.js");
async function navigateToNetworkRequestBlockingTab() {
    await (0, settings_helpers_js_1.openPanelViaMoreTools)('Network request blocking');
}
async function checkboxIsChecked(element) {
    return await element.evaluate(node => node.checked);
}
async function isVisible(element, container) {
    const elementBox = JSON.parse(await element.evaluate(e => JSON.stringify(e.getBoundingClientRect())));
    const containerBox = JSON.parse(await container.evaluate(e => JSON.stringify(e.getBoundingClientRect())));
    return elementBox.top <= containerBox.top ? containerBox.top - elementBox.top <= elementBox.height :
        elementBox.bottom - containerBox.bottom <= elementBox.height;
}
async function disableNetworkRequestBlocking() {
    const networkRequestBlockingCheckbox = await (0, helper_js_1.waitForAria)('Enable network request blocking');
    (0, chai_2.expect)(await checkboxIsChecked(networkRequestBlockingCheckbox)).to.equal(true);
    await networkRequestBlockingCheckbox.click();
    (0, chai_2.expect)(await checkboxIsChecked(networkRequestBlockingCheckbox)).to.equal(false);
}
// Flakey in the beforeEach step on Mac bot.
describe.skip('[crbug.com/1259120] Network request blocking panel', async () => {
    beforeEach(async () => {
        await navigateToNetworkRequestBlockingTab();
        for (let i = 0; i < 20; i++) {
            const plusButton = await (0, helper_js_1.waitForAria)('Add pattern');
            await plusButton.click();
            const inputField = await (0, helper_js_1.waitFor)('.blocked-url-edit-value > input');
            await inputField.type(i.toString());
            const addButton = await (0, helper_js_1.waitForAria)('Add');
            await addButton.click();
        }
    });
    it('pattern list inactive when blocking disabled', async () => {
        await disableNetworkRequestBlocking();
        await (0, helper_js_1.waitForAriaNone)('Edit');
        await (0, helper_js_1.waitForAriaNone)('Remove');
        const firstListItem = await (0, helper_js_1.waitFor)('.blocked-url');
        const firstCheckbox = await (0, helper_js_1.waitFor)('.widget > .list > .list-item > .blocked-url > .blocked-url-checkbox');
        (0, chai_2.expect)(await checkboxIsChecked(firstCheckbox)).to.equal(true);
        await firstListItem.click();
        (0, chai_2.expect)(await checkboxIsChecked(firstCheckbox)).to.equal(true);
    });
    it('pattern scrollable when blocking disabled', async () => {
        await disableNetworkRequestBlocking();
        const list = await (0, helper_js_1.waitFor)('.list');
        const listBB = await list.boundingBox();
        if (listBB) {
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            // +20 to move from the top left point so we are definitely scrolling
            // within the container
            await frontend.mouse.move(listBB.x + 20, listBB.y + 20);
            await frontend.mouse.wheel({ deltaY: 450 });
        }
        else {
            chai_1.assert.fail('Could not obtain a bounding box for the pattern list.');
        }
        const lastListItem = await (0, helper_js_1.waitForElementWithTextContent)('19');
        await (0, helper_js_1.waitForFunction)(() => isVisible(lastListItem, list));
    });
});
//# sourceMappingURL=network-request-blocking-panel_test.js.map