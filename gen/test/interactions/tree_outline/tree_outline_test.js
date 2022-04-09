"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const shared_js_1 = require("../helpers/shared.js");
async function getTreeOutline(root) {
    const treeOutline = await (0, helper_js_1.waitFor)('devtools-tree-outline', root);
    if (!treeOutline) {
        chai_1.assert.fail('Could not find tree-outline.');
    }
    return treeOutline;
}
async function buildTreeNode(handler) {
    const keyNode = await (0, helper_js_1.$)('[data-node-key]', handler);
    const keyText = keyNode ? await keyNode.evaluate(k => (k.textContent || '').trim()) : '';
    const item = {
        key: keyText,
    };
    const ariaExpandedAttribute = await handler.evaluate(elem => elem.getAttribute('aria-expanded'));
    if (ariaExpandedAttribute && ariaExpandedAttribute === 'true') {
        // Figure out the aria-level of the parent, so we only select its immediate children that are one level down.
        const parentNodeLevel = await handler.evaluate(elem => window.parseInt(elem.getAttribute('aria-level') || ''));
        item.children = [];
        const childNodes = await (0, helper_js_1.$$)(`ul[role="group"] > li[role="treeitem"][aria-level="${parentNodeLevel + 1}"]`, handler);
        for (const child of childNodes) {
            const newNode = await buildTreeNode(child);
            item.children.push(newNode);
        }
    }
    return item;
}
async function getRenderedNodesTextAsTree(treeOutline) {
    const tree = [];
    const rootNodes = await (0, helper_js_1.$$)('ul[role="tree"]>li[role="treeitem"]', treeOutline);
    for (const root of rootNodes) {
        const newNode = await buildTreeNode(root);
        tree.push(newNode);
    }
    return tree;
}
describe('TreeOutline', () => {
    (0, shared_js_1.preloadForCodeCoverage)('tree_outline/basic.html');
    (0, mocha_extensions_js_1.it)('renders the top level nodes by default', async () => {
        await (0, shared_js_1.loadComponentDocExample)('tree_outline/basic.html');
        const treeOutline = await getTreeOutline();
        const renderedNodeTree = await getRenderedNodesTextAsTree(treeOutline);
        chai_1.assert.deepEqual(renderedNodeTree, [
            { key: 'Offices' },
            { key: 'Products' },
        ]);
    });
    (0, mocha_extensions_js_1.it)('lets the user click to expand a node', async () => {
        await (0, shared_js_1.loadComponentDocExample)('tree_outline/basic.html');
        const treeOutline = await getTreeOutline();
        const firstArrow = await (0, helper_js_1.$)('.arrow-icon', treeOutline);
        if (!firstArrow) {
            chai_1.assert.fail('Could not find arrow icon to click');
        }
        await (0, helper_js_1.click)(firstArrow);
        await (0, helper_js_1.waitForFunction)(async () => {
            const visibleNodes = await (0, helper_js_1.$$)('li[role="treeitem"]', treeOutline);
            // 3: 2 original root nodes, and the 1 child of the first root node.
            return visibleNodes.length === 3;
        });
        const renderedNodeTree = await getRenderedNodesTextAsTree(treeOutline);
        chai_1.assert.deepEqual(renderedNodeTree, [
            { key: 'Offices', children: [{ key: 'Europe' }] },
            { key: 'Products' },
        ]);
    });
});
//# sourceMappingURL=tree_outline_test.js.map