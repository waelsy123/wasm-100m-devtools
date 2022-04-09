"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Cookie attribute exceeds max size issues test', async () => {
    afterEach(async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        const cookies = await target.cookies();
        await target.deleteCookie(...cookies);
    });
    (0, mocha_extensions_js_1.it)('should display issue when a cookie has an attribute that exceeds the max size', async () => {
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, helper_js_1.goToResource)('empty.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(() => {
            document.cookie =
                'exceeds_max_size=yes;max-age=0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000031536';
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await (0, issues_helpers_js_1.expandIssue)();
        const issueElement = await (0, issues_helpers_js_1.getIssueByTitle)('Ensure cookie attribute values don’t exceed 1024 characters');
        (0, helper_js_1.assertNotNullOrUndefined)(issueElement);
        const section = await (0, issues_helpers_js_1.getResourcesElement)('1 cookie', issueElement, '.affected-resource-label');
        await (0, issues_helpers_js_1.ensureResourceSectionIsExpanded)(section);
        const expectedTableRows = [
            ['Name', 'Domain & Path'],
            ['exceeds_max_size', 'localhost/test/e2e/resources'],
        ];
        await (0, issues_helpers_js_1.waitForTableFromResourceSectionContents)(section.content, expectedTableRows);
    });
});
//# sourceMappingURL=cookie-attribute-exceeds-max-size-issues_test.js.map