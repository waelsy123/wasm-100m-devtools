"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const path_1 = require("path");
const helper_js_1 = require("../../shared/helper.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_1.describe)('Sources Tab', async () => {
    async function runTest(filename, functionName) {
        const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openFileInEditor)(filename);
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 2);
        const scriptEvaluation = target.evaluate(functionName + '();');
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        // Breakpoint is still visible
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getBreakpointDecorators)(), [2]);
        await (0, sources_helpers_js_1.executionLineHighlighted)();
        // Title of tab matches filename
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getOpenSources)(), [filename]);
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await scriptEvaluation;
    }
    async function loadFromFilePath() {
        const fileUrl = 'file://' + (0, path_1.resolve)(__dirname, '..', 'resources', 'sources', 'filesystem', 'special-characters.html');
        await (0, helper_js_1.goTo)(fileUrl);
        await (0, sources_helpers_js_1.openSourcesPanel)();
    }
    (0, mocha_1.it)('can handle filename with space loading over the network', async () => {
        await (0, sources_helpers_js_1.openFileInSourcesPanel)('filesystem/special-characters.html');
        await runTest('with space.js', 'f1');
    });
    (0, mocha_1.it)('can handle filename with escape sequence loading over the network', async () => {
        await (0, sources_helpers_js_1.openFileInSourcesPanel)('filesystem/special-characters.html');
        await runTest('with%20space.js', 'f2');
    });
    (0, mocha_1.it)('can handle filename with space loading from local file', async () => {
        await loadFromFilePath();
        await runTest('with space.js', 'f1');
    });
    (0, mocha_1.it)('can handle filename with escape sequence loading from local file', async () => {
        await loadFromFilePath();
        await runTest('with%20space.js', 'f2');
    });
});
//# sourceMappingURL=can-handle-special-characters_test.js.map