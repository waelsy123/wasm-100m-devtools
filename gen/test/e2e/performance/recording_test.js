"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const performance_helpers_js_1 = require("../helpers/performance-helpers.js");
(0, mocha_extensions_js_1.describe)('The Performance panel', () => {
    (0, mocha_extensions_js_1.it)('can start and stop a new recording', async () => {
        await (0, performance_helpers_js_1.navigateToPerformanceTab)('empty');
        await (0, performance_helpers_js_1.startRecording)();
        await (0, performance_helpers_js_1.stopRecording)();
        // Check that the recording shows the pie chart with a non 0 total time.
        const totalTime = await (0, performance_helpers_js_1.getTotalTimeFromSummary)();
        chai_1.assert.isAbove(totalTime, 0, 'The recording was created successfully');
    });
});
//# sourceMappingURL=recording_test.js.map