"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('The Elements panel', async () => {
    (0, mocha_extensions_js_1.it)('has a context menu item to enter Isolation Mode', async () => {
        await (0, helper_js_1.goToResource)('elements/css-container-queries.html');
        await (0, sources_helpers_js_1.clickOnContextMenu)('[aria-label="</body>"]', 'Enter Isolation Mode');
        await (0, sources_helpers_js_1.clickOnContextMenu)('[aria-label="</body>"]', 'Exit Isolation Mode');
    });
});
//# sourceMappingURL=isolation-mode_test.js.map