/// <reference types="mocha" />
import type { ProtocolMapping } from '../../../../front_end/generated/protocol-mapping.js';
import type * as SDK from '../../../../front_end/core/sdk/sdk.js';
export declare type ProtocolCommand = keyof ProtocolMapping.Commands;
export declare type ProtocolCommandParams<C extends ProtocolCommand> = ProtocolMapping.Commands[C]['paramsType'];
export declare type ProtocolResponse<C extends ProtocolCommand> = ProtocolMapping.Commands[C]['returnType'];
export declare type ProtocolCommandHandler<C extends ProtocolCommand> = (...params: ProtocolCommandParams<C>) => Omit<ProtocolResponse<C>, 'getError'>;
export declare type MessageCallback = (result: string | Object) => void;
export declare function setMockConnectionResponseHandler<C extends ProtocolCommand>(command: C, handler: ProtocolCommandHandler<C>): void;
export declare function getMockConnectionResponseHandler(method: ProtocolCommand): Function | undefined;
export declare function clearMockConnectionResponseHandler(method: ProtocolCommand): void;
export declare function clearAllMockConnectionResponseHandlers(): void;
export declare function dispatchEvent<E extends keyof ProtocolMapping.Events>(target: SDK.Target.Target, eventName: E, ...payload: ProtocolMapping.Events[E]): void;
export declare function describeWithMockConnection(title: string, fn: (this: Mocha.Suite) => void, opts?: {
    reset: boolean;
}): Mocha.Suite;
