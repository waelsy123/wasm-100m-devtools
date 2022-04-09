interface SupportedEnvVars {
    NO_SHUFFLE: boolean;
    STRESS: boolean;
    VERBOSE: boolean;
    THROTTLE: number;
    TEST_LIST: string;
    TEST_PATTERNS: string;
    DEBUG_TEST: boolean;
    ITERATIONS: number;
    JOBS: number;
    SLOWMO: number;
    CHROME_BIN: string;
    INTERACTIVE: boolean;
    TIMEOUT: number;
    CHROME_FEATURES: string;
}
export declare function getEnvVar<Key extends keyof SupportedEnvVars>(name: Key, defaultValue?: SupportedEnvVars[Key]): SupportedEnvVars[Key];
export {};
