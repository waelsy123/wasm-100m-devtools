"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const extension_helpers_js_1 = require("../helpers/extension-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const helper_js_1 = require("../../shared/helper.js");
(0, mocha_extensions_js_1.describe)('The Extension API', async () => {
    (0, mocha_extensions_js_1.it)('can open wasm resources with offset', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await target.goto(`${(0, helper_js_1.getResourcesPath)()}/sources/wasm/scopes.html`);
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        const resource = `${(0, helper_js_1.getResourcesPath)()}/sources/wasm/scopes.wasm`;
        await extension.waitForFunction(async (resource) => {
            const resources = await new Promise(r => window.chrome.devtools.inspectedWindow.getResources(r));
            return resources.find(r => r.url === resource);
        }, undefined, resource);
        // Accepts a wasm offset as column
        await extension.evaluate(resource => window.chrome.devtools.panels.openResource(resource, 0, 0x4b), resource);
        await (0, sources_helpers_js_1.waitForHighlightedLine)(0x4b);
        // Selects the right wasm line on an inexact match
        await extension.evaluate(resource => window.chrome.devtools.panels.openResource(resource, 0, 0x4e), resource);
        await (0, sources_helpers_js_1.waitForHighlightedLine)(0x4d);
        // Accepts a missing columnNumber
        await extension.evaluate(resource => window.chrome.devtools.panels.openResource(resource, 0), resource);
        await (0, sources_helpers_js_1.waitForHighlightedLine)(0);
        // Accepts a wasm offset as column and a callback
        {
            const r = await extension.evaluate(resource => new Promise(r => window.chrome.devtools.panels.openResource(resource, 0, 0x4b, () => r(1))), resource);
            chai_1.assert.deepEqual(r, 1);
        }
        await (0, sources_helpers_js_1.waitForHighlightedLine)(0x4b);
        // Is backwards compatible: accepts a callback with a missing columnNumber
        {
            const r = await extension.evaluate(
            // @ts-expect-error Legacy API
            resource => new Promise(r => window.chrome.devtools.panels.openResource(resource, 0, () => r(1))), resource);
            chai_1.assert.deepEqual(r, 1);
        }
        await (0, sources_helpers_js_1.waitForHighlightedLine)(0);
    });
    (0, mocha_extensions_js_1.it)('can open page resources with column numbers', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        const resource = `${(0, helper_js_1.getResourcesPath)()}/sources/wasm/scopes.html`;
        await target.goto(resource);
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension');
        await extension.waitForFunction(async (resource) => {
            const resources = await new Promise(r => window.chrome.devtools.inspectedWindow.getResources(r));
            return resources.find(r => r.url === resource);
        }, undefined, resource);
        // Accepts a missing columnNumber
        await extension.evaluate(resource => window.chrome.devtools.panels.openResource(resource, 2), resource);
        await (0, sources_helpers_js_1.waitForHighlightedLine)(3);
        // Accepts a column number
        {
            await extension.evaluate(resource => window.chrome.devtools.panels.openResource(resource, 29, 160), resource);
            await (0, sources_helpers_js_1.waitForHighlightedLine)(30);
            const toolbarText = await (0, sources_helpers_js_1.getToolbarText)();
            chai_1.assert.isTrue(toolbarText.includes('Line 30, Column 161'));
        }
        // Accepts a column number and a callback
        {
            const r = await extension.evaluate(resource => new Promise(r => window.chrome.devtools.panels.openResource(resource, 1, 2000, () => r(1))), resource);
            chai_1.assert.deepEqual(r, 1);
            await (0, sources_helpers_js_1.waitForHighlightedLine)(2);
            const toolbarText = await (0, sources_helpers_js_1.getToolbarText)();
            chai_1.assert.isTrue(toolbarText.includes('Line 2, Column 60'));
        }
        // Is backwards compatible: accepts a callback with a missing columnNumber
        {
            const r = await extension.evaluate(
            // @ts-expect-error Legacy API
            resource => new Promise(r => window.chrome.devtools.panels.openResource(resource, 2, () => r(1))), resource);
            chai_1.assert.deepEqual(r, 1);
            await (0, sources_helpers_js_1.waitForHighlightedLine)(3);
        }
    });
});
//# sourceMappingURL=can-open-resources-with-columns_test.js.map