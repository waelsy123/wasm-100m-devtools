"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('CORS issues', async () => {
    (0, mocha_extensions_js_1.it)('should display CORS violations with the correct affected resources', async () => {
        await (0, helper_js_1.goToResource)('issues/cors-issue.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            // @ts-ignore
            await window.doCorsFetches(`https://devtools.oopif.test:${document.location.port}`);
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure CORS response header values are valid');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('requests', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '3 requests');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request (if problematic)',
                'Header',
                'Problem',
                'Invalid Value (if available)',
            ],
            [
                /^devtools.oopif.test:.*/,
                'blocked',
                '',
                'Access-Control-Allow-Origin',
                'Missing Header',
                '',
            ],
            [
                /^devtools.oopif.test:.*/,
                'blocked',
                /^devtools.oopif.test:.*/,
                'Access-Control-Allow-Origin',
                'Missing Header',
                '',
            ],
            [
                /.*invalid-preflight.*/,
                'blocked',
                /.*invalid-preflight.*/,
                'Access-Control-Allow-Origin',
                'Missing Header',
                '',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display credentialed+wildcard CORS issues with the correct affected resources', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            try {
                const url = new URL('./issues/origin-wildcard.rawresponse', document.location.toString())
                    .toString()
                    .replace('localhost', 'devtools.oopif.test');
                await fetch(url, { credentials: 'include' });
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure credentialed requests are not sent to CORS resources with origin wildcards');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('request', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 request');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request (if problematic)',
            ],
            [
                'origin-wildcard.rawresponse',
                'blocked',
                '',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display invalid CORS preflight response codes with the correct affected resources', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ geeting: 'hello' }),
            };
            try {
                const url = new URL('./issues/invalid-response-code.rawresponse', document.location.toString())
                    .toString()
                    .replace('localhost', 'devtools.oopif.test');
                await fetch(url, options);
            }
            catch (e) {
            }
            try {
                const url2 = new URL('./issues/redirect.rawresponse', document.location.toString())
                    .toString()
                    .replace('localhost', 'devtools.oopif.test');
                await fetch(url2, options);
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure preflight responses are valid');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('requests', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '2 requests');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request',
                'Problem',
            ],
            [
                'invalid-response-code.rawresponse',
                'blocked',
                'invalid-response-code.rawresponse',
                'HTTP status of preflight request didn\'t indicate success',
            ],
            [
                'redirect.rawresponse',
                'blocked',
                'redirect.rawresponse',
                'Response to preflight was a redirect',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display CORS ACAO mismatches with the correct affected resources', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ geeting: 'hello' }),
            };
            const url = new URL('./issues/acao-mismatch.rawresponse', document.location.toString())
                .toString()
                .replace('localhost', 'devtools.oopif.test');
            try {
                await fetch(url, options);
            }
            catch (e) {
            }
            try {
                await fetch(url);
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure CORS requesting origin matches resource\'s allowed origin');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('requests', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '2 requests');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request (if problematic)',
                'Initiator Context',
                'Allowed Origin (from header)',
            ],
            [
                'acao-mismatch.rawresponse',
                'blocked',
                'acao-mismatch.rawresponse',
                /^https:\/\/localhost.*/,
                'https://devtools.oopif.test',
            ],
            [
                'acao-mismatch.rawresponse',
                'blocked',
                '',
                /^https:\/\/localhost.*/,
                'https://devtools.oopif.test',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display invalid CORS ACAC values with the correct affected resources', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            const url = new URL('./issues/acac-invalid.rawresponse', document.location.toString())
                .toString()
                .replace('localhost', 'devtools.oopif.test');
            try {
                await fetch(url, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ geeting: 'hello' }),
                });
            }
            catch (e) {
            }
            try {
                await fetch(url, { credentials: 'include' });
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure CORS requests include credentials only when allowed');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('requests', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '2 requests');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request (if problematic)',
                'Access-Control-Allow-Credentials Header Value',
            ],
            [
                'acac-invalid.rawresponse',
                'blocked',
                'acac-invalid.rawresponse',
                'false',
            ],
            [
                'acac-invalid.rawresponse',
                'blocked',
                '',
                'false',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display CORS requests using disallowed methods with the correct affected resources', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            try {
                const url = new URL('./issues/method-disallowed.rawresponse', document.location.toString())
                    .toString()
                    .replace('localhost', 'devtools.oopif.test');
                await fetch(url, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ geeting: 'hello' }),
                });
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure CORS request uses allowed method');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('request', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 request');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request',
                'Disallowed Request Method',
            ],
            [
                'method-disallowed.rawresponse',
                'blocked',
                'method-disallowed.rawresponse',
                'PUT',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display CORS requests using disallowed headers with the correct affected resources', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            try {
                // We can re-use `method-disallowed.rawresponse` for this test.
                const url = new URL('./issues/method-disallowed.rawresponse', document.location.toString())
                    .toString()
                    .replace('localhost', 'devtools.oopif.test');
                await fetch(url, {
                    headers: { 'X-Foo': 'bar' },
                });
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure CORS request includes only allowed headers');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('request', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 request');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request',
                'Disallowed Request Header',
            ],
            [
                'method-disallowed.rawresponse',
                'blocked',
                'method-disallowed.rawresponse',
                'x-foo',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display CORS requests redirecting to credentialed URLs', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            try {
                const url = new URL('./issues/credentialed-redirect.rawresponse', document.location.toString())
                    .toString()
                    .replace('localhost', 'devtools.oopif.test');
                await fetch(url);
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure CORS requests are not redirected to URLs containing credentials');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('request', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 request');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
            ],
            [
                'credentialed-redirect.rawresponse',
                'blocked',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display CORS issues that are disallowed by the mode', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            try {
                const url = new URL('/', document.location.toString()).toString().replace('localhost', 'devtools.oopif.test');
                await fetch(url, { mode: 'same-origin' });
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure only same-origin resources are fetched with same-origin request mode');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('request', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 request');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Initiator Context',
                'Source Location',
            ],
            [
                /^devtools.oopif.test.*\//,
                'blocked',
                /^https:\/\/localhost.*/,
                /.*:\d+/,
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display CORS issues that are unsupported by the scheme', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            try {
                const url = new URL('/', document.location.toString())
                    .toString()
                    .replace('https://localhost', 'webdav://devtools.oopif.test');
                await fetch(url);
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure CORS requests are made on supported schemes');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('request', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 request');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Initiator Context',
                'Source Location',
                'Unsupported Scheme',
            ],
            [
                /^devtools.oopif.test.*\//,
                'blocked',
                /^https:\/\/localhost.*/,
                /.*:\d+/,
                'webdav',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display CORS issues that are misconfiguring the redirect mode', async () => {
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            try {
                const url = new URL('/', document.location.toString())
                    .toString()
                    .replace('https://localhost', 'webdav://devtools.oopif.test');
                await fetch(url, { mode: 'no-cors', redirect: 'manual' });
            }
            catch (e) {
            }
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure no-cors requests configure redirect mode follow');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('request', issueElement, '.cors-issue-affected-resource-label');
        const text = await section.label.evaluate(el => el.textContent);
        chai_1.assert.strictEqual(text, '1 request');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Source Location',
            ],
            [
                /^devtools.oopif.test.*\//,
                'blocked',
                /.*:\d+/,
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
});
//# sourceMappingURL=cors-issues_test.js.map