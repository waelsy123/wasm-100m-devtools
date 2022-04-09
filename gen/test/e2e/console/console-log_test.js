"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
/* eslint-disable no-console */
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    const tests = [
        {
            description: 'produces console messages when a page logs using console.log',
            evaluate: () => console.log('log'),
            expectedMessages: [{
                    message: 'log',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:1',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                }],
        },
        {
            description: 'produces console messages when a page logs using console.debug',
            evaluate: () => console.debug('debug'),
            expectedMessages: [{
                    message: 'debug',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:1',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-verbose-level',
                }],
        },
        {
            description: 'produces console messages when a page logs using console.warn',
            evaluate: () => console.warn('warn'),
            expectedMessages: [{
                    message: 'warn',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:1',
                    stackPreview: '\n(anonymous) @ __puppeteer_evaluation_script__:1',
                    wrapperClasses: 'console-message-wrapper console-from-api console-warning-level',
                }],
        },
        {
            description: 'produces console messages when a page logs using console.error',
            evaluate: () => console.error('error'),
            expectedMessages: [{
                    message: 'error',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:1',
                    stackPreview: '\n(anonymous) @ __puppeteer_evaluation_script__:1',
                    wrapperClasses: 'console-message-wrapper console-from-api console-error-level',
                }],
        },
        {
            description: 'produces a single console message when messages are repeated',
            evaluate: () => {
                for (let i = 0; i < 5; ++i) {
                    console.log('repeated');
                }
            },
            expectedMessages: [{
                    message: 'repeated',
                    messageClasses: 'console-message repeated-message',
                    repeatCount: '5',
                    source: '__puppeteer_evaluation_script__:3',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                }],
        },
        {
            description: 'counts how many time console.count has been called with the same message',
            evaluate: () => {
                for (let i = 0; i < 2; ++i) {
                    console.count('count');
                }
            },
            expectedMessages: [
                {
                    message: 'count: 1',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:3',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
                {
                    message: 'count: 2',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:3',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
            ],
        },
        {
            description: 'creates an empty group message using console.group/console.groupEnd',
            evaluate: () => {
                console.group('group');
                console.groupEnd();
            },
            expectedMessages: [
                {
                    message: 'group',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:2',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-group-title console-from-api console-info-level',
                },
            ],
        },
        {
            description: 'logs multiple arguments using console.log',
            evaluate: () => {
                console.log('1', '2', '3');
            },
            expectedMessages: [
                {
                    message: '1 2 3',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:2',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
            ],
        },
        {
            description: 'creates a collapsed group using console.groupCollapsed with all messages in between hidden',
            evaluate: () => {
                console.groupCollapsed('groupCollapsed');
                console.log({ property: 'value' });
                console.log(42);
                console.log(true);
                console.log(null);
                console.log(undefined);
                console.log(document);
                console.log(function () { });
                console.log(function f() { });
                console.log([1, 2, 3]);
                console.log(/regexp.*/);
                console.groupEnd();
            },
            expectedMessages: [
                {
                    message: 'groupCollapsed',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:2',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-group-title console-from-api console-info-level',
                },
            ],
        },
        {
            description: 'logs console.count messages with and without arguments',
            evaluate: () => {
                console.count();
                console.count();
                console.count();
                console.count('title');
                console.count('title');
                console.count('title');
            },
            expectedMessages: [
                {
                    message: 'default: 1',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:2',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
                {
                    message: 'default: 2',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:3',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
                {
                    message: 'default: 3',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:4',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
                {
                    message: 'title: 1',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:5',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
                {
                    message: 'title: 2',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:6',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
                {
                    message: 'title: 3',
                    messageClasses: 'console-message',
                    repeatCount: null,
                    source: '__puppeteer_evaluation_script__:7',
                    stackPreview: null,
                    wrapperClasses: 'console-message-wrapper console-from-api console-info-level',
                },
            ],
        },
    ];
    for (const test of tests) {
        (0, mocha_extensions_js_1.it)(test.description, async () => {
            const { target } = (0, helper_js_1.getBrowserAndPages)();
            await (0, console_helpers_js_1.navigateToConsoleTab)();
            await (0, console_helpers_js_1.showVerboseMessages)();
            await target.evaluate(test.evaluate);
            const actualMessages = await (0, helper_js_1.waitForFunction)(async () => {
                const messages = await (0, console_helpers_js_1.getStructuredConsoleMessages)();
                return messages.length === test.expectedMessages.length ? messages : undefined;
            });
            chai_1.assert.deepEqual(actualMessages, test.expectedMessages, 'Console message does not match the expected message');
        });
    }
    (0, mocha_extensions_js_1.describe)('keyboard navigation', () => {
        (0, mocha_extensions_js_1.it)('can navigate between individual messages', async () => {
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            await (0, console_helpers_js_1.getConsoleMessages)('focus-interaction');
            await (0, console_helpers_js_1.focusConsolePrompt)();
            await (0, helper_js_1.tabBackward)();
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementTextContent)(), 'focus-interaction.html:9');
            await frontend.keyboard.press('ArrowUp');
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementTextContent)(), 'focus-interaction.html:9 Third message');
            await frontend.keyboard.press('ArrowUp');
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementTextContent)(), 'focus-interaction.html:8');
            await frontend.keyboard.press('ArrowDown');
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementTextContent)(), 'focus-interaction.html:9 Third message');
            await (0, helper_js_1.tabBackward)(); // Focus should now be on the console settings, e.g. out of the list of console messages
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementAccessibleName)(), 'Console settings');
            await (0, helper_js_1.tabForward)(); // Focus is now back to the list, selecting the last message source URL
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementTextContent)(), 'focus-interaction.html:9');
            await (0, helper_js_1.tabForward)();
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementAccessibleName)(), 'Console prompt');
        });
        (0, mocha_extensions_js_1.it)('should not lose focus on prompt when logging and scrolling', async () => {
            const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
            await (0, console_helpers_js_1.getConsoleMessages)('focus-interaction');
            await (0, console_helpers_js_1.focusConsolePrompt)();
            await target.evaluate(() => {
                console.log('New message');
            });
            await (0, console_helpers_js_1.waitForLastConsoleMessageToHaveContent)('New message');
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementAccessibleName)(), 'Console prompt');
            await target.evaluate(() => {
                for (let i = 0; i < 100; i++) {
                    console.log(`Message ${i}`);
                }
            });
            await (0, console_helpers_js_1.waitForLastConsoleMessageToHaveContent)('Message 99');
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementAccessibleName)(), 'Console prompt');
            const consolePrompt = await (0, helper_js_1.activeElement)();
            const wrappingBox = await consolePrompt.boundingBox();
            if (!wrappingBox) {
                throw new Error('Can\'t compute bounding box of console prompt.');
            }
            // +20 to move from the top left point so we are definitely scrolling
            // within the container
            await frontend.mouse.move(wrappingBox.x + 20, wrappingBox.y + 5);
            await frontend.mouse.wheel({ deltaY: -500 });
            chai_1.assert.strictEqual(await (0, helper_js_1.activeElementAccessibleName)(), 'Console prompt');
        });
    });
    (0, mocha_extensions_js_1.describe)('Console log message formatters', () => {
        async function getConsoleMessageTextChunksWithStyle(frontend, styles = []) {
            return await frontend.evaluate((selector, styles) => {
                return [...document.querySelectorAll(selector)].map(message => [...message.childNodes].map(node => {
                    // For all nodes, extract text.
                    const result = [node.textContent];
                    // For element nodes, get the requested styles.
                    for (const style of styles) {
                        result.push(node.style?.[style] ?? '');
                    }
                    return result;
                }));
            }, console_helpers_js_1.CONSOLE_FIRST_MESSAGES_SELECTOR, styles);
        }
        async function waitForConsoleMessages(count) {
            await (0, helper_js_1.waitForFunction)(async () => {
                const messages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
                return messages.length === count ? messages : null;
            });
        }
        (0, mocha_extensions_js_1.it)('expand primitive formatters', async () => {
            const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
            await (0, console_helpers_js_1.navigateToConsoleTab)();
            await target.evaluate(() => {
                console.log('--%s--', 'text');
                console.log('--%s--', '%s%i', 'u', 2);
                console.log('Number %i', 42);
                console.log('Float %f', 1.5);
            });
            await waitForConsoleMessages(4);
            const texts = await getConsoleMessageTextChunksWithStyle(frontend);
            chai_1.assert.deepEqual(texts, [[['--text--']], [['--u2--']], [['Number 42']], [['Float 1.5']]]);
        });
        (0, mocha_extensions_js_1.it)('expand %c formatter with color style', async () => {
            const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
            await (0, console_helpers_js_1.navigateToConsoleTab)();
            await target.evaluate(() => console.log('PRE%cRED%cBLUE', 'color:red', 'color:blue'));
            await waitForConsoleMessages(1);
            // Extract the text and color.
            const textsAndStyles = await getConsoleMessageTextChunksWithStyle(frontend, ['color']);
            chai_1.assert.deepEqual(textsAndStyles, [[['PRE', ''], ['RED', 'red'], ['BLUE', 'blue']]]);
        });
        (0, mocha_extensions_js_1.it)('expand %c formatter with background image in data URL', async () => {
            const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
            await (0, console_helpers_js_1.navigateToConsoleTab)();
            await target.evaluate(() => console.log('PRE%cBG', 'background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAAAAABzHgM7AAAAF0lEQVR42mM4Awb/wYCBYg6EgghRzAEAWDWBGQVyKPMAAAAASUVORK5CYII=);'));
            await waitForConsoleMessages(1);
            // Check that the 'BG' text has the background image set.
            const textsAndStyles = await getConsoleMessageTextChunksWithStyle(frontend, ['background-image']);
            chai_1.assert.strictEqual(textsAndStyles.length, 1);
            const message = textsAndStyles[0];
            chai_1.assert.strictEqual(message.length, 2);
            const textWithBackground = message[1];
            chai_1.assert.strictEqual(textWithBackground[0], 'BG');
            chai_1.assert.include(textWithBackground[1], 'data:image/png;base64');
        });
        (0, mocha_extensions_js_1.it)('filter out %c formatter if background image is remote URL', async () => {
            const { frontend, target } = (0, helper_js_1.getBrowserAndPages)();
            await (0, console_helpers_js_1.navigateToConsoleTab)();
            await target.evaluate(() => console.log('PRE%cBG', 'background-image: url(http://localhost/image.png)'));
            await waitForConsoleMessages(1);
            // Check that the 'BG' text has no bakcground image.
            const textsAndStyles = await getConsoleMessageTextChunksWithStyle(frontend, ['background-image']);
            chai_1.assert.deepEqual(textsAndStyles, [[['PRE', ''], ['BG', '']]]);
        });
    });
});
//# sourceMappingURL=console-log_test.js.map