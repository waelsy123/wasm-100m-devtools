"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const event_listeners_helpers_js_1 = require("../helpers/event-listeners-helpers.js");
(0, mocha_extensions_js_1.describe)('Removing event listeners in the elements sidebar', async () => {
    beforeEach(async () => {
        await (0, event_listeners_helpers_js_1.loadEventListenersAndSelectButtonNode)();
    });
    (0, mocha_extensions_js_1.it)('shows "Remove" by each node for a given event', async () => {
        await (0, event_listeners_helpers_js_1.openEventListenersPaneAndWaitForListeners)();
        const { firstListenerText, listenerSelector, } = await (0, event_listeners_helpers_js_1.getFirstNodeForEventListener)('[aria-label="click, event listener"]');
        // check that we have the right event for the right element
        // and that it has the "Remove" button within it
        chai_1.assert.include(firstListenerText, 'button#test-button');
        chai_1.assert.include(firstListenerText, 'Remove');
        const removeButtonSelector = `${listenerSelector} .event-listener-button`;
        await (0, helper_js_1.click)(removeButtonSelector);
        // now we can check that the 'click' event is gone
        const eventListenerNames = await (0, event_listeners_helpers_js_1.getDisplayedEventListenerNames)();
        chai_1.assert.deepEqual(eventListenerNames, ['custom event', 'hover']);
    });
});
//# sourceMappingURL=sidebar-event-listeners-remove_test.js.map