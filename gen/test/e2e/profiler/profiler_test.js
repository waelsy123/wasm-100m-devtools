"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const profiler_helpers_js_1 = require("../helpers/profiler-helpers.js");
(0, mocha_extensions_js_1.describe)('The JavaScript Profiler Panel', async () => {
    (0, mocha_extensions_js_1.it)('Loads content', async () => {
        await (0, profiler_helpers_js_1.navigateToProfilerTab)();
    });
    (0, mocha_extensions_js_1.it)('Can make one profile and display its information', async () => {
        await (0, profiler_helpers_js_1.navigateToProfilerTab)();
        await (0, profiler_helpers_js_1.createAProfile)();
    });
    (0, mocha_extensions_js_1.it)('Can start and stop a recording using keyboard shortcuts', async () => {
        await (0, profiler_helpers_js_1.navigateToProfilerTab)();
        await (0, helper_js_1.waitFor)(profiler_helpers_js_1.START_PROFILING_BUTTON);
        await (0, profiler_helpers_js_1.toggleRecordingWithKeyboad)();
        await (0, helper_js_1.waitFor)(profiler_helpers_js_1.STOP_PROFILING_BUTTON);
        await (0, profiler_helpers_js_1.toggleRecordingWithKeyboad)();
        await (0, helper_js_1.waitFor)(profiler_helpers_js_1.START_PROFILING_BUTTON);
    });
});
//# sourceMappingURL=profiler_test.js.map