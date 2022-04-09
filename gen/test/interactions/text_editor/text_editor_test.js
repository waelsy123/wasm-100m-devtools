"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const shared_js_1 = require("../helpers/shared.js");
async function getEditorContent(textEditor) {
    return textEditor.evaluate(node => node.state.doc.toString());
}
async function getEditorSelection(textEditor) {
    return JSON.parse(await textEditor.evaluate(node => {
        const { anchor, head } = node.state.selection.main;
        return JSON.stringify({ anchor, head });
    }));
}
describe('text editor', async () => {
    (0, shared_js_1.preloadForCodeCoverage)('text_editor/basic.html');
    (0, mocha_extensions_js_1.it)('can insert and delete some text', async () => {
        await (0, shared_js_1.loadComponentDocExample)('text_editor/basic.html');
        const textEditor = await (0, helper_js_1.waitFor)('devtools-text-editor');
        await (0, helper_js_1.click)('.cm-content', { root: textEditor });
        await (0, helper_js_1.typeText)('Some text here');
        chai_1.assert.strictEqual(await getEditorContent(textEditor), 'Some text here');
        await (0, helper_js_1.pressKey)('Backspace');
        await (0, helper_js_1.pressKey)('Backspace');
        chai_1.assert.strictEqual(await getEditorContent(textEditor), 'Some text he');
    });
    (0, mocha_extensions_js_1.it)('binds the expected keys', async () => {
        await (0, shared_js_1.loadComponentDocExample)('text_editor/basic.html');
        const textEditor = await (0, helper_js_1.waitFor)('devtools-text-editor');
        await (0, helper_js_1.click)('.cm-content', { root: textEditor });
        await (0, helper_js_1.typeText)('one two');
        const ctrlOrAlt = process.platform === 'darwin' ? { alt: true } : { control: true };
        await (0, helper_js_1.pressKey)('ArrowLeft');
        chai_1.assert.strictEqual((await getEditorSelection(textEditor)).head, 6);
        await (0, helper_js_1.pressKey)('ArrowLeft', ctrlOrAlt);
        chai_1.assert.strictEqual((await getEditorSelection(textEditor)).head, 4);
        await (0, helper_js_1.pressKey)('Home');
        chai_1.assert.strictEqual((await getEditorSelection(textEditor)).head, 0);
        await (0, helper_js_1.pressKey)('ArrowRight');
        chai_1.assert.strictEqual((await getEditorSelection(textEditor)).head, 1);
        await (0, helper_js_1.pressKey)('ArrowRight', ctrlOrAlt);
        chai_1.assert.strictEqual((await getEditorSelection(textEditor)).head, 3);
        await (0, helper_js_1.pressKey)('End', { control: true });
        chai_1.assert.strictEqual((await getEditorSelection(textEditor)).head, 7);
        await (0, helper_js_1.typeText)(' three');
        chai_1.assert.strictEqual(await getEditorContent(textEditor), 'one two three');
        await (0, helper_js_1.pressKey)('Z', { control: true });
        chai_1.assert.strictEqual(await getEditorContent(textEditor), 'one two');
        await (0, helper_js_1.pressKey)('Z', { control: true });
        chai_1.assert.strictEqual(await getEditorContent(textEditor), '');
    });
});
//# sourceMappingURL=text_editor_test.js.map