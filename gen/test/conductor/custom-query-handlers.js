"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.querySelectorShadowTextAll = exports.querySelectorShadowTextOne = void 0;
/**
* The following custom query all implement the same traversal logic and as such
* it would be nice if we could refactor this out instead of repeating ourselves.
* But because the handlers will be stringified and sent over the wire through
* CDP, we need the functions to be completely self-contained and not refer any
* names from the outer scope. This means that such a refactoring can only be
* achieved by using reflection, which we decided against.
*/
const querySelectorShadowTextOne = (element, text) => {
    let found = null;
    const search = (root) => {
        const iter = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        do {
            const currentNode = iter.currentNode;
            if (currentNode.shadowRoot) {
                search(currentNode.shadowRoot);
            }
            if (currentNode instanceof ShadowRoot) {
                continue;
            }
            if (!found && currentNode.textContent === text) {
                found = currentNode;
            }
        } while (!found && iter.nextNode());
    };
    if (element instanceof Document) {
        element = element.documentElement;
    }
    search(element);
    return found;
};
exports.querySelectorShadowTextOne = querySelectorShadowTextOne;
const querySelectorShadowTextAll = (element, selector) => {
    const result = [];
    const collect = (root) => {
        const iter = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        do {
            const currentNode = iter.currentNode;
            if (currentNode.shadowRoot) {
                collect(currentNode.shadowRoot);
            }
            if (currentNode instanceof ShadowRoot) {
                continue;
            }
            if (currentNode.textContent === selector) {
                result.push(currentNode);
            }
        } while (iter.nextNode());
    };
    if (element instanceof Document) {
        element = element.documentElement;
    }
    collect(element);
    return result;
};
exports.querySelectorShadowTextAll = querySelectorShadowTextAll;
//# sourceMappingURL=custom-query-handlers.js.map