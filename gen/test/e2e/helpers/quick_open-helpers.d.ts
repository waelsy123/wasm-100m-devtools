export declare const QUICK_OPEN_SELECTOR = "[aria-label=\"Quick open\"]";
export declare const openCommandMenu: () => Promise<void>;
export declare const openFileQuickOpen: () => Promise<void>;
export declare const showSnippetsAutocompletion: () => Promise<void>;
export declare function getAvailableSnippets(): Promise<(string | null)[]>;
export declare function getMenuItemAtPosition(position: number): Promise<import("puppeteer").ElementHandle<Element>>;
export declare function getMenuItemTitleAtPosition(position: number): Promise<string | null>;
export declare const closeDrawer: () => Promise<void>;
export declare const getSelectedItemText: () => Promise<string>;
