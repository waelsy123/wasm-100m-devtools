import type * as puppeteer from 'puppeteer';
export declare function getResourcesPathWithDevToolsHostname(): string;
export declare function loadExtension(name: string, startPage?: string): Promise<puppeteer.Frame>;
