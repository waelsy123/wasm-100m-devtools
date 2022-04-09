"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
(0, mocha_extensions_js_1.describe)('The Host browser', () => {
    (0, mocha_extensions_js_1.it)('resolves .test domains to localhost and OOPIFs work as intended', async () => {
        await (0, helper_js_1.goToResourceWithCustomHost)('devtools.test', 'host/page-with-oopif.html');
        const { browser } = (0, helper_js_1.getBrowserAndPages)();
        const iframeTarget = browser.targets().find(target => target.type() === 'other' && target.url().startsWith('https://devtools.oopif.test'));
        chai_1.assert.exists(iframeTarget);
    });
});
//# sourceMappingURL=out-of-process_test.js.map