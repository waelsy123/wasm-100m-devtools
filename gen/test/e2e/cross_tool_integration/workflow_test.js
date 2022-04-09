"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const cross_tool_helper_js_1 = require("../helpers/cross-tool-helper.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const layers_helpers_js_1 = require("../helpers/layers-helpers.js");
const memory_helpers_js_1 = require("../helpers/memory-helpers.js");
const performance_helpers_js_1 = require("../helpers/performance-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('A user can navigate across', async function () {
    // These tests move between panels, which takes time.
    this.timeout(10000);
    beforeEach(async function () {
        await (0, cross_tool_helper_js_1.prepareForCrossToolScenario)();
    });
    (0, mocha_extensions_js_1.it)('Console -> Sources', async () => {
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.waitForConsoleMessageAndClickOnLink)();
        await (0, helper_js_1.waitFor)('.panel[aria-label="sources"]');
    });
    (0, mocha_extensions_js_1.it)('Console -> Issues', async () => {
        await (0, console_helpers_js_1.navigateToConsoleTab)();
        await (0, console_helpers_js_1.navigateToIssuesPanelViaInfoBar)();
        // Expand the first issue
        await (0, helper_js_1.click)('li.issue.parent');
        // Expand the affected resources
        await (0, helper_js_1.click)('li.parent', { root: await (0, helper_js_1.waitFor)('ol.affected-resources') });
    });
    (0, mocha_extensions_js_1.it)('Elements -> Sources', async () => {
        await (0, elements_helpers_js_1.navigateToElementsTab)();
        await (0, elements_helpers_js_1.clickOnFirstLinkInStylesPanel)();
        await (0, helper_js_1.waitFor)('.panel[aria-label="sources"]');
    });
    // Flakes in multiple ways, with timeouts or assertion failures
    mocha_extensions_js_1.it.skip('[crbug.com/1100337]: Performance -> Sources', async () => {
        await (0, performance_helpers_js_1.navigateToPerformanceTab)();
        await (0, performance_helpers_js_1.startRecording)();
        await (0, performance_helpers_js_1.stopRecording)();
        await (0, performance_helpers_js_1.navigateToPerformanceSidebarTab)('Bottom-Up');
        await (0, performance_helpers_js_1.waitForSourceLinkAndFollowIt)();
    });
});
(0, mocha_extensions_js_1.describe)('A user can move tabs', async function () {
    this.timeout(10000);
    (0, mocha_extensions_js_1.it)('Move Memory to drawer', async () => {
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, cross_tool_helper_js_1.tabExistsInMainPanel)(memory_helpers_js_1.MEMORY_TAB_ID);
        await (0, cross_tool_helper_js_1.clickOnContextMenuItemFromTab)(memory_helpers_js_1.MEMORY_TAB_ID, cross_tool_helper_js_1.MOVE_TO_DRAWER_SELECTOR);
        await (0, cross_tool_helper_js_1.tabExistsInDrawer)(memory_helpers_js_1.MEMORY_TAB_ID);
    });
    (0, mocha_extensions_js_1.it)('Move Animations to main panel', async () => {
        const ANIMATIONS_TAB_ID = '#tab-animations';
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Animations');
        await (0, cross_tool_helper_js_1.tabExistsInDrawer)(ANIMATIONS_TAB_ID);
        await (0, cross_tool_helper_js_1.clickOnContextMenuItemFromTab)(ANIMATIONS_TAB_ID, cross_tool_helper_js_1.MOVE_TO_MAIN_PANEL_SELECTOR);
        await (0, cross_tool_helper_js_1.tabExistsInMainPanel)(ANIMATIONS_TAB_ID);
    });
});
(0, mocha_extensions_js_1.describe)('A user can open panels via the "panel" query param', async function () {
    (0, mocha_extensions_js_1.it)('Layers is shown', async () => {
        await (0, helper_js_1.reloadDevTools)({ queryParams: { panel: 'layers' } });
        await (0, cross_tool_helper_js_1.tabExistsInMainPanel)(layers_helpers_js_1.LAYERS_TAB_SELECTOR);
    });
});
//# sourceMappingURL=workflow_test.js.map