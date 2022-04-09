import * as Common from '../../../../../front_end/core/common/common.js';
import type * as SDK from '../../../../../front_end/core/sdk/sdk.js';
import * as Logs from '../../../../../front_end/models/logs/logs.js';
interface MockNetworkRequest {
    requestId(): string;
}
export declare function createNetworkRequest(requestId: string): SDK.NetworkRequest.NetworkRequest;
export declare class MockNetworkLog extends Common.ObjectWrapper.ObjectWrapper<Logs.NetworkLog.EventTypes> {
    private mockRequests;
    constructor(mockRequests: Array<MockNetworkRequest>);
    requestsForId(requestId: string): MockNetworkRequest[];
    addRequest(mockRequest: MockNetworkRequest): void;
}
export {};
