"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenForSourceFilesAdded = exports.waitForSourceLoadedEvent = exports.listenForSourceFilesLoaded = exports.reloadPageAndWaitForSourceFile = exports.retrieveTopCallFrameWithoutResuming = exports.retrieveTopCallFrameScriptLocation = exports.switchToCallFrame = exports.getCallFrameLocations = exports.getCallFrameNames = exports.getExecutionLineText = exports.getExecutionLine = exports.executionLineHighlighted = exports.getNonBreakableLines = exports.getBreakpointDecorators = exports.checkBreakpointDidNotActivate = exports.isBreakpointSet = exports.sourceLineNumberSelector = exports.removeBreakpointForLine = exports.addBreakpointForLine = exports.getToolbarText = exports.waitForHighlightedLine = exports.waitForHighlightedLineWhichIncludesText = exports.getOpenSources = exports.getSelectedSource = exports.openSourceCodeEditorForFile = exports.openFileInEditor = exports.createNewSnippet = exports.openSnippetsSubPane = exports.createNewRecording = exports.openRecorderSubPane = exports.openFileInSourcesPanel = exports.openSourcesPanel = exports.doubleClickSourceTreeItem = exports.getLineNumberElement = exports.navigateToLine = exports.DEBUGGER_PAUSED_EVENT = exports.TURNED_ON_PAUSE_BUTTON_SELECTOR = exports.TURNED_OFF_PAUSE_BUTTON_SELECTOR = exports.STEP_OUT_BUTTON = exports.STEP_OVER_BUTTON = exports.STEP_INTO_BUTTON = exports.SELECTED_THREAD_SELECTOR = exports.SCOPE_LOCAL_VALUES_SELECTOR = exports.CODE_LINE_SELECTOR = exports.PAUSE_INDICATOR_SELECTOR = exports.SOURCES_LINES_SELECTOR = exports.RESUME_BUTTON = exports.PAUSE_BUTTON = exports.PAUSE_ON_EXCEPTION_BUTTON = exports.ACTIVE_LINE = void 0;
exports.addSelectedTextToWatches = exports.evaluateSelectedTextInConsole = exports.runSnippet = exports.getWatchExpressionsValues = exports.getPausedMessages = exports.getValuesForScope = exports.getScopeNames = exports.typeIntoSourcesAndSave = exports.inspectMemory = exports.clickOnContextMenu = exports.openNestedWorkerFile = exports.stepThroughTheCode = exports.expandFileTree = exports.createSelectorsForWorkerFile = exports.retrieveSourceFilesAdded = exports.clearSourceFilesAdded = exports.waitForAdditionalSourceFiles = void 0;
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
exports.ACTIVE_LINE = '.CodeMirror-activeline > pre > span';
exports.PAUSE_ON_EXCEPTION_BUTTON = '[aria-label="Pause on exceptions"]';
exports.PAUSE_BUTTON = '[aria-label="Pause script execution"]';
exports.RESUME_BUTTON = '[aria-label="Resume script execution"]';
exports.SOURCES_LINES_SELECTOR = '.CodeMirror-code > div';
exports.PAUSE_INDICATOR_SELECTOR = '.paused-status';
exports.CODE_LINE_SELECTOR = '.cm-lineNumbers .cm-gutterElement';
exports.SCOPE_LOCAL_VALUES_SELECTOR = 'li[aria-label="Local"] + ol';
exports.SELECTED_THREAD_SELECTOR = 'div.thread-item.selected > div.thread-item-title';
exports.STEP_INTO_BUTTON = '[aria-label="Step into next function call"]';
exports.STEP_OVER_BUTTON = '[aria-label="Step over next function call"]';
exports.STEP_OUT_BUTTON = '[aria-label="Step out of current function"]';
exports.TURNED_OFF_PAUSE_BUTTON_SELECTOR = 'button.toolbar-state-off';
exports.TURNED_ON_PAUSE_BUTTON_SELECTOR = 'button.toolbar-state-on';
exports.DEBUGGER_PAUSED_EVENT = 'DevTools.DebuggerPaused';
const WATCH_EXPRESSION_VALUE_SELECTOR = '.watch-expression-tree-item .object-value-string.value';
async function navigateToLine(frontend, lineNumber) {
    // Navigating to a line will trigger revealing the current
    // uiSourceCodeFrame. Make sure to consume the 'source-file-loaded'
    // event for this file.
    await listenForSourceFilesLoaded(frontend);
    await frontend.keyboard.down('Control');
    await frontend.keyboard.press('KeyG');
    await frontend.keyboard.up('Control');
    await frontend.keyboard.type(`${lineNumber}`);
    await frontend.keyboard.press('Enter');
    const source = await getSelectedSource();
    await waitForSourceLoadedEvent(frontend, source);
}
exports.navigateToLine = navigateToLine;
async function getLineNumberElement(lineNumber) {
    const visibleLines = await (0, helper_js_1.$$)(exports.CODE_LINE_SELECTOR);
    for (let i = 0; i < visibleLines.length; i++) {
        const lineValue = await visibleLines[i].evaluate(node => node.textContent);
        if (lineValue === `${lineNumber}`) {
            return visibleLines[i];
        }
    }
    return null;
}
exports.getLineNumberElement = getLineNumberElement;
async function doubleClickSourceTreeItem(selector) {
    const item = await (0, helper_js_1.waitFor)(selector);
    await (0, helper_js_1.click)(item, { clickOptions: { clickCount: 2 }, maxPixelsFromLeft: 40 });
}
exports.doubleClickSourceTreeItem = doubleClickSourceTreeItem;
async function openSourcesPanel() {
    // Locate the button for switching to the sources tab.
    await (0, helper_js_1.click)('#tab-sources');
    // Wait for the navigation panel to show up
    await (0, helper_js_1.waitFor)('.navigator-file-tree-item');
}
exports.openSourcesPanel = openSourcesPanel;
async function openFileInSourcesPanel(testInput) {
    await (0, helper_js_1.goToResource)(`sources/${testInput}`);
    await openSourcesPanel();
}
exports.openFileInSourcesPanel = openFileInSourcesPanel;
async function openRecorderSubPane() {
    const root = await (0, helper_js_1.waitFor)('.navigator-tabbed-pane');
    await (0, helper_js_1.waitFor)('[aria-label="More tabs"]', root);
    await (0, helper_js_1.click)('[aria-label="More tabs"]', { root });
    await (0, helper_js_1.waitFor)('[aria-label="Recordings"]');
    await (0, helper_js_1.click)('[aria-label="Recordings"]');
    await (0, helper_js_1.waitFor)('[aria-label="Add recording"]');
}
exports.openRecorderSubPane = openRecorderSubPane;
async function createNewRecording(recordingName) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.click)('[aria-label="Add recording"]');
    await (0, helper_js_1.waitFor)('[aria-label^="Recording"]');
    await (0, helper_js_1.typeText)(recordingName);
    await frontend.keyboard.press('Enter');
}
exports.createNewRecording = createNewRecording;
async function openSnippetsSubPane() {
    const root = await (0, helper_js_1.waitFor)('.navigator-tabbed-pane');
    await (0, helper_js_1.waitFor)('[aria-label="More tabs"]', root);
    await (0, helper_js_1.click)('[aria-label="More tabs"]', { root });
    await (0, helper_js_1.waitFor)('[aria-label="Snippets"]');
    await (0, helper_js_1.click)('[aria-label="Snippets"]');
    await (0, helper_js_1.waitFor)('[aria-label="New snippet"]');
}
exports.openSnippetsSubPane = openSnippetsSubPane;
/**
 * Creates a new snippet, optionally pre-filling it with the provided content.
 * `snippetName` must not contain spaces or special characters, otherwise
 * `createNewSnippet` will time out.
 * DevTools uses the escaped snippet name for the ARIA label. `createNewSnippet`
 * doesn't mirror the escaping so it won't be able to wait for the snippet
 * entry in the navigation tree to appear.
 */
async function createNewSnippet(snippetName, content) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.click)('[aria-label="New snippet"]');
    await (0, helper_js_1.waitFor)('[aria-label^="Script snippet"]');
    await (0, helper_js_1.typeText)(snippetName);
    await frontend.keyboard.press('Enter');
    await (0, helper_js_1.waitFor)(`[aria-label*="${snippetName}"]`);
    if (content) {
        await (0, helper_js_1.pasteText)(content);
        await (0, helper_js_1.pressKey)('s', { control: true });
    }
}
exports.createNewSnippet = createNewSnippet;
async function openFileInEditor(sourceFile) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await listenForSourceFilesLoaded(frontend);
    // Open a particular file in the editor
    await doubleClickSourceTreeItem(`[aria-label="${sourceFile}, file"]`);
    await waitForSourceLoadedEvent(frontend, sourceFile);
}
exports.openFileInEditor = openFileInEditor;
async function openSourceCodeEditorForFile(sourceFile, testInput) {
    await openFileInSourcesPanel(testInput);
    await openFileInEditor(sourceFile);
}
exports.openSourceCodeEditorForFile = openSourceCodeEditorForFile;
async function getSelectedSource() {
    const sourceTabPane = await (0, helper_js_1.waitFor)('#sources-panel-sources-view .tabbed-pane');
    const sourceTabs = await (0, helper_js_1.waitFor)('.tabbed-pane-header-tab.selected', sourceTabPane);
    return sourceTabs.evaluate(node => node.getAttribute('aria-label'));
}
exports.getSelectedSource = getSelectedSource;
async function getOpenSources() {
    const sourceTabPane = await (0, helper_js_1.waitFor)('#sources-panel-sources-view .tabbed-pane');
    const sourceTabs = await (0, helper_js_1.waitFor)('.tabbed-pane-header-tabs', sourceTabPane);
    const openSources = await sourceTabs.$$eval('.tabbed-pane-header-tab', nodes => nodes.map(n => n.getAttribute('aria-label')));
    return openSources;
}
exports.getOpenSources = getOpenSources;
async function waitForHighlightedLineWhichIncludesText(expectedTextContent) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const selectedLine = await (0, helper_js_1.waitFor)(exports.ACTIVE_LINE);
        const text = await selectedLine.evaluate(node => node.textContent);
        return (text && text.includes(expectedTextContent)) ? text : undefined;
    });
}
exports.waitForHighlightedLineWhichIncludesText = waitForHighlightedLineWhichIncludesText;
async function waitForHighlightedLine(lineNumber) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const selectedLine = await (0, helper_js_1.waitFor)('.cm-highlightedLine');
        const currentlySelectedLineNumber = await selectedLine.evaluate(line => {
            return [...line.parentElement?.childNodes || []].indexOf(line);
        });
        const lineNumbers = await (0, helper_js_1.waitFor)('.cm-lineNumbers');
        const text = await lineNumbers.evaluate((node, lineNumber) => node.childNodes[lineNumber].textContent, currentlySelectedLineNumber + 1);
        return Number(text) === lineNumber;
    });
}
exports.waitForHighlightedLine = waitForHighlightedLine;
async function getToolbarText() {
    const toolbar = await (0, helper_js_1.waitFor)('.sources-toolbar');
    if (!toolbar) {
        return [];
    }
    const textNodes = await (0, helper_js_1.$$)('.toolbar-text', toolbar);
    return Promise.all(textNodes.map(node => node.evaluate(node => node.textContent, node)));
}
exports.getToolbarText = getToolbarText;
async function addBreakpointForLine(frontend, index) {
    await navigateToLine(frontend, index);
    const breakpointLine = await getLineNumberElement(index);
    chai_1.assert.isNotNull(breakpointLine, 'Line is not visible or does not exist');
    await (0, helper_js_1.waitForFunction)(async () => !(await isBreakpointSet(index)));
    await breakpointLine?.click();
    await (0, helper_js_1.waitForFunction)(async () => await isBreakpointSet(index));
}
exports.addBreakpointForLine = addBreakpointForLine;
async function removeBreakpointForLine(frontend, index) {
    await navigateToLine(frontend, index);
    const breakpointLine = await getLineNumberElement(index);
    chai_1.assert.isNotNull(breakpointLine, 'Line is not visible or does not exist');
    await (0, helper_js_1.waitForFunction)(async () => await isBreakpointSet(index));
    await breakpointLine?.click();
    await (0, helper_js_1.waitForFunction)(async () => !(await isBreakpointSet(index)));
}
exports.removeBreakpointForLine = removeBreakpointForLine;
function sourceLineNumberSelector(lineNumber) {
    return `div.CodeMirror-code > div:nth-child(${lineNumber}) div.CodeMirror-linenumber.CodeMirror-gutter-elt`;
}
exports.sourceLineNumberSelector = sourceLineNumberSelector;
async function isBreakpointSet(lineNumber) {
    const lineNumberElement = await getLineNumberElement(lineNumber);
    const breakpointLineParentClasses = await lineNumberElement?.evaluate(n => n.className);
    return breakpointLineParentClasses?.includes('cm-breakpoint');
}
exports.isBreakpointSet = isBreakpointSet;
async function checkBreakpointDidNotActivate() {
    await (0, helper_js_1.step)('check that the script did not pause', async () => {
        // TODO(almuthanna): make sure this check happens at a point where the pause indicator appears if it was active
        const pauseIndicators = await (0, helper_js_1.$$)(exports.PAUSE_INDICATOR_SELECTOR);
        const breakpointIndicator = await Promise.all(pauseIndicators.map(elements => {
            return elements.evaluate(el => el.className);
        }));
        chai_1.assert.deepEqual(breakpointIndicator.length, 0, 'script had been paused');
    });
}
exports.checkBreakpointDidNotActivate = checkBreakpointDidNotActivate;
async function getBreakpointDecorators(disabledOnly = false) {
    const selector = `.cm-breakpoint${disabledOnly ? '-disabled' : ''}`;
    const breakpointDecorators = await (0, helper_js_1.$$)(selector);
    return await Promise.all(breakpointDecorators.map(breakpointDecorator => breakpointDecorator.evaluate(n => Number(n.textContent))));
}
exports.getBreakpointDecorators = getBreakpointDecorators;
async function getNonBreakableLines() {
    const selector = '.cm-nonBreakableLine';
    await (0, helper_js_1.waitFor)(selector);
    const unbreakableLines = await (0, helper_js_1.$$)(selector);
    return await Promise.all(unbreakableLines.map(unbreakableLine => unbreakableLine.evaluate(n => Number(n.textContent))));
}
exports.getNonBreakableLines = getNonBreakableLines;
async function executionLineHighlighted() {
    return await (0, helper_js_1.waitFor)('.cm-executionLine');
}
exports.executionLineHighlighted = executionLineHighlighted;
async function getExecutionLine() {
    const activeLine = await (0, helper_js_1.waitFor)('.cm-execution-line-outline');
    return await activeLine.evaluate(n => parseInt(n.textContent, 10));
}
exports.getExecutionLine = getExecutionLine;
async function getExecutionLineText() {
    const activeLine = await (0, helper_js_1.waitFor)('.cm-execution-line pre');
    return await activeLine.evaluate(n => n.textContent);
}
exports.getExecutionLineText = getExecutionLineText;
async function getCallFrameNames() {
    await (0, helper_js_1.waitFor)('.call-frame-item-title');
    const items = await (0, helper_js_1.$$)('.call-frame-item-title');
    const promises = items.map(handle => handle.evaluate(el => el.textContent));
    const results = [];
    for (const promise of promises) {
        results.push(await promise);
    }
    return results;
}
exports.getCallFrameNames = getCallFrameNames;
async function getCallFrameLocations() {
    await (0, helper_js_1.waitFor)('.call-frame-location');
    const items = await (0, helper_js_1.$$)('.call-frame-location');
    const promises = items.map(handle => handle.evaluate(el => el.textContent));
    const results = [];
    for (const promise of promises) {
        results.push(await promise);
    }
    return results;
}
exports.getCallFrameLocations = getCallFrameLocations;
async function switchToCallFrame(index) {
    const selector = `.call-frame-item[aria-posinset="${index}"]`;
    await (0, helper_js_1.click)(selector);
    await (0, helper_js_1.waitFor)(selector + '[aria-selected="true"]');
}
exports.switchToCallFrame = switchToCallFrame;
async function retrieveTopCallFrameScriptLocation(script, target) {
    // The script will run into a breakpoint, which means that it will not actually
    // finish the evaluation, until we continue executing.
    // Thus, we have to await it at a later point, while stepping through the code.
    const scriptEvaluation = target.evaluate(script);
    // Wait for the evaluation to be paused and shown in the UI
    // and retrieve the top level call frame script location name
    const scriptLocation = await retrieveTopCallFrameWithoutResuming();
    // Resume the evaluation
    await (0, helper_js_1.click)(exports.RESUME_BUTTON);
    // Make sure to await the context evaluate before asserting
    // Otherwise the Puppeteer process might crash on a failure assertion,
    // as its execution context is destroyed
    await scriptEvaluation;
    return scriptLocation;
}
exports.retrieveTopCallFrameScriptLocation = retrieveTopCallFrameScriptLocation;
async function retrieveTopCallFrameWithoutResuming() {
    // Wait for the evaluation to be paused and shown in the UI
    await (0, helper_js_1.waitFor)(exports.PAUSE_INDICATOR_SELECTOR);
    // Retrieve the top level call frame script location name
    const locationHandle = await (0, helper_js_1.waitFor)('.call-frame-location');
    const scriptLocation = await locationHandle.evaluate(location => location.textContent);
    return scriptLocation;
}
exports.retrieveTopCallFrameWithoutResuming = retrieveTopCallFrameWithoutResuming;
async function reloadPageAndWaitForSourceFile(frontend, target, sourceFile) {
    await listenForSourceFilesLoaded(frontend);
    await target.reload();
    await waitForSourceLoadedEvent(frontend, sourceFile);
}
exports.reloadPageAndWaitForSourceFile = reloadPageAndWaitForSourceFile;
function listenForSourceFilesLoaded(frontend) {
    return frontend.evaluate(() => {
        if (!window.__sourceFilesLoadedEvents) {
            window.__sourceFilesLoadedEvents = [];
        }
        if (!window.__sourceFilesLoadedEventListenerAdded) {
            window.addEventListener('source-file-loaded', (event) => {
                const customEvent = event;
                window.__sourceFilesLoadedEvents.push(customEvent.detail);
            });
            window.__sourceFilesLoadedEventListenerAdded = true;
        }
    });
}
exports.listenForSourceFilesLoaded = listenForSourceFilesLoaded;
async function waitForSourceLoadedEvent(frontend, fileName) {
    const nameRegex = fileName.replace('…', '.*');
    await (0, helper_js_1.waitForFunction)(async () => {
        return frontend.evaluate(nameRegex => {
            return window.__sourceFilesLoadedEvents.some(x => new RegExp(nameRegex).test(x));
        }, nameRegex);
    });
    await frontend.evaluate(nameRegex => {
        window.__sourceFilesLoadedEvents =
            window.__sourceFilesLoadedEvents.filter(event => !new RegExp(nameRegex).test(event));
    }, nameRegex);
}
exports.waitForSourceLoadedEvent = waitForSourceLoadedEvent;
function listenForSourceFilesAdded(frontend) {
    return frontend.evaluate(() => {
        window.__sourceFilesAddedEvents = [];
        window.addEventListener('source-tree-file-added', (event) => {
            const customEvent = event;
            if (customEvent.detail !== '/__puppeteer_evaluation_script__') {
                window.__sourceFilesAddedEvents.push(customEvent.detail);
            }
        });
    });
}
exports.listenForSourceFilesAdded = listenForSourceFilesAdded;
function waitForAdditionalSourceFiles(frontend, count = 1) {
    return (0, helper_js_1.waitForFunction)(async () => {
        return frontend.evaluate(count => {
            return window.__sourceFilesAddedEvents.length >= count;
        }, count);
    });
}
exports.waitForAdditionalSourceFiles = waitForAdditionalSourceFiles;
function clearSourceFilesAdded(frontend) {
    return frontend.evaluate(() => {
        window.__sourceFilesAddedEvents = [];
    });
}
exports.clearSourceFilesAdded = clearSourceFilesAdded;
function retrieveSourceFilesAdded(frontend) {
    // Strip hostname, to make it agnostic of which server port we use
    return frontend.evaluate(() => window.__sourceFilesAddedEvents.map(file => new URL(`https://${file}`).pathname));
}
exports.retrieveSourceFilesAdded = retrieveSourceFilesAdded;
function createSelectorsForWorkerFile(workerName, folderName, fileName, workerIndex = 1) {
    const rootSelector = new Array(workerIndex).fill(`[aria-label="${workerName}, worker"]`).join(' ~ ');
    const domainSelector = `${rootSelector} + ol > [aria-label="localhost:${(0, helper_js_1.getTestServerPort)()}, domain"]`;
    const folderSelector = `${domainSelector} + ol > [aria-label^="${folderName}, "]`;
    const fileSelector = `${folderSelector} + ol > [aria-label="${fileName}, file"]`;
    return {
        rootSelector,
        domainSelector,
        folderSelector,
        fileSelector,
    };
}
exports.createSelectorsForWorkerFile = createSelectorsForWorkerFile;
async function expandSourceTreeItem(selector) {
    // FIXME(crbug/1112692): Refactor test to remove the timeout.
    await (0, helper_js_1.timeout)(50);
    const sourceTreeItem = await (0, helper_js_1.waitFor)(selector);
    const isExpanded = await sourceTreeItem.evaluate(element => {
        return element.getAttribute('aria-expanded') === 'true';
    });
    if (!isExpanded) {
        // FIXME(crbug/1112692): Refactor test to remove the timeout.
        await (0, helper_js_1.timeout)(50);
        await doubleClickSourceTreeItem(selector);
    }
}
async function expandFileTree(selectors) {
    await expandSourceTreeItem(selectors.rootSelector);
    await expandSourceTreeItem(selectors.domainSelector);
    await expandSourceTreeItem(selectors.folderSelector);
    // FIXME(crbug/1112692): Refactor test to remove the timeout.
    await (0, helper_js_1.timeout)(50);
    return await (0, helper_js_1.waitFor)(selectors.fileSelector);
}
exports.expandFileTree = expandFileTree;
async function stepThroughTheCode() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await frontend.keyboard.press('F9');
    await (0, helper_js_1.waitForFunction)(() => (0, helper_js_1.getPendingEvents)(frontend, exports.DEBUGGER_PAUSED_EVENT));
    await (0, helper_js_1.waitFor)(exports.PAUSE_INDICATOR_SELECTOR);
}
exports.stepThroughTheCode = stepThroughTheCode;
async function openNestedWorkerFile(selectors) {
    await expandFileTree(selectors);
    // FIXME(crbug/1112692): Refactor test to remove the timeout.
    await (0, helper_js_1.timeout)(50);
    await (0, helper_js_1.click)(selectors.fileSelector);
}
exports.openNestedWorkerFile = openNestedWorkerFile;
async function clickOnContextMenu(selector, label) {
    // Find the selected node, right click.
    const selectedNode = await (0, helper_js_1.waitFor)(selector);
    await (0, helper_js_1.click)(selectedNode, { clickOptions: { button: 'right' } });
    // Wait for the context menu option, and click it.
    const labelSelector = `[aria-label="${label}"]`;
    await (0, helper_js_1.waitFor)(labelSelector);
    await (0, helper_js_1.click)(labelSelector);
}
exports.clickOnContextMenu = clickOnContextMenu;
async function inspectMemory(variableName) {
    await clickOnContextMenu(`[data-object-property-name-for-test="${variableName}"]`, 'Reveal in Memory Inspector panel');
}
exports.inspectMemory = inspectMemory;
async function typeIntoSourcesAndSave(text) {
    const pane = await (0, helper_js_1.waitFor)('.sources');
    await pane.type(text);
    await (0, helper_js_1.pressKey)('s', { control: true });
}
exports.typeIntoSourcesAndSave = typeIntoSourcesAndSave;
async function getScopeNames() {
    const scopeElements = await (0, helper_js_1.$$)('.scope-chain-sidebar-pane-section-title');
    const scopeNames = await Promise.all(scopeElements.map(nodes => nodes.evaluate(n => n.textContent)));
    return scopeNames;
}
exports.getScopeNames = getScopeNames;
async function getValuesForScope(scope, expandCount, waitForNoOfValues) {
    const scopeSelector = `[aria-label="${scope}"]`;
    await (0, helper_js_1.waitFor)(scopeSelector);
    for (let i = 0; i < expandCount; i++) {
        const unexpandedSelector = `${scopeSelector} + ol li[aria-expanded=false]`;
        await (0, helper_js_1.waitFor)(unexpandedSelector);
        await (0, helper_js_1.click)(unexpandedSelector);
    }
    const valueSelector = `${scopeSelector} + ol .name-and-value`;
    const valueSelectorElements = await (0, helper_js_1.waitForFunction)(async () => {
        const elements = await (0, helper_js_1.$$)(valueSelector);
        if (elements.length >= waitForNoOfValues) {
            return elements;
        }
        return undefined;
    });
    const values = await Promise.all(valueSelectorElements.map(elem => elem.evaluate(n => n.textContent)));
    return values;
}
exports.getValuesForScope = getValuesForScope;
async function getPausedMessages() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const messageElement = await frontend.waitForSelector('.paused-message');
    if (!messageElement) {
        chai_1.assert.fail('getPausedMessages: did not find .paused-message element.');
    }
    const statusMain = await (0, helper_js_1.waitFor)('.status-main', messageElement);
    const statusSub = await (0, helper_js_1.waitFor)('.status-sub', messageElement);
    return {
        statusMain: await statusMain.evaluate(x => x.textContent),
        statusSub: await statusSub.evaluate(x => x.textContent),
    };
}
exports.getPausedMessages = getPausedMessages;
async function getWatchExpressionsValues() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.click)('[aria-label="Watch"]');
    await frontend.keyboard.press('ArrowRight');
    await (0, helper_js_1.waitFor)(WATCH_EXPRESSION_VALUE_SELECTOR);
    const values = await (0, helper_js_1.$$)(WATCH_EXPRESSION_VALUE_SELECTOR);
    return await Promise.all(values.map(value => value.evaluate(element => element.innerText)));
}
exports.getWatchExpressionsValues = getWatchExpressionsValues;
async function runSnippet() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const modifierKey = helper_js_1.platform === 'mac' ? 'Meta' : 'Control';
    await frontend.keyboard.down(modifierKey);
    await frontend.keyboard.press('Enter');
    await frontend.keyboard.up(modifierKey);
}
exports.runSnippet = runSnippet;
async function evaluateSelectedTextInConsole() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const modifierKey = helper_js_1.platform === 'mac' ? 'Meta' : 'Control';
    await frontend.keyboard.down(modifierKey);
    await frontend.keyboard.down('Shift');
    await frontend.keyboard.press('E');
    await frontend.keyboard.up(modifierKey);
    await frontend.keyboard.up('Shift');
}
exports.evaluateSelectedTextInConsole = evaluateSelectedTextInConsole;
async function addSelectedTextToWatches() {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const modifierKey = helper_js_1.platform === 'mac' ? 'Meta' : 'Control';
    await frontend.keyboard.down(modifierKey);
    await frontend.keyboard.down('Shift');
    await frontend.keyboard.press('A');
    await frontend.keyboard.up(modifierKey);
    await frontend.keyboard.up('Shift');
}
exports.addSelectedTextToWatches = addSelectedTextToWatches;
//# sourceMappingURL=sources-helpers.js.map