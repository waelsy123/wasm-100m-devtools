"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
(0, mocha_extensions_js_1.describe)('The Sources Tab', async () => {
    (0, mocha_extensions_js_1.it)('sets multiple breakpoints in case of code-splitting', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('sourcemap-codesplit.ts', 'sourcemap-codesplit.html');
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 3);
        for (let i = 0; i < 2; ++i) {
            const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameScriptLocation)(`functions[${i}]();`, target);
            chai_1.assert.deepEqual(scriptLocation, 'sourcemap-codesplit.ts:3');
        }
    });
    async function waitForStackTopMatch(matcher) {
        // The call stack is updated asynchronously, so let us wait until we see the correct one
        // (or report the last one we have seen before timeout).
        let stepLocation = '<no call stack>';
        await (0, helper_js_1.waitForFunctionWithTries)(async () => {
            stepLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameWithoutResuming)() ?? '<invalid>';
            return stepLocation?.match(matcher);
        }, { tries: 10 });
        return stepLocation;
    }
    (0, mocha_extensions_js_1.it)('steps over a source line mapping to a range with several statements', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('sourcemap-stepping-source.js', 'sourcemap-stepping.html');
        let scriptEvaluation;
        // DevTools is contracting long filenames with ellipses.
        // Let us match the location with regexp to match even contracted locations.
        const breakLocationRegExp = /.*source\.js:12$/;
        const stepLocationRegExp = /.*source\.js:13$/;
        await (0, helper_js_1.step)('Run to breakpoint', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 12);
            scriptEvaluation = target.evaluate('singleline();');
            const scriptLocation = await waitForStackTopMatch(breakLocationRegExp);
            chai_1.assert.match(scriptLocation, breakLocationRegExp);
        });
        await (0, helper_js_1.step)('Step over the mapped line', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.STEP_OVER_BUTTON);
            const stepLocation = await waitForStackTopMatch(stepLocationRegExp);
            chai_1.assert.match(stepLocation, stepLocationRegExp);
        });
        await (0, helper_js_1.step)('Resume', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
            await scriptEvaluation;
        });
    });
    (0, mocha_extensions_js_1.it)('steps over a source line with mappings to several adjacent target lines', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('sourcemap-stepping-source.js', 'sourcemap-stepping.html');
        let scriptEvaluation;
        // DevTools is contracting long filenames with ellipses.
        // Let us match the location with regexp to match even contracted locations.
        const breakLocationRegExp = /.*source\.js:4$/;
        const stepLocationRegExp = /.*source\.js:5$/;
        await (0, helper_js_1.step)('Run to breakpoint', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 4);
            scriptEvaluation = target.evaluate('multiline();');
            const scriptLocation = await waitForStackTopMatch(breakLocationRegExp);
            chai_1.assert.match(scriptLocation, breakLocationRegExp);
        });
        await (0, helper_js_1.step)('Step over the mapped line', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.STEP_OVER_BUTTON);
            const stepLocation = await waitForStackTopMatch(stepLocationRegExp);
            chai_1.assert.match(stepLocation, stepLocationRegExp);
        });
        await (0, helper_js_1.step)('Resume', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
            await scriptEvaluation;
        });
    });
    (0, mocha_extensions_js_1.it)('steps out from a function, with source maps available (crbug/1283188)', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('sourcemap-stepping-source.js', 'sourcemap-stepping.html');
        let scriptEvaluation;
        // DevTools is contracting long filenames with ellipses.
        // Let us match the location with regexp to match even contracted locations.
        const breakLocationRegExp = /.*source\.js:4$/;
        const stepLocationRegExp = /sourcemap-stepping.html:6$/;
        await (0, helper_js_1.step)('Run to breakpoint', async () => {
            await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 4);
            scriptEvaluation = target.evaluate('outer();');
            const scriptLocation = await waitForStackTopMatch(breakLocationRegExp);
            chai_1.assert.match(scriptLocation, breakLocationRegExp);
        });
        await (0, helper_js_1.step)('Step out from breakpoint', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.STEP_OUT_BUTTON);
            const stepLocation = await waitForStackTopMatch(stepLocationRegExp);
            chai_1.assert.match(stepLocation, stepLocationRegExp);
        });
        await (0, helper_js_1.step)('Resume', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
            await scriptEvaluation;
        });
    });
    (0, mocha_extensions_js_1.it)('stepping works at the end of a sourcemapped script (crbug/1305956)', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('sourcemap-stepping-at-end.js', 'sourcemap-stepping-at-end.html');
        // DevTools is contracting long filenames with ellipses.
        // Let us match the location with regexp to match even contracted locations.
        const breakLocationRegExp = /.*at-end\.js:2$/;
        const stepLocationRegExp = /.*at-end.html:6$/;
        for (const [description, button] of [
            ['into', sources_helpers_js_1.STEP_INTO_BUTTON],
            ['out', sources_helpers_js_1.STEP_OUT_BUTTON],
            ['over', sources_helpers_js_1.STEP_OVER_BUTTON],
        ]) {
            let scriptEvaluation;
            await (0, helper_js_1.step)('Run to debugger statement', async () => {
                scriptEvaluation = target.evaluate('outer();');
                const scriptLocation = await waitForStackTopMatch(breakLocationRegExp);
                chai_1.assert.match(scriptLocation, breakLocationRegExp);
            });
            await (0, helper_js_1.step)(`Step ${description} from debugger statement`, async () => {
                await (0, helper_js_1.click)(button);
                const stepLocation = await waitForStackTopMatch(stepLocationRegExp);
                chai_1.assert.match(stepLocation, stepLocationRegExp);
            });
            await (0, helper_js_1.step)('Resume', async () => {
                await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
                await scriptEvaluation;
            });
        }
    });
    (0, mocha_extensions_js_1.it)('shows unminified identifiers in scopes and console', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('sourcemap-minified.js', 'sourcemap-minified.html');
        let scriptEvaluation;
        const breakLocationRegExp = /sourcemap-minified\.js:1$/;
        await (0, helper_js_1.step)('Run to debugger statement', async () => {
            scriptEvaluation = target.evaluate('sayHello(" world");');
            const scriptLocation = await waitForStackTopMatch(breakLocationRegExp);
            chai_1.assert.match(scriptLocation, breakLocationRegExp);
        });
        await (0, helper_js_1.step)('Check local variable is eventually un-minified', async () => {
            const unminifiedVariable = 'element: div';
            await (0, sources_helpers_js_1.clickOnContextMenu)('.cm-line', 'Add source map…');
            // Enter the source map URL into the appropriate input box.
            await (0, helper_js_1.waitFor)('.add-source-map');
            await (0, helper_js_1.click)('.add-source-map');
            await (0, helper_js_1.typeText)('sourcemap-minified.map');
            await frontend.keyboard.press('Enter');
            const scopeValues = await (0, helper_js_1.waitForFunction)(async () => {
                const values = await (0, sources_helpers_js_1.getValuesForScope)('Local', 0, 0);
                return (values && values.includes(unminifiedVariable)) ? values : undefined;
            });
            chai_1.assert.include(scopeValues, unminifiedVariable);
        });
        await (0, helper_js_1.step)('Check that expression evaluation understands unminified name', async () => {
            await frontend.evaluate(() => {
                // @ts-ignore
                globalThis.Root.Runtime.experiments.setEnabled('evaluateExpressionsWithSourceMaps', true);
            });
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
            await (0, helper_js_1.pasteText)('`Hello${text}!`');
            await frontend.keyboard.press('Enter');
            // Wait for the console to be usable again.
            await frontend.waitForFunction(() => {
                return document.querySelectorAll('.console-user-command-result').length === 1;
            });
            const messages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
            chai_1.assert.deepEqual(messages, ['\'Hello world!\'']);
            await (0, sources_helpers_js_1.openSourcesPanel)();
        });
        await (0, helper_js_1.step)('Resume', async () => {
            await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
            await scriptEvaluation;
        });
    });
    (0, mocha_extensions_js_1.it)('updates decorators for removed breakpoints in case of code-splitting (crbug.com/1251675)', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('sourcemap-disjoint.js', 'sourcemap-disjoint.html');
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getBreakpointDecorators)(), []);
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 2);
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getBreakpointDecorators)(), [2]);
        await (0, sources_helpers_js_1.removeBreakpointForLine)(frontend, 2);
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getBreakpointDecorators)(), []);
    });
});
(0, mocha_extensions_js_1.describe)('The Elements Tab', async () => {
    (0, mocha_extensions_js_1.it)('links to the right SASS source for inline CSS with relative sourcemap (crbug.com/787792)', async () => {
        await (0, helper_js_1.goToResource)('sources/sourcemap-css-inline-relative.html');
        await (0, helper_js_1.step)('Prepare elements tab', async () => {
            await (0, elements_helpers_js_1.waitForElementsStyleSection)();
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
            await (0, elements_helpers_js_1.focusElementsTree)();
            await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
        });
        const value = await (0, elements_helpers_js_1.waitForCSSPropertyValue)('body .text', 'color', 'green', 'app.scss:6');
        await (0, helper_js_1.click)(value, { clickOptions: { modifier: 'ControlOrMeta' } });
        await (0, helper_js_1.waitForElementWithTextContent)('Line 12, Column 9');
    });
    (0, mocha_extensions_js_1.it)('links to the right SASS source for inline CSS with absolute sourcemap (crbug.com/787792)', async () => {
        await (0, helper_js_1.goToResource)('sources/sourcemap-css-dynamic-link.html');
        await (0, helper_js_1.step)('Prepare elements tab', async () => {
            await (0, elements_helpers_js_1.waitForElementsStyleSection)();
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
            await (0, elements_helpers_js_1.focusElementsTree)();
            await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
        });
        const value = await (0, elements_helpers_js_1.waitForCSSPropertyValue)('body .text', 'color', 'green', 'app.scss:6');
        await (0, helper_js_1.click)(value, { clickOptions: { modifier: 'ControlOrMeta' } });
        await (0, helper_js_1.waitForElementWithTextContent)('Line 12, Column 9');
    });
    (0, mocha_extensions_js_1.it)('links to the right SASS source for dynamically added CSS style tags (crbug.com/787792)', async () => {
        await (0, helper_js_1.goToResource)('sources/sourcemap-css-dynamic.html');
        await (0, helper_js_1.step)('Prepare elements tab', async () => {
            await (0, elements_helpers_js_1.waitForElementsStyleSection)();
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
            await (0, elements_helpers_js_1.focusElementsTree)();
            await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
        });
        const value = await (0, elements_helpers_js_1.waitForCSSPropertyValue)('body .text', 'color', 'green', 'app.scss:6');
        await (0, helper_js_1.click)(value, { clickOptions: { modifier: 'ControlOrMeta' } });
        await (0, helper_js_1.waitForElementWithTextContent)('Line 12, Column 9');
    });
    (0, mocha_extensions_js_1.it)('links to the right SASS source for dynamically added CSS link tags (crbug.com/787792)', async () => {
        await (0, helper_js_1.goToResource)('sources/sourcemap-css-dynamic-link.html');
        await (0, helper_js_1.step)('Prepare elements tab', async () => {
            await (0, elements_helpers_js_1.waitForElementsStyleSection)();
            await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
            await (0, elements_helpers_js_1.focusElementsTree)();
            await (0, elements_helpers_js_1.clickNthChildOfSelectedElementNode)(1);
        });
        const value = await (0, elements_helpers_js_1.waitForCSSPropertyValue)('body .text', 'color', 'green', 'app.scss:6');
        await (0, helper_js_1.click)(value, { clickOptions: { modifier: 'ControlOrMeta' } });
        await (0, helper_js_1.waitForElementWithTextContent)('Line 12, Column 9');
    });
});
//# sourceMappingURL=sourcemap_test.js.map