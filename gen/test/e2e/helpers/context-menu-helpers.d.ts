import type { puppeteer } from '../../shared/helper.js';
export declare function platformSpecificTextForSubMenuEntryItem(text: string): string;
export declare function assertTopLevelContextMenuItemsText(expectedOptions: string[]): Promise<void>;
export declare function findSubMenuEntryItem(text: string): Promise<puppeteer.ElementHandle<Element>>;
export declare function assertSubMenuItemsText(subMenuText: string, expectedOptions: string[]): Promise<void>;
