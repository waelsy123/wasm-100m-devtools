import type { puppeteer } from '../../shared/helper.js';
/**
 * Select the Network tab in DevTools
 */
export declare function navigateToNetworkTab(testName: string): Promise<void>;
/**
 * Wait until a certain number of requests are shown in the request list.
 * @param numberOfRequests The expected number of requests to wait for.
 * @param selector Optional. The selector to use to get the list of requests.
 */
export declare function waitForSomeRequestsToAppear(numberOfRequests: number): Promise<void>;
export declare function getAllRequestNames(): Promise<(string | null)[]>;
export declare function getSelectedRequestName(): Promise<string | null>;
export declare function selectRequestByName(name: string, clickOptions?: puppeteer.ClickOptions): Promise<void>;
export declare function waitForSelectedRequestChange(initialRequestName: string | null): Promise<void>;
export declare function setPersistLog(persist: boolean): Promise<void>;
export declare function setCacheDisabled(disabled: boolean): Promise<void>;
