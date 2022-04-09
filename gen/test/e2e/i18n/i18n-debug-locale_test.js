"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const coverage_helpers_js_1 = require("../helpers/coverage-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('With en-US locale (default)', () => {
    (0, mocha_extensions_js_1.it)('check that the reload button has the correct text', async () => {
        await (0, coverage_helpers_js_1.waitForTheCoveragePanelToLoad)();
        const message = await (0, coverage_helpers_js_1.getMessageContents)();
        chai_1.assert.include(message, 'Click the reload button');
    });
});
(0, mocha_extensions_js_1.describe)('With en-XL locale (debug)', () => {
    (0, mocha_extensions_js_1.it)('renders the translated text for the reload button', async () => {
        await (0, helper_js_1.setDevToolsSettings)({ language: 'en-XL' });
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Ĉóv̂ér̂áĝé', true);
        await (0, helper_js_1.waitFor)('div[aria-label="Ĉóv̂ér̂áĝé p̂án̂él̂"]');
        await (0, helper_js_1.waitFor)('.coverage-results .landing-page');
        const message = await (0, coverage_helpers_js_1.getMessageContents)();
        chai_1.assert.include(message, 'Ĉĺîćk̂ t́ĥé r̂él̂óâd́ b̂út̂t́ôń');
    });
});
//# sourceMappingURL=i18n-debug-locale_test.js.map