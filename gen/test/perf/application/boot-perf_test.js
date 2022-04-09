"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const perf_hooks_1 = require("perf_hooks");
const helper_js_1 = require("../../shared/helper.js");
const perf_helper_js_1 = require("../helpers/perf-helper.js");
const RUNS = 37;
describe('Boot performance', () => {
    const times = {
        bootperf: [],
        mean: 0,
        percentile50: 0,
        percentile90: 0,
        percentile99: 0,
    };
    after(async () => {
        /* eslint-disable no-console */
        const values = times.bootperf;
        times.mean = Number((0, perf_helper_js_1.mean)(values).toFixed(2));
        times.percentile50 = Number((0, perf_helper_js_1.percentile)(values, 0.5).toFixed(2));
        times.percentile90 = Number((0, perf_helper_js_1.percentile)(values, 0.9).toFixed(2));
        times.percentile99 = Number((0, perf_helper_js_1.percentile)(values, 0.99).toFixed(2));
        await (0, perf_helper_js_1.storeGeneratedResults)('devtools-perf.json', JSON.stringify(times));
        console.log(`Mean boot time: ${times.mean}ms`);
        console.log(`50th percentile boot time: ${times.percentile50}ms`);
        console.log(`90th percentile boot time: ${times.percentile90}ms`);
        console.log(`99th percentile boot time: ${times.percentile99}ms`);
        /* eslint-enable no-console */
    });
    for (let run = 1; run <= RUNS; run++) {
        it(`run ${run}/${RUNS}`, async () => {
            const start = perf_hooks_1.performance.now();
            await (0, helper_js_1.reloadDevTools)();
            // Ensure only 2 decimal places.
            const timeTaken = (perf_hooks_1.performance.now() - start).toFixed(2);
            times.bootperf.push(Number(timeTaken));
        });
    }
});
//# sourceMappingURL=boot-perf_test.js.map