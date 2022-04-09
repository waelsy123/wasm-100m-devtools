"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const network_helpers_js_1 = require("../helpers/network-helpers.js");
(0, mocha_extensions_js_1.describe)('The Network Tab', async function () {
    if (this.timeout() !== 0.0) {
        // These tests take some time on slow windows machines.
        this.timeout(10000);
    }
    const formatByteSize = (value) => {
        return `${value}\xA0B`;
    };
    beforeEach(async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('empty.html');
        await (0, network_helpers_js_1.setCacheDisabled)(true);
        await (0, network_helpers_js_1.setPersistLog)(false);
    });
    (0, mocha_extensions_js_1.it)('can click on checkbox label to toggle checkbox', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('resources-from-cache.html');
        // Click the label next to the checkbox input element
        await (0, helper_js_1.click)('[aria-label="Disable cache"] + label');
        const checkbox = await (0, helper_js_1.waitFor)('[aria-label="Disable cache"]');
        const checked = await checkbox.evaluate(box => box.checked);
        chai_1.assert.strictEqual(checked, false, 'The disable cache checkbox should be unchecked');
    });
    (0, mocha_extensions_js_1.it)('shows Last-Modified', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('last-modified.html');
        // Reload to populate network request table
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, helper_js_1.step)('Wait for the column to show up and populate its values', async () => {
            await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        });
        await (0, helper_js_1.step)('Open the contextmenu for all network column', async () => {
            await (0, helper_js_1.click)('.name-column', { clickOptions: { button: 'right' } });
        });
        await (0, helper_js_1.step)('Click "Response Headers" submenu', async () => {
            const responseHeaders = await (0, helper_js_1.waitForAria)('Response Headers');
            await (0, helper_js_1.click)(responseHeaders);
        });
        await (0, helper_js_1.step)('Enable the Last-Modified column in the network datagrid', async () => {
            const lastModified = await (0, helper_js_1.waitForAria)('Last-Modified, unchecked');
            await (0, helper_js_1.click)(lastModified);
        });
        await (0, helper_js_1.step)('Wait for the "Last-Modified" column to have the expected values', async () => {
            const expectedValues = JSON.stringify(['Last-Modified', '', 'Sun, 26 Sep 2010 22:04:35 GMT']);
            await (0, helper_js_1.waitForFunction)(async () => {
                const lastModifiedColumnValues = await frontend.$$eval('pierce/.last-modified-column', cells => cells.map(element => element.textContent));
                return JSON.stringify(lastModifiedColumnValues) === expectedValues;
            });
        });
    });
    (0, mocha_extensions_js_1.it)('the HTML response including cyrillic characters with utf-8 encoding', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('utf-8.rawresponse');
        // Reload to populate network request table
        await target.reload({ waitUntil: 'networkidle0' });
        // Wait for the column to show up and populate its values
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(1);
        // Open the HTML file that was loaded
        await (0, helper_js_1.click)('td.name-column');
        // Wait for the detailed network information pane to show up
        await (0, helper_js_1.waitFor)('[aria-label="Response"]');
        // Open the raw response HTML
        await (0, helper_js_1.click)('[aria-label="Response"]');
        // Wait for the raw response editor to show up
        const codeMirrorEditor = await (0, helper_js_1.waitFor)('[aria-label="Code editor"]');
        const htmlRawResponse = await codeMirrorEditor.evaluate(editor => editor.textContent);
        chai_1.assert.strictEqual(htmlRawResponse, '<html><body>The following word is written using cyrillic letters and should look like "SUCCESS": SU\u0421\u0421\u0415SS.</body></html>');
    });
    (0, mocha_extensions_js_1.it)('the correct MIME type when resources came from HTTP cache', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('resources-from-cache.html');
        // Reload the page without a cache, to force a fresh load of the network resources
        await (0, network_helpers_js_1.setCacheDisabled)(true);
        await target.reload({ waitUntil: 'networkidle0' });
        // Wait for the column to show up and populate its values
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        // Get the size of the first two network request responses (excluding header and favicon.ico).
        const getNetworkRequestSize = () => frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.size-column')).slice(1, 3).map(node => node.textContent);
        });
        const getNetworkRequestMimeTypes = () => frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.type-column')).slice(1, 3).map(node => node.textContent);
        });
        chai_1.assert.deepEqual(await getNetworkRequestSize(), [
            `${formatByteSize(404)}${formatByteSize(219)}`,
            `${formatByteSize(376)}${formatByteSize(28)}`,
        ]);
        chai_1.assert.deepEqual(await getNetworkRequestMimeTypes(), [
            'document',
            'script',
        ]);
        // Allow resources from the cache again and reload the page to load from cache
        await (0, network_helpers_js_1.setCacheDisabled)(false);
        await target.reload({ waitUntil: 'networkidle0' });
        // Wait for the column to show up and populate its values
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        chai_1.assert.deepEqual(await getNetworkRequestSize(), [
            `${formatByteSize(404)}${formatByteSize(219)}`,
            `(memory cache)${formatByteSize(28)}`,
        ]);
        chai_1.assert.deepEqual(await getNetworkRequestMimeTypes(), [
            'document',
            'script',
        ]);
    });
    (0, mocha_extensions_js_1.it)('shows the correct initiator address space', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('fetch.html');
        // Reload to populate network request table
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        await (0, helper_js_1.step)('Open the contextmenu for all network column', async () => {
            await (0, helper_js_1.click)('.name-column', { clickOptions: { button: 'right' } });
        });
        await (0, helper_js_1.step)('Enable the Initiator Address Space column in the network datagrid', async () => {
            const initiatorAddressSpace = await (0, helper_js_1.waitForAria)('Initiator Address Space, unchecked');
            await (0, helper_js_1.click)(initiatorAddressSpace);
        });
        await (0, helper_js_1.step)('Wait for the Initiator Address Space column to have the expected values', async () => {
            const expectedValues = JSON.stringify(['Initiator Address Space', '', 'Local']);
            await (0, helper_js_1.waitForFunction)(async () => {
                const initiatorAddressSpaceValues = await frontend.$$eval('pierce/.initiator-address-space-column', cells => cells.map(element => element.textContent));
                return JSON.stringify(initiatorAddressSpaceValues) === expectedValues;
            });
        });
    });
    (0, mocha_extensions_js_1.it)('shows the correct remote address space', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('fetch.html');
        // Reload to populate network request table
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        await (0, helper_js_1.step)('Open the contextmenu for all network column', async () => {
            await (0, helper_js_1.click)('.name-column', { clickOptions: { button: 'right' } });
        });
        await (0, helper_js_1.step)('Enable the Remote Address Space column in the network datagrid', async () => {
            const remoteAddressSpace = await (0, helper_js_1.waitForAria)('Remote Address Space, unchecked');
            await (0, helper_js_1.click)(remoteAddressSpace);
        });
        await (0, helper_js_1.step)('Wait for the Remote Address Space column to have the expected values', async () => {
            const expectedValues = JSON.stringify(['Remote Address Space', 'Local', 'Local']);
            await (0, helper_js_1.waitForFunction)(async () => {
                const remoteAddressSpaceValues = await frontend.$$eval('pierce/.remoteaddress-space-column', cells => cells.map(element => element.textContent));
                return JSON.stringify(remoteAddressSpaceValues) === expectedValues;
            });
        });
    });
    (0, mocha_extensions_js_1.it)('indicates resources from the web bundle in the size column', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('resources-from-webbundle.html');
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        await (0, helper_js_1.waitForElementWithTextContent)(`(Web Bundle)${formatByteSize(27)}`);
        const getNetworkRequestSize = () => frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.size-column')).slice(2, 4).map(node => node.textContent);
        });
        chai_1.assert.sameMembers(await getNetworkRequestSize(), [
            `${formatByteSize(653)}${formatByteSize(0)}`,
            `(Web Bundle)${formatByteSize(27)}`,
        ]);
    });
    (0, mocha_extensions_js_1.it)('shows web bundle metadata error in the status column', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('resources-from-webbundle-with-bad-metadata.html');
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        await (0, helper_js_1.waitForElementWithTextContent)('Web Bundle error');
        const getNetworkRequestStatus = () => frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.status-column')).slice(2, 4).map(node => node.textContent);
        });
        chai_1.assert.sameMembers(await getNetworkRequestStatus(), ['Web Bundle error', '(failed)net::ERR_INVALID_WEB_BUNDLE']);
    });
    (0, mocha_extensions_js_1.it)('shows web bundle inner request error in the status column', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('resources-from-webbundle-with-bad-inner-request.html');
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        await (0, helper_js_1.waitForElementWithTextContent)('Web Bundle error');
        const getNetworkRequestSize = () => frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.status-column')).slice(2, 4).map(node => node.textContent);
        });
        chai_1.assert.sameMembers(await getNetworkRequestSize(), ['200OK', 'Web Bundle error']);
    });
    (0, mocha_extensions_js_1.it)('shows web bundle icons', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('resources-from-webbundle.html');
        await (0, network_helpers_js_1.setCacheDisabled)(true);
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        await (0, helper_js_1.waitFor)('.name-column > [role="link"] > .icon');
        const getNetworkRequestIcons = () => frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.name-column > .icon'))
                .slice(1, 4)
                .map(node => node.alt);
        });
        chai_1.assert.sameMembers(await getNetworkRequestIcons(), [
            'Script',
            'WebBundle',
        ]);
        const getFromWebBundleIcons = () => frontend.evaluate(() => {
            return Array.from(document.querySelectorAll('.name-column > [role="link"] > .icon'))
                .map(node => node.alt);
        });
        chai_1.assert.sameMembers(await getFromWebBundleIcons(), [
            'Served from Web Bundle',
        ]);
    });
    (0, mocha_extensions_js_1.it)('shows preserved pending requests as unknown', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('send_beacon_on_unload.html');
        await (0, network_helpers_js_1.setCacheDisabled)(true);
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(1);
        await (0, network_helpers_js_1.setPersistLog)(true);
        await (0, network_helpers_js_1.navigateToNetworkTab)('fetch.html');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(1);
        async function getStatusAndTime(name) {
            const statusColumn = await frontend.evaluate(() => {
                return Array.from(document.querySelectorAll('.status-column')).map(node => node.textContent);
            });
            const timeColumn = await frontend.evaluate(() => {
                return Array.from(document.querySelectorAll('.time-column')).map(node => node.textContent);
            });
            const nameColumn = await frontend.evaluate(() => {
                return Array.from(document.querySelectorAll('.name-column')).map(node => node.textContent);
            });
            const index = nameColumn.findIndex(x => x === name);
            return { status: statusColumn[index], time: timeColumn[index] };
        }
        // We need to wait for the network log to update.
        await (0, helper_js_1.waitForFunction)(async () => {
            const { status, time } = await getStatusAndTime('sendBeacon');
            // Depending on timing of the reporting, the status infomation (404) might reach DevTools in time.
            return (status === '(unknown)' || status === '404') && time === '(unknown)';
        });
    });
    (0, mocha_extensions_js_1.it)('repeats xhr request on "r" shortcut when the request is focused', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, network_helpers_js_1.navigateToNetworkTab)('xhr.html');
        await target.reload({ waitUntil: 'networkidle0' });
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        await (0, network_helpers_js_1.selectRequestByName)('image.svg');
        await (0, network_helpers_js_1.waitForSelectedRequestChange)(null);
        await (0, helper_js_1.pressKey)('r');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(3);
        const updatedRequestNames = await (0, network_helpers_js_1.getAllRequestNames)();
        chai_1.assert.deepStrictEqual(updatedRequestNames, ['xhr.html', 'image.svg', 'image.svg']);
    });
    (0, mocha_extensions_js_1.it)('shows the request panel when clicked during a websocket message (https://crbug.com/1222382)', async () => {
        await (0, network_helpers_js_1.navigateToNetworkTab)('websocket.html?infiniteMessages=true');
        await (0, network_helpers_js_1.waitForSomeRequestsToAppear)(2);
        // WebSocket messages get sent every 100 milliseconds, so holding the mouse
        // down for 300 milliseconds should suffice.
        await (0, network_helpers_js_1.selectRequestByName)('localhost', { delay: 300 });
        await (0, helper_js_1.waitFor)('.network-item-view');
    });
});
//# sourceMappingURL=network-datagrid_test.js.map