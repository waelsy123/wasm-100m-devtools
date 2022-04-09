"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.preloadForCodeCoverage = exports.loadComponentDocExample = void 0;
const helper_js_1 = require("../../shared/helper.js");
const fontsByPlatform = {
    'mac': 'Helvetica Neue',
    'win32': 'Tahoma',
    'linux': '"Liberation Sans"',
};
const loadComponentDocExample = async (urlComponent) => {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const url = new URL(`http://localhost:${(0, helper_js_1.getTestServerPort)()}/front_end/ui/components/docs/${urlComponent}`);
    url.searchParams.set('fontFamily', fontsByPlatform[helper_js_1.platform]);
    await frontend.goto(url.toString(), {
        waitUntil: 'networkidle0',
    });
};
exports.loadComponentDocExample = loadComponentDocExample;
const SHOULD_GATHER_COVERAGE_INFORMATION = process.env.COVERAGE === '1';
const preloadForCodeCoverage = (name) => {
    if (!SHOULD_GATHER_COVERAGE_INFORMATION) {
        return;
    }
    before(async function () {
        this.timeout(0);
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.setExtraHTTPHeaders({
            'devtools-compute-coverage': '1',
        });
        await (0, exports.loadComponentDocExample)(name);
        await frontend.setExtraHTTPHeaders({});
    });
};
exports.preloadForCodeCoverage = preloadForCodeCoverage;
//# sourceMappingURL=shared.js.map