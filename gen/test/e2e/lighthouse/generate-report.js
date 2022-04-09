"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const lighthouse_helpers_js_1 = require("../helpers/lighthouse-helpers.js");
(0, mocha_extensions_js_1.describe)('The Lighthouse Tab', async () => {
    (0, mocha_extensions_js_1.it)('shows a button to generate a new report', async () => {
        await (0, lighthouse_helpers_js_1.navigateToLighthouseTab)('empty.html');
        const disabled = await (0, lighthouse_helpers_js_1.isGenerateReportButtonDisabled)();
        chai_1.assert.isFalse(disabled, 'The Generate Report button should not be disabled');
    });
    // Broken on non-debug runs
    mocha_extensions_js_1.it.skip('[crbug.com/1057948] shows generate report button even when navigating to an unreachable page', async () => {
        await (0, lighthouse_helpers_js_1.navigateToLighthouseTab)('empty.html');
        await (0, helper_js_1.goToResource)('network/unreachable.rawresponse');
        const disabled = await (0, lighthouse_helpers_js_1.isGenerateReportButtonDisabled)();
        chai_1.assert.isTrue(disabled, 'The Generate Report button should be disabled');
    });
});
//# sourceMappingURL=generate-report.js.map