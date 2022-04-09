// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
const { getPhysicalAxisFromQueryAxis, getQueryAxis, PhysicalAxis, QueryAxis } = SDK.CSSContainerQuery;
describe('CSSContainerQuery', () => {
    describe('getQueryAxis', () => {
        it('gets the query axis of no containment correctly', () => {
            assert.strictEqual(getQueryAxis(''), "" /* None */);
            assert.strictEqual(getQueryAxis('style layout'), "" /* None */);
        });
        it('gets the query axis of an inline container query correctly', () => {
            assert.strictEqual(getQueryAxis('inline-size layout style'), "inline-size" /* Inline */);
            assert.strictEqual(getQueryAxis('layout inline-size style inline-size'), "inline-size" /* Inline */);
        });
        it('gets the query axis of a block container query correctly', () => {
            assert.strictEqual(getQueryAxis('block-size layout style'), "block-size" /* Block */);
            assert.strictEqual(getQueryAxis('layout block-size style block-size'), "block-size" /* Block */);
        });
        it('gets the query axis of inline-block container query correctly', () => {
            assert.strictEqual(getQueryAxis('inline-size layout style block-size'), "size" /* Both */);
            assert.strictEqual(getQueryAxis('layout size style'), "size" /* Both */);
            assert.strictEqual(getQueryAxis('size'), "size" /* Both */);
        });
    });
    describe('getPhysicalAxisFromQueryAxis', () => {
        it('gets the physical axis of no containment correctly', () => {
            assert.strictEqual(getPhysicalAxisFromQueryAxis("" /* None */, 'horizontal-tb'), "" /* None */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("" /* None */, 'vertical-lr'), "" /* None */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("" /* None */, 'vertical-rl'), "" /* None */);
        });
        it('gets the physical axis of horizontal containment correctly', () => {
            assert.strictEqual(getPhysicalAxisFromQueryAxis("inline-size" /* Inline */, 'horizontal-tb'), "Horizontal" /* Horizontal */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("block-size" /* Block */, 'vertical-lr'), "Horizontal" /* Horizontal */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("block-size" /* Block */, 'vertical-rl'), "Horizontal" /* Horizontal */);
        });
        it('gets the physical axis of vertical containment correctly', () => {
            assert.strictEqual(getPhysicalAxisFromQueryAxis("block-size" /* Block */, 'horizontal-tb'), "Vertical" /* Vertical */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("inline-size" /* Inline */, 'vertical-lr'), "Vertical" /* Vertical */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("inline-size" /* Inline */, 'vertical-rl'), "Vertical" /* Vertical */);
        });
        it('gets the physical axis both-axes containment correctly', () => {
            assert.strictEqual(getPhysicalAxisFromQueryAxis("size" /* Both */, 'horizontal-tb'), "Both" /* Both */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("size" /* Both */, 'vertical-lr'), "Both" /* Both */);
            assert.strictEqual(getPhysicalAxisFromQueryAxis("size" /* Both */, 'vertical-rl'), "Both" /* Both */);
        });
    });
});
//# sourceMappingURL=CSSContainerQuery_test.js.map