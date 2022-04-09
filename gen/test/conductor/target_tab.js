"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetTab = void 0;
const frontend_tab_js_1 = require("./frontend_tab.js");
/**
 * Wrapper class around `puppeteer.Page` that helps with setting up and
 * managing a tab that can be inspected by the DevTools frontend.
 */
class TargetTab {
    page;
    constructor(page) {
        this.page = page;
    }
    static async create(browser) {
        const page = await browser.newPage();
        await (0, frontend_tab_js_1.loadEmptyPageAndWaitForContent)(page);
        return new TargetTab(page);
    }
    async reset() {
        await (0, frontend_tab_js_1.loadEmptyPageAndWaitForContent)(this.page);
    }
    targetId() {
        // TODO(crbug.com/1297458): Replace private property access with public getter once available in puppeteer.
        return this.page.target()._targetId;
    }
}
exports.TargetTab = TargetTab;
//# sourceMappingURL=target_tab.js.map