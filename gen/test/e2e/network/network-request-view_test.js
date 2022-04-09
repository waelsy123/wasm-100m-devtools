"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const events_js_1 = require("../../conductor/events.js");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const network_helpers_js_1 = require("../helpers/network-helpers.js");
const SIMPLE_PAGE_REQUEST_NUMBER = 2;
const SIMPLE_PAGE_URL = `requests.html?num=${SIMPLE_PAGE_REQUEST_NUMBER}`;
(0, mocha_extensions_js_1.describe)('The Network Request view', async () => {
    (0, mocha_extensions_js_1.it)('re-opens the same tab after switching to another panel and navigating back to the "Network" tab (https://crbug.com/1184578)', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)(SIMPLE_PAGE_URL);
        await (0, helper_js_1.step)('wait for all requests to be shown', async () => {
            await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(SIMPLE_PAGE_REQUEST_NUMBER + 1);
        });
        await (0, helper_js_1.step)('select the first SVG request', async () => {
            await (0, network_helpers_js_1.selectRequestByName)('image.svg?id=0');
        });
        await (0, helper_js_1.step)('select the "Timing" tab', async () => {
            const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
            const timingTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Timing][role="tab"]', networkView);
            await (0, helper_js_1.click)(timingTabHeader);
            await (0, helper_js_1.waitFor)('[aria-label=Timing][role=tab][aria-selected=true]', networkView);
        });
        await (0, helper_js_1.step)('open the "Console" panel', async () => {
            await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
            await (0, console_helpers_js_1.focusConsolePrompt)();
        });
        await (0, helper_js_1.step)('open the "Network" panel', async () => {
            await (0, helper_js_1.click)('#tab-network');
            await (0, helper_js_1.waitFor)('.network-log-grid');
        });
        await (0, helper_js_1.step)('ensure that the "Timing" tab is shown', async () => {
            const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
            const selectedTabHeader = await (0, helper_js_1.waitFor)('[role=tab][aria-selected=true]', networkView);
            const selectedTabText = await selectedTabHeader.evaluate(element => element.textContent || '');
            chai_1.assert.strictEqual(selectedTabText, 'Timing');
        });
    });
    (0, mocha_extensions_js_1.it)('shows webbundle content on preview tab', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('resources-from-webbundle.html');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        await (0, network_helpers_js_1.selectRequestByName)('webbundle.wbn');
        const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
        const previewTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Preview][role=tab]', networkView);
        await (0, helper_js_1.click)(previewTabHeader);
        await (0, helper_js_1.waitFor)('[aria-label=Preview][role=tab][aria-selected=true]', networkView);
        await (0, helper_js_1.waitForElementWithTextContent)('webbundle.wbn', networkView);
        await (0, helper_js_1.waitForElementWithTextContent)('uuid-in-package:429fcc4e-0696-4bad-b099-ee9175f023ae', networkView);
        await (0, helper_js_1.waitForElementWithTextContent)('uuid-in-package:020111b3-437a-4c5c-ae07-adb6bbffb720', networkView);
    });
    (0, mocha_extensions_js_1.it)('prevents requests on the preview tab.', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('embedded_requests.html');
        // For the issue to manifest it's mandatory to load the stylesheet by absolute URL. A relative URL would be treated
        // relative to the data URL in the preview iframe and thus not work. We need to generate the URL because the
        // resources path is dynamic, but we can't have any scripts in the resource page since they would be disabled in the
        // preview. Therefore, the resource page contains just an iframe and we're filling it dynamically with content here.
        const stylesheet = `${(0, helper_js_1.getResourcesPath)()}/network/style.css`;
        const contents = `<head><link rel="stylesheet" href="${stylesheet}"></head><body><p>Content</p></body>`;
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.waitForFunction)(async () => (await target.$('iframe')) ?? undefined);
        const dataUrl = `data:text/html,${contents}`;
        await target.evaluate((dataUrl) => {
            document.querySelector('iframe').src = dataUrl;
        }, dataUrl);
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        const names = await (0, network_helpers_js_1.getAllRequestNames)();
        const name = names.find(v => v && v.startsWith('data:'));
        chai_1.assert.isNotNull(name);
        await (0, network_helpers_js_1.selectRequestByName)(name);
        const styleSrcError = (0, events_js_1.expectError)(`Refused to load the stylesheet '${stylesheet}'`);
        const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
        const previewTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Preview][role=tab]', networkView);
        await (0, helper_js_1.click)(previewTabHeader);
        await (0, helper_js_1.waitFor)('[aria-label=Preview][role=tab][aria-selected=true]', networkView);
        const frame = await (0, helper_js_1.waitFor)('.html-preview-frame');
        const content = await (0, helper_js_1.waitForFunction)(async () => (await frame.contentFrame() ?? undefined));
        const p = await (0, helper_js_1.waitForFunction)(async () => (await content.$('p') ?? undefined));
        const color = await p.evaluate(e => getComputedStyle(e).color);
        chai_1.assert.deepEqual(color, 'rgb(0, 0, 0)');
        await (0, helper_js_1.waitForFunction)(async () => await styleSrcError.caught);
    });
    (0, mocha_extensions_js_1.it)('stores websocket filter', async () => {
        const navigateToWebsocketMessages = async () => {
            await (0, network_helpers_js_1.navigateToNetworkTab)('websocket.html');
            await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
            await (0, network_helpers_js_1.selectRequestByName)('localhost');
            const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
            const messagesTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Messages][role=tab]', networkView);
            await (0, helper_js_1.click)(messagesTabHeader);
            await (0, helper_js_1.waitFor)('[aria-label=Messages][role=tab][aria-selected=true]', networkView);
            return (0, helper_js_1.waitFor)('.websocket-frame-view');
        };
        let messagesView = await navigateToWebsocketMessages();
        const waitForMessages = async (count) => {
            return (0, helper_js_1.waitForFunction)(async () => {
                const messages = await (0, helper_js_1.$$)('.data-column.websocket-frame-view-td', messagesView);
                if (messages.length !== count) {
                    return undefined;
                }
                return Promise.all(messages.map(message => {
                    return message.evaluate(message => message.textContent || '');
                }));
            });
        };
        let messages = await waitForMessages(4);
        const filterInput = await (0, helper_js_1.waitFor)('[aria-label="Enter regex, for example: (web)?socket"][role=textbox]', messagesView);
        filterInput.focus();
        void (0, helper_js_1.typeText)('ping');
        messages = await waitForMessages(2);
        chai_1.assert.deepEqual(messages, ['ping', 'ping']);
        messagesView = await navigateToWebsocketMessages();
        messages = await waitForMessages(2);
        chai_1.assert.deepEqual(messages, ['ping', 'ping']);
    });
    async function assertOutlineMatches(expectedPatterns, outline) {
        const regexpSpecialChars = /[-\/\\^$*+?.()|[\]{}]/g;
        for (const item of outline) {
            const actualText = await item.evaluate(el => el.textContent || '');
            const expectedPattern = expectedPatterns.shift();
            if (expectedPattern) {
                chai_1.assert.match(actualText, new RegExp(expectedPattern.replace(regexpSpecialChars, '\\$&').replace(/%/g, '.*')));
            }
            else {
                chai_1.assert.fail('Unexpected text: ' + actualText);
            }
        }
    }
    (0, mocha_extensions_js_1.it)('shows request headers and payload', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('headers-and-payload.html');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        await (0, network_helpers_js_1.selectRequestByName)('image.svg?id=42&param=a%20b');
        const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
        const headersTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Headers][role="tab"]', networkView);
        await (0, helper_js_1.click)(headersTabHeader);
        await (0, helper_js_1.waitFor)('[aria-label=Headers][role=tab][aria-selected=true]', networkView);
        const headersView = await (0, helper_js_1.waitFor)('.request-headers-view');
        const headersOutline = await (0, helper_js_1.$$)('[role=treeitem]:not(.hidden)', headersView);
        const expectedHeadersContent = [
            'General',
            [
                'Request URL: https://localhost:%/test/e2e/resources/network/image.svg?id=42&param=a%20b',
                'Request Method: POST',
                'Status Code: 200 OK',
                'Remote Address: [::1]:%',
                'Referrer Policy: strict-origin-when-cross-origin',
            ],
            'Response Headers (7)View source',
            [
                'Cache-Control: max-age=%',
                'Connection: keep-alive',
                'Content-Type: image/svg+xml; charset=utf-8',
                'Date: %',
                'Keep-Alive: timeout=5',
                'Transfer-Encoding: chunked',
                'Vary: Origin',
            ],
            'Request Headers (17)View source',
            [
                'accept: */*',
                'Accept-Encoding: gzip, deflate, br',
                'Accept-Language: en-US',
                'Connection: keep-alive',
                'Content-Length: 32',
                'content-type: application/x-www-form-urlencoded;charset=UTF-8',
                'Host: localhost:%',
                'Origin: https://localhost:%',
                'Referer: https://localhost:%/test/e2e/resources/network/headers-and-payload.html',
                'sec-ch-ua',
                'sec-ch-ua-mobile: ?0',
                'sec-ch-ua-platform',
                'Sec-Fetch-Dest: empty',
                'Sec-Fetch-Mode: cors',
                'Sec-Fetch-Site: same-origin',
                'User-Agent: Mozilla/5.0 %',
                'x-same-domain: 1',
            ],
        ].flat();
        await assertOutlineMatches(expectedHeadersContent, headersOutline);
        const payloadTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Payload][role="tab"]', networkView);
        await (0, helper_js_1.click)(payloadTabHeader);
        await (0, helper_js_1.waitFor)('[aria-label=Payload][role=tab][aria-selected=true]', networkView);
        const payloadView = await (0, helper_js_1.waitFor)('.request-payload-view');
        const payloadOutline = await (0, helper_js_1.$$)('[role=treeitem]:not(.hidden)', payloadView);
        const expectedPayloadContent = [
            'Query String Parameters (2)view sourceview URL-encoded',
            ['id: 42', 'param: a b'],
            'Form Data (4)view sourceview URL-encoded',
            [
                'foo: alpha',
                'bar: beta:42:0',
                'baz: ',
                '(empty)',
            ],
        ].flat();
        await assertOutlineMatches(expectedPayloadContent, payloadOutline);
    });
    (0, mocha_extensions_js_1.it)('shows raw headers', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('headers-and-payload.html');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        await (0, network_helpers_js_1.selectRequestByName)('image.svg?id=42&param=a%20b');
        const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
        const headersTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Headers][role="tab"]', networkView);
        await (0, helper_js_1.click)(headersTabHeader);
        await (0, helper_js_1.waitFor)('[aria-label=Headers][role=tab][aria-selected=true]', networkView);
        const headersView = await (0, helper_js_1.waitFor)('.request-headers-view');
        const responseHeadersTitle = await (0, helper_js_1.waitForElementWithTextContent)('Response Headers (7)View source');
        const rawHeadersToggle = await (0, helper_js_1.waitFor)('.header-toggle', responseHeadersTitle);
        await (0, helper_js_1.click)(rawHeadersToggle);
        const headersOutline = await (0, helper_js_1.$$)('[role=treeitem]:not(.hidden)', headersView);
        const expectedHeadersContent = [
            'General',
            [
                'Request URL: https://localhost:%/test/e2e/resources/network/image.svg?id=42&param=a%20b',
                'Request Method: POST',
                'Status Code: 200 OK',
                'Remote Address: [::1]:%',
                'Referrer Policy: strict-origin-when-cross-origin',
            ],
            'Response Headers (7)View parsed',
            [
                'HTTP/1.1 200 OK',
                'Content-Type: image/svg+xml; charset=utf-8',
                'Cache-Control: max-age=%',
                'Vary: Origin',
                'Date: %',
                'Connection: keep-alive',
                'Keep-Alive: timeout=5',
                'Transfer-Encoding: chunked',
            ].join('\r\n'),
            'Request Headers (17)View source',
            [
                'accept: */*',
                'Accept-Encoding: gzip, deflate, br',
                'Accept-Language: en-US',
                'Connection: keep-alive',
                'Content-Length: 32',
                'content-type: application/x-www-form-urlencoded;charset=UTF-8',
                'Host: localhost:%',
                'Origin: https://localhost:%',
                'Referer: https://localhost:%/test/e2e/resources/network/headers-and-payload.html',
                'sec-ch-ua',
                'sec-ch-ua-mobile: ?0',
                'sec-ch-ua-platform',
                'Sec-Fetch-Dest: empty',
                'Sec-Fetch-Mode: cors',
                'Sec-Fetch-Site: same-origin',
                'User-Agent: Mozilla/5.0 %',
                'x-same-domain: 1',
            ],
        ].flat();
        await assertOutlineMatches(expectedHeadersContent, headersOutline);
    });
    (0, mocha_extensions_js_1.it)('payload tab selection is preserved', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('headers-and-payload.html');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        await (0, network_helpers_js_1.selectRequestByName)('image.svg?id=42&param=a%20b');
        const networkView = await (0, helper_js_1.waitFor)('.network-item-view');
        const payloadTabHeader = await (0, helper_js_1.waitFor)('[aria-label=Payload][role="tab"]', networkView);
        await (0, helper_js_1.click)(payloadTabHeader);
        await (0, helper_js_1.waitFor)('[aria-label=Payload][role=tab][aria-selected=true]', networkView);
        await (0, network_helpers_js_1.selectRequestByName)('image.svg');
        await (0, helper_js_1.waitForElementWithTextContent)('foo: gamma');
    });
    (0, mocha_extensions_js_1.it)('no duplicate payload tab on headers update', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('requests.html');
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        target.evaluate(() => fetch('image.svg?delay'));
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        await (0, network_helpers_js_1.selectRequestByName)('image.svg?delay');
        await target.evaluate(async () => await fetch('/?send_delayed'));
    });
});
//# sourceMappingURL=network-request-view_test.js.map