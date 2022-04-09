"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadExtension = exports.getResourcesPathWithDevToolsHostname = void 0;
const helper_js_1 = require("../../shared/helper.js");
// TODO: Remove once Chromium updates its version of Node.js to 12+.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalThis = global;
let loadExtensionPromise = Promise.resolve();
// FIXME(chromium:1248945): Replace with crypto.randomUUID() once Chromium updates its version of node.js
function guid() {
    const digits = '0123456789abcdef';
    const rnd = () => digits[Math.floor(Math.random() * (digits.length - 1))];
    const eight = new Array(8).fill('0').map(rnd).join('');
    const four = new Array(4).fill('0').map(rnd).join('');
    const version = new Array(3).fill('0').map(rnd).join('');
    const variant = new Array(3).fill('0').map(rnd).join('');
    const twelve = new Array(12).fill('0').map(rnd).join('');
    return `${eight}-${four}-4${version}-8${variant}-${twelve}`;
}
function getResourcesPathWithDevToolsHostname() {
    return (0, helper_js_1.getResourcesPath)((0, helper_js_1.getDevToolsFrontendHostname)());
}
exports.getResourcesPathWithDevToolsHostname = getResourcesPathWithDevToolsHostname;
async function loadExtension(name, startPage) {
    startPage = startPage || `${getResourcesPathWithDevToolsHostname()}/extensions/empty_extension.html`;
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const extensionInfo = { startPage, name };
    // Because the injected script is shared across calls for the target, we cannot run multiple instances concurrently.
    const load = loadExtensionPromise.then(() => doLoad(frontend, extensionInfo));
    loadExtensionPromise = load.catch(() => { });
    return load;
    async function doLoad(frontend, extensionInfo) {
        // @ts-ignore The pptr API doesn't allow us to remove the API injection after we're done.
        const session = await frontend._client;
        // TODO(chromium:1246836) remove once real extension tests are available
        const injectedAPI = await frontend.evaluate(extensionInfo => globalThis.buildExtensionAPIInjectedScript(extensionInfo, undefined, 'default', globalThis.UI.shortcutRegistry.globalShortcutKeys()), extensionInfo);
        function declareChrome() {
            if (!window.chrome) {
                window.chrome = {};
            }
        }
        const extensionScriptId = guid();
        const injectedScriptId = await session.send('Page.addScriptToEvaluateOnNewDocument', { source: `(${declareChrome})();${injectedAPI}('${extensionScriptId}')` });
        try {
            await frontend.evaluate(extensionInfo => {
                globalThis.Extensions.extensionServer.addExtension(extensionInfo);
                const extensionIFrames = document.body.querySelectorAll(`[data-devtools-extension="${extensionInfo.name}"]`);
                if (extensionIFrames.length > 1) {
                    throw new Error(`Duplicate extension ${extensionInfo.name}`);
                }
                if (extensionIFrames.length === 0) {
                    throw new Error('Installing the extension failed.');
                }
                return new Promise(resolve => {
                    extensionIFrames[0].onload = () => resolve();
                });
            }, extensionInfo);
            const iframe = await (0, helper_js_1.waitFor)(`[data-devtools-extension="${name}"]`);
            const frame = await iframe.contentFrame();
            if (!frame) {
                throw new Error('Installing the extension failed.');
            }
            return frame;
        }
        finally {
            await session.send('Page.removeScriptToEvaluateOnNewDocument', injectedScriptId);
        }
    }
}
exports.loadExtension = loadExtension;
//# sourceMappingURL=extension-helpers.js.map