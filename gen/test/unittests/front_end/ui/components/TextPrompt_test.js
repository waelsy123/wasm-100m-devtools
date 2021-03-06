// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as TextPrompt from '../../../../../front_end/ui/components/text_prompt/text_prompt.js';
import { assertElements, assertShadowRoot, renderElementIntoDOM } from '../../helpers/DOMHelpers.js';
const { assert } = chai;
const renderTextPrompt = (data) => {
    const component = new TextPrompt.TextPrompt.TextPrompt();
    component.data = data;
    return component;
};
const defaultTextPromptData = {
    ariaLabel: 'Quick open prompt',
    prefix: 'Open',
    suggestion: 'File',
};
describe('TextPrompt', () => {
    it('renders one text prompt correctly', () => {
        const component = renderTextPrompt(defaultTextPromptData);
        renderElementIntoDOM(component);
        assertShadowRoot(component.shadowRoot);
        const textPromptPrefixs = component.shadowRoot.querySelectorAll('.prefix');
        assert.strictEqual(textPromptPrefixs.length, 1);
        assertElements(textPromptPrefixs, HTMLSpanElement);
        const textPromptInputs = component.shadowRoot.querySelectorAll('.text-prompt-input');
        assert.strictEqual(textPromptInputs.length, 1);
        assertElements(textPromptInputs, HTMLSpanElement);
        assert.deepEqual(component.data, defaultTextPromptData);
    });
    describe('data setter', () => {
        it('sets the prefix correctly', () => {
            const component = renderTextPrompt(defaultTextPromptData);
            renderElementIntoDOM(component);
            assertShadowRoot(component.shadowRoot);
            component.setPrefix('Run');
            const textPromptPrefixs = component.shadowRoot.querySelectorAll('.prefix');
            assert.strictEqual(textPromptPrefixs.length, 1);
            assert.strictEqual(textPromptPrefixs[0].textContent?.trim(), 'Run');
        });
        it('sets the suggestion correctly', () => {
            const component = renderTextPrompt(defaultTextPromptData);
            renderElementIntoDOM(component);
            assertShadowRoot(component.shadowRoot);
            component.setSuggestion('Command');
            const textPromptSuggestions = component.shadowRoot.querySelectorAll('.suggestion');
            assert.strictEqual(textPromptSuggestions.length, 1);
            assert.strictEqual(textPromptSuggestions[0].value.trim(), 'Command');
        });
        it('sets the input text correctly', () => {
            const component = renderTextPrompt(defaultTextPromptData);
            renderElementIntoDOM(component);
            assertShadowRoot(component.shadowRoot);
            component.setText('text');
            const textPromptInputs = component.shadowRoot.querySelectorAll('.input');
            assert.strictEqual(textPromptInputs.length, 1);
            assert.strictEqual(textPromptInputs[0].value.trim(), 'text');
        });
        it('sets the input and suggestion text correctly', () => {
            const component = renderTextPrompt(defaultTextPromptData);
            renderElementIntoDOM(component);
            assertShadowRoot(component.shadowRoot);
            component.setText('@');
            component.setSuggestion('Command');
            const textPromptInputs = component.shadowRoot.querySelectorAll('.input');
            assert.strictEqual(textPromptInputs[0].value.trim(), '@');
            const textPromptSuggestions = component.shadowRoot.querySelectorAll('.suggestion');
            assert.strictEqual(textPromptSuggestions[0].value.trim(), '@Command');
        });
    });
    it('focus on the input element correctly', () => {
        const component = renderTextPrompt(defaultTextPromptData);
        renderElementIntoDOM(component);
        assertShadowRoot(component.shadowRoot);
        const textPromptInput = component.shadowRoot.querySelectorAll('.text-prompt-input')[0];
        assert.isFalse(textPromptInput.hasFocus());
        component.focus();
        assert.isTrue(textPromptInput.hasFocus());
    });
});
//# sourceMappingURL=TextPrompt_test.js.map