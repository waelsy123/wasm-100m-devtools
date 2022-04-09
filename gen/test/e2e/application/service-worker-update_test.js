"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const application_helpers_js_1 = require("../helpers/application-helpers.js");
const TEST_HTML_FILE = 'service-worker-network';
const SERVICE_WORKER_UPDATE_TIMELINE_SELECTOR = '.service-worker-update-timing-table';
(0, mocha_extensions_js_1.describe)('The Application Tab', async function () {
    (0, mocha_extensions_js_1.beforeEach)(async function () {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, TEST_HTML_FILE);
        await (0, application_helpers_js_1.navigateToServiceWorkers)();
    });
    (0, mocha_extensions_js_1.it)('Navigate to a page with service worker we should find service worker update timeline info', async () => {
        await (0, helper_js_1.step)('wait and locate service worker update time line', async () => {
            const timeline = await (0, helper_js_1.waitFor)(SERVICE_WORKER_UPDATE_TIMELINE_SELECTOR);
            chai_1.assert.isDefined(timeline);
        });
    });
});
//# sourceMappingURL=service-worker-update_test.js.map