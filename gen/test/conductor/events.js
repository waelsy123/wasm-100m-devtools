"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedErrors = exports.fatalErrors = exports.dumpCollectedErrors = exports.expectError = exports.ErrorExpectation = exports.installPageErrorHandlers = exports.setupBrowserProcessIO = void 0;
const ALLOWED_ASSERTION_FAILURES = [
    // Failure during shutdown. crbug.com/1145969
    'Session is unregistering, can\'t dispatch pending call to Debugger.setBlackboxPatterns',
    // Failure during shutdown. crbug.com/1199322
    'Session is unregistering, can\'t dispatch pending call to DOM.getDocument',
    // Expected failures in assertion_test.ts
    'expected failure 1',
    'expected failure 2',
    // A failing fetch isn't itself a real error.
    // TODO(https://crbug.com/124534) Remove once those messages are not printed anymore.
    'Failed to load resource: the server responded with a status of 404 (Not Found)',
    // Every letter "typed" into the console can trigger a preview `Runtime.evaluate` call.
    // There is no way for an e2e test to know whether all of them have resolved or if there are
    // still pending calls. If the test finishes too early, the JS context is destroyed and pending
    // evaluations will fail. We ignore these kinds of errors. Tests have to make sure themselves
    // that all assertions and success criteria are met (e.g. autocompletions etc).
    // See: https://crbug.com/1192052
    'Request Runtime.evaluate failed. {"code":-32602,"message":"uniqueContextId not found"}',
    'uniqueContextId not found',
];
const logLevels = {
    log: 'I',
    info: 'I',
    warning: 'I',
    error: 'E',
    exception: 'E',
    assert: 'E',
};
let stdout = '', stderr = '';
let unhandledRejectionSet = false;
function setupBrowserProcessIO(browser) {
    const browserProcess = browser.process();
    if (!browserProcess) {
        throw new Error('browserProcess is unexpectedly not defined.');
    }
    if (browserProcess.stderr) {
        browserProcess.stderr.setEncoding('utf8');
        browserProcess.stderr.on('data', data => {
            stderr += data;
        });
    }
    if (browserProcess.stdout) {
        browserProcess.stdout.setEncoding('utf8');
        browserProcess.stdout.on('data', data => {
            stdout += data;
        });
    }
    if (!unhandledRejectionSet) {
        browserProcess.on('unhandledRejection', error => {
            throw new Error(`Unhandled rejection in Frontend: ${error}`);
        });
        unhandledRejectionSet = true;
    }
}
exports.setupBrowserProcessIO = setupBrowserProcessIO;
function installPageErrorHandlers(page) {
    page.on('error', error => {
        console.log('STDOUT:');
        console.log(stdout);
        console.log();
        console.log('STDERR:');
        console.log(stderr);
        console.log();
        throw new Error(`Error in Frontend: ${error}`);
    });
    page.on('pageerror', error => {
        throw new Error(`Page error in Frontend: ${error}`);
    });
    page.on('console', async (msg) => {
        const logLevel = logLevels[msg.type()];
        if (logLevel) {
            if (logLevel === 'E') {
                let message = `${logLevel}> `;
                if (msg.text() === 'JSHandle@error') {
                    const errorHandle = msg.args()[0];
                    message += await errorHandle.evaluate(error => {
                        return error.stack;
                    });
                    await errorHandle.dispose();
                }
                else {
                    message += msg.text();
                    for (const frame of msg.stackTrace()) {
                        message += '\n' + formatStackFrame(frame);
                    }
                }
                if (isExpectedError(msg)) {
                    exports.expectedErrors.push(message);
                    console.log('(expected) ' + message);
                }
                else {
                    exports.fatalErrors.push(message);
                    console.error(message);
                }
            }
            else {
                console.log(`${logLevel}> ${formatStackFrame(msg.location())}: ${msg.text()}`);
            }
        }
    });
}
exports.installPageErrorHandlers = installPageErrorHandlers;
function isExpectedError(consoleMessage) {
    if (ALLOWED_ASSERTION_FAILURES.includes(consoleMessage.text())) {
        return true;
    }
    for (const expectation of pendingErrorExpectations) {
        if (expectation.check(consoleMessage)) {
            pendingErrorExpectations.delete(expectation);
            return true;
        }
    }
    return false;
}
class ErrorExpectation {
    #caught;
    #msg;
    constructor(msg) {
        this.#msg = msg;
    }
    get caught() {
        return this.#caught;
    }
    check(consoleMessage) {
        const text = consoleMessage.text();
        const match = (this.#msg instanceof RegExp) ? Boolean(text.match(this.#msg)) : text.includes(this.#msg);
        if (match) {
            this.#caught = consoleMessage;
        }
        return match;
    }
}
exports.ErrorExpectation = ErrorExpectation;
function expectError(msg) {
    const expectation = new ErrorExpectation(msg);
    pendingErrorExpectations.add(expectation);
    return expectation;
}
exports.expectError = expectError;
function formatStackFrame(stackFrame) {
    if (!stackFrame || !stackFrame.url) {
        return '<unknown>';
    }
    const filename = stackFrame.url.replace(/^.*\//, '');
    return `${filename}:${stackFrame.lineNumber}:${stackFrame.columnNumber}`;
}
function dumpCollectedErrors() {
    console.log('Expected errors: ' + exports.expectedErrors.length);
    console.log('   Fatal errors: ' + exports.fatalErrors.length);
    if (exports.fatalErrors.length) {
        throw new Error('Fatal errors logged:\n' + exports.fatalErrors.join('\n'));
    }
}
exports.dumpCollectedErrors = dumpCollectedErrors;
const pendingErrorExpectations = new Set();
exports.fatalErrors = [];
exports.expectedErrors = [];
//# sourceMappingURL=events.js.map