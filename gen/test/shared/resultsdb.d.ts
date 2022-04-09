export interface TestResult {
    testId: SanitizedTestId;
    expected?: boolean;
    status?: 'PASS' | 'FAIL' | 'SKIP';
    summaryHtml?: string;
    duration?: string;
    tags?: {
        key: string;
        value: string;
    }[];
}
declare class SanitizedTestIdTag {
    private sanitizedTag;
}
export declare type SanitizedTestId = string & SanitizedTestIdTag;
export declare function sanitizedTestId(rawTestId: string): SanitizedTestId;
export declare function recordTestResult(testResult: TestResult): void;
export declare function sendCollectedTestResultsIfSinkIsAvailable(): void;
export {};
