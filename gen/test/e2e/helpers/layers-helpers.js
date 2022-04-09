"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUrl = exports.LAYERS_TAB_SELECTOR = void 0;
const helper_js_1 = require("../../shared/helper.js");
exports.LAYERS_TAB_SELECTOR = '#tab-layers';
async function getCurrentUrl() {
    await (0, helper_js_1.waitFor)('[aria-label="layers"]');
    const element = await (0, helper_js_1.waitFor)('[aria-label="layers"]');
    return element.evaluate(e => e.getAttribute('test-current-url'));
}
exports.getCurrentUrl = getCurrentUrl;
//# sourceMappingURL=layers-helpers.js.map