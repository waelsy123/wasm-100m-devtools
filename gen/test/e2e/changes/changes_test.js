"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const changes_helpers_js_1 = require("../helpers/changes-helpers.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
(0, mocha_extensions_js_1.describe)('The Changes Panel', async () => {
    // Flaky test causing build failures
    mocha_extensions_js_1.it.skip('[crbug.com/1147806]: Shows changes made in the Styles pane', async () => {
        const TEST_PAGE = 'styled-page';
        await (0, changes_helpers_js_1.openChangesPanelAndNavigateTo)(TEST_PAGE);
        let changes = await (0, changes_helpers_js_1.getChangesList)();
        chai_1.assert.strictEqual(changes.length, 0, 'There should be no changes by default');
        await (0, elements_helpers_js_1.editCSSProperty)('html, body', 'background', 'red');
        await (0, changes_helpers_js_1.waitForNewChanges)(changes);
        changes = await (0, changes_helpers_js_1.getChangesList)();
        chai_1.assert.strictEqual(changes.length, 1, 'There should now be 1 change in the list');
        chai_1.assert.strictEqual(changes[0], `${TEST_PAGE}.html`);
    });
});
//# sourceMappingURL=changes_test.js.map