"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Cors Private Network issue', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.goToResource)('empty.html');
    });
    (0, mocha_extensions_js_1.it)('should display correct information for insecure contexts', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                code: 'CorsIssue',
                details: {
                    corsIssueDetails: {
                        clientSecurityState: {
                            initiatorIsSecureContext: false,
                            initiatorIPAddressSpace: 'Public',
                            privateNetworkRequestPolicy: 'WarnFromInsecureToMorePrivate',
                        },
                        corsErrorStatus: { corsError: 'InsecurePrivateNetwork', failedParameter: '' },
                        isWarning: true,
                        request: { requestId: 'request-1', url: 'http://localhost/' },
                        resourceIPAddressSpace: 'Local',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
            const issue2 = {
                code: 'CorsIssue',
                details: {
                    corsIssueDetails: {
                        clientSecurityState: {
                            initiatorIsSecureContext: false,
                            initiatorIPAddressSpace: 'Unknown',
                            privateNetworkRequestPolicy: 'WarnFromInsecureToMorePrivate',
                        },
                        corsErrorStatus: { corsError: 'InsecurePrivateNetwork', failedParameter: '' },
                        isWarning: true,
                        request: { requestId: 'request-1', url: 'http://example.com/' },
                        resourceIPAddressSpace: 'Local',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue2);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure private network requests are made from secure contexts');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('2 requests', issueElement, '.cors-issue-affected-resource-label');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Resource Address',
                'Initiator Address',
                'Initiator Context',
            ],
            [
                'localhost/',
                'warning',
                'Local',
                'Public',
                'insecure',
            ],
            [
                'example.com/',
                'warning',
                'Local',
                'Unknown',
                'insecure',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display correct information for secure contexts', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                code: 'CorsIssue',
                details: {
                    corsIssueDetails: {
                        clientSecurityState: {
                            initiatorIsSecureContext: true,
                            initiatorIPAddressSpace: 'Public',
                            privateNetworkRequestPolicy: 'WarnFromInsecureToMorePrivate',
                        },
                        corsErrorStatus: { corsError: 'InsecurePrivateNetwork', failedParameter: '' },
                        isWarning: true,
                        request: { requestId: 'request-1', url: 'http://localhost/' },
                        resourceIPAddressSpace: 'Local',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
            const issue2 = {
                code: 'CorsIssue',
                details: {
                    corsIssueDetails: {
                        clientSecurityState: {
                            initiatorIsSecureContext: true,
                            initiatorIPAddressSpace: 'Unknown',
                            privateNetworkRequestPolicy: 'WarnFromInsecureToMorePrivate',
                        },
                        corsErrorStatus: { corsError: 'InsecurePrivateNetwork', failedParameter: '' },
                        isWarning: true,
                        request: { requestId: 'request-1', url: 'http://example.com/' },
                        resourceIPAddressSpace: 'Local',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue2);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure private network requests are made from secure contexts');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('2 requests', issueElement, '.cors-issue-affected-resource-label');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Resource Address',
                'Initiator Address',
                'Initiator Context',
            ],
            [
                'localhost/',
                'warning',
                'Local',
                'Public',
                'secure',
            ],
            [
                'example.com/',
                'warning',
                'Local',
                'Unknown',
                'secure',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display correct information for preflight request errors', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                code: 'CorsIssue',
                details: {
                    corsIssueDetails: {
                        clientSecurityState: {
                            initiatorIsSecureContext: true,
                            initiatorIPAddressSpace: 'Public',
                            privateNetworkRequestPolicy: 'PreflightBlock',
                        },
                        corsErrorStatus: { corsError: 'PreflightMissingAllowPrivateNetwork', failedParameter: '' },
                        isWarning: false,
                        request: { requestId: 'request-1', url: 'http://localhost/' },
                        resourceIPAddressSpace: 'Local',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
            const issue2 = {
                code: 'CorsIssue',
                details: {
                    corsIssueDetails: {
                        clientSecurityState: {
                            initiatorIsSecureContext: true,
                            initiatorIPAddressSpace: 'Public',
                            privateNetworkRequestPolicy: 'PreflightBlock',
                        },
                        corsErrorStatus: { corsError: 'PreflightInvalidAllowPrivateNetwork', failedParameter: 'shouldBeTrue' },
                        isWarning: false,
                        request: { requestId: 'request-1', url: 'http://example.com/' },
                        resourceIPAddressSpace: 'Local',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue2);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure private network requests are only made to resources that allow them');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('2 requests', issueElement, '.cors-issue-affected-resource-label');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request',
                'Invalid Value (if available)',
                'Initiator Address',
                'Initiator Context',
            ],
            [
                'localhost/',
                'blocked',
                'localhost/',
                '',
                'Public',
                'secure',
            ],
            [
                'example.com/',
                'blocked',
                'example.com/',
                'shouldBeTrue',
                'Public',
                'secure',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display correct information for failed preflight requests', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                code: 'CorsIssue',
                details: {
                    corsIssueDetails: {
                        clientSecurityState: {
                            initiatorIsSecureContext: true,
                            initiatorIPAddressSpace: 'Public',
                            privateNetworkRequestPolicy: 'PreflightWarn',
                        },
                        corsErrorStatus: { corsError: 'InvalidResponse', failedParameter: '' },
                        isWarning: true,
                        request: { requestId: 'request-1', url: 'http://localhost/' },
                        resourceIPAddressSpace: 'Local',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure preflight responses are valid');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 request', issueElement, '.cors-issue-affected-resource-label');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            [
                'Request',
                'Status',
                'Preflight Request',
                'Problem',
            ],
            [
                'localhost/',
                'warning',
                'localhost/',
                'Failed Request',
            ],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
});
//# sourceMappingURL=cors-private-network-issues_test.js.map