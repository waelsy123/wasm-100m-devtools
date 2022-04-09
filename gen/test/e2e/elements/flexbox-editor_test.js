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
(0, mocha_extensions_js_1.describe)('Flexbox Editor', async function () {
    beforeEach(async function () {
        await (0, helper_js_1.goToResource)('elements/flexbox-editor.html');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        await (0, elements_helpers_js_1.focusElementsTree)();
        await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#target', 'display', 'flex');
    });
    (0, mocha_extensions_js_1.it)('can be opened and flexbox styles can be edited', async () => {
        await (0, style_property_editor_helpers_js_1.clickStylePropertyEditorButton)('Open flexbox editor', 'devtools-flexbox-editor');
        // Clicking once sets the value.
        await (0, style_property_editor_helpers_js_1.clickPropertyButton)('[title="Add flex-direction: column"]');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#target', 'flex-direction', 'column');
        // Clicking again removes the value.
        await (0, style_property_editor_helpers_js_1.clickPropertyButton)('[title="Remove flex-direction: column"]');
        // Wait for the button's title to be updated so that we know the change
        // was made.
        await (0, helper_js_1.waitFor)('[title="Add flex-direction: column"]');
        const property = await (0, elements_helpers_js_1.getCSSPropertyInRule)('#target', 'flex-direction');
        chai_1.assert.isUndefined(property);
    });
    (0, mocha_extensions_js_1.it)('can be opened for flexbox styles with !important', async () => {
        await (0, elements_helpers_js_1.editCSSProperty)('#target', 'display', 'flex !important');
        await (0, elements_helpers_js_1.waitForCSSPropertyValue)('#target', 'display', 'flex !important');
        await (0, style_property_editor_helpers_js_1.clickStylePropertyEditorButton)('Open flexbox editor', 'devtools-flexbox-editor');
    });
});
//# sourceMappingURL=flexbox-editor_test.js.map