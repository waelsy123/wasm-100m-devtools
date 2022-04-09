import type { ElementHandle } from 'puppeteer';
export declare function setCustomOrientation(): Promise<void>;
export declare function getInputFieldValue(field: ElementHandle<Element>): Promise<string>;
export declare function getOrientationInputs(): Promise<ElementHandle<Element>[]>;
export declare function getOrientationValues(): Promise<number[]>;
