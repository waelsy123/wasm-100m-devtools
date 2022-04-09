import puppeteer = require('puppeteer');
/**
 * Wrapper class around `puppeteer.Page` that helps with setting up and
 * managing a tab that can be inspected by the DevTools frontend.
 */
export declare class TargetTab {
    readonly page: puppeteer.Page;
    private constructor();
    static create(browser: puppeteer.Browser): Promise<TargetTab>;
    reset(): Promise<void>;
    targetId(): string;
}
