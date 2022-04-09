"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const style_property_editor_helpers_js_1 = require("../helpers/style-property-editor-helpers.js");
(0, mocha_extensions_js_1.describe)('Grid Editor', async function () {
    beforeEach(async function () {
        await (0, helper_js_1.goToResource)('elements/grid-editor.html');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        await (0, elements_helpers_js_1.focusElementsTree)();
        await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#target', 'display', 'grid');
    });
    (0, mocha_extensions_js_1.it)('can be opened and grid styles can be edited', async () => {
        await (0, style_property_editor_helpers_js_1.clickStylePropertyEditorButton)('Open grid editor', 'devtools-grid-editor');
        // Clicking once sets the value.
        await (0, style_property_editor_helpers_js_1.clickPropertyButton)('[title="Add align-items: start"]');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#target', 'align-items', 'start');
        // Clicking again removes the value.
        await (0, style_property_editor_helpers_js_1.clickPropertyButton)('[title="Remove align-items: start"]');
        // Wait for the button's title to be updated so that we know the change
        // was made.
        await (0, helper_js_1.waitFor)('[title="Add align-items: start"]');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#target', 'align-items');
        chai_1.assert.isUndefined(property);
    });
});
//# sourceMappingURL=grid-editor_test.js.map