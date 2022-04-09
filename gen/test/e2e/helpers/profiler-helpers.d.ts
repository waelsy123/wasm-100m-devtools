export declare const START_PROFILING_BUTTON = "button[aria-label=\"Start CPU profiling\"]";
export declare const STOP_PROFILING_BUTTON = "button[aria-label=\"Stop CPU profiling\"]";
export declare function navigateToProfilerTab(): Promise<void>;
export declare function createAProfile(): Promise<void>;
export declare function toggleRecordingWithKeyboad(): Promise<void>;
