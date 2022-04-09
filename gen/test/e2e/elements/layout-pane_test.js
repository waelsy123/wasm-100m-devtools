"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('Layout Pane in the Elements Tab', async function () {
    (0, mocha_extensions_js_1.it)('displays Layout pane', async () => {
        await (0, helper_js_1.goToResource)('elements/css-grid.html');
        await (0, helper_js_1.step)('Prepare elements tab', async () => {
            await (0, elements_helpers_js_1.waitForElementsStyleSection)();
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
            await (0, elements_helpers_js_1.expandSelectedNodeRecursively)();
        });
        await (0, elements_helpers_js_1.waitForAdorners)([
            { textContent: 'grid', isActive: false },
        ]);
        await (0, elements_helpers_js_1.openLayoutPane)();
        await (0, elements_helpers_js_1.toggleElementCheckboxInLayoutPane)();
        await (0, elements_helpers_js_1.waitForAdorners)([
            { textContent: 'grid', isActive: true },
        ]);
    });
    (0, mocha_extensions_js_1.it)('Lists grids in UA shadow DOM only when needed', async () => {
        await (0, helper_js_1.goToResource)('elements/css-grid-ua-shadow.html');
        await (0, elements_helpers_js_1.openLayoutPane)();
        const grids = await (0, elements_helpers_js_1.getGridsInLayoutPane)();
        chai_1.assert.strictEqual(grids.length, 1, 'Without UA shadow DOM, there is only one grid');
        await (0, settings_helpers_js_1.togglePreferenceInSettingsTab)('Show user agent shadow DOM');
        // We only wait for at least 2 grids, the <video> element may generate more grids, but we're not interested
        // in testing how many exactly.
        await (0, elements_helpers_js_1.waitForSomeGridsInLayoutPane)(2);
    });
});
//# sourceMappingURL=layout-pane_test.js.map