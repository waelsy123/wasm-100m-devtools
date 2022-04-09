"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
const PATTERN_ADD_BUTTON = 'button[aria-label="Add filename pattern"]';
const PATTERN_INPUT_FIELD = 'input[aria-label="Pattern"]';
const CLOSE_BUTTON = '.close-button[aria-label="Close"]';
(0, mocha_extensions_js_1.describe)('SourceMap handling', async () => {
    (0, mocha_extensions_js_1.it)('can deal with a source map that has no mappings', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, settings_helpers_js_1.openSettingsTab)('Ignore List');
        await (0, helper_js_1.click)(PATTERN_ADD_BUTTON);
        await (0, helper_js_1.waitFor)(PATTERN_INPUT_FIELD);
        await (0, helper_js_1.click)(PATTERN_INPUT_FIELD);
        await frontend.keyboard.type('cljs/user.cljs');
        await frontend.keyboard.press('Enter');
        await (0, helper_js_1.click)(CLOSE_BUTTON);
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('script-with-sourcemap-without-mappings.js', 'script-with-sourcemap-without-mappings.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 1);
    });
});
//# sourceMappingURL=sourcemap-without-mappings_test.js.map