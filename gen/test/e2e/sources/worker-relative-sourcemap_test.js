"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
let WORKER_SELECTORS;
function createSelectorsForEvalWorker(fileName) {
    const EVAL_WORKER_NAME = '#1';
    return (0, sources_helpers_js_1.createSelectorsForWorkerFile)(EVAL_WORKER_NAME, 'test/e2e/resources/sources', fileName);
}
async function openNestedWorkerFile(selectors) {
    const workerFile = await (0, sources_helpers_js_1.expandFileTree)(selectors);
    return workerFile.evaluate(node => node.textContent);
}
(0, mocha_extensions_js_1.describe)('The Sources Tab', async function () {
    // The tests in this suite are particularly slow, as they perform a lot of actions
    this.timeout(10000);
    before(() => {
        WORKER_SELECTORS = createSelectorsForEvalWorker('worker-relative-sourcemap.ts');
    });
    (0, mocha_extensions_js_1.it)('shows sources from worker\'s source maps', async () => {
        // Have the target load the page.
        await (0, helper_js_1.goToResource)('sources/worker-relative-sourcemap.html');
        // Locate the button for switching to the sources tab.
        await (0, helper_js_1.click)('#tab-sources');
        // Wait for the navigation panel to show up
        await (0, helper_js_1.waitFor)('.navigator-file-tree-item');
        // Check that we can expand the file tree up to the file name node.
        const worker1FileName = await openNestedWorkerFile(WORKER_SELECTORS);
        chai_1.assert.strictEqual(worker1FileName, 'worker-relative-sourcemap.ts');
    });
});
//# sourceMappingURL=worker-relative-sourcemap_test.js.map