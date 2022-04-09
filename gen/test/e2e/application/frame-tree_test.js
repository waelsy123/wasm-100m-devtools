"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const application_helpers_js_1 = require("../helpers/application-helpers.js");
const TOP_FRAME_SELECTOR = '[aria-label="top"]';
const WEB_WORKERS_SELECTOR = '[aria-label="Web Workers"]';
const SERVICE_WORKERS_SELECTOR = '[aria-label="top"] ~ ol [aria-label="Service Workers"]';
const OPENED_WINDOWS_SELECTOR = '[aria-label="Opened Windows"]';
const IFRAME_FRAME_ID_SELECTOR = '[aria-label="frameId (iframe.html)"]';
const MAIN_FRAME_SELECTOR = '[aria-label="frameId (main-frame.html)"]';
const IFRAME_SELECTOR = '[aria-label="iframe.html"]';
const EXPAND_STACKTRACE_BUTTON_SELECTOR = '.arrow-icon-button';
const STACKTRACE_ROW_SELECTOR = '.stack-trace-row';
const APPLICATION_PANEL_SELECTED_SELECTOR = '.tabbed-pane-header-tab.selected[aria-label="Application"]';
const getTrailingURL = (text) => {
    const match = text.match(/http.*$/);
    return match ? match[0] : '';
};
const ensureApplicationPanel = async () => {
    if ((await (0, helper_js_1.$$)(APPLICATION_PANEL_SELECTED_SELECTOR)).length === 0) {
        await (0, helper_js_1.waitForFunction)(async () => {
            await (0, helper_js_1.click)('#tab-resources');
            return (await (0, helper_js_1.$$)(APPLICATION_PANEL_SELECTED_SELECTOR)).length === 1;
        });
    }
};
(0, mocha_extensions_js_1.describe)('[crbug.com/12]: The Application Tab', async () => {
    afterEach(async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.evaluate(async () => {
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (const registration of registrations) {
                void registration.unregister();
            }
        });
    });
    // Update and reactivate when the whole FrameDetailsView is a custom component
    (0, mocha_extensions_js_1.it)('shows details for a frame when clicked on in the frame tree', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'frame-tree');
        await (0, helper_js_1.click)('#tab-resources');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(TOP_FRAME_SELECTOR);
        const fieldValuesTextContent = await (0, helper_js_1.waitForFunction)(async () => {
            const fieldValues = await (0, application_helpers_js_1.getTrimmedTextContent)('devtools-report-value');
            if (fieldValues[0]) {
                // This contains some CSS from the svg icon link being rendered. It's
                // system-specific, so we get rid of it and only look at the (URL) text.
                fieldValues[0] = getTrailingURL(fieldValues[0]);
            }
            if (fieldValues[9] && fieldValues[9].includes('accelerometer')) {
                fieldValues[9] = 'accelerometer';
            }
            // Make sure the length is equivalent to the expected value below
            if (fieldValues.length === 10) {
                return fieldValues;
            }
            return undefined;
        });
        const expected = [
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/frame-tree.html`,
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}`,
            '<#document>',
            'Yes\xA0Localhost is always a secure context',
            'No',
            'None',
            'UnsafeNone',
            'unavailable\xA0requires cross-origin isolated context',
            'unavailable\xA0Learn more',
            'accelerometer',
        ];
        chai_1.assert.deepEqual(fieldValuesTextContent, expected);
    });
    (0, mocha_extensions_js_1.it)('shows stack traces for OOPIF', async () => {
        await (0, helper_js_1.goToResource)('application/js-oopif.html');
        await ensureApplicationPanel();
        await (0, helper_js_1.waitForFunction)(async () => {
            await (0, application_helpers_js_1.doubleClickSourceTreeItem)(TOP_FRAME_SELECTOR);
            await (0, application_helpers_js_1.doubleClickSourceTreeItem)(IFRAME_SELECTOR);
            return (await (0, helper_js_1.$$)(EXPAND_STACKTRACE_BUTTON_SELECTOR)).length === 1;
        });
        const stackTraceRowsTextContent = await (0, helper_js_1.waitForFunction)(async () => {
            await ensureApplicationPanel();
            await (0, helper_js_1.click)(EXPAND_STACKTRACE_BUTTON_SELECTOR);
            const stackTraceRows = await (0, application_helpers_js_1.getTrimmedTextContent)(STACKTRACE_ROW_SELECTOR);
            // Make sure the length is equivalent to the expected value below
            if (stackTraceRows.length === 3) {
                return stackTraceRows;
            }
            return undefined;
        });
        const expected = [
            'second\xA0@\xA0js-oopif.html:17',
            'first\xA0@\xA0js-oopif.html:11',
            '(anonymous)\xA0@\xA0js-oopif.html:20',
        ];
        chai_1.assert.deepEqual(stackTraceRowsTextContent, expected);
    });
    (0, mocha_extensions_js_1.it)('shows details for opened windows in the frame tree', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'frame-tree');
        await (0, helper_js_1.click)('#tab-resources');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(TOP_FRAME_SELECTOR);
        await target.evaluate(() => {
            window.iFrameWindow = window.open('iframe.html');
        });
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(OPENED_WINDOWS_SELECTOR);
        await (0, helper_js_1.waitFor)(`${OPENED_WINDOWS_SELECTOR} + ol li:first-child`);
        void (0, helper_js_1.pressKey)('ArrowDown');
        const fieldValuesTextContent = await (0, helper_js_1.waitForFunction)(async () => {
            const fieldValues = await (0, application_helpers_js_1.getTrimmedTextContent)('.report-field-value');
            // Make sure the length is equivalent to the expected value below
            if (fieldValues.length === 3) {
                return fieldValues;
            }
            return undefined;
        });
        const expected = [
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/iframe.html`,
            '<#document>',
            'Yes',
        ];
        chai_1.assert.deepEqual(fieldValuesTextContent, expected);
        await target.evaluate(() => {
            window.iFrameWindow?.close();
        });
    });
    (0, mocha_extensions_js_1.it)('shows dedicated workers in the frame tree', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('application/frame-tree.html');
        await (0, helper_js_1.click)('#tab-resources');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(TOP_FRAME_SELECTOR);
        // DevTools is not ready yet when the worker is being initially attached.
        // We therefore need to reload the page to see the worker in DevTools.
        await target.reload();
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(WEB_WORKERS_SELECTOR);
        await (0, helper_js_1.waitFor)(`${WEB_WORKERS_SELECTOR} + ol li:first-child`);
        void (0, helper_js_1.pressKey)('ArrowDown');
        const fieldValuesTextContent = await (0, helper_js_1.waitForFunction)(async () => {
            const fieldValues = await (0, application_helpers_js_1.getTrimmedTextContent)('.report-field-value');
            // Make sure the length is equivalent to the expected value below
            if (fieldValues.length === 3) {
                return fieldValues;
            }
            return undefined;
        });
        const expected = [
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/dedicated-worker.js`,
            'Web Worker',
            'None',
        ];
        chai_1.assert.deepEqual(fieldValuesTextContent, expected);
    });
    // Flaky test
    mocha_extensions_js_1.it.skipOnPlatforms(['win32', 'mac'], '[crbug.com/1231056]: shows service workers in the frame tree', async () => {
        await (0, helper_js_1.goToResource)('application/service-worker-network.html');
        await (0, helper_js_1.click)('#tab-resources');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(TOP_FRAME_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(SERVICE_WORKERS_SELECTOR);
        await (0, helper_js_1.waitFor)(`${SERVICE_WORKERS_SELECTOR} + ol li:first-child`);
        void (0, helper_js_1.pressKey)('ArrowDown');
        const fieldValuesTextContent = await (0, helper_js_1.waitForFunction)(async () => {
            const fieldValues = await (0, application_helpers_js_1.getTrimmedTextContent)('.report-field-value');
            // Make sure the length is equivalent to the expected value below
            if (fieldValues.length === 3) {
                return fieldValues;
            }
            return undefined;
        });
        const expected = [
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/service-worker.js`,
            'Service Worker',
            'None',
        ];
        chai_1.assert.deepEqual(fieldValuesTextContent, expected);
    });
    // Update and reactivate when the whole FrameDetailsView is a custom component
    (0, mocha_extensions_js_1.it)('can handle when JS writes to frame', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('application/main-frame.html');
        await (0, helper_js_1.click)('#tab-resources');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(TOP_FRAME_SELECTOR);
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(IFRAME_FRAME_ID_SELECTOR);
        // check iframe's URL after pageload
        const fieldValuesTextContent = await (0, helper_js_1.waitForFunction)(async () => {
            const fieldValues = await (0, application_helpers_js_1.getTrimmedTextContent)('devtools-report-value');
            if (fieldValues[0]) {
                // This contains some CSS from the svg icon link being rendered. It's
                // system-specific, so we get rid of it and only look at the (URL) text.
                fieldValues[0] = getTrailingURL(fieldValues[0]);
            }
            if (fieldValues[9] && fieldValues[9].includes('accelerometer')) {
                fieldValues[9] = 'accelerometer';
            }
            // Make sure the length is equivalent to the expected value below
            if (fieldValues.length === 10) {
                return fieldValues;
            }
            return undefined;
        });
        const expected = [
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/iframe.html`,
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}`,
            '<iframe>',
            'Yes\xA0Localhost is always a secure context',
            'No',
            'None',
            'UnsafeNone',
            'unavailable\xA0requires cross-origin isolated context',
            'unavailable\xA0Learn more',
            'accelerometer',
        ];
        chai_1.assert.deepEqual(fieldValuesTextContent, expected);
        chai_1.assert.deepEqual(await (0, application_helpers_js_1.getFrameTreeTitles)(), ['top', 'frameId (iframe.html)', 'iframe.html', 'main-frame.html']);
        // write to the iframe using 'document.write()'
        await target.evaluate(() => {
            const frame = document.getElementById('frameId');
            const doc = frame.contentDocument;
            if (doc) {
                doc.open();
                doc.write('<h1>Hello world !</h1>');
                doc.close();
            }
        });
        // check that iframe's URL has changed
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(MAIN_FRAME_SELECTOR);
        const fieldValuesTextContent2 = await (0, helper_js_1.waitForFunction)(async () => {
            const fieldValues = await (0, application_helpers_js_1.getTrimmedTextContent)('devtools-report-value');
            if (fieldValues[0]) {
                fieldValues[0] = getTrailingURL(fieldValues[0]);
            }
            if (fieldValues[9] && fieldValues[9].includes('accelerometer')) {
                fieldValues[9] = 'accelerometer';
            }
            // Make sure the length is equivalent to the expected value below
            if (fieldValues.length === 10) {
                return fieldValues;
            }
            return undefined;
        });
        const expected2 = [
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/main-frame.html`,
            `https://localhost:${(0, helper_js_1.getTestServerPort)()}`,
            '<iframe>',
            'Yes\xA0Localhost is always a secure context',
            'No',
            'None',
            'UnsafeNone',
            'unavailable\xA0requires cross-origin isolated context',
            'unavailable\xA0Learn more',
            'accelerometer',
        ];
        chai_1.assert.deepEqual(fieldValuesTextContent2, expected2);
        chai_1.assert.deepEqual(await (0, application_helpers_js_1.getFrameTreeTitles)(), ['top', 'frameId (main-frame.html)', 'Document not available', 'main-frame.html']);
    });
});
//# sourceMappingURL=frame-tree_test.js.map