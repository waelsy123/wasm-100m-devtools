"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const security_helpers_js_1 = require("../helpers/security-helpers.js");
(0, mocha_extensions_js_1.describe)('The Security Panel', async () => {
    (0, mocha_extensions_js_1.it)('is open by default when devtools initializes', async () => {
        await (0, security_helpers_js_1.navigateToSecurityTab)();
    });
    (0, mocha_extensions_js_1.it)('closes without crashing and stays closed after reloading tools', async () => {
        await (0, security_helpers_js_1.closeSecurityTab)();
        await (0, helper_js_1.reloadDevTools)();
        await (0, security_helpers_js_1.securityTabDoesNotExist)();
    });
    (0, mocha_extensions_js_1.it)('appears under More tools after being closed', async () => {
        await (0, security_helpers_js_1.closeSecurityTab)();
        await (0, security_helpers_js_1.openSecurityPanelFromMoreTools)();
        await (0, helper_js_1.reloadDevTools)({ selectedPanel: { name: 'security' } });
        await (0, security_helpers_js_1.securityTabExists)();
    });
    // Test flaky on Windows
    mocha_extensions_js_1.it.skipOnPlatforms(['win32'], '[crbug.com/1183304]: can be opened from command menu after being closed', async () => {
        await (0, security_helpers_js_1.closeSecurityTab)();
        await (0, security_helpers_js_1.openSecurityPanelFromCommandMenu)();
    });
    (0, mocha_extensions_js_1.it)('opens if the query param "panel" is set', async () => {
        await (0, security_helpers_js_1.closeSecurityTab)();
        await (0, helper_js_1.reloadDevTools)({ queryParams: { panel: 'security' } });
        await (0, security_helpers_js_1.securityTabExists)();
        await (0, security_helpers_js_1.securityPanelContentIsLoaded)();
    });
});
//# sourceMappingURL=security_test.js.map