"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const animations_helpers_js_1 = require("../helpers/animations-helpers.js");
(0, mocha_extensions_js_1.describe)('The Animations Panel', async () => {
    // Inconsistent behavior on Animations panel causes tets to be flaky
    mocha_extensions_js_1.it.skip('[crbug.com/1085569] Listens for animation in webpage', async () => {
        await (0, animations_helpers_js_1.waitForAnimationsPanelToLoad)();
        await (0, animations_helpers_js_1.navigateToSiteWithAnimation)();
        await (0, animations_helpers_js_1.waitForAnimationContent)();
    });
});
//# sourceMappingURL=animations_test.js.map