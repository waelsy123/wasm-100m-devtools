"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandlers = exports.getTestServerPort = exports.setTestServerPort = exports.getBrowserAndPages = exports.setBrowserAndPages = exports.clearPuppeteerState = void 0;
const puppeteer = require("puppeteer");
const custom_query_handlers_js_1 = require("./custom-query-handlers.js");
let target;
let frontend;
let browser;
// Set when we launch the server. It will be different for each
// sub-process runner when running in parallel.
let testServerPort;
const clearPuppeteerState = () => {
    target = null;
    frontend = null;
    browser = null;
    testServerPort = null;
};
exports.clearPuppeteerState = clearPuppeteerState;
const setBrowserAndPages = (newValues) => {
    if (target || frontend || browser) {
        throw new Error('Can\'t set the puppeteer browser twice.');
    }
    ({ target, frontend, browser } = newValues);
};
exports.setBrowserAndPages = setBrowserAndPages;
const getBrowserAndPages = () => {
    if (!target) {
        throw new Error('Unable to locate target page. Was it stored first?');
    }
    if (!frontend) {
        throw new Error('Unable to locate DevTools frontend page. Was it stored first?');
    }
    if (!browser) {
        throw new Error('Unable to locate browser instance. Was it stored first?');
    }
    return {
        target,
        frontend,
        browser,
    };
};
exports.getBrowserAndPages = getBrowserAndPages;
const setTestServerPort = (port) => {
    if (testServerPort) {
        throw new Error('Can\'t set the test server port twice.');
    }
    testServerPort = port;
};
exports.setTestServerPort = setTestServerPort;
const getTestServerPort = () => {
    if (!testServerPort) {
        throw new Error('Unable to locate test server port. Was it stored first?' +
            '\nYou might be calling this function at module instantiation time, instead of ' +
            'at runtime when the port is available.');
    }
    return testServerPort;
};
exports.getTestServerPort = getTestServerPort;
let handlerRegistered = false;
const registerHandlers = () => {
    if (handlerRegistered) {
        return;
    }
    puppeteer.registerCustomQueryHandler('pierceShadowText', {
        queryOne: custom_query_handlers_js_1.querySelectorShadowTextOne,
        queryAll: custom_query_handlers_js_1.querySelectorShadowTextAll,
    });
    handlerRegistered = true;
};
exports.registerHandlers = registerHandlers;
//# sourceMappingURL=puppeteer-state.js.map