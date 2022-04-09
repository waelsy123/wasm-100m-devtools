"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const quick_open_helpers_js_1 = require("../helpers/quick_open-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_1.describe)('Snippets subpane', () => {
    async function runTest(name) {
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, sources_helpers_js_1.openSnippetsSubPane)();
        await (0, sources_helpers_js_1.createNewSnippet)(name);
        // Title matches
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getOpenSources)(), [name]);
        await (0, quick_open_helpers_js_1.openCommandMenu)();
        await (0, quick_open_helpers_js_1.showSnippetsAutocompletion)();
        // Available in autocompletion
        chai_1.assert.deepEqual(await (0, quick_open_helpers_js_1.getAvailableSnippets)(), [
            name + '\u200B',
        ]);
    }
    (0, mocha_1.it)('can create snippet with simple name', async () => {
        await runTest('MySnippet');
    });
    (0, mocha_1.it)('can create snippet with name like default name', async () => {
        await runTest('My Snippet #555');
    });
    (0, mocha_1.it)('can create snippet with name with slash', async () => {
        await runTest('My Group #1/Snip #1');
    });
    (0, mocha_1.it)('can create snippet with name with backslash', async () => {
        await runTest('My Group #1\Snip #1');
    });
});
//# sourceMappingURL=name_test.js.map