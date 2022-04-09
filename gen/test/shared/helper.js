"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasClass = exports.getPendingEvents = exports.installEventListener = exports.scrollElementIntoView = exports.selectOption = exports.enableCDPLogging = exports.closeAllCloseableTabs = exports.closePanelTab = exports.selectTextFromNodeToNode = exports.tabBackward = exports.tabForward = exports.activeElementAccessibleName = exports.activeElementTextContent = exports.activeElement = exports.waitForAnimationFrame = exports.step = exports.getResourcesPath = exports.goToResourceWithCustomHost = exports.goToResource = exports.clearPermissionsOverride = exports.overridePermissions = exports.goTo = exports.setDevToolsSettings = exports.enableExperiment = exports.logFailure = exports.logToStdOut = exports.debuggerStatement = exports.waitForWithTries = exports.waitForFunctionWithTries = exports.waitForFunction = exports.waitForNoElementsWithTextContent = exports.waitForElementsWithTextContent = exports.waitForElementWithTextContent = exports.waitForAriaNone = exports.waitForAria = exports.waitForNone = exports.waitForMany = exports.waitFor = exports.timeout = exports.$$textContent = exports.$textContent = exports.$$ = exports.$ = exports.pasteText = exports.pressKey = exports.typeText = exports.doubleClick = exports.click = exports.getElementPosition = exports.platform = void 0;
exports.setCheckBox = exports.renderCoordinatorQueueEmpty = exports.matchStringTable = exports.assertMatchArray = exports.matchStringArray = exports.matchTable = exports.assertOk = exports.matchArray = exports.matchString = exports.puppeteer = exports.reloadDevTools = exports.getTestServerPort = exports.getDevToolsFrontendHostname = exports.getBrowserAndPages = exports.assertNotNullOrUndefined = exports.waitForClass = void 0;
const chai_1 = require("chai");
const os = require("os");
const puppeteer = require("puppeteer");
exports.puppeteer = puppeteer;
const hooks_js_1 = require("../conductor/hooks.js");
Object.defineProperty(exports, "getDevToolsFrontendHostname", { enumerable: true, get: function () { return hooks_js_1.getDevToolsFrontendHostname; } });
Object.defineProperty(exports, "reloadDevTools", { enumerable: true, get: function () { return hooks_js_1.reloadDevTools; } });
const puppeteer_state_js_1 = require("../conductor/puppeteer-state.js");
Object.defineProperty(exports, "getBrowserAndPages", { enumerable: true, get: function () { return puppeteer_state_js_1.getBrowserAndPages; } });
Object.defineProperty(exports, "getTestServerPort", { enumerable: true, get: function () { return puppeteer_state_js_1.getTestServerPort; } });
const test_runner_config_js_1 = require("../conductor/test_runner_config.js");
const async_scope_js_1 = require("./async-scope.js");
switch (os.platform()) {
    case 'darwin':
        exports.platform = 'mac';
        break;
    case 'win32':
        exports.platform = 'win32';
        break;
    default:
        exports.platform = 'linux';
        break;
}
// TODO: Remove once Chromium updates its version of Node.js to 12+.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalThis = global;
/**
 * Returns an {x, y} position within the element identified by the selector within the root.
 * By default the position is the center of the bounding box. If the element's bounding box
 * extends beyond that of a containing element, this position may not correspond to the element.
 * In this case, specifying maxPixelsFromLeft will constrain the returned point to be close to
 * the left edge of the bounding box.
 */
const getElementPosition = async (selector, root, maxPixelsFromLeft) => {
    let element;
    if (typeof selector === 'string') {
        element = await (0, exports.waitFor)(selector, root);
    }
    else {
        element = selector;
    }
    const rectData = await element.evaluate((element) => {
        if (!element) {
            return {};
        }
        const isConnected = element.isConnected;
        const { left, top, width, height } = element.getBoundingClientRect();
        return { left, top, width, height, isConnected };
    });
    if (!rectData.isConnected) {
        throw new Error('Element is no longer attached to the dom');
    }
    if (rectData.left === undefined) {
        throw new Error(`Unable to find element with selector "${selector}"`);
    }
    let pixelsFromLeft = rectData.width * 0.5;
    if (maxPixelsFromLeft && pixelsFromLeft > maxPixelsFromLeft) {
        pixelsFromLeft = maxPixelsFromLeft;
    }
    return {
        x: rectData.left + pixelsFromLeft,
        y: rectData.top + rectData.height * 0.5,
    };
};
exports.getElementPosition = getElementPosition;
const click = async (selector, options) => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    const clickableElement = await (0, exports.getElementPosition)(selector, options && options.root, options && options.maxPixelsFromLeft);
    if (!clickableElement) {
        throw new Error(`Unable to locate clickable element "${selector}".`);
    }
    const modifier = exports.platform === 'mac' ? 'Meta' : 'Control';
    if (options?.clickOptions?.modifier) {
        await frontend.keyboard.down(modifier);
    }
    // Click on the button and wait for the console to load. The reason we use this method
    // rather than elementHandle.click() is because the frontend attaches the behavior to
    // a 'mousedown' event (not the 'click' event). To avoid attaching the test behavior
    // to a specific event we instead locate the button in question and ask Puppeteer to
    // click on it instead.
    await frontend.mouse.click(clickableElement.x, clickableElement.y, options && options.clickOptions);
    if (options?.clickOptions?.modifier) {
        await frontend.keyboard.up(modifier);
    }
};
exports.click = click;
const doubleClick = async (selector, options) => {
    const passedClickOptions = (options && options.clickOptions) || {};
    const clickOptionsWithDoubleClick = {
        ...passedClickOptions,
        clickCount: 2,
    };
    return (0, exports.click)(selector, {
        ...options,
        clickOptions: clickOptionsWithDoubleClick,
    });
};
exports.doubleClick = doubleClick;
const typeText = async (text) => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await frontend.keyboard.type(text);
};
exports.typeText = typeText;
const pressKey = async (key, modifiers) => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    if (modifiers) {
        if (modifiers.control) {
            if (exports.platform === 'mac') {
                // Use command key on mac
                await frontend.keyboard.down('Meta');
            }
            else {
                await frontend.keyboard.down('Control');
            }
        }
        if (modifiers.alt) {
            await frontend.keyboard.down('Alt');
        }
        if (modifiers.shift) {
            await frontend.keyboard.down('Shift');
        }
    }
    await frontend.keyboard.press(key);
    if (modifiers) {
        if (modifiers.shift) {
            await frontend.keyboard.up('Shift');
        }
        if (modifiers.alt) {
            await frontend.keyboard.up('Alt');
        }
        if (modifiers.control) {
            if (exports.platform === 'mac') {
                // Use command key on mac
                await frontend.keyboard.up('Meta');
            }
            else {
                await frontend.keyboard.up('Control');
            }
        }
    }
};
exports.pressKey = pressKey;
const pasteText = async (text) => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await frontend.keyboard.sendCharacter(text);
};
exports.pasteText = pasteText;
// Get a single element handle. Uses `pierce` handler per default for piercing Shadow DOM.
const $ = async (selector, root, handler = 'pierce') => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    const rootElement = root ? root : frontend;
    const element = await rootElement.$(`${handler}/${selector}`);
    return element;
};
exports.$ = $;
// Get multiple element handles. Uses `pierce` handler per default for piercing Shadow DOM.
const $$ = async (selector, root, handler = 'pierce') => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    const rootElement = root ? root.asElement() || frontend : frontend;
    const elements = await rootElement.$$(`${handler}/${selector}`);
    return elements;
};
exports.$$ = $$;
/**
 * Search for an element based on its textContent.
 *
 * @param textContent The text content to search for.
 * @param root The root of the search.
 */
const $textContent = async (textContent, root) => {
    return (0, exports.$)(textContent, root, 'pierceShadowText');
};
exports.$textContent = $textContent;
/**
 * Search for all elements based on their textContent
 *
 * @param textContent The text content to search for.
 * @param root The root of the search.
 */
const $$textContent = async (textContent, root) => {
    return (0, exports.$$)(textContent, root, 'pierceShadowText');
};
exports.$$textContent = $$textContent;
const timeout = (duration) => new Promise(resolve => setTimeout(resolve, duration));
exports.timeout = timeout;
const waitFor = async (selector, root, asyncScope = new async_scope_js_1.AsyncScope(), handler) => {
    return await asyncScope.exec(() => (0, exports.waitForFunction)(async () => {
        const element = await (0, exports.$)(selector, root, handler);
        return (element || undefined);
    }, asyncScope));
};
exports.waitFor = waitFor;
const waitForMany = async (selector, count, root, asyncScope = new async_scope_js_1.AsyncScope(), handler) => {
    return await asyncScope.exec(() => (0, exports.waitForFunction)(async () => {
        const elements = await (0, exports.$$)(selector, root, handler);
        return elements.length >= count ? elements : undefined;
    }, asyncScope));
};
exports.waitForMany = waitForMany;
const waitForNone = async (selector, root, asyncScope = new async_scope_js_1.AsyncScope(), handler) => {
    return await asyncScope.exec(() => (0, exports.waitForFunction)(async () => {
        const elements = await (0, exports.$$)(selector, root, handler);
        if (elements.length === 0) {
            return true;
        }
        return false;
    }, asyncScope));
};
exports.waitForNone = waitForNone;
const waitForAria = (selector, root, asyncScope = new async_scope_js_1.AsyncScope()) => {
    return (0, exports.waitFor)(selector, root, asyncScope, 'aria');
};
exports.waitForAria = waitForAria;
const waitForAriaNone = (selector, root, asyncScope = new async_scope_js_1.AsyncScope()) => {
    return (0, exports.waitForNone)(selector, root, asyncScope, 'aria');
};
exports.waitForAriaNone = waitForAriaNone;
const waitForElementWithTextContent = (textContent, root, asyncScope = new async_scope_js_1.AsyncScope()) => {
    return (0, exports.waitFor)(textContent, root, asyncScope, 'pierceShadowText');
};
exports.waitForElementWithTextContent = waitForElementWithTextContent;
const waitForElementsWithTextContent = (textContent, root, asyncScope = new async_scope_js_1.AsyncScope()) => {
    return asyncScope.exec(() => (0, exports.waitForFunction)(async () => {
        const elems = await (0, exports.$$textContent)(textContent, root);
        if (elems && elems.length) {
            return elems;
        }
        return undefined;
    }, asyncScope));
};
exports.waitForElementsWithTextContent = waitForElementsWithTextContent;
const waitForNoElementsWithTextContent = (textContent, root, asyncScope = new async_scope_js_1.AsyncScope()) => {
    return asyncScope.exec(() => (0, exports.waitForFunction)(async () => {
        const elems = await (0, exports.$$textContent)(textContent, root);
        if (elems && elems.length === 0) {
            return true;
        }
        return false;
    }, asyncScope));
};
exports.waitForNoElementsWithTextContent = waitForNoElementsWithTextContent;
const waitForFunction = async (fn, asyncScope = new async_scope_js_1.AsyncScope()) => {
    return await asyncScope.exec(async () => {
        while (true) {
            if (asyncScope.isCanceled()) {
                throw new Error('Test timed out');
            }
            const result = await fn();
            if (result) {
                return result;
            }
            await (0, exports.timeout)(100);
        }
    });
};
exports.waitForFunction = waitForFunction;
const waitForFunctionWithTries = async (fn, options = {
    tries: Number.MAX_SAFE_INTEGER,
}, asyncScope = new async_scope_js_1.AsyncScope()) => {
    return await asyncScope.exec(async () => {
        let tries = 0;
        while (tries++ < options.tries) {
            const result = await fn();
            if (result) {
                return result;
            }
            await (0, exports.timeout)(100);
        }
        return undefined;
    });
};
exports.waitForFunctionWithTries = waitForFunctionWithTries;
const waitForWithTries = async (selector, root, options = {
    tries: Number.MAX_SAFE_INTEGER,
}, asyncScope = new async_scope_js_1.AsyncScope(), handler) => {
    return await asyncScope.exec(() => (0, exports.waitForFunctionWithTries)(async () => {
        const element = await (0, exports.$)(selector, root, handler);
        return (element || undefined);
    }, options, asyncScope));
};
exports.waitForWithTries = waitForWithTries;
const debuggerStatement = (frontend) => {
    return frontend.evaluate(() => {
        // eslint-disable-next-line no-debugger
        debugger;
    });
};
exports.debuggerStatement = debuggerStatement;
const logToStdOut = (msg) => {
    if (!process.send) {
        return;
    }
    process.send({
        pid: process.pid,
        details: msg,
    });
};
exports.logToStdOut = logToStdOut;
const logFailure = () => {
    if (!process.send) {
        return;
    }
    process.send({
        pid: process.pid,
        details: 'failure',
    });
};
exports.logFailure = logFailure;
const enableExperiment = async (experiment, options = {}) => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await frontend.evaluate(experiment => {
        // @ts-ignore
        globalThis.Root.Runtime.experiments.setEnabled(experiment, true);
    }, experiment);
    await (0, hooks_js_1.reloadDevTools)(options);
};
exports.enableExperiment = enableExperiment;
const setDevToolsSettings = async (settings) => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await frontend.evaluate(settings => {
        for (const name in settings) {
            globalThis.InspectorFrontendHost.setPreference(name, JSON.stringify(settings[name]));
        }
    }, settings);
    await (0, hooks_js_1.reloadDevTools)();
};
exports.setDevToolsSettings = setDevToolsSettings;
const goTo = async (url) => {
    const { target } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await target.goto(url);
};
exports.goTo = goTo;
const overridePermissions = async (permissions) => {
    const { browser } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await browser.defaultBrowserContext().overridePermissions(`https://localhost:${(0, puppeteer_state_js_1.getTestServerPort)()}`, permissions);
};
exports.overridePermissions = overridePermissions;
const clearPermissionsOverride = async () => {
    const { browser } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await browser.defaultBrowserContext().clearPermissionOverrides();
};
exports.clearPermissionsOverride = clearPermissionsOverride;
const goToResource = async (path) => {
    await (0, exports.goTo)(`${(0, exports.getResourcesPath)()}/${path}`);
};
exports.goToResource = goToResource;
const goToResourceWithCustomHost = async (host, path) => {
    chai_1.assert.isTrue(host.endsWith('.test'), 'Only custom hosts with a .test domain are allowed.');
    await (0, exports.goTo)(`${(0, exports.getResourcesPath)(host)}/${path}`);
};
exports.goToResourceWithCustomHost = goToResourceWithCustomHost;
const getResourcesPath = (host = 'localhost') => {
    let resourcesPath = (0, test_runner_config_js_1.getTestRunnerConfigSetting)('hosted-server-e2e-resources-path', '/test/e2e/resources');
    if (!resourcesPath.startsWith('/')) {
        resourcesPath = `/${resourcesPath}`;
    }
    return `https://${host}:${(0, puppeteer_state_js_1.getTestServerPort)()}${resourcesPath}`;
};
exports.getResourcesPath = getResourcesPath;
const step = async (description, step) => {
    try {
        return await step();
    }
    catch (error) {
        if (error instanceof chai_1.AssertionError) {
            throw new chai_1.AssertionError(`Unexpected Result in Step "${description}"
      ${error.message}`, error);
        }
        else {
            error.message += ` in Step "${description}"`;
            throw error;
        }
    }
};
exports.step = step;
const waitForAnimationFrame = async () => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await frontend.waitForFunction(() => {
        return new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
    });
};
exports.waitForAnimationFrame = waitForAnimationFrame;
const activeElement = async () => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await (0, exports.waitForAnimationFrame)();
    return frontend.evaluateHandle(() => {
        let activeElement = document.activeElement;
        while (activeElement && activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
        }
        return activeElement;
    });
};
exports.activeElement = activeElement;
const activeElementTextContent = async () => {
    const element = await (0, exports.activeElement)();
    return element.evaluate(node => node.textContent);
};
exports.activeElementTextContent = activeElementTextContent;
const activeElementAccessibleName = async () => {
    const element = await (0, exports.activeElement)();
    return element.evaluate(node => node.getAttribute('aria-label'));
};
exports.activeElementAccessibleName = activeElementAccessibleName;
const tabForward = async (page) => {
    let targetPage;
    if (page) {
        targetPage = page;
    }
    else {
        const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
        targetPage = frontend;
    }
    await targetPage.keyboard.press('Tab');
};
exports.tabForward = tabForward;
const tabBackward = async (page) => {
    let targetPage;
    if (page) {
        targetPage = page;
    }
    else {
        const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
        targetPage = frontend;
    }
    await targetPage.keyboard.down('Shift');
    await targetPage.keyboard.press('Tab');
    await targetPage.keyboard.up('Shift');
};
exports.tabBackward = tabBackward;
const selectTextFromNodeToNode = async (from, to, direction) => {
    const { target } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    // The clipboard api does not allow you to copy, unless the tab is focused.
    await target.bringToFront();
    return target.evaluate(async (from, to, direction) => {
        const selection = from.getRootNode().getSelection();
        const range = document.createRange();
        if (direction === 'down') {
            range.setStartBefore(from);
            range.setEndAfter(to);
        }
        else {
            range.setStartBefore(to);
            range.setEndAfter(from);
        }
        selection.removeAllRanges();
        selection.addRange(range);
        document.execCommand('copy');
        return navigator.clipboard.readText();
    }, await from, await to, direction);
};
exports.selectTextFromNodeToNode = selectTextFromNodeToNode;
const closePanelTab = async (panelTabSelector) => {
    // Get close button from tab element
    const selector = `${panelTabSelector} > .tabbed-pane-close-button`;
    await (0, exports.click)(selector);
    await (0, exports.waitForNone)(selector);
};
exports.closePanelTab = closePanelTab;
const closeAllCloseableTabs = async () => {
    // get all closeable tools by looking for the available x buttons on tabs
    const selector = '.tabbed-pane-close-button';
    const allCloseButtons = await (0, exports.$$)(selector);
    // Get all panel ids
    const panelTabIds = await Promise.all(allCloseButtons.map(button => {
        return button.evaluate(button => button.parentElement ? button.parentElement.id : '');
    }));
    // Close each tab
    for (const tabId of panelTabIds) {
        const selector = `#${tabId}`;
        await (0, exports.closePanelTab)(selector);
    }
};
exports.closeAllCloseableTabs = closeAllCloseableTabs;
// Noisy! Do not leave this in your test but it may be helpful
// when debugging.
const enableCDPLogging = async () => {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await frontend.evaluate(() => {
        globalThis.ProtocolClient.test.dumpProtocol = console.log; // eslint-disable-line no-console
    });
};
exports.enableCDPLogging = enableCDPLogging;
const selectOption = async (select, value) => {
    await select.evaluate(async (node, _value) => {
        node.value = _value;
        const event = document.createEvent('HTMLEvents');
        event.initEvent('change', false, true);
        node.dispatchEvent(event);
    }, value);
};
exports.selectOption = selectOption;
const scrollElementIntoView = async (selector, root) => {
    const element = await (0, exports.$)(selector, root);
    if (!element) {
        throw new Error(`Unable to find element with selector "${selector}"`);
    }
    await element.evaluate(el => {
        el.scrollIntoView();
    });
};
exports.scrollElementIntoView = scrollElementIntoView;
const installEventListener = function (frontend, eventType) {
    return frontend.evaluate(eventType => {
        if (!('__pendingEvents' in window)) {
            window.__pendingEvents = new Map();
        }
        window.addEventListener(eventType, (e) => {
            let events = window.__pendingEvents.get(eventType);
            if (!events) {
                events = [];
                window.__pendingEvents.set(eventType, events);
            }
            events.push(e);
        });
    }, eventType);
};
exports.installEventListener = installEventListener;
const getPendingEvents = function (frontend, eventType) {
    return frontend.evaluate(eventType => {
        if (!('__pendingEvents' in window)) {
            return [];
        }
        const pendingEvents = window.__pendingEvents.get(eventType);
        window.__pendingEvents.set(eventType, []);
        return pendingEvents || [];
    }, eventType);
};
exports.getPendingEvents = getPendingEvents;
const hasClass = async (element, classname) => {
    return await element.evaluate((el, classname) => el.classList.contains(classname), classname);
};
exports.hasClass = hasClass;
const waitForClass = async (element, classname) => {
    await (0, exports.waitForFunction)(async () => {
        return (0, exports.hasClass)(element, classname);
    });
};
exports.waitForClass = waitForClass;
/**
 * This is useful to keep TypeScript happy in a test - if you have a value
 * that's potentially `null` you can use this function to assert that it isn't,
 * and satisfy TypeScript that the value is present.
 */
function assertNotNullOrUndefined(val) {
    if (val === null || val === undefined) {
        throw new Error(`Expected given value to not be null/undefined but it was: ${val}`);
    }
}
exports.assertNotNullOrUndefined = assertNotNullOrUndefined;
function matchString(actual, expected) {
    if (typeof expected === 'string') {
        if (actual !== expected) {
            return `Expected item "${actual}" to equal "${expected}"`;
        }
    }
    else if (!expected.test(actual)) {
        return `Expected item "${actual}" to match "${expected}"`;
    }
    return true;
}
exports.matchString = matchString;
function matchArray(actual, expected, comparator) {
    if (actual.length !== expected.length) {
        return `Expected [${actual.map(x => `"${x}"`).join(', ')}] to have length ${expected.length}`;
    }
    for (let i = 0; i < expected.length; ++i) {
        const result = comparator(actual[i], expected[i]);
        if (result !== true) {
            return `Mismatch in row ${i}: ${result}`;
        }
    }
    return true;
}
exports.matchArray = matchArray;
function assertOk(check) {
    return (...args) => {
        const result = check(...args);
        if (result !== true) {
            throw new chai_1.AssertionError(result);
        }
    };
}
exports.assertOk = assertOk;
function matchTable(actual, expected, comparator) {
    return matchArray(actual, expected, (actual, expected) => matchArray(actual, expected, comparator));
}
exports.matchTable = matchTable;
const matchStringArray = (actual, expected) => matchArray(actual, expected, matchString);
exports.matchStringArray = matchStringArray;
exports.assertMatchArray = assertOk(exports.matchStringArray);
const matchStringTable = (actual, expected) => matchTable(actual, expected, matchString);
exports.matchStringTable = matchStringTable;
async function renderCoordinatorQueueEmpty() {
    const { frontend } = (0, puppeteer_state_js_1.getBrowserAndPages)();
    await frontend.evaluate(() => {
        return new Promise(resolve => {
            const pendingFrames = globalThis.__getRenderCoordinatorPendingFrames();
            if (pendingFrames < 1) {
                resolve();
                return;
            }
            globalThis.addEventListener('renderqueueempty', resolve, { once: true });
        });
    });
}
exports.renderCoordinatorQueueEmpty = renderCoordinatorQueueEmpty;
async function setCheckBox(selector, wantChecked) {
    const checkbox = await (0, exports.waitFor)(selector);
    const checked = await checkbox.evaluate(box => box.checked);
    if (checked !== wantChecked) {
        await (0, exports.click)(`${selector} + label`);
    }
    chai_1.assert.strictEqual(await checkbox.evaluate(box => box.checked), wantChecked);
}
exports.setCheckBox = setCheckBox;
//# sourceMappingURL=helper.js.map