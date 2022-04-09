"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('Breakpoints on CSP Violation', async () => {
    (0, mocha_extensions_js_1.it)('CSP Violations should come up before break on exceptions', async () => {
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)('[aria-label="CSP Violation Breakpoints"]');
        await (0, helper_js_1.click)('[aria-label="Trusted Type Violations"]');
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        const resource = (0, helper_js_1.goToResource)('network/trusted-type-violations-enforced.rawresponse');
        const status1 = await (0, sources_helpers_js_1.getPausedMessages)();
        chai_1.assert.strictEqual(status1.statusMain, 'Paused on CSP violation');
        chai_1.assert.strictEqual(status1.statusSub, 'Trusted Type Policy Violation');
        await (0, helper_js_1.click)('[aria-label="Resume script execution"]');
        const status2 = await (0, sources_helpers_js_1.getPausedMessages)();
        chai_1.assert.strictEqual(status2.statusMain, 'Paused on exception');
        chai_1.assert.strictEqual(status2.statusSub, 'TypeError: Failed to execute \'createPolicy\' on \'TrustedTypePolicyFactory\': Policy "policy2" disallowed.');
        await (0, helper_js_1.click)('[aria-label="Resume script execution"]');
        await resource;
    });
    (0, mocha_extensions_js_1.it)('CSP Violations should show in report-only mode', async () => {
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)('[aria-label="CSP Violation Breakpoints"]');
        await (0, helper_js_1.click)('[aria-label="Trusted Type Violations"]');
        const resource = (0, helper_js_1.goToResource)('network/trusted-type-violations-report-only.rawresponse');
        const status1 = await (0, sources_helpers_js_1.getPausedMessages)();
        chai_1.assert.strictEqual(status1.statusMain, 'Paused on CSP violation');
        chai_1.assert.strictEqual(status1.statusSub, 'Trusted Type Policy Violation');
        await (0, helper_js_1.click)('[aria-label="Resume script execution"]');
        const status2 = await (0, sources_helpers_js_1.getPausedMessages)();
        chai_1.assert.strictEqual(status2.statusMain, 'Paused on CSP violation');
        chai_1.assert.strictEqual(status2.statusSub, 'Trusted Type Sink Violation');
        await (0, helper_js_1.click)('[aria-label="Resume script execution"]');
        await resource;
    });
});
//# sourceMappingURL=breakpoint-csp-violations_test.js.map