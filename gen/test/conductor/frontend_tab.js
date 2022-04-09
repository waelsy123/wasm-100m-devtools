"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEmptyPageAndWaitForContent = exports.DevToolsFrontendTab = void 0;
const events_js_1 = require("./events.js");
const test_runner_config_js_1 = require("./test_runner_config.js");
// When loading DevTools with target.goto, we wait for it to be fully loaded using these events.
const DEVTOOLS_WAITUNTIL_EVENTS = ['networkidle2', 'domcontentloaded'];
// When loading an empty page (including within the devtools window), we wait for it to be loaded using these events.
const EMPTY_PAGE_WAITUNTIL_EVENTS = ['domcontentloaded'];
const EMPTY_PAGE = 'data:text/html,<!DOCTYPE html>';
/**
 * Wrapper class around `puppeteer.Page` that helps with setting up and
 * managing a DevTools frontend tab.
 */
class DevToolsFrontendTab {
    page;
    #frontendUrl;
    static DEFAULT_TAB = {
        name: 'elements',
        selector: '.elements',
    };
    // We use the counter to give each tab a unique origin.
    static tabCounter = 0;
    constructor(page, frontendUrl) {
        this.page = page;
        this.#frontendUrl = frontendUrl;
    }
    static async create({ browser, testServerPort, targetId }) {
        const devToolsAppURL = (0, test_runner_config_js_1.getTestRunnerConfigSetting)('hosted-server-devtools-url', 'front_end/devtools_app.html');
        if (!devToolsAppURL) {
            throw new Error('Could not load DevTools. hosted-server-devtools-url config not found.');
        }
        // We load the DevTools frontend on a unique origin. Otherwise we would share 'localhost' with
        // target pages. This could cause difficult to debug problems as things like window.localStorage
        // would be shared and requests would be "same-origin".
        // We also use a unique ID per DevTools frontend instance, to avoid the same issue with other
        // frontend instances.
        const id = DevToolsFrontendTab.tabCounter++;
        const frontendUrl = `https://i${id}.devtools-frontend.test:${testServerPort}/${devToolsAppURL}?ws=localhost:${getDebugPort(browser)}/devtools/page/${targetId}`;
        const frontend = await browser.newPage();
        (0, events_js_1.installPageErrorHandlers)(frontend);
        await frontend.goto(frontendUrl, { waitUntil: DEVTOOLS_WAITUNTIL_EVENTS });
        const tab = new DevToolsFrontendTab(frontend, frontendUrl);
        return tab;
    }
    /** Same as `reload` but also clears out experiments and settings (window.localStorage really) */
    async reset() {
        // Clear any local storage settings.
        await this.page.evaluate(() => localStorage.clear());
        await this.reload();
    }
    async reload(options = {}) {
        // For the unspecified case wait for loading, then wait for the elements panel.
        const { selectedPanel = DevToolsFrontendTab.DEFAULT_TAB, canDock = false, queryParams = {} } = options;
        if (selectedPanel.name !== DevToolsFrontendTab.DEFAULT_TAB.name) {
            await this.page.evaluate(name => {
                globalThis.localStorage.setItem('panel-selectedTab', `"${name}"`);
            }, selectedPanel.name);
        }
        // Reload the DevTools frontend and await the elements panel.
        await loadEmptyPageAndWaitForContent(this.page);
        // omit "can_dock=" when it's false because appending "can_dock=false"
        // will make getElementPosition in shared helpers unhappy
        let url = canDock ? `${this.#frontendUrl}&can_dock=true` : this.#frontendUrl;
        if (queryParams.panel) {
            url += `&panel=${queryParams.panel}`;
        }
        await this.page.goto(url, { waitUntil: DEVTOOLS_WAITUNTIL_EVENTS });
        if (!queryParams.panel && selectedPanel.selector) {
            await this.page.waitForSelector(selectedPanel.selector);
        }
    }
    /**
     * Returns the current hostname of this frontend tab. This might not be
     * consistent with the intial URL in case the page was navigated to
     * a different origin.
     */
    hostname() {
        const url = new URL(this.page.url());
        return url.hostname;
    }
}
exports.DevToolsFrontendTab = DevToolsFrontendTab;
async function loadEmptyPageAndWaitForContent(target) {
    await target.goto(EMPTY_PAGE, { waitUntil: EMPTY_PAGE_WAITUNTIL_EVENTS });
}
exports.loadEmptyPageAndWaitForContent = loadEmptyPageAndWaitForContent;
function getDebugPort(browser) {
    const websocketUrl = browser.wsEndpoint();
    const url = new URL(websocketUrl);
    if (url.port) {
        return url.port;
    }
    throw new Error(`Unable to find debug port: ${websocketUrl}`);
}
//# sourceMappingURL=frontend_tab.js.map