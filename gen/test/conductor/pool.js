"use strict";
// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pool = exports.FrontendTargetPool = void 0;
const frontend_tab_js_1 = require("./frontend_tab.js");
const target_tab_js_1 = require("./target_tab.js");
/**
 * A pool of DevTools frontend tab plus target tab pairs. Every time a pair
 * is taken from the pool, the pool will automatically prepare another pair.
 *
 * Tab pairs are not intended to be reused and its the consumer's responsibility
 * to clean them up properly.
 */
class FrontendTargetPool {
    static POOL_SIZE = 5;
    #pool = new Pool();
    #browser;
    #testServerPort;
    constructor(browser, testServerPort) {
        this.#browser = browser;
        this.#testServerPort = testServerPort;
    }
    /** Returns a pool with `options.poolSize` tab pairs ready to go. */
    static create(options) {
        const { browser, testServerPort, poolSize = FrontendTargetPool.POOL_SIZE } = options;
        const tabPool = new FrontendTargetPool(browser, testServerPort);
        for (let i = 0; i < poolSize; ++i) {
            void tabPool.addTabPairToPool();
        }
        return tabPool;
    }
    async addTabPairToPool() {
        const target = await target_tab_js_1.TargetTab.create(this.#browser);
        const frontend = await frontend_tab_js_1.DevToolsFrontendTab.create({ browser: this.#browser, testServerPort: this.#testServerPort, targetId: target.targetId() });
        this.#pool.put({ target, frontend });
    }
    async takeTabPair() {
        const pair = this.#pool.take();
        // We took a pair, so lets queue up the creation of a fresh pair.
        // It's important that we do not block here, the fresh pair is prepared
        // in the background.
        // Also note that this approach allows a pool size of 0. For every
        // `takeTabPair`, we call `addTabPairToPool`. The resulting pair is then
        // used to resolve the `pair` promise of the `takeTabPair` call.
        void this.addTabPairToPool();
        return pair;
    }
}
exports.FrontendTargetPool = FrontendTargetPool;
/**
 * A simple Promise-based pool. Esentially a queue.
 *
 * When the pool is empty, consumers get a promise that resolves as soon as
 * the pool is refilled.
 */
class Pool {
    #pool = [];
    #queue = [];
    put(value) {
        if (this.#queue.length > 0) {
            const waitee = this.#queue.shift();
            waitee(value);
            return;
        }
        this.#pool.push(value);
    }
    take() {
        if (this.#pool.length > 0) {
            const value = this.#pool.shift();
            return Promise.resolve(value);
        }
        return new Promise(resolve => {
            this.#queue.push(resolve);
        });
    }
}
exports.Pool = Pool;
//# sourceMappingURL=pool.js.map