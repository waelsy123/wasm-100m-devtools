import type * as puppeteer from 'puppeteer';
export declare const MEMORY_TAB_ID = "#tab-heap_profiler";
export declare function navigateToMemoryTab(): Promise<void>;
export declare function takeAllocationProfile(frontend: puppeteer.Page): Promise<void>;
export declare function takeAllocationTimelineProfile(frontend: puppeteer.Page, { recordStacks }?: {
    recordStacks: boolean;
}): Promise<void>;
export declare function takeHeapSnapshot(): Promise<void>;
export declare function waitForHeapSnapshotData(): Promise<puppeteer.ElementHandle<Element>[]>;
export declare function waitForNonEmptyHeapSnapshotData(): Promise<void>;
export declare function getDataGridRows(selector: string): Promise<puppeteer.ElementHandle<Element>[]>;
export declare function setClassFilter(text: string): Promise<void>;
export declare function triggerLocalFindDialog(frontend: puppeteer.Page): Promise<void>;
export declare function setSearchFilter(text: string): Promise<void>;
export declare function waitForSearchResultNumber(results: number): Promise<puppeteer.ElementHandle<Element>>;
export declare function findSearchResult(p: (el: puppeteer.ElementHandle<Element>) => Promise<boolean>): Promise<puppeteer.ElementHandle<Element>>;
interface RetainerChainEntry {
    propertyName: string;
    retainerClassName: string;
}
export declare function assertRetainerChainSatisfies(p: (retainerChain: Array<RetainerChainEntry>) => boolean): Promise<boolean>;
export declare function waitUntilRetainerChainSatisfies(p: (retainerChain: Array<RetainerChainEntry>) => boolean): Promise<void>;
export declare function waitForRetainerChain(expectedRetainers: Array<string>): Promise<void>;
export declare function changeViewViaDropdown(newPerspective: string): Promise<void>;
export declare function changeAllocationSampleViewViaDropdown(newPerspective: string): Promise<void>;
export {};
