"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const issues_helpers_js_1 = require("../helpers/issues-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
async function getIconComponents(className, root) {
    return await (0, helper_js_1.waitForFunction)(async () => {
        const icons = await (0, helper_js_1.$$)(`devtools-icon.${className}`, root);
        return icons.length > 0 ? icons : undefined;
    });
}
async function getRowsText(root) {
    const rowMessages = await (0, helper_js_1.$$)('.text-editor-row-message', root);
    const messages = [];
    for (const rowMessage of rowMessages) {
        const messageText = await rowMessage.evaluate(x => (x instanceof HTMLElement) ? x.innerText : '');
        messages.push(messageText);
    }
    return messages;
}
async function getIconFile(iconComponent) {
    const issueIcon = await (0, helper_js_1.waitFor)('.icon-basic', iconComponent);
    const imageSrc = await issueIcon.evaluate(x => window.getComputedStyle(x).backgroundImage);
    const splitImageSrc = imageSrc.substring(5, imageSrc.length - 2).split('/');
    return splitImageSrc[splitImageSrc.length - 1];
}
async function openFileInSourceTab(fileName) {
    await (0, helper_js_1.goToResource)(`network/${fileName}`);
    await (0, sources_helpers_js_1.openSourcesPanel)();
    const element = await (0, helper_js_1.waitFor)(`[aria-label="${fileName}, file"]`);
    await element.click();
}
async function getExpandedIssuesTitle() {
    const expandedIssues = new Set();
    const issues = await (0, helper_js_1.$$)('.issue');
    for (const issue of issues) {
        const expanded = await issue.evaluate(x => x.classList.contains('expanded'));
        if (expanded) {
            const titleHandler = await (0, helper_js_1.waitFor)('.title', issue);
            const title = await titleHandler.evaluate(x => (x instanceof HTMLElement) ? x.innerText : '');
            expandedIssues.add(title);
        }
    }
    return expandedIssues;
}
async function waitForExpandedIssueTitle(issueIconComponent) {
    return await (0, helper_js_1.waitForFunction)(async () => {
        await (0, helper_js_1.click)(issueIconComponent);
        const expandedIssues = await getExpandedIssuesTitle();
        if (expandedIssues.size) {
            return expandedIssues;
        }
        return undefined;
    });
}
(0, mocha_extensions_js_1.describe)('The row\'s icon bucket', async function () {
    if (this.timeout()) {
        this.timeout(10000);
    }
    (0, mocha_extensions_js_1.it)('should display error messages', async () => {
        await openFileInSourceTab('trusted-type-policy-violation-report-only.rawresponse');
        const iconComponents = await getIconComponents('cm-messageIcon-error');
        const messages = [];
        const expectedMessages = [
            '[Report Only] Refused to create a TrustedTypePolicy named \'policy2\' because it violates the following Content Security Policy directive: "trusted-types policy1".',
        ];
        for (const iconComponent of iconComponents) {
            await iconComponent.hover();
            const vbox = await (0, helper_js_1.waitFor)('div.vbox.flex-auto.no-pointer-events');
            const rowMessages = await getRowsText(vbox);
            messages.push(...rowMessages);
        }
        chai_1.assert.deepEqual(messages, expectedMessages);
    });
    (0, mocha_extensions_js_1.it)('should use the correct error icon', async () => {
        await openFileInSourceTab('trusted-type-violations-report-only.rawresponse');
        const bucketIconComponents = await getIconComponents('cm-messageIcon-error');
        for (const bucketIconComponent of bucketIconComponents) {
            await bucketIconComponent.hover();
            const vbox = await (0, helper_js_1.waitFor)('div.vbox.flex-auto.no-pointer-events');
            const iconComponents = await getIconComponents('text-editor-row-message-icon', vbox);
            for (const iconComponent of iconComponents) {
                chai_1.assert.strictEqual(await getIconFile(iconComponent), 'error_icon.svg');
            }
            chai_1.assert.strictEqual(await getIconFile(bucketIconComponent), 'error_icon.svg');
        }
    });
    (0, mocha_extensions_js_1.it)('should display issue messages', async () => {
        await openFileInSourceTab('trusted-type-violations-report-only.rawresponse');
        const issueIconComponents = await getIconComponents('cm-messageIcon-issue');
        const issueMessages = [];
        const expectedIssueMessages = [
            'Trusted Type policy creation blocked by Content Security Policy',
            'Trusted Type expected, but String received',
        ];
        for (const issueIconComponent of issueIconComponents) {
            await issueIconComponent.hover();
            const vbox = await (0, helper_js_1.waitFor)('div.vbox.flex-auto.no-pointer-events');
            const rowMessages = await getRowsText(vbox);
            issueMessages.push(...rowMessages);
        }
        chai_1.assert.deepEqual(issueMessages.sort(), expectedIssueMessages.sort());
    });
    (0, mocha_extensions_js_1.it)('should also mark issues in inline event handlers in HTML documents', async () => {
        await openFileInSourceTab('trusted-type-violations-report-only-in-html.rawresponse');
        const icons = await getIconComponents('cm-messageIcon-issue');
        chai_1.assert.strictEqual(icons.length, 1);
    });
    (0, mocha_extensions_js_1.it)('should reveal Issues tab when the icon is clicked', async () => {
        await openFileInSourceTab('trusted-type-policy-violation-report-only.rawresponse');
        const HIDE_DEBUGGER_SELECTOR = '[aria-label="Hide debugger"]';
        const HIDE_NAVIGATOR_SELECTOR = '[aria-label="Hide navigator"]';
        await (0, helper_js_1.click)(HIDE_DEBUGGER_SELECTOR);
        await (0, helper_js_1.click)(HIDE_NAVIGATOR_SELECTOR);
        const bucketIssueIconComponents = await getIconComponents('cm-messageIcon-issue');
        chai_1.assert.strictEqual(bucketIssueIconComponents.length, 1);
        const issueIconComponent = bucketIssueIconComponents[0];
        await (0, helper_js_1.click)(issueIconComponent);
        const expandedIssues = await waitForExpandedIssueTitle(issueIconComponent);
        chai_1.assert.isTrue(expandedIssues.has('Trusted Type policy creation blocked by Content Security Policy'));
    });
    (0, mocha_extensions_js_1.it)('should reveal the Issues tab if the icon in the popover is clicked', async () => {
        if (this.timeout()) {
            this.timeout(20000);
        }
        await (0, issues_helpers_js_1.navigateToIssuesTab)();
        await openFileInSourceTab('trusted-type-violations-report-only.rawresponse');
        const HIDE_DEBUGGER_SELECTOR = '[aria-label="Hide debugger"]';
        const HIDE_NAVIGATOR_SELECTOR = '[aria-label="Hide navigator"]';
        await (0, helper_js_1.click)(HIDE_DEBUGGER_SELECTOR);
        await (0, helper_js_1.click)(HIDE_NAVIGATOR_SELECTOR);
        const { issueIcon, issueTitle } = await (0, helper_js_1.waitForFunction)(async () => {
            const bucketIssueIconComponents = await getIconComponents('cm-messageIcon-issue');
            chai_1.assert.strictEqual(bucketIssueIconComponents.length, 1);
            const issueIconComponent = bucketIssueIconComponents[0];
            await issueIconComponent.hover();
            const vbox = await (0, helper_js_1.waitForWithTries)('div.vbox.flex-auto.no-pointer-events', undefined, { tries: 3 });
            if (!vbox) {
                return undefined;
            }
            const rowMessage = await (0, helper_js_1.waitForWithTries)('.text-editor-row-message', vbox, { tries: 3 });
            if (!rowMessage) {
                return undefined;
            }
            const issueTitle = await rowMessage.evaluate(x => (x instanceof HTMLElement) ? x.innerText : '');
            const issueIcon = await (0, helper_js_1.waitForWithTries)('.text-editor-row-message-icon', rowMessage, { tries: 3 });
            if (!issueIcon) {
                return undefined;
            }
            return { issueIcon, issueTitle };
        });
        const expandedIssues = await waitForExpandedIssueTitle(issueIcon);
        chai_1.assert.isTrue(expandedIssues.has(issueTitle));
    });
});
//# sourceMappingURL=icon-row-bucket_test.js.map