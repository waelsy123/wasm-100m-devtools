"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
let WORKER1_SELECTORS;
let WORKER2_SELECTORS;
function createSelectorsForFile(fileName) {
    return (0, sources_helpers_js_1.createSelectorsForWorkerFile)(fileName, 'test/e2e/resources/sources', fileName);
}
async function openNestedWorkerFile(selectors) {
    const workerFile = await (0, sources_helpers_js_1.expandFileTree)(selectors);
    return workerFile.evaluate(node => node.textContent);
}
(0, mocha_extensions_js_1.describe)('The Sources Tab', async function () {
    // The tests in this suite are particularly slow, as they perform a lot of actions
    this.timeout(10000);
    before(() => {
        WORKER1_SELECTORS = createSelectorsForFile('worker1.js');
        WORKER2_SELECTORS = createSelectorsForFile('worker2.js');
    });
    (0, mocha_extensions_js_1.it)('can show multiple dedicated workers with different scripts', async () => {
        // Have the target load the page.
        await (0, helper_js_1.goToResource)('sources/different-workers.html');
        // Locate the button for switching to the sources tab.
        await (0, helper_js_1.click)('#tab-sources');
        // Wait for the navigation panel to show up
        await (0, helper_js_1.waitFor)('.navigator-file-tree-item');
        const worker1FileName = await openNestedWorkerFile(WORKER1_SELECTORS);
        chai_1.assert.strictEqual(worker1FileName, 'worker1.js');
        const worker2FileName = await openNestedWorkerFile(WORKER2_SELECTORS);
        chai_1.assert.strictEqual(worker2FileName, 'worker2.js');
    });
});
//# sourceMappingURL=can-show-multiple-workers_test.js.map