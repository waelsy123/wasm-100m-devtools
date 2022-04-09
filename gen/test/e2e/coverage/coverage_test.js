"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const coverage_helpers_js_1 = require("../helpers/coverage-helpers.js");
(0, mocha_extensions_js_1.describe)('The Coverage Panel', async () => {
    (0, mocha_extensions_js_1.it)('Loads correctly', async () => {
        await (0, coverage_helpers_js_1.waitForTheCoveragePanelToLoad)();
    });
    (0, mocha_extensions_js_1.it)('Can start and stop instrumenting coverage', async () => {
        await (0, coverage_helpers_js_1.waitForTheCoveragePanelToLoad)();
        await (0, coverage_helpers_js_1.navigateToCoverageTestSite)();
        await (0, coverage_helpers_js_1.startInstrumentingCoverage)();
        await (0, coverage_helpers_js_1.stopInstrumentingCoverage)();
        await (0, coverage_helpers_js_1.clearCoverageContent)();
    });
});
//# sourceMappingURL=coverage_test.js.map