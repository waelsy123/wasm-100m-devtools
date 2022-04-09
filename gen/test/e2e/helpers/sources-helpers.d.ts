import type * as puppeteer from 'puppeteer';
export declare const ACTIVE_LINE = ".CodeMirror-activeline > pre > span";
export declare const PAUSE_ON_EXCEPTION_BUTTON = "[aria-label=\"Pause on exceptions\"]";
export declare const PAUSE_BUTTON = "[aria-label=\"Pause script execution\"]";
export declare const RESUME_BUTTON = "[aria-label=\"Resume script execution\"]";
export declare const SOURCES_LINES_SELECTOR = ".CodeMirror-code > div";
export declare const PAUSE_INDICATOR_SELECTOR = ".paused-status";
export declare const CODE_LINE_SELECTOR = ".cm-lineNumbers .cm-gutterElement";
export declare const SCOPE_LOCAL_VALUES_SELECTOR = "li[aria-label=\"Local\"] + ol";
export declare const SELECTED_THREAD_SELECTOR = "div.thread-item.selected > div.thread-item-title";
export declare const STEP_INTO_BUTTON = "[aria-label=\"Step into next function call\"]";
export declare const STEP_OVER_BUTTON = "[aria-label=\"Step over next function call\"]";
export declare const STEP_OUT_BUTTON = "[aria-label=\"Step out of current function\"]";
export declare const TURNED_OFF_PAUSE_BUTTON_SELECTOR = "button.toolbar-state-off";
export declare const TURNED_ON_PAUSE_BUTTON_SELECTOR = "button.toolbar-state-on";
export declare const DEBUGGER_PAUSED_EVENT = "DevTools.DebuggerPaused";
export declare function navigateToLine(frontend: puppeteer.Page, lineNumber: number | string): Promise<void>;
export declare function getLineNumberElement(lineNumber: number | string): Promise<puppeteer.ElementHandle<Element> | null>;
export declare function doubleClickSourceTreeItem(selector: string): Promise<void>;
export declare function openSourcesPanel(): Promise<void>;
export declare function openFileInSourcesPanel(testInput: string): Promise<void>;
export declare function openRecorderSubPane(): Promise<void>;
export declare function createNewRecording(recordingName: string): Promise<void>;
export declare function openSnippetsSubPane(): Promise<void>;
/**
 * Creates a new snippet, optionally pre-filling it with the provided content.
 * `snippetName` must not contain spaces or special characters, otherwise
 * `createNewSnippet` will time out.
 * DevTools uses the escaped snippet name for the ARIA label. `createNewSnippet`
 * doesn't mirror the escaping so it won't be able to wait for the snippet
 * entry in the navigation tree to appear.
 */
export declare function createNewSnippet(snippetName: string, content?: string): Promise<void>;
export declare function openFileInEditor(sourceFile: string): Promise<void>;
export declare function openSourceCodeEditorForFile(sourceFile: string, testInput: string): Promise<void>;
export declare function getSelectedSource(): Promise<string>;
export declare function getOpenSources(): Promise<(string | null)[]>;
export declare function waitForHighlightedLineWhichIncludesText(expectedTextContent: string): Promise<void>;
export declare function waitForHighlightedLine(lineNumber: number): Promise<void>;
export declare function getToolbarText(): Promise<(string | null)[]>;
export declare function addBreakpointForLine(frontend: puppeteer.Page, index: number | string): Promise<void>;
export declare function removeBreakpointForLine(frontend: puppeteer.Page, index: number | string): Promise<void>;
export declare function sourceLineNumberSelector(lineNumber: number): string;
export declare function isBreakpointSet(lineNumber: number | string): Promise<boolean | undefined>;
export declare function checkBreakpointDidNotActivate(): Promise<void>;
export declare function getBreakpointDecorators(disabledOnly?: boolean): Promise<number[]>;
export declare function getNonBreakableLines(): Promise<number[]>;
export declare function executionLineHighlighted(): Promise<puppeteer.ElementHandle<Element>>;
export declare function getExecutionLine(): Promise<number>;
export declare function getExecutionLineText(): Promise<string>;
export declare function getCallFrameNames(): Promise<string[]>;
export declare function getCallFrameLocations(): Promise<string[]>;
export declare function switchToCallFrame(index: number): Promise<void>;
export declare function retrieveTopCallFrameScriptLocation(script: string, target: puppeteer.Page): Promise<string | null>;
export declare function retrieveTopCallFrameWithoutResuming(): Promise<string | null>;
declare global {
    interface Window {
        __sourceFilesAddedEvents: string[];
        __sourceFilesLoadedEvents: string[];
        __sourceFilesLoadedEventListenerAdded: boolean;
    }
}
export declare function reloadPageAndWaitForSourceFile(frontend: puppeteer.Page, target: puppeteer.Page, sourceFile: string): Promise<void>;
export declare function listenForSourceFilesLoaded(frontend: puppeteer.Page): Promise<void>;
export declare function waitForSourceLoadedEvent(frontend: puppeteer.Page, fileName: string): Promise<void>;
export declare function listenForSourceFilesAdded(frontend: puppeteer.Page): Promise<void>;
export declare function waitForAdditionalSourceFiles(frontend: puppeteer.Page, count?: number): Promise<boolean>;
export declare function clearSourceFilesAdded(frontend: puppeteer.Page): Promise<void>;
export declare function retrieveSourceFilesAdded(frontend: puppeteer.Page): Promise<string[]>;
export declare type NestedFileSelector = {
    rootSelector: string;
    domainSelector: string;
    folderSelector: string;
    fileSelector: string;
};
export declare function createSelectorsForWorkerFile(workerName: string, folderName: string, fileName: string, workerIndex?: number): NestedFileSelector;
export declare function expandFileTree(selectors: NestedFileSelector): Promise<puppeteer.ElementHandle<Element>>;
export declare function stepThroughTheCode(): Promise<void>;
export declare function openNestedWorkerFile(selectors: NestedFileSelector): Promise<void>;
export declare function clickOnContextMenu(selector: string, label: string): Promise<void>;
export declare function inspectMemory(variableName: string): Promise<void>;
export declare function typeIntoSourcesAndSave(text: string): Promise<void>;
export declare function getScopeNames(): Promise<(string | null)[]>;
export declare function getValuesForScope(scope: string, expandCount: number, waitForNoOfValues: number): Promise<string[]>;
export declare function getPausedMessages(): Promise<{
    statusMain: string | null;
    statusSub: string | null;
}>;
export declare function getWatchExpressionsValues(): Promise<string[]>;
export declare function runSnippet(): Promise<void>;
export declare function evaluateSelectedTextInConsole(): Promise<void>;
export declare function addSelectedTextToWatches(): Promise<void>;
