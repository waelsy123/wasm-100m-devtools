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
    (0, mocha_extensions_js_1.it)('can show JavaScript files after dynamic loading', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openFileInSourcesPanel)('dynamic-loading-javascript.html');
        await (0, sources_helpers_js_1.listenForSourceFilesAdded)(frontend);
        // Load the JavaScript files by executing the function in `dynamic-loading.html`
        await target.evaluate('go();');
        await (0, sources_helpers_js_1.waitForAdditionalSourceFiles)(frontend);
        const capturedFileNames = await (0, sources_helpers_js_1.retrieveSourceFilesAdded)(frontend);
        chai_1.assert.deepEqual(capturedFileNames, [
            '/test/e2e/resources/sources/minified-sourcecode.js',
            '/test/e2e/resources/sources/evalSourceURL.js',
        ]);
    });
    (0, mocha_extensions_js_1.it)('can show CSS files after dynamic loading', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openFileInSourcesPanel)('dynamic-loading-css.html');
        await (0, sources_helpers_js_1.listenForSourceFilesAdded)(frontend);
        // Load the CSS file by executing the function in `dynamic-loading-css.html`
        await target.evaluate('go();');
        // We must focus the target page, as Chrome does not actually fetch the
        // css file if the tab is not focused
        await target.bringToFront();
        await frontend.bringToFront();
        await (0, sources_helpers_js_1.waitForAdditionalSourceFiles)(frontend);
        const capturedFileNames = await (0, sources_helpers_js_1.retrieveSourceFilesAdded)(frontend);
        chai_1.assert.deepEqual(capturedFileNames, [
            '/test/e2e/resources/sources/dynamic.css',
        ]);
    });
});
//# sourceMappingURL=can-show-files-after-loading_test.js.map