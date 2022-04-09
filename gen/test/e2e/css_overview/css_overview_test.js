"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const css_overview_helpers_js_1 = require("../helpers/css-overview-helpers.js");
const CONTRAST_BUTTON_SELECTOR = '[data-type="contrast"]';
const CONTRAST_ISSUE_IN_GRID_SELECTOR = '.contrast-container-in-grid';
(0, mocha_extensions_js_1.describe)('CSS Overview experiment', async () => {
    (0, mocha_extensions_js_1.it)('can display low contrast issues', async () => {
        await (0, helper_js_1.goToResource)('elements/low-contrast.html');
        await (0, css_overview_helpers_js_1.navigateToCssOverviewTab)();
        await (0, css_overview_helpers_js_1.startCaptureCSSOverview)();
        await (0, helper_js_1.waitFor)(CONTRAST_BUTTON_SELECTOR);
        const contrastButtons = await (0, helper_js_1.$$)(CONTRAST_BUTTON_SELECTOR);
        chai_1.assert.strictEqual(2, contrastButtons.length, 'Wrong number of contrast issues found in CSS Overview');
        const firstIssue = contrastButtons[0];
        await firstIssue.click();
        const gridContainer = await (0, helper_js_1.waitFor)(CONTRAST_ISSUE_IN_GRID_SELECTOR);
        const text = await gridContainer.evaluate(el => el.innerText);
        chai_1.assert.strictEqual(text.replace(/\n/gmi, ' '), 'Aa 1 AA AAA');
    });
});
//# sourceMappingURL=css_overview_test.js.map