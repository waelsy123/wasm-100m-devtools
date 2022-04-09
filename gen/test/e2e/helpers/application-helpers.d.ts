import type * as puppeteer from 'puppeteer';
export declare function navigateToApplicationTab(target: puppeteer.Page, testName: string): Promise<void>;
export declare function navigateToServiceWorkers(): Promise<void>;
export declare function doubleClickSourceTreeItem(selector: string): Promise<void>;
export declare function getDataGridData(selector: string, columns: string[]): Promise<{
    [key: string]: string | null;
}[]>;
export declare function getTrimmedTextContent(selector: string): Promise<string[]>;
export declare function getFrameTreeTitles(): Promise<(string | null)[]>;
export declare function getStorageItemsData(columns: string[]): Promise<{
    [key: string]: string | null;
}[]>;
export declare function filterStorageItems(filter: string): Promise<void>;
export declare function clearStorageItemsFilter(): Promise<void>;
export declare function clearStorageItems(): Promise<void>;
export declare function selectCookieByName(name: string): Promise<void>;
export declare function waitForQuotaUsage(p: (quota: number) => boolean): Promise<void>;
export declare function getPieChartLegendRows(): Promise<(string | null)[][]>;
