"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
function createUrlFilter(url) {
    return `-url:${url}`;
}
function collectSourceUrlsFromConsoleOutput(frontend) {
    return frontend.evaluate(CONSOLE_MESSAGE_WRAPPER_SELECTOR => {
        return Array.from(document.querySelectorAll(CONSOLE_MESSAGE_WRAPPER_SELECTOR)).map(wrapper => {
            return wrapper.querySelector('.devtools-link').textContent.split(':')[0];
        });
    }, console_helpers_js_1.CONSOLE_MESSAGE_WRAPPER_SELECTOR);
}
function getExpectedMessages(unfilteredMessages, filter) {
    return unfilteredMessages.filter((msg) => {
        return filter(msg);
    });
}
async function testMessageFilter(filter, expectedMessageFilter) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    let unfilteredMessages;
    const showMessagesWithAnchor = true;
    await (0, helper_js_1.step)('navigate to console-filter.html and get console messages', async () => {
        unfilteredMessages = await (0, console_helpers_js_1.getConsoleMessages)('console-filter', showMessagesWithAnchor);
    });
    await (0, helper_js_1.step)(`filter to only show messages containing '${filter}'`, async () => {
        await (0, console_helpers_js_1.filterConsoleMessages)(frontend, filter);
    });
    await (0, helper_js_1.step)('check that messages are correctly filtered', async () => {
        const filteredMessages = await (0, console_helpers_js_1.getCurrentConsoleMessages)(showMessagesWithAnchor);
        const expectedMessages = getExpectedMessages(unfilteredMessages, expectedMessageFilter);
        chai_1.assert.isNotEmpty(filteredMessages);
        chai_1.assert.deepEqual(filteredMessages, expectedMessages);
    });
}
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.it)('shows logged messages', async () => {
        let messages;
        const withAnchor = true;
        await (0, helper_js_1.step)('navigate to console-filter.html and get console messages', async () => {
            messages = await (0, console_helpers_js_1.getConsoleMessages)('console-filter', withAnchor);
        });
        await (0, helper_js_1.step)('check that all console messages appear', async () => {
            chai_1.assert.deepEqual(messages, [
                'console-filter.html:10 1topGroup: log1()',
                'log-source.js:6 2topGroup: log2()',
                'console-filter.html:10 3topGroup: log1()',
                'console-filter.html:17 enter outerGroup',
                'console-filter.html:10 1outerGroup: log1()',
                'log-source.js:6 2outerGroup: log2()',
                'console-filter.html:21 enter innerGroup1',
                'console-filter.html:10 1innerGroup1: log1()',
                'log-source.js:6 2innerGroup1: log2()',
                'console-filter.html:26 enter innerGroup2',
                'console-filter.html:10 1innerGroup2: log1()',
                'log-source.js:6 2innerGroup2: log2()',
                'console-filter.html:10 4topGroup: log1()',
                'log-source.js:6 5topGroup: log2()',
                'console-filter.html:38 Hello 1',
                'console-filter.html:39 Hello 2',
                'console-filter.html:42 end',
            ]);
        });
    });
    (0, mocha_extensions_js_1.it)('shows messages from all levels', async () => {
        let messages;
        const withAnchor = true;
        await (0, helper_js_1.step)('navigate to console-filter.html and get console messages', async () => {
            messages = await (0, console_helpers_js_1.getConsoleMessages)('console-filter', withAnchor, console_helpers_js_1.showVerboseMessages);
        });
        await (0, helper_js_1.step)('ensure that all levels are logged', async () => {
            const allLevelsDropdown = await (0, helper_js_1.$)('[aria-label^="Log level: All levels"]');
            chai_1.assert.isNotNull(allLevelsDropdown);
        });
        await (0, helper_js_1.step)('check that all console messages appear', async () => {
            chai_1.assert.deepEqual(messages, [
                'console-filter.html:10 1topGroup: log1()',
                'log-source.js:6 2topGroup: log2()',
                'console-filter.html:10 3topGroup: log1()',
                'console-filter.html:17 enter outerGroup',
                'console-filter.html:10 1outerGroup: log1()',
                'log-source.js:6 2outerGroup: log2()',
                'console-filter.html:21 enter innerGroup1',
                'console-filter.html:10 1innerGroup1: log1()',
                'log-source.js:6 2innerGroup1: log2()',
                'console-filter.html:26 enter innerGroup2',
                'console-filter.html:10 1innerGroup2: log1()',
                'log-source.js:6 2innerGroup2: log2()',
                'console-filter.html:10 4topGroup: log1()',
                'log-source.js:6 5topGroup: log2()',
                'console-filter.html:38 Hello 1',
                'console-filter.html:39 Hello 2',
                'console-filter.html:41 verbose debug message',
                'console-filter.html:42 end',
            ]);
        });
    });
    (0, mocha_extensions_js_1.it)('can exclude messages from a source url', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        let sourceUrls;
        let uniqueUrls = new Set();
        await (0, helper_js_1.step)('navigate to console-filter.html and wait for console messages', async () => {
            await (0, console_helpers_js_1.getConsoleMessages)('console-filter');
        });
        await (0, helper_js_1.step)('collect source urls from all messages', async () => {
            sourceUrls = await collectSourceUrlsFromConsoleOutput(frontend);
        });
        await (0, helper_js_1.step)('find unique urls', async () => {
            uniqueUrls = new Set(sourceUrls);
            chai_1.assert.isNotEmpty(uniqueUrls);
        });
        for (const urlToExclude of uniqueUrls) {
            const filter = createUrlFilter(urlToExclude);
            const expectedMessageFilter = msg => {
                if (msg.includes('enter')) {
                    return true;
                }
                // When we exclude "log-source.js", all groups match,
                // as they are created from "console-filter.html".
                // When a group matches, its content is fully shown.
                if (msg.includes('log-source') && (msg.includes('innerGroup') || msg.includes('outerGroup'))) {
                    return true;
                }
                return msg.indexOf(urlToExclude) === -1;
            };
            await testMessageFilter(filter, expectedMessageFilter);
            await (0, helper_js_1.step)(`remove filter '${filter}'`, async () => {
                await (0, console_helpers_js_1.deleteConsoleMessagesFilter)(frontend);
            });
        }
    });
    (0, mocha_extensions_js_1.it)('can include messages from a given source url', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        let sourceUrls;
        let uniqueUrls = new Set();
        await (0, helper_js_1.step)('navigate to console-filter.html and wait for console messages', async () => {
            await (0, console_helpers_js_1.getConsoleMessages)('console-filter');
        });
        await (0, helper_js_1.step)('collect source urls from all messages', async () => {
            sourceUrls = await collectSourceUrlsFromConsoleOutput(frontend);
        });
        await (0, helper_js_1.step)('find unique urls', async () => {
            uniqueUrls = new Set(sourceUrls);
            chai_1.assert.isNotEmpty(uniqueUrls);
        });
        for (const urlToKeep of uniqueUrls) {
            const filter = urlToKeep;
            const expectedMessageFilter = msg => {
                if (msg.includes('enter')) {
                    return true;
                }
                // When we include from any of the two URLs, all groups match.
                // When a group matches, its content is fully shown.
                if (msg.includes('log-source') && (msg.includes('innerGroup') || msg.includes('outerGroup'))) {
                    return true;
                }
                return msg.indexOf(urlToKeep) !== -1;
            };
            await testMessageFilter(filter, expectedMessageFilter);
            await (0, helper_js_1.step)(`remove filter '${filter}'`, async () => {
                await (0, console_helpers_js_1.deleteConsoleMessagesFilter)(frontend);
            });
        }
    });
    (0, mocha_extensions_js_1.it)('can apply empty filter', async () => {
        const filter = '';
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const expectedMessageFilter = _ => true;
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply text filter matching outer group title', async () => {
        const filter = 'enter outerGroup';
        const expectedMessageFilter = msg => {
            // If the group title matches, all of its content should be shown.
            if (msg.includes('outerGroup')) {
                return true;
            }
            if (msg.includes('innerGroup')) {
                return true;
            }
            return false;
        };
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply text filter matching inner group title', async () => {
        const filter = 'enter innerGroup1';
        const expectedMessageFilter = msg => {
            // If the group title matches, all of its content should be shown.
            // In addition, the group titles of parent groups should be shown.
            if (msg.includes('enter outerGroup')) {
                return true;
            }
            if (msg.includes('innerGroup1')) {
                return true;
            }
            return false;
        };
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply text filter matching outer group content', async () => {
        const filter = '1outerGroup';
        const expectedMessageFilter = msg => {
            // If the group title matches, all of its content should be shown.
            if (msg.includes('enter outerGroup')) {
                return true;
            }
            if (msg.includes('1outerGroup')) {
                return true;
            }
            return false;
        };
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply text filter matching inner group content', async () => {
        const filter = '1innerGroup1';
        const expectedMessageFilter = msg => {
            // If the group title matches, all of its content should be shown.
            // In addition, the group titles of parent groups should be shown.
            if (msg.includes('enter outerGroup')) {
                return true;
            }
            if (msg.includes('enter innerGroup1')) {
                return true;
            }
            if (msg.includes('1innerGroup1')) {
                return true;
            }
            return false;
        };
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply text filter matching non-grouped content', async () => {
        const filter = 'topGroup';
        const expectedMessageFilter = msg => {
            // No grouped content is shown.
            if (msg.includes('topGroup')) {
                return true;
            }
            return false;
        };
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply start/end line regex filter', async () => {
        const filter = '/^Hello\\s\\d$/';
        const expectedMessageFilter = msg => {
            return /^console-filter\.html:\d{2}\sHello\s\d$/.test(msg);
        };
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply context filter', async () => {
        const expectedMessageFilter = msg => {
            return msg.indexOf('Hello') !== -1;
        };
        await testMessageFilter('context:context', expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can apply multi text filter', async () => {
        const filter = 'Group /[2-3]top/';
        const expectedMessageFilter = msg => {
            return /[2-3]top/.test(msg);
        };
        await testMessageFilter(filter, expectedMessageFilter);
    });
    (0, mocha_extensions_js_1.it)('can reset filter', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        let unfilteredMessages;
        await (0, helper_js_1.step)('get unfiltered messages', async () => {
            unfilteredMessages = await (0, console_helpers_js_1.getConsoleMessages)('console-filter');
        });
        await (0, helper_js_1.step)('apply message filter', async () => {
            await (0, console_helpers_js_1.filterConsoleMessages)(frontend, 'outer');
        });
        await (0, helper_js_1.step)('delete message filter', async () => {
            void (0, console_helpers_js_1.deleteConsoleMessagesFilter)(frontend);
        });
        await (0, helper_js_1.step)('check if messages are unfiltered', async () => {
            const messages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
            chai_1.assert.deepEqual(messages, unfilteredMessages);
        });
    });
    (0, mocha_extensions_js_1.it)('can exclude CORS error messages', async () => {
        const CORS_DETAILED_ERROR_PATTERN = /Access to fetch at 'https:.*' from origin 'https:.*' has been blocked by CORS policy: .*/;
        const NETWORK_ERROR_PATTERN = /GET https:.* net::ERR_FAILED/;
        const JS_ERROR_PATTERN = /Uncaught \(in promise\) TypeError: Failed to fetch.*/;
        const allMessages = await (0, console_helpers_js_1.getConsoleMessages)('cors-issue', false, () => (0, console_helpers_js_1.waitForConsoleMessagesToBeNonEmpty)(6));
        allMessages.sort();
        chai_1.assert.strictEqual(allMessages.length, 6);
        chai_1.assert.match(allMessages[0], CORS_DETAILED_ERROR_PATTERN);
        chai_1.assert.match(allMessages[1], CORS_DETAILED_ERROR_PATTERN);
        chai_1.assert.match(allMessages[2], NETWORK_ERROR_PATTERN);
        chai_1.assert.match(allMessages[3], NETWORK_ERROR_PATTERN);
        chai_1.assert.match(allMessages[4], JS_ERROR_PATTERN);
        chai_1.assert.match(allMessages[5], JS_ERROR_PATTERN);
        await (0, console_helpers_js_1.toggleShowCorsErrors)();
        const filteredMessages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
        chai_1.assert.strictEqual(2, filteredMessages.length);
        for (const message of filteredMessages) {
            chai_1.assert.match(message, JS_ERROR_PATTERN);
        }
    });
});
//# sourceMappingURL=console-filter_test.js.map