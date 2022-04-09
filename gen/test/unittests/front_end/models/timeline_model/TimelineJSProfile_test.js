// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
import * as TimelineModel from '../../../../../front_end/models/timeline_model/timeline_model.js';
describe('TimelineJSProfile', () => {
    let tracingModel;
    let process;
    let thread;
    const config = {
        showAllEvents: false,
        showRuntimeCallStats: false,
        showNativeFunctions: false,
    };
    before(() => {
        tracingModel = new SDK.TracingModel.TracingModel(new FakeStorage());
        process = new SDK.TracingModel.Process(tracingModel, 1);
        thread = new SDK.TracingModel.Thread(process, 1);
    });
    it('generateJSFrameEvents returns an empty array for an empty input', () => {
        const events = [];
        const returnedEvents = TimelineModel.TimelineJSProfile.TimelineJSProfileProcessor.generateJSFrameEvents(events, config);
        assert.deepEqual(returnedEvents, []);
    });
    it('generateJSFrameEvents creates JS frame events with a top-level V8 invocation', () => {
        const callEvent = new SDK.TracingModel.Event('devtools.timeline', 'FunctionCall', SDK.TracingModel.Phase.Complete, 10, thread);
        callEvent.setEndTime(20);
        const sampleEvent = new SDK.TracingModel.Event('devtools.timeline', 'JSSample', SDK.TracingModel.Phase.Instant, 5, thread);
        sampleEvent.addArgs({ data: { stackTrace: [{ callFrame: {} }] } });
        const events = [callEvent, sampleEvent];
        const returnedEvents = TimelineModel.TimelineJSProfile.TimelineJSProfileProcessor.generateJSFrameEvents(events, config);
        assert.strictEqual(returnedEvents.length, 1);
        assert.strictEqual(returnedEvents[0].name, 'JSFrame');
        assert.strictEqual(returnedEvents[0].startTime, 5);
        assert.strictEqual(returnedEvents[0].endTime, 20);
    });
    it('generateJSFrameEvents creates JS frame events without a top-level V8 invocation', () => {
        const sampleEvent = new SDK.TracingModel.Event('devtools.timeline', 'JSSample', SDK.TracingModel.Phase.Instant, 5, thread);
        sampleEvent.addArgs({ data: { stackTrace: [{ callFrame: {} }] } });
        const events = [sampleEvent];
        const returnedEvents = TimelineModel.TimelineJSProfile.TimelineJSProfileProcessor.generateJSFrameEvents(events, config);
        assert.strictEqual(returnedEvents.length, 1);
        assert.strictEqual(returnedEvents[0].name, 'JSFrame');
        assert.strictEqual(returnedEvents[0].startTime, 5);
        assert.strictEqual(returnedEvents[0].endTime, 5);
    });
    it('generateJSFrameEvents creates JS frame events for mixed with/without top-level events', () => {
        const sampleEvent1 = new SDK.TracingModel.Event('devtools.timeline', 'JSSample', SDK.TracingModel.Phase.Instant, 5, thread);
        sampleEvent1.addArgs({ data: { stackTrace: [{ 'functionName': 'a', 'callUID': 'a', 'scriptId': 1 }] } });
        const sampleEvent2 = new SDK.TracingModel.Event('devtools.timeline', 'JSSample', SDK.TracingModel.Phase.Instant, 6, thread);
        sampleEvent2.addArgs({ data: { stackTrace: [{ 'functionName': 'a', 'callUID': 'a', 'scriptId': 1 }] } });
        const sampleEvent3 = new SDK.TracingModel.Event('devtools.timeline', 'JSSample', SDK.TracingModel.Phase.Instant, 7, thread);
        sampleEvent3.addArgs({ data: { stackTrace: [{ 'functionName': 'a', 'callUID': 'a', 'scriptId': 1 }] } });
        const callEvent = new SDK.TracingModel.Event('devtools.timeline', 'FunctionCall', SDK.TracingModel.Phase.Complete, 8, thread);
        callEvent.setEndTime(15);
        const sampleEvent4 = new SDK.TracingModel.Event('devtools.timeline', 'JSSample', SDK.TracingModel.Phase.Instant, 9, thread);
        sampleEvent4.addArgs({ data: { stackTrace: [{ 'functionName': 'a', 'callUID': 'a', 'scriptId': 1 }] } });
        const sampleEvent5 = new SDK.TracingModel.Event('devtools.timeline', 'JSSample', SDK.TracingModel.Phase.Instant, 10, thread);
        sampleEvent5.addArgs({ data: { stackTrace: [{ 'functionName': 'a', 'callUID': 'a', 'scriptId': 1 }] } });
        const events = [sampleEvent1, sampleEvent2, sampleEvent3, callEvent, sampleEvent4, sampleEvent5];
        const returnedEvents = TimelineModel.TimelineJSProfile.TimelineJSProfileProcessor.generateJSFrameEvents(events, config);
        assert.strictEqual(returnedEvents.length, 2);
        assert.strictEqual(returnedEvents[0].name, 'JSFrame');
        assert.strictEqual(returnedEvents[0].startTime, 5);
        assert.strictEqual(returnedEvents[0].endTime, 8);
        assert.strictEqual(returnedEvents[1].name, 'JSFrame');
        assert.strictEqual(returnedEvents[1].startTime, 9);
        assert.strictEqual(returnedEvents[1].endTime, 15);
    });
});
class FakeStorage extends SDK.TracingModel.BackingStorage {
    appendString() {
        throw new Error('Not implemented yet');
    }
    appendAccessibleString() {
        throw new Error('Not implemented yet');
    }
    finishWriting() {
        throw new Error('Not implemented yet');
    }
    reset() {
        throw new Error('Not implemented yet');
    }
}
//# sourceMappingURL=TimelineJSProfile_test.js.map