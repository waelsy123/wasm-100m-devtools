"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('The Console Tab', async () => {
    (0, mocha_extensions_js_1.beforeEach)(async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.typeText)('let object = {a:1, b:2}; let map = new Map([["somekey", 5], ["some other key", 42]])');
        await frontend.keyboard.press('Enter');
        // Wait for the console to be usable again.
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 1;
        });
    });
    afterEach(async () => {
        // Make sure we don't close DevTools while there is an outstanding
        // Runtime.evaluate CDP request, which causes an error. crbug.com/1134579.
        await (0, sources_helpers_js_1.openSourcesPanel)();
    });
    // See the comments in console-repl-mode_test to see why this is necessary.
    async function objectAutocompleteTest(textAfterObject) {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        const appearPromise = (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await (0, helper_js_1.typeText)('object');
        await appearPromise;
        const disappearPromise = (0, helper_js_1.waitForNone)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await frontend.keyboard.press('Escape');
        await disappearPromise;
        const appearPromise2 = (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
        await (0, helper_js_1.typeText)(textAfterObject);
        await appearPromise2;
        // The first auto-suggest result is evaluated and generates a preview, which
        // we wait for so that we don't end the test/navigate with an open
        // Runtime.evaluate CDP request, which causes an error. crbug.com/1134579.
        await (0, helper_js_1.waitFor)('.console-eager-inner-preview > span');
    }
    (0, mocha_extensions_js_1.it)('triggers autocompletion for `object.`', async () => {
        await objectAutocompleteTest('.');
    });
    (0, mocha_extensions_js_1.it)('triggers autocompletion for `object?.`', async () => {
        await objectAutocompleteTest('?.');
    });
    (0, mocha_extensions_js_1.it)('triggers autocompletion for `object[`', async () => {
        await objectAutocompleteTest('[');
    });
    (0, mocha_extensions_js_1.describe)('triggers autocompletion for maps', () => {
        async function typeMapGetter() {
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            const appearPromise = (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
            await (0, helper_js_1.typeText)('map.get');
            await appearPromise;
            const disappearPromise = (0, helper_js_1.waitForNone)(console_helpers_js_1.CONSOLE_TOOLTIP_SELECTOR);
            await frontend.keyboard.press('Escape');
            await disappearPromise;
            const appearPromise2 = (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_COMPLETION_HINT_SELECTOR);
            await (0, helper_js_1.typeText)('(');
            await appearPromise2;
            await (0, helper_js_1.waitForFunction)(async () => {
                const completionHint = await (0, helper_js_1.waitFor)(console_helpers_js_1.CONSOLE_COMPLETION_HINT_SELECTOR);
                return await completionHint.evaluate(node => node.textContent === '"somekey")');
            });
            // Even though the completion hint has the correct contents, there are no atomic DOM updates
            // for the console input. This means that there is a race condition between when CodeMirror
            // has finished computing the completion hint (and written it to the DOM) and when it is
            // ready to receive further key inputs. This typically happens near instantly, but it is
            // possible for another task to be inserted in between these two events. Since we are
            // writing to the DOM, 100ms timeout is sufficient to flush the DOM and let all of the components
            // be in sync.
            await (0, helper_js_1.timeout)(100);
        }
        (0, mocha_extensions_js_1.it)('can select the first key result', async () => {
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            await typeMapGetter();
            const completionPromise = (0, helper_js_1.waitForNone)(console_helpers_js_1.CONSOLE_COMPLETION_HINT_SELECTOR);
            await (0, helper_js_1.tabForward)();
            await completionPromise;
            await frontend.keyboard.press('Enter');
            await frontend.waitForFunction(() => {
                return document.querySelectorAll('.console-user-command-result').length === 2;
            });
            await (0, console_helpers_js_1.waitForLastConsoleMessageToHaveContent)('5');
        });
        (0, mocha_extensions_js_1.it)('can select the second key result', async () => {
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            await typeMapGetter();
            // Select the second key by pressing the arrow down.
            // Keys should be ordered by appearance in the original `Map.keys()` array
            await frontend.keyboard.press('ArrowDown');
            await frontend.waitForFunction(() => {
                return document.querySelectorAll('.console-eager-inner-preview').length === 1 &&
                    document.querySelectorAll('.console-eager-inner-preview')[0].textContent === '42';
            });
            const completionPromise = (0, helper_js_1.waitForNone)(console_helpers_js_1.CONSOLE_COMPLETION_HINT_SELECTOR);
            await (0, helper_js_1.tabForward)();
            await completionPromise;
            await frontend.keyboard.press('Enter');
            await frontend.waitForFunction(() => {
                return document.querySelectorAll('.console-user-command-result').length === 2;
            });
            await (0, console_helpers_js_1.waitForLastConsoleMessageToHaveContent)('42');
        });
    });
});
//# sourceMappingURL=console-autocomplete_test.js.map