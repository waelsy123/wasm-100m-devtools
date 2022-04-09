"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Trusted Web Activity issue', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.goToResource)('empty.html');
    });
    (0, mocha_extensions_js_1.it)('should display correct information for type kHttpError', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                'code': 'TrustedWebActivityIssue',
                'details': {
                    'twaQualityEnforcementDetails': {
                        'url': 'test1.example.com',
                        'violationType': 'kHttpError',
                        'httpStatusCode': 404,
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Trusted Web Activity navigations must succeed or be handled by the ServiceWorker. Your app may crash in the future.');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 resource', issueElement);
        const expectedTableRows = [
            ['Status code', 'Url'],
            ['404', 'test1.example.com'],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display correct information for type kUnavailableOffline', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                'code': 'TrustedWebActivityIssue',
                'details': {
                    'twaQualityEnforcementDetails': {
                        'url': 'test2.example.com',
                        'violationType': 'kUnavailableOffline',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Trusted Web Activity does not work offline. In the future, your app may crash if the user’s device goes offline.');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 resource', issueElement);
        const expectedTableRows = [
            ['Url'],
            ['test2.example.com'],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
    (0, mocha_extensions_js_1.it)('should display correct information for type kDigitalAssetLinks', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                'code': 'TrustedWebActivityIssue',
                'details': {
                    'twaQualityEnforcementDetails': {
                        'url': 'test3.example.com',
                        'violationType': 'kDigitalAssetLinks',
                        'packageName': 'test.package',
                        'signature': '1A:2B:3C',
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
        });
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Digital asset links of the Trusted Web Activity failed verification. Your app may crash in the future.');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 resource', issueElement);
        const expectedTableRows = [
            ['Package name', 'Url', 'Package signature'],
            ['test.package', 'test3.example.com', '1A:2B:3C'],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
});
//# sourceMappingURL=twa-issues_test.js.map