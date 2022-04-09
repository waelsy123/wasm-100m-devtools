"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
(0, mocha_extensions_js_1.describe)('Hide issues menu', async () => {
    (0, mocha_extensions_js_1.it)('should be appended to the issue header', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const issueTitle = 'Cross-origin portal post messages are blocked on your site';
        const issueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueHeader);
        const hideIssuesMenu = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        const menuDisplay = await hideIssuesMenu.evaluate(node => window.getComputedStyle(node).getPropertyValue('display'));
        chai_1.assert.strictEqual(menuDisplay, 'none');
    });
    (0, mocha_extensions_js_1.it)('should become visible on hovering over the issue header', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        frontend.evaluate(() => {
            const issue = {
                'code': 'HeavyAdIssue',
                'details': {
                    'heavyAdIssueDetails': {
                        'resolution': 'HeavyAdBlocked',
                        'reason': 'NetworkTotalLimit',
                        'frame': { frameId: 'main' },
                    },
                },
            };
            // @ts-ignore
            window.addIssueForTest(issue);
        });
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const issueTitle = 'An ad on your site has exceeded resource limits';
        const issueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueHeader);
        const hideIssuesMenu = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        let menuDisplay = await hideIssuesMenu.evaluate(node => window.getComputedStyle(node).getPropertyValue('display'));
        chai_1.assert.strictEqual(menuDisplay, 'none');
        await issueHeader.hover();
        menuDisplay =
            await hideIssuesMenu.evaluate(node => window.getComputedStyle(node).getPropertyValue('display'));
        chai_1.assert.strictEqual(menuDisplay, 'block');
    });
    (0, mocha_extensions_js_1.it)('should open a context menu upon clicking', async () => {
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
        const issueTitle = 'Ensure credentialed requests are not sent to CORS resources with origin wildcards';
        const issueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueHeader);
        await issueHeader.hover();
        const hideIssuesMenu = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        await hideIssuesMenu.click();
        const menuItem = await (0, issues_helpers_js_1.getHideIssuesMenuItem)();
        (0, helper_js_1.assertNotNullOrUndefined)(menuItem);
        const content = await menuItem.evaluate(node => node.textContent);
        (0, helper_js_1.assertNotNullOrUndefined)(content);
        chai_1.assert.include(content, 'Hide issues like this');
    });
    (0, mocha_extensions_js_1.it)('should hide issue upon clicking the context menu entry', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const issueTitle = 'Cross-origin portal post messages are blocked on your site';
        const issueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueHeader);
        await issueHeader.hover();
        const hideIssuesMenuBtn = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        await hideIssuesMenuBtn.click();
        const menuItem = await (0, issues_helpers_js_1.getHideIssuesMenuItem)();
        (0, helper_js_1.assertNotNullOrUndefined)(menuItem);
        await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
        await menuItem.click();
        await (0, helper_js_1.waitFor)('.hidden-issue');
    });
    (0, mocha_extensions_js_1.it)('should unhide all issues upon clicking unhide all issues button', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const issueTitle = 'Cross-origin portal post messages are blocked on your site';
        const issueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueHeader);
        await issueHeader.hover();
        const hideIssuesMenuBtn = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        await hideIssuesMenuBtn.click();
        const menuItem = await (0, issues_helpers_js_1.getHideIssuesMenuItem)();
        (0, helper_js_1.assertNotNullOrUndefined)(menuItem);
        await menuItem.click();
        await (0, helper_js_1.waitFor)('.hidden-issue');
        const btn = await (0, issues_helpers_js_1.getUnhideAllIssuesBtn)();
        await btn.click();
        await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
    });
    (0, mocha_extensions_js_1.it)('should contain unhide issues like this entry while hovering over a hidden issue', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const issueTitle = 'Cross-origin portal post messages are blocked on your site';
        const issueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueHeader);
        await issueHeader.hover();
        let hideIssuesMenuBtn = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        await hideIssuesMenuBtn.click();
        const menuItem = await (0, issues_helpers_js_1.getHideIssuesMenuItem)();
        (0, helper_js_1.assertNotNullOrUndefined)(menuItem);
        await menuItem.click();
        await (0, helper_js_1.waitFor)('.hidden-issue');
        const row = await (0, issues_helpers_js_1.getHiddenIssuesRow)();
        let isHidden = await row?.evaluate(node => node.classList.contains('hidden'));
        chai_1.assert.isFalse(isHidden);
        await row?.click();
        const body = await (0, issues_helpers_js_1.getHiddenIssuesRowBody)();
        isHidden = await body?.evaluate(node => node.classList.contains('hidden'));
        chai_1.assert.isFalse(isHidden);
        const hiddenIssueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(hiddenIssueHeader);
        await hiddenIssueHeader.hover();
        hideIssuesMenuBtn = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        await hideIssuesMenuBtn.click();
        await (0, issues_helpers_js_1.getUnhideIssuesMenuItem)();
    });
    (0, mocha_extensions_js_1.it)('should unhide issue after clicking the unhide issues like this entry', async () => {
        await (0, helper_js_1.goToResource)('issues/cross-origin-portal-post.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        const issueTitle = 'Cross-origin portal post messages are blocked on your site';
        const issueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(issueHeader);
        await issueHeader.hover();
        let hideIssuesMenuBtn = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        await hideIssuesMenuBtn.click();
        const menuItem = await (0, issues_helpers_js_1.getHideIssuesMenuItem)();
        (0, helper_js_1.assertNotNullOrUndefined)(menuItem);
        await menuItem.click();
        await (0, helper_js_1.waitFor)('.hidden-issue');
        const row = await (0, issues_helpers_js_1.getHiddenIssuesRow)();
        let isHidden = await row?.evaluate(node => node.classList.contains('hidden'));
        chai_1.assert.isFalse(isHidden);
        await row?.click();
        const body = await (0, issues_helpers_js_1.getHiddenIssuesRowBody)();
        isHidden = await body?.evaluate(node => node.classList.contains('hidden'));
        chai_1.assert.isFalse(isHidden);
        const hiddenIssueHeader = await (0, issues_helpers_js_1.getIssueHeaderByTitle)(issueTitle);
        (0, helper_js_1.assertNotNullOrUndefined)(hiddenIssueHeader);
        await hiddenIssueHeader.hover();
        hideIssuesMenuBtn = await (0, issues_helpers_js_1.getHideIssuesMenu)();
        await hideIssuesMenuBtn.click();
        const unhideMenuItem = await (0, issues_helpers_js_1.getUnhideIssuesMenuItem)();
        await unhideMenuItem?.click();
        await (0, helper_js_1.waitFor)(issues_helpers_js_1.ISSUE);
    });
});
(0, mocha_extensions_js_1.describe)('After enabling grouping by IssueKind, Hide issues menu', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.enableExperiment)('groupAndHideIssuesByKind');
    });
    (0, mocha_extensions_js_1.it)('should be appended to the issue kinds group header', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (!await (0, issues_helpers_js_1.getGroupByKindChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByKind)();
        }
        await (0, helper_js_1.waitFor)('.issue-kind');
        await (await (0, helper_js_1.waitFor)('.issue-kind .header')).hover();
        const hideIssuesMenu = await (0, helper_js_1.waitFor)('.hide-available-issues');
        chai_1.assert.isNotNull(hideIssuesMenu);
    });
    (0, mocha_extensions_js_1.it)('should hide all available issues upon click menu entry', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        if (!await (0, issues_helpers_js_1.getGroupByKindChecked)()) {
            await (0, issues_helpers_js_1.toggleGroupByKind)();
        }
        await (0, helper_js_1.waitFor)('.issue-kind');
        chai_1.assert.isEmpty(await (0, helper_js_1.$$)('.hidden-issue'));
        await (await (0, helper_js_1.waitFor)('.issue-kind .header')).hover();
        const hideIssuesMenu = await (0, helper_js_1.waitFor)('.hide-available-issues');
        await hideIssuesMenu.click();
        const menuItem = await (0, helper_js_1.waitFor)('[aria-label="Hide all current Page Errors"]');
        await menuItem.click();
        await (0, helper_js_1.waitFor)('.hidden-issue');
    });
});
//# sourceMappingURL=hide-issues-menu_test.js.map