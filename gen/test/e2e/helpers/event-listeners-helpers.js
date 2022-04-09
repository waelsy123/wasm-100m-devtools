"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFirstNodeForEventListener = exports.getEventListenerProperties = exports.getDisplayedEventListenerNames = exports.openEventListenersPaneAndWaitForListeners = exports.loadEventListenersAndSelectButtonNode = void 0;
const helper_js_1 = require("../../shared/helper.js");
const elements_helpers_js_1 = require("./elements-helpers.js");
const loadEventListenersAndSelectButtonNode = async () => {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.goToResource)('elements/sidebar-event-listeners.html');
    await (0, elements_helpers_js_1.waitForElementsStyleSection)();
    // Check to make sure we have the correct node selected after opening a file
    await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
    // FIXME(crbug/1112692): Refactor test to remove the timeout.
    await (0, helper_js_1.timeout)(50);
    // Select the button that has the events and make sure it's selected
    await frontend.keyboard.press('ArrowRight');
    await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<button id=\u200B"test-button">\u200Bhello world\u200B</button>\u200B');
};
exports.loadEventListenersAndSelectButtonNode = loadEventListenersAndSelectButtonNode;
const EVENT_LISTENERS_PANEL_LINK = '[aria-label="Event Listeners"]';
/* We add :not(.hidden) here as if you create an event listener + remove it via the UI
 * it gets the class of .hidden rather than being removed
 */
const EVENT_LISTENERS_SELECTOR = '[aria-label$="event listener"]:not(.hidden)';
const openEventListenersPaneAndWaitForListeners = async () => {
    await (0, helper_js_1.click)(EVENT_LISTENERS_PANEL_LINK);
    await (0, helper_js_1.waitFor)(EVENT_LISTENERS_SELECTOR);
};
exports.openEventListenersPaneAndWaitForListeners = openEventListenersPaneAndWaitForListeners;
const getDisplayedEventListenerNames = async () => {
    const eventListeners = await (0, helper_js_1.$$)(EVENT_LISTENERS_SELECTOR);
    const eventListenerNames = await Promise.all(eventListeners.map(listener => listener.evaluate(l => l.textContent)));
    return eventListenerNames;
};
exports.getDisplayedEventListenerNames = getDisplayedEventListenerNames;
const getEventListenerProperties = async (selector) => {
    const clickEventProperties = await (0, helper_js_1.$$)(selector);
    const propertiesOutput = await Promise.all(clickEventProperties.map(n => n.evaluate(node => {
        const nameNode = node.querySelector('.name');
        const valueNode = node.querySelector('.value');
        if (!nameNode || !valueNode) {
            throw new Error('Could not find a name and value node for event listener properties.');
        }
        const key = nameNode.textContent;
        const value = valueNode.textContent;
        return [key, value];
    })));
    return propertiesOutput;
};
exports.getEventListenerProperties = getEventListenerProperties;
const getFirstNodeForEventListener = async (listenerTypeSelector) => {
    await (0, helper_js_1.click)(listenerTypeSelector);
    const listenerNodesSelector = `${listenerTypeSelector} + ol>li`;
    const firstListenerNode = await (0, helper_js_1.waitFor)(listenerNodesSelector);
    const firstListenerText = await firstListenerNode.evaluate(node => {
        return node.textContent || '';
    });
    return {
        firstListenerText: firstListenerText,
        listenerSelector: listenerNodesSelector,
    };
};
exports.getFirstNodeForEventListener = getFirstNodeForEventListener;
//# sourceMappingURL=event-listeners-helpers.js.map