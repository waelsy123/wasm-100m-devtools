"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const Mocha = require("mocha");
const ResultsDb = require("./resultsdb.js");
const { EVENT_RUN_END, EVENT_TEST_FAIL, EVENT_TEST_PASS, EVENT_TEST_PENDING, } = Mocha.Runner.constants;
class ResultsDbReporter extends Mocha.reporters.Spec {
    suitePrefix;
    constructor(runner, options) {
        super(runner, options);
        // `reportOptions` doesn't work with .mocharc.js (configurig via exports).
        // BUT, every module.exports is forwarded onto the options object.
        this.suitePrefix = options?.suiteName;
        runner.on(EVENT_TEST_PASS, this.onTestPass.bind(this));
        runner.on(EVENT_TEST_FAIL, this.onTestFail.bind(this));
        runner.on(EVENT_TEST_PENDING, this.onTestSkip.bind(this));
        runner.on(EVENT_RUN_END, this.onceEventRunEnds.bind(this));
    }
    onTestPass(test) {
        const testResult = this.buildDefaultTestResultFrom(test);
        testResult.status = 'PASS';
        testResult.expected = true;
        ResultsDb.recordTestResult(testResult);
    }
    onTestFail(test, error) {
        const testResult = this.buildDefaultTestResultFrom(test);
        testResult.status = 'FAIL';
        testResult.expected = false;
        testResult.summaryHtml = `<pre>${error instanceof Error ? error.stack : error}</pre>`;
        ResultsDb.recordTestResult(testResult);
    }
    onTestSkip(test) {
        const testResult = this.buildDefaultTestResultFrom(test);
        testResult.status = 'SKIP';
        testResult.expected = true;
        ResultsDb.recordTestResult(testResult);
    }
    onceEventRunEnds() {
        ResultsDb.sendCollectedTestResultsIfSinkIsAvailable();
    }
    buildDefaultTestResultFrom(test) {
        let testId = this.suitePrefix ? this.suitePrefix + '/' : '';
        testId += test.titlePath().join('/'); // Chrome groups test by a path logic.
        return {
            testId: ResultsDb.sanitizedTestId(testId),
            duration: `${test.duration || 0}ms`,
        };
    }
}
exports = module.exports = ResultsDbReporter;
//# sourceMappingURL=mocha-resultsdb-reporter.js.map