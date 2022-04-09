"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
(0, mocha_extensions_js_1.describe)('Accessibility Pane in the Elements Tab', async function () {
    (0, mocha_extensions_js_1.it)('displays the partial accessibility tree', async () => {
        await (0, helper_js_1.goToResource)('elements/accessibility-simple-page.html');
        await (0, elements_helpers_js_1.toggleAccessibilityPane)();
        void (0, helper_js_1.waitForAria)('Accessibility Tree');
    });
    (0, mocha_extensions_js_1.it)('shows computed name from contents for title element', async () => {
        await (0, helper_js_1.goToResource)('elements/accessibility-simple-page.html');
        await (0, elements_helpers_js_1.toggleAccessibilityPane)();
        const titleElement = await (0, helper_js_1.waitForAria)('<h1>');
        await (0, helper_js_1.click)(titleElement);
        await (0, helper_js_1.waitForAria)('Contents:\xa0"Title"');
    });
    (0, mocha_extensions_js_1.it)('shows name from label for span element', async () => {
        await (0, helper_js_1.goToResource)('elements/accessibility-simple-page.html');
        await (0, elements_helpers_js_1.toggleAccessibilityPane)();
        const a11yPane = await (0, helper_js_1.waitForAria)('Accessibility panel');
        const spanElement = await (0, helper_js_1.waitForElementWithTextContent)('span-name');
        await (0, helper_js_1.click)(spanElement);
        await (0, helper_js_1.waitForAria)('Name:\xa0"span-name"', a11yPane);
    });
});
//# sourceMappingURL=accessibility-pane_test.js.map