"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const quick_open_helpers_js_1 = require("../helpers/quick_open-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
async function openAFileWithQuickMenu() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, sources_helpers_js_1.listenForSourceFilesLoaded)(frontend);
    await (0, helper_js_1.step)('navigate to elements tab', async () => {
        await (0, elements_helpers_js_1.navigateToElementsTab)();
    });
    await (0, helper_js_1.step)('open quick open menu and select the first option', async () => {
        await (0, helper_js_1.goToResource)('pages/hello-world.html');
        await (0, quick_open_helpers_js_1.openFileQuickOpen)();
        const firstItem = await (0, quick_open_helpers_js_1.getMenuItemAtPosition)(0);
        await (0, helper_js_1.click)(firstItem);
    });
    await (0, helper_js_1.step)('check the sources panel is open with the selected file', async () => {
        await (0, helper_js_1.waitFor)('.navigator-file-tree-item');
        await (0, sources_helpers_js_1.waitForSourceLoadedEvent)(frontend, 'hello-world.html');
    });
}
(0, mocha_extensions_js_1.describe)('Quick Open menu', () => {
    (0, mocha_extensions_js_1.it)('lists available files', async () => {
        await (0, helper_js_1.goToResource)('pages/hello-world.html');
        await (0, quick_open_helpers_js_1.openFileQuickOpen)();
        const firstItemTitle = await (0, quick_open_helpers_js_1.getMenuItemTitleAtPosition)(0);
        chai_1.assert.strictEqual(firstItemTitle, 'hello-world.html');
    });
    (0, mocha_extensions_js_1.it)('opens the sources panel when a file is selected', async () => {
        await openAFileWithQuickMenu();
        await (0, settings_helpers_js_1.togglePreferenceInSettingsTab)('Focus Sources panel when triggering a breakpoint');
        await openAFileWithQuickMenu();
    });
});
//# sourceMappingURL=QuickOpen_test.js.map