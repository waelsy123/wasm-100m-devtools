import type { CoverageMapData } from 'istanbul-lib-coverage';
import { type DevToolsFrontendReloadOptions } from './frontend_tab.js';
declare module 'puppeteer' {
    interface ConsoleMessage {
        stackTrace(): ConsoleMessageLocation[];
    }
}
export declare function resetPages(): Promise<void>;
export declare function reloadDevTools(options?: DevToolsFrontendReloadOptions): Promise<void>;
export declare function preFileSetup(serverPort: number): Promise<void>;
export declare function postFileTeardown(): Promise<void>;
export declare function collectCoverageFromPage(): Promise<CoverageMapData | undefined>;
export declare function getDevToolsFrontendHostname(): string;
