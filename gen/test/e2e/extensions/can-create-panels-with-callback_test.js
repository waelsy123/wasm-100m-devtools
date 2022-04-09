"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const extension_helpers_js_1 = require("../helpers/extension-helpers.js");
describe('The Extension API', async () => {
    it('can create panels with callbacks', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        const callbackArgs = await extension.evaluate(() => new Promise(r => window.chrome.devtools.panels.create('title', '', '', (...args) => r(JSON.stringify(args)))));
        chai_1.assert.deepEqual(callbackArgs, '[{"onShown":{},"onHidden":{},"onSearch":{}}]');
    });
});
//# sourceMappingURL=can-create-panels-with-callback_test.js.map