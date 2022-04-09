/// <reference types="mocha" />
import * as Common from '../../../../front_end/core/common/common.js';
import * as SDK from '../../../../front_end/core/sdk/sdk.js';
import type * as Protocol from '../../../../front_end/generated/protocol.js';
export declare function createTarget({ id, name, type, parentTarget }?: {
    id?: Protocol.Target.TargetID;
    name?: string;
    type?: SDK.Target.Type;
    parentTarget?: SDK.Target.Target;
}): SDK.Target.Target;
export declare function initializeGlobalVars({ reset }?: {
    reset?: boolean | undefined;
}): Promise<void>;
export declare function deinitializeGlobalVars(): Promise<void>;
export declare function describeWithEnvironment(title: string, fn: (this: Mocha.Suite) => void, opts?: {
    reset: boolean;
}): Mocha.Suite;
export declare function initializeGlobalLocaleVars(): Promise<void>;
export declare function deinitializeGlobalLocaleVars(): void;
export declare function describeWithLocale(title: string, fn: (this: Mocha.Suite) => void): Mocha.Suite;
export declare function createFakeSetting<T>(name: string, defaultValue: T): Common.Settings.Setting<T>;
export declare function enableFeatureForTest(feature: string): void;
