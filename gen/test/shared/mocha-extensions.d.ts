import * as Mocha from 'mocha';
import type { Platform } from './helper.js';
export { beforeEach } from 'mocha';
export declare function takeScreenshots(): Promise<void>;
export declare function wrapDescribe<ReturnT>(mochaFn: (title: string, fn: (this: Mocha.Suite) => void) => ReturnT, title: string, fn: (this: Mocha.Suite) => void): ReturnT;
export declare function describe(title: string, fn: (this: Mocha.Suite) => void): Mocha.Suite;
export declare namespace describe {
    var only: (title: string, fn: (this: Mocha.Suite) => void) => Mocha.Suite;
    var skip: (title: string, fn: (this: Mocha.Suite) => void) => void | Mocha.Suite;
    var skipOnPlatforms: (platforms: Platform[], name: string, fn: (this: Mocha.Suite) => void) => void;
}
export declare const it: {
    (name: string, callback: MochaCallback): void;
    skip(name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
    skipOnPlatforms(platforms: Array<Platform>, name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
    only(name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
    repeat(repeat: number, name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
};
declare type MochaCallback = Mocha.Func | Mocha.AsyncFunc;
export declare function makeCustomWrappedIt(namePrefix?: string): {
    (name: string, callback: MochaCallback): void;
    skip(name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
    skipOnPlatforms(platforms: Array<Platform>, name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
    only(name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
    repeat(repeat: number, name: string, callback: Mocha.Func | Mocha.AsyncFunc): void;
};
