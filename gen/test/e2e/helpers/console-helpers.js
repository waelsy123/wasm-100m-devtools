"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.clickOnContextMenu = exports.waitForIssueButtonLabel = exports.toggleShowCorsErrors = exports.turnOffHistoryAutocomplete = exports.navigateToIssuesPanelViaInfoBar = exports.waitForConsoleMessageAndClickOnLink = exports.navigateToConsoleTab = exports.switchToTopExecutionContext = exports.unifyLogVM = exports.typeIntoConsoleAndWaitForResult = exports.typeIntoConsole = exports.showVerboseMessages = exports.focusConsolePrompt = exports.getStructuredConsoleMessages = exports.getCurrentConsoleMessages = exports.getConsoleMessages = exports.waitForLastConsoleMessageToHaveContent = exports.waitForConsoleMessagesToBeNonEmpty = exports.filterConsoleMessages = exports.deleteConsoleMessagesFilter = exports.CONSOLE_CREATE_LIVE_EXPRESSION_SELECTOR = exports.SHOW_CORS_ERRORS_SELECTOR = exports.AUTOCOMPLETE_FROM_HISTORY_SELECTOR = exports.CONSOLE_SETTINGS_SELECTOR = exports.CONSOLE_SELECTOR = exports.CONSOLE_MESSAGE_WRAPPER_SELECTOR = exports.STACK_PREVIEW_CONTAINER = exports.CONSOLE_COMPLETION_HINT_SELECTOR = exports.CONSOLE_TOOLTIP_SELECTOR = exports.CONSOLE_VIEW_SELECTOR = exports.CONSOLE_PROMPT_SELECTOR = exports.LOG_LEVELS_VERBOSE_OPTION_SELECTOR = exports.LOG_LEVELS_SELECTOR = exports.CONSOLE_MESSAGE_TEXT_AND_ANCHOR_SELECTOR = exports.CONSOLE_FIRST_MESSAGES_SELECTOR = exports.CONSOLE_MESSAGES_SELECTOR = exports.CONSOLE_TAB_SELECTOR = void 0;
const helper_js_1 = require("../../shared/helper.js");
const async_scope_js_1 = require("../../shared/async-scope.js");
exports.CONSOLE_TAB_SELECTOR = '#tab-console';
exports.CONSOLE_MESSAGES_SELECTOR = '.console-group-messages';
exports.CONSOLE_FIRST_MESSAGES_SELECTOR = '.console-group-messages .source-code .console-message-text';
exports.CONSOLE_MESSAGE_TEXT_AND_ANCHOR_SELECTOR = '.console-group-messages .source-code';
exports.LOG_LEVELS_SELECTOR = '[aria-label^="Log level: "]';
exports.LOG_LEVELS_VERBOSE_OPTION_SELECTOR = '[aria-label^="Verbose"]';
exports.CONSOLE_PROMPT_SELECTOR = '.console-prompt-editor-container';
exports.CONSOLE_VIEW_SELECTOR = '.console-view';
exports.CONSOLE_TOOLTIP_SELECTOR = '.cm-tooltip';
exports.CONSOLE_COMPLETION_HINT_SELECTOR = '.cm-completionHint';
exports.STACK_PREVIEW_CONTAINER = '.stack-preview-container';
exports.CONSOLE_MESSAGE_WRAPPER_SELECTOR = '.console-group-messages .console-message-wrapper';
exports.CONSOLE_SELECTOR = '.console-user-command-result';
exports.CONSOLE_SETTINGS_SELECTOR = '[aria-label^="Console settings"]';
exports.AUTOCOMPLETE_FROM_HISTORY_SELECTOR = '[aria-label^="Autocomplete from history"]';
exports.SHOW_CORS_ERRORS_SELECTOR = '[aria-label^="Show CORS errors in console"]';
exports.CONSOLE_CREATE_LIVE_EXPRESSION_SELECTOR = '[aria-label^="Create live expression"]';
async function deleteConsoleMessagesFilter(frontend) {
    await (0, helper_js_1.waitFor)('.console-main-toolbar');
    const main = await (0, helper_js_1.$)('.console-main-toolbar');
    await frontend.evaluate(n => {
        const deleteButton = n.shadowRoot.querySelector('.search-cancel-button');
        if (deleteButton) {
            deleteButton.click();
        }
    }, main);
}
exports.deleteConsoleMessagesFilter = deleteConsoleMessagesFilter;
async function filterConsoleMessages(frontend, filter) {
    await (0, helper_js_1.waitFor)('.console-main-toolbar');
    const main = await (0, helper_js_1.$)('.console-main-toolbar');
    await frontend.evaluate(n => {
        const toolbar = n.shadowRoot.querySelector('.toolbar-input-prompt.text-prompt');
        toolbar.focus();
    }, main);
    await (0, helper_js_1.pasteText)(filter);
    await frontend.keyboard.press('Enter');
}
exports.filterConsoleMessages = filterConsoleMessages;
async function waitForConsoleMessagesToBeNonEmpty(numberOfMessages) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const messages = await (0, helper_js_1.$$)(exports.CONSOLE_FIRST_MESSAGES_SELECTOR);
        if (messages.length < numberOfMessages) {
            return false;
        }
        const textContents = await Promise.all(messages.map(message => message.evaluate(message => message.textContent || '')));
        return textContents.every(text => text !== '');
    });
}
exports.waitForConsoleMessagesToBeNonEmpty = waitForConsoleMessagesToBeNonEmpty;
async function waitForLastConsoleMessageToHaveContent(expectedTextContent) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const messages = await (0, helper_js_1.$$)(exports.CONSOLE_FIRST_MESSAGES_SELECTOR);
        if (messages.length === 0) {
            return false;
        }
        const lastMessageContent = await messages[messages.length - 1].evaluate(message => message.textContent);
        return lastMessageContent === expectedTextContent;
    });
}
exports.waitForLastConsoleMessageToHaveContent = waitForLastConsoleMessageToHaveContent;
async function getConsoleMessages(testName, withAnchor = false, callback) {
    // Ensure Console is loaded before the page is loaded to avoid a race condition.
    await getCurrentConsoleMessages();
    // Have the target load the page.
    await (0, helper_js_1.goToResource)(`console/${testName}.html`);
    return getCurrentConsoleMessages(withAnchor, callback);
}
exports.getConsoleMessages = getConsoleMessages;
async function getCurrentConsoleMessages(withAnchor = false, callback) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const asyncScope = new async_scope_js_1.AsyncScope();
    await navigateToConsoleTab();
    // Get console messages that were logged.
    await (0, helper_js_1.waitFor)(exports.CONSOLE_MESSAGES_SELECTOR, undefined, asyncScope);
    if (callback) {
        await callback();
    }
    // Ensure all messages are populated.
    await asyncScope.exec(() => frontend.waitForFunction((CONSOLE_FIRST_MESSAGES_SELECTOR) => {
        return Array.from(document.querySelectorAll(CONSOLE_FIRST_MESSAGES_SELECTOR))
            .every(message => message.childNodes.length > 0);
    }, { timeout: 0 }, exports.CONSOLE_FIRST_MESSAGES_SELECTOR));
    const selector = withAnchor ? exports.CONSOLE_MESSAGE_TEXT_AND_ANCHOR_SELECTOR : exports.CONSOLE_FIRST_MESSAGES_SELECTOR;
    // FIXME(crbug/1112692): Refactor test to remove the timeout.
    await (0, helper_js_1.timeout)(100);
    // Get the messages from the console.
    return frontend.evaluate(selector => {
        return Array.from(document.querySelectorAll(selector)).map(message => message.textContent);
    }, selector);
}
exports.getCurrentConsoleMessages = getCurrentConsoleMessages;
async function getStructuredConsoleMessages() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const asyncScope = new async_scope_js_1.AsyncScope();
    await navigateToConsoleTab();
    // Get console messages that were logged.
    await (0, helper_js_1.waitFor)(exports.CONSOLE_MESSAGES_SELECTOR, undefined, asyncScope);
    // Ensure all messages are populated.
    await asyncScope.exec(() => frontend.waitForFunction((CONSOLE_FIRST_MESSAGES_SELECTOR) => {
        return Array.from(document.querySelectorAll(CONSOLE_FIRST_MESSAGES_SELECTOR))
            .every(message => message.childNodes.length > 0);
    }, { timeout: 0 }, exports.CONSOLE_FIRST_MESSAGES_SELECTOR));
    return frontend.evaluate((CONSOLE_MESSAGE_WRAPPER_SELECTOR, STACK_PREVIEW_CONTAINER) => {
        return Array.from(document.querySelectorAll(CONSOLE_MESSAGE_WRAPPER_SELECTOR)).map(wrapper => {
            const message = wrapper.querySelector('.console-message-text').textContent;
            const source = wrapper.querySelector('.devtools-link').textContent;
            const consoleMessage = wrapper.querySelector('.console-message');
            const repeatCount = wrapper.querySelector('.console-message-repeat-count');
            const stackPreviewRoot = wrapper.querySelector('.hidden > span');
            const stackPreview = stackPreviewRoot ? stackPreviewRoot.shadowRoot.querySelector(STACK_PREVIEW_CONTAINER) : null;
            return {
                message,
                messageClasses: consoleMessage.className,
                repeatCount: repeatCount ? repeatCount.textContent : null,
                source,
                stackPreview: stackPreview ? stackPreview.textContent : null,
                wrapperClasses: wrapper.className,
            };
        });
    }, exports.CONSOLE_MESSAGE_WRAPPER_SELECTOR, exports.STACK_PREVIEW_CONTAINER);
}
exports.getStructuredConsoleMessages = getStructuredConsoleMessages;
async function focusConsolePrompt() {
    await (0, helper_js_1.waitFor)(exports.CONSOLE_PROMPT_SELECTOR);
    await (0, helper_js_1.click)(exports.CONSOLE_PROMPT_SELECTOR);
    await (0, helper_js_1.waitFor)('[aria-label="Console prompt"]');
    // FIXME(crbug/1112692): Refactor test to remove the timeout.
    await (0, helper_js_1.timeout)(50);
}
exports.focusConsolePrompt = focusConsolePrompt;
async function showVerboseMessages() {
    await (0, helper_js_1.click)(exports.LOG_LEVELS_SELECTOR);
    await (0, helper_js_1.click)(exports.LOG_LEVELS_VERBOSE_OPTION_SELECTOR);
}
exports.showVerboseMessages = showVerboseMessages;
async function typeIntoConsole(frontend, message) {
    const asyncScope = new async_scope_js_1.AsyncScope();
    const consoleElement = await (0, helper_js_1.waitFor)(exports.CONSOLE_PROMPT_SELECTOR, undefined, asyncScope);
    await consoleElement.type(message);
    // Wait for autocomplete text to catch up.
    const line = await (0, helper_js_1.waitFor)('[aria-label="Console prompt"]', consoleElement, asyncScope);
    const autocomplete = await (0, helper_js_1.$)(exports.CONSOLE_TOOLTIP_SELECTOR);
    // The autocomplete element doesn't exist until the first autocomplete suggestion
    // is actually given.
    // Sometimes the autocomplete suggests `assert` when typing `console.clear()` which made a test flake.
    // The following checks if there is any autocomplete text and dismisses it by pressing escape.
    if (autocomplete && await autocomplete.evaluate(e => e.textContent)) {
        consoleElement.press('Escape');
    }
    await asyncScope.exec(() => frontend.waitForFunction((msg, ln) => ln.textContent === msg, { timeout: 0 }, message, line));
    await consoleElement.press('Enter');
}
exports.typeIntoConsole = typeIntoConsole;
async function typeIntoConsoleAndWaitForResult(frontend, message) {
    // Get the current number of console results so we can check we increased it.
    const originalLength = await frontend.evaluate(() => {
        return document.querySelectorAll('.console-user-command-result').length;
    });
    await typeIntoConsole(frontend, message);
    await new async_scope_js_1.AsyncScope().exec(() => frontend.waitForFunction((originalLength) => {
        return document.querySelectorAll('.console-user-command-result').length === originalLength + 1;
    }, { timeout: 0 }, originalLength));
}
exports.typeIntoConsoleAndWaitForResult = typeIntoConsoleAndWaitForResult;
async function unifyLogVM(actualLog, expectedLog) {
    const actualLogArray = actualLog.split('\n');
    const expectedLogArray = expectedLog.split('\n');
    if (actualLogArray.length !== expectedLogArray.length) {
        throw 'logs are not the same length';
    }
    for (let index = 0; index < actualLogArray.length; index++) {
        const repl = actualLogArray[index].match(/VM\d+:/g);
        if (repl) {
            expectedLogArray[index] = expectedLogArray[index].replace(/VM\d+:/g, repl[0]);
        }
    }
    return expectedLogArray.join('\n');
}
exports.unifyLogVM = unifyLogVM;
async function switchToTopExecutionContext(frontend) {
    const dropdown = await (0, helper_js_1.waitFor)('[aria-label^="JavaScript context:"]');
    // Use keyboard to open drop down, select first item.
    await dropdown.press('Space');
    await frontend.keyboard.press('Home');
    await frontend.keyboard.press('Space');
    // Double-check that it worked.
    await (0, helper_js_1.waitFor)('[aria-label="JavaScript context: top"]');
}
exports.switchToTopExecutionContext = switchToTopExecutionContext;
async function navigateToConsoleTab() {
    // Locate the button for switching to the console tab.
    await (0, helper_js_1.click)(exports.CONSOLE_TAB_SELECTOR);
    await (0, helper_js_1.waitFor)(exports.CONSOLE_VIEW_SELECTOR);
}
exports.navigateToConsoleTab = navigateToConsoleTab;
async function waitForConsoleMessageAndClickOnLink() {
    const consoleMessage = await (0, helper_js_1.waitFor)('div.console-group-messages span.source-code');
    await (0, helper_js_1.click)('span.devtools-link', { root: consoleMessage });
}
exports.waitForConsoleMessageAndClickOnLink = waitForConsoleMessageAndClickOnLink;
async function navigateToIssuesPanelViaInfoBar() {
    // Navigate to Issues panel
    await (0, helper_js_1.waitFor)('#console-issues-counter');
    await (0, helper_js_1.click)('#console-issues-counter');
    await (0, helper_js_1.waitFor)('.issues-pane');
}
exports.navigateToIssuesPanelViaInfoBar = navigateToIssuesPanelViaInfoBar;
async function turnOffHistoryAutocomplete() {
    await (0, helper_js_1.click)(exports.CONSOLE_SETTINGS_SELECTOR);
    await (0, helper_js_1.waitFor)(exports.AUTOCOMPLETE_FROM_HISTORY_SELECTOR);
    await (0, helper_js_1.click)(exports.AUTOCOMPLETE_FROM_HISTORY_SELECTOR);
}
exports.turnOffHistoryAutocomplete = turnOffHistoryAutocomplete;
async function toggleShowCorsErrors() {
    await (0, helper_js_1.click)(exports.CONSOLE_SETTINGS_SELECTOR);
    await (0, helper_js_1.waitFor)(exports.SHOW_CORS_ERRORS_SELECTOR);
    await (0, helper_js_1.click)(exports.SHOW_CORS_ERRORS_SELECTOR);
    await (0, helper_js_1.click)(exports.CONSOLE_SETTINGS_SELECTOR);
}
exports.toggleShowCorsErrors = toggleShowCorsErrors;
async function getIssueButtonLabel() {
    const infobarButton = await (0, helper_js_1.waitFor)('#console-issues-counter');
    const iconButton = await (0, helper_js_1.waitFor)('icon-button', infobarButton);
    const titleElement = await (0, helper_js_1.waitFor)('.icon-button-title', iconButton);
    (0, helper_js_1.assertNotNullOrUndefined)(titleElement);
    const infobarButtonText = await titleElement.evaluate(node => node.textContent);
    return infobarButtonText;
}
async function waitForIssueButtonLabel(expectedLabel) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const label = await getIssueButtonLabel();
        return expectedLabel === label;
    });
}
exports.waitForIssueButtonLabel = waitForIssueButtonLabel;
async function clickOnContextMenu(selectorForNode, ctxMenuItemName) {
    const node = await (0, helper_js_1.waitFor)(selectorForNode);
    await (0, helper_js_1.click)(node, { clickOptions: { button: 'right' } });
    const copyButton = await (0, helper_js_1.waitForAria)(ctxMenuItemName);
    await copyButton.click();
}
exports.clickOnContextMenu = clickOnContextMenu;
//# sourceMappingURL=console-helpers.js.map