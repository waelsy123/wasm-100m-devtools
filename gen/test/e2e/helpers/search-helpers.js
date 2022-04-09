"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerFindDialog = void 0;
const helper_js_1 = require("../../shared/helper.js");
async function triggerFindDialog(frontend) {
    switch (helper_js_1.platform) {
        case 'mac':
            await frontend.keyboard.down('Meta');
            await frontend.keyboard.down('Alt');
            break;
        default:
            await frontend.keyboard.down('Control');
            await frontend.keyboard.down('Shift');
    }
    await frontend.keyboard.press('f');
    switch (helper_js_1.platform) {
        case 'mac':
            await frontend.keyboard.up('Meta');
            await frontend.keyboard.up('Alt');
            break;
        default:
            await frontend.keyboard.up('Control');
            await frontend.keyboard.up('Shift');
    }
}
exports.triggerFindDialog = triggerFindDialog;
//# sourceMappingURL=search-helpers.js.map