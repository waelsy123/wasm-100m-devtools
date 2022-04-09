"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_1 = require("mocha");
const helper_js_1 = require("../../shared/helper.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_1.describe)('Snippets subpane', () => {
    (0, mocha_1.it)('can stop on breakpoints', async () => {
        const snippetName = 'Script snippet #7';
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, sources_helpers_js_1.openSnippetsSubPane)();
        await (0, sources_helpers_js_1.createNewSnippet)(snippetName, 'console.log(1);\nconsole.log(2);\nconsole.log(3);\n');
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getOpenSources)(), [snippetName]);
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 2);
        let decorators = await (0, sources_helpers_js_1.getBreakpointDecorators)();
        chai_1.assert.deepEqual(decorators, [2]);
        await (0, helper_js_1.click)('[aria-label="Run snippet"]');
        // We stop on the breakpoint
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        await (0, sources_helpers_js_1.executionLineHighlighted)();
        // The breakpoint is still visible
        decorators = await (0, sources_helpers_js_1.getBreakpointDecorators)();
        chai_1.assert.deepEqual(decorators, [2]);
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getOpenSources)(), [snippetName]);
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.PAUSE_BUTTON);
    });
});
//# sourceMappingURL=breakpoint_test.js.map