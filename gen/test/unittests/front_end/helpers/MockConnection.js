// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as ProtocolClient from '../../../../front_end/core/protocol_client/protocol_client.js';
import { deinitializeGlobalVars, initializeGlobalVars } from './EnvironmentHelpers.js';
// Note that we can't set the Function to the correct handler on the basis
// that we don't know which ProtocolCommand will be stored.
const responseMap = new Map();
export function setMockConnectionResponseHandler(command, handler) {
    if (responseMap.get(command)) {
        throw new Error(`Response handler already set for ${command}`);
    }
    responseMap.set(command, handler);
}
export function getMockConnectionResponseHandler(method) {
    return responseMap.get(method);
}
export function clearMockConnectionResponseHandler(method) {
    responseMap.delete(method);
}
export function clearAllMockConnectionResponseHandlers() {
    responseMap.clear();
}
export function dispatchEvent(target, eventName, ...payload) {
    const event = eventName;
    const [domain] = ProtocolClient.InspectorBackend.splitQualifiedName(event);
    const registeredEvents = ProtocolClient.InspectorBackend.inspectorBackend.getOrCreateEventParameterNamesForDomainForTesting(domain);
    const eventParameterNames = registeredEvents.get(event);
    if (!eventParameterNames) {
        // The event is not registered, fake-register with empty parameters.
        registeredEvents.set(event, []);
    }
    target.dispatch({ method: event, params: payload[0] });
}
async function enable({ reset = true } = {}) {
    if (reset) {
        responseMap.clear();
    }
    // The DevTools frontend code expects certain things to be in place
    // before it can run. This function will ensure those things are
    // minimally there.
    await initializeGlobalVars({ reset });
    let messageCallback;
    ProtocolClient.InspectorBackend.Connection.setFactory(() => {
        return {
            setOnMessage(callback) {
                messageCallback = callback;
            },
            sendRawMessage(message) {
                const outgoingMessage = JSON.parse(message);
                const handler = responseMap.get(outgoingMessage.method);
                if (!handler) {
                    return;
                }
                const result = handler.call(undefined, outgoingMessage.params);
                // Since we allow the test author to omit the getError call, we
                // need to add it in here on their behalf so that the calling code
                // will succeed.
                if (!('getError' in result)) {
                    result.getError = () => undefined;
                }
                messageCallback.call(undefined, { id: outgoingMessage.id, method: outgoingMessage.method, result });
            },
            async disconnect() {
                // Included only to meet interface requirements.
            },
            onMessage() {
                // Included only to meet interface requirements.
            },
            setOnDisconnect() {
                // Included only to meet interface requirements.
            },
        };
    });
}
async function disable() {
    await deinitializeGlobalVars();
    // @ts-ignore Setting back to undefined as a hard reset.
    ProtocolClient.InspectorBackend.Connection.setFactory(undefined);
}
export function describeWithMockConnection(title, fn, opts = {
    reset: true,
}) {
    return describe(`mock-${title}`, () => {
        beforeEach(async () => await enable(opts));
        afterEach(disable);
        describe(title, fn);
    });
}
//# sourceMappingURL=MockConnection.js.map