"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('The Sources Tab', async () => {
    (0, mocha_extensions_js_1.describe)('Navigation', () => {
        (0, mocha_extensions_js_1.it)('should show a "search in folder" option in the context menu of folders', async () => {
            await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('index.html', 'navigation/index.html');
            await (0, sources_helpers_js_1.clickOnContextMenu)('[aria-label="test/e2e/resources/sources/navigation, nw-folder"]', 'Search in folder');
            const element = await (0, helper_js_1.waitFor)('[aria-label="Search Query"]');
            const value = await element.evaluate(input => input.value);
            chai_1.assert.strictEqual(value, 'file:test/e2e/resources/sources/navigation');
        });
    });
});
//# sourceMappingURL=navigation_test.js.map