"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const event_listeners_helpers_js_1 = require("../helpers/event-listeners-helpers.js");
(0, mocha_extensions_js_1.describe)('Event listeners in the elements sidebar', async () => {
    beforeEach(async () => {
        await (0, event_listeners_helpers_js_1.loadEventListenersAndSelectButtonNode)();
    });
    (0, mocha_extensions_js_1.it)('lists the active event listeners on the page', async () => {
        await (0, event_listeners_helpers_js_1.openEventListenersPaneAndWaitForListeners)();
        const eventListenerNames = await (0, event_listeners_helpers_js_1.getDisplayedEventListenerNames)();
        chai_1.assert.deepEqual(eventListenerNames, ['click', 'custom event', 'hover']);
    });
    (0, mocha_extensions_js_1.it)('shows the event listener properties when expanding it', async () => {
        await (0, event_listeners_helpers_js_1.openEventListenersPaneAndWaitForListeners)();
        const { firstListenerText, listenerSelector, } = await (0, event_listeners_helpers_js_1.getFirstNodeForEventListener)('[aria-label="click, event listener"]');
        // check that we have the right event for the right element
        // we can't use assert.strictEqual() as the text also includes the "Remove" button
        chai_1.assert.include(firstListenerText, 'button#test-button');
        // we have to double click on the event to expand it
        // as single click reveals it in the elements tree
        await (0, helper_js_1.doubleClick)(listenerSelector);
        const clickEventPropertiesSelector = `${listenerSelector} + ol .name-and-value`;
        const propertiesOutput = await (0, event_listeners_helpers_js_1.getEventListenerProperties)(clickEventPropertiesSelector);
        chai_1.assert.deepEqual(propertiesOutput, [
            ['useCapture', 'false'],
            ['passive', 'false'],
            ['once', 'false'],
            ['handler', '() => {}'],
        ]);
    });
    (0, mocha_extensions_js_1.it)('shows custom event listeners and their properties correctly', async () => {
        await (0, event_listeners_helpers_js_1.openEventListenersPaneAndWaitForListeners)();
        const { firstListenerText, listenerSelector, } = await (0, event_listeners_helpers_js_1.getFirstNodeForEventListener)('[aria-label="custom event, event listener"]');
        // check that we have the right event for the right element
        // we can't use assert.strictEqual() as the text also includes the "Remove" button
        chai_1.assert.include(firstListenerText, 'body');
        // we have to double click on the event to expand it
        // as single click reveals it in the elements tree
        await (0, helper_js_1.doubleClick)(listenerSelector);
        const customEventProperties = `${listenerSelector} + ol .name-and-value`;
        const propertiesOutput = await (0, event_listeners_helpers_js_1.getEventListenerProperties)(customEventProperties);
        chai_1.assert.deepEqual(propertiesOutput, [
            ['useCapture', 'true'],
            ['passive', 'false'],
            ['once', 'true'],
            ['handler', '() => console.log(\'test\')'],
        ]);
    });
});
//# sourceMappingURL=sidebar-event-listeners_test.js.map