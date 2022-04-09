/**
 * @fileoverview Functions and state to tie error reporting and console output of
 * the browser process and frontend pages together.
 */
import puppeteer = require('puppeteer');
export declare function setupBrowserProcessIO(browser: puppeteer.Browser): void;
export declare function installPageErrorHandlers(page: puppeteer.Page): void;
export declare class ErrorExpectation {
    #private;
    constructor(msg: string | RegExp);
    get caught(): puppeteer.ConsoleMessage | undefined;
    check(consoleMessage: puppeteer.ConsoleMessage): boolean;
}
export declare function expectError(msg: string | RegExp): ErrorExpectation;
export declare function dumpCollectedErrors(): void;
export declare const fatalErrors: string[];
export declare const expectedErrors: string[];
