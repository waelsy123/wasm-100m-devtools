/// <reference types="mocha" />
export declare function mochaGlobalSetup(this: Mocha.Suite): Promise<void>;
export declare function mochaGlobalTeardown(): void;
export declare const mochaHooks: {
    beforeAll: (this: Mocha.Suite) => Promise<void>;
    afterAll: (this: Mocha.Suite) => Promise<void>;
    beforeEach: (this: Mocha.Suite) => Promise<void>;
    afterEach: (this: Mocha.Suite) => Promise<void>;
};
