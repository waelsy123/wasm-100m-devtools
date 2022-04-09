"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const layers_helpers_js_1 = require("../helpers/layers-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
(0, mocha_extensions_js_1.describe)('The Layers Panel', async () => {
    // See crbug.com/1261763 for details.
    mocha_extensions_js_1.it.skip('[crbug.com/1261763] should keep the currently inspected url as an attribute', async () => {
        const targetUrl = 'layers/default.html';
        await (0, helper_js_1.goToResource)(targetUrl);
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Layers');
        await (0, helper_js_1.waitFor)('[aria-label="layers"]:not([test-current-url=""])');
        // FIXME(crbug/1112692): Refactor test to remove the timeout.
        await (0, helper_js_1.timeout)(50);
        const url = await (0, layers_helpers_js_1.getCurrentUrl)();
        chai_1.assert.strictEqual(url, `${(0, helper_js_1.getResourcesPath)()}/${targetUrl}`);
    });
    // Disabled due to flakiness, original regression: crbug.com/1053901
    mocha_extensions_js_1.it.skip('[crbug.com/1111256] should update the layers view when going offline', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Layers');
        const targetUrl = 'layers/default.html';
        await (0, helper_js_1.goToResource)(targetUrl);
        await (0, helper_js_1.waitFor)('[aria-label="layers"]:not([test-current-url=""])');
        chai_1.assert.strictEqual(await (0, layers_helpers_js_1.getCurrentUrl)(), `${(0, helper_js_1.getResourcesPath)()}/${targetUrl}`);
        const session = await target.target().createCDPSession();
        await session.send('Network.emulateNetworkConditions', {
            offline: true,
            latency: 0,
            downloadThroughput: 0,
            uploadThroughput: 0,
        });
        await target.reload();
        await (0, helper_js_1.waitFor)(`[aria-label="layers"]:not([test-current-url="${targetUrl}"])`);
        chai_1.assert.strictEqual(await (0, layers_helpers_js_1.getCurrentUrl)(), 'chrome-error://chromewebdata/');
    });
});
//# sourceMappingURL=layers_test.js.map