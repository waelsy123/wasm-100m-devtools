"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleGroupByKind = exports.toggleGroupByCategory = exports.revealViolatingSourcesLines = exports.revealNodeInElementsPanel = exports.getGroupByKindChecked = exports.getGroupByCategoryChecked = exports.waitForTableFromResourceSectionContents = exports.waitForTableFromResourceSection = exports.ensureResourceSectionIsExpanded = exports.getResourcesElement = exports.expandIssue = exports.expandKind = exports.expandCategory = exports.assertStatus = exports.getIssueHeaderByTitle = exports.getAndExpandSpecificIssueByTitle = exports.getIssueByTitle = exports.assertIssueTitle = exports.assertCategoryName = exports.getHiddenIssuesRowBody = exports.getHiddenIssuesRow = exports.getUnhideIssuesMenuItem = exports.getHideIssuesMenuItem = exports.getUnhideAllIssuesBtn = exports.navigateToIssuesTab = exports.getHideIssuesMenu = exports.UNHIDE_ALL_ISSUES = exports.UNHIDE_THIS_ISSUE = exports.HIDE_THIS_ISSUE = exports.HIDE_ISSUES_MENU = exports.RESOURCES_LABEL = exports.REPORT_ONLY_STATUS = exports.BLOCKED_STATUS = exports.SOURCES_LINK = exports.ELEMENTS_PANEL_SELECTOR = exports.ELEMENT_REVEAL_ICON = exports.AFFECTED_ELEMENT_ICON = exports.ISSUE_TITLE = exports.ISSUE = exports.KIND_CHECKBOX = exports.CATEGORY_CHECKBOX = exports.CATEGORY_NAME = exports.KIND = exports.CATEGORY = void 0;
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const settings_helpers_js_1 = require("./settings-helpers.js");
exports.CATEGORY = '.issue-category:not(.hidden-issues)';
exports.KIND = '.issue-kind';
exports.CATEGORY_NAME = '.issue-category .title';
exports.CATEGORY_CHECKBOX = 'input[aria-label="Group by category"]';
exports.KIND_CHECKBOX = 'input[aria-label="Group by kind"]';
exports.ISSUE = '.issue:not(.hidden-issue)';
exports.ISSUE_TITLE = '.issue .title';
exports.AFFECTED_ELEMENT_ICON = '.affected-resource-csp-info-node';
exports.ELEMENT_REVEAL_ICON = '.element-reveal-icon';
exports.ELEMENTS_PANEL_SELECTOR = '.panel[aria-label="elements"]';
exports.SOURCES_LINK = '.affected-source-location > span';
exports.BLOCKED_STATUS = '.affected-resource-blocked-status';
exports.REPORT_ONLY_STATUS = '.affected-resource-report-only-status';
exports.RESOURCES_LABEL = '.affected-resource-label';
exports.HIDE_ISSUES_MENU = 'devtools-hide-issues-menu';
exports.HIDE_THIS_ISSUE = 'Hide issues like this';
exports.UNHIDE_THIS_ISSUE = 'Unhide issues like this';
exports.UNHIDE_ALL_ISSUES = '.unhide-all-issues-button';
async function getHideIssuesMenu() {
    const menu = await (0, helper_js_1.waitFor)(exports.HIDE_ISSUES_MENU);
    return menu;
}
exports.getHideIssuesMenu = getHideIssuesMenu;
async function navigateToIssuesTab() {
    await (0, settings_helpers_js_1.openPanelViaMoreTools)('Issues');
}
exports.navigateToIssuesTab = navigateToIssuesTab;
async function getUnhideAllIssuesBtn() {
    const btn = await (0, helper_js_1.waitFor)(exports.UNHIDE_ALL_ISSUES);
    return btn;
}
exports.getUnhideAllIssuesBtn = getUnhideAllIssuesBtn;
async function getHideIssuesMenuItem() {
    const menuItem = await (0, helper_js_1.waitFor)(`[aria-label="${exports.HIDE_THIS_ISSUE}"]`);
    if (menuItem) {
        return menuItem;
    }
    return null;
}
exports.getHideIssuesMenuItem = getHideIssuesMenuItem;
async function getUnhideIssuesMenuItem() {
    return await (0, helper_js_1.waitFor)(`[aria-label="${exports.UNHIDE_THIS_ISSUE}"]`);
}
exports.getUnhideIssuesMenuItem = getUnhideIssuesMenuItem;
async function getHiddenIssuesRow() {
    return await (0, helper_js_1.waitFor)('.hidden-issues');
}
exports.getHiddenIssuesRow = getHiddenIssuesRow;
async function getHiddenIssuesRowBody() {
    return await (0, helper_js_1.waitFor)('.hidden-issues-body');
}
exports.getHiddenIssuesRowBody = getHiddenIssuesRowBody;
async function assertCategoryName(categoryName) {
    const categoryNameElement = await (0, helper_js_1.waitFor)(exports.CATEGORY_NAME);
    const selectedCategoryName = await categoryNameElement.evaluate(node => node.textContent);
    chai_1.assert.strictEqual(selectedCategoryName, categoryName);
}
exports.assertCategoryName = assertCategoryName;
async function assertIssueTitle(issueMessage) {
    const issueMessageElement = await (0, helper_js_1.waitFor)(exports.ISSUE_TITLE);
    const selectedIssueMessage = await issueMessageElement.evaluate(node => node.textContent);
    chai_1.assert.strictEqual(selectedIssueMessage, issueMessage);
}
exports.assertIssueTitle = assertIssueTitle;
async function getIssueByTitleElement(issueMessageElement) {
    const header = await issueMessageElement.evaluateHandle(el => el.parentElement);
    if (header) {
        const headerClassList = await header.evaluate(el => el.classList.toString());
        chai_1.assert.include(headerClassList, 'header');
        const issue = await header.evaluateHandle(el => el.parentElement.nextSibling);
        if (issue) {
            return issue;
        }
    }
    return undefined;
}
// Only works if there is just a single issue.
async function getIssueByTitle(issueMessage) {
    const issueMessageElement = await (0, helper_js_1.waitFor)(exports.ISSUE_TITLE);
    const selectedIssueMessage = await issueMessageElement.evaluate(node => node.textContent);
    chai_1.assert.strictEqual(selectedIssueMessage, issueMessage);
    return getIssueByTitleElement(issueMessageElement);
}
exports.getIssueByTitle = getIssueByTitle;
// Works also if there are multiple issues.
async function getAndExpandSpecificIssueByTitle(issueMessage) {
    const issueMessageElement = await (0, helper_js_1.waitForFunction)(async () => {
        const issueElements = await (0, helper_js_1.$$)(exports.ISSUE_TITLE);
        for (const issueElement of issueElements) {
            const message = await issueElement.evaluate(issueElement => issueElement.textContent);
            if (message === issueMessage) {
                return issueElement;
            }
        }
        return undefined;
    });
    await (0, helper_js_1.click)(issueMessageElement);
    await (0, helper_js_1.waitFor)('.message');
    return getIssueByTitleElement(issueMessageElement);
}
exports.getAndExpandSpecificIssueByTitle = getAndExpandSpecificIssueByTitle;
async function getIssueHeaderByTitle(issueMessage) {
    const issueMessageElement = await (0, helper_js_1.waitFor)(exports.ISSUE_TITLE);
    const selectedIssueMessage = await issueMessageElement.evaluate(node => node.textContent);
    chai_1.assert.strictEqual(selectedIssueMessage, issueMessage);
    const header = await issueMessageElement.evaluateHandle(el => el.parentElement);
    if (header) {
        return header;
    }
    return undefined;
}
exports.getIssueHeaderByTitle = getIssueHeaderByTitle;
async function assertStatus(status) {
    const classStatus = status === 'blocked' ? exports.BLOCKED_STATUS : exports.REPORT_ONLY_STATUS;
    const issueMessageElement = await (0, helper_js_1.waitFor)(classStatus);
    const selectedIssueMessage = await issueMessageElement.evaluate(node => node.textContent);
    chai_1.assert.strictEqual(selectedIssueMessage, status);
}
exports.assertStatus = assertStatus;
async function expandCategory() {
    const categoryElement = await (0, helper_js_1.waitFor)(exports.CATEGORY);
    const isCategoryExpanded = await categoryElement.evaluate(node => node.classList.contains('expanded'));
    if (!isCategoryExpanded) {
        await (0, helper_js_1.click)(exports.CATEGORY);
    }
    await (0, helper_js_1.waitFor)(exports.ISSUE);
}
exports.expandCategory = expandCategory;
async function expandKind(classSelector) {
    const kindElement = await (0, helper_js_1.waitFor)(`${exports.KIND}${classSelector}`);
    const isKindExpanded = await kindElement.evaluate(node => node.classList.contains('expanded'));
    if (!isKindExpanded) {
        await kindElement.click();
    }
    await (0, helper_js_1.waitFor)(exports.ISSUE);
}
exports.expandKind = expandKind;
async function expandIssue() {
    if (await getGroupByCategoryChecked()) {
        await expandCategory();
    }
    await (0, helper_js_1.waitFor)(exports.ISSUE);
    await (0, helper_js_1.click)(exports.ISSUE);
    await (0, helper_js_1.waitFor)('.message');
}
exports.expandIssue = expandIssue;
async function getResourcesElement(resourceName, issueElement, className) {
    return await (0, helper_js_1.waitForFunction)(async () => {
        const elements = await (0, helper_js_1.$$)(className ?? exports.RESOURCES_LABEL, issueElement);
        for (const el of elements) {
            const text = await el.evaluate(el => el.textContent);
            if (text && text.includes(resourceName)) {
                const content = await el.evaluateHandle(el => el.parentElement && el.parentElement.nextSibling);
                return { label: el, content: content };
            }
        }
        return undefined;
    });
}
exports.getResourcesElement = getResourcesElement;
async function ensureResourceSectionIsExpanded(section) {
    await section.label.evaluate(el => {
        el.scrollIntoView();
    });
    const isExpanded = await (0, helper_js_1.hasClass)(section.content, 'expanded');
    if (!isExpanded) {
        await section.label.click();
    }
    await (0, helper_js_1.waitForClass)(section.content, 'expanded');
}
exports.ensureResourceSectionIsExpanded = ensureResourceSectionIsExpanded;
async function extractTableFromResourceSection(resourceContentElement) {
    const table = await resourceContentElement.$('.affected-resource-list');
    if (table) {
        return await table.evaluate(table => {
            const rows = [];
            for (const tableRow of table.childNodes) {
                const row = [];
                for (const cell of tableRow.childNodes) {
                    const requestLinkIcon = cell instanceof HTMLElement && cell.querySelector('devtools-request-link-icon');
                    if (requestLinkIcon) {
                        const label = requestLinkIcon.shadowRoot?.querySelector('[aria-label="Shortened URL"]');
                        row.push(label?.textContent || '');
                    }
                    else {
                        row.push(cell.textContent || '');
                    }
                }
                rows.push(row);
            }
            return rows;
        });
    }
    return undefined;
}
async function waitForTableFromResourceSection(resourceContentElement, predicate) {
    return await (0, helper_js_1.waitForFunction)(async () => {
        const table = await extractTableFromResourceSection(resourceContentElement);
        if (!table || predicate(table) !== true) {
            return undefined;
        }
        return table;
    });
}
exports.waitForTableFromResourceSection = waitForTableFromResourceSection;
function waitForTableFromResourceSectionContents(resourceContentElement, expected) {
    return waitForTableFromResourceSection(resourceContentElement, table => (0, helper_js_1.matchStringTable)(table, expected) === true ? true : undefined);
}
exports.waitForTableFromResourceSectionContents = waitForTableFromResourceSectionContents;
async function getGroupByCategoryChecked() {
    const categoryCheckbox = await (0, helper_js_1.waitFor)(exports.CATEGORY_CHECKBOX);
    return await categoryCheckbox.evaluate(node => node.checked);
}
exports.getGroupByCategoryChecked = getGroupByCategoryChecked;
async function getGroupByKindChecked() {
    const categoryCheckbox = await (0, helper_js_1.waitFor)(exports.KIND_CHECKBOX);
    return await categoryCheckbox.evaluate(node => node.checked);
}
exports.getGroupByKindChecked = getGroupByKindChecked;
async function revealNodeInElementsPanel() {
    const revealIcon = await (0, helper_js_1.waitFor)(exports.ELEMENT_REVEAL_ICON);
    await revealIcon.click();
}
exports.revealNodeInElementsPanel = revealNodeInElementsPanel;
async function revealViolatingSourcesLines() {
    const sourcesLink = await (0, helper_js_1.waitFor)(exports.SOURCES_LINK);
    await sourcesLink.click();
}
exports.revealViolatingSourcesLines = revealViolatingSourcesLines;
async function toggleGroupByCategory() {
    const wasChecked = await getGroupByCategoryChecked();
    const categoryCheckbox = await (0, helper_js_1.waitFor)(exports.CATEGORY_CHECKBOX);
    // Invoke `click()` directly on the checkbox to toggle while hidden.
    await categoryCheckbox.evaluate(checkbox => checkbox.click());
    if (wasChecked) {
        await (0, helper_js_1.waitFor)(exports.ISSUE);
    }
    else {
        await (0, helper_js_1.waitFor)(exports.CATEGORY);
    }
}
exports.toggleGroupByCategory = toggleGroupByCategory;
async function toggleGroupByKind() {
    const wasChecked = await getGroupByKindChecked();
    const kindCheckbox = await (0, helper_js_1.waitFor)(exports.KIND_CHECKBOX);
    // Invoke `click()` directly on the checkbox to toggle while hidden.
    await kindCheckbox.evaluate(checkbox => checkbox.click());
    if (wasChecked) {
        await (0, helper_js_1.waitFor)(exports.ISSUE);
    }
    else {
        await (0, helper_js_1.waitFor)(exports.KIND);
    }
}
exports.toggleGroupByKind = toggleGroupByKind;
//# sourceMappingURL=issues-helpers.js.map