// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Buttons from '../../../../../../front_end/ui/components/buttons/buttons.js';
import * as Coordinator from '../../../../../../front_end/ui/components/render_coordinator/render_coordinator.js';
import { assertElement, dispatchKeyDownEvent, renderElementIntoDOM } from '../../../helpers/DOMHelpers.js';
const coordinator = Coordinator.RenderCoordinator.RenderCoordinator.instance();
const { assert } = chai;
describe('Button', async () => {
    const iconUrl = new URL('../../../../../../front_end/Images/ic_file_image.svg', import.meta.url).toString();
    async function renderButton(data = {
        variant: "primary" /* PRIMARY */,
    }, text = 'Button') {
        const button = new Buttons.Button.Button();
        button.data = data;
        button.innerText = text;
        renderElementIntoDOM(button);
        await coordinator.done();
        return button;
    }
    async function testClick(data = {
        variant: "primary" /* PRIMARY */,
        disabled: false,
    }, expectedClickCount = 1) {
        const button = await renderButton(data);
        let clicks = 0;
        button.onclick = () => clicks++;
        const innerButton = button.shadowRoot?.querySelector('button');
        assertElement(innerButton, HTMLButtonElement);
        innerButton.click();
        dispatchKeyDownEvent(innerButton, {
            key: 'Enter',
        });
        assert.strictEqual(clicks, expectedClickCount);
    }
    it('primary button can be clicked', async () => {
        await testClick({
            variant: "primary" /* PRIMARY */,
        });
    });
    it('disabled primary button cannot be clicked', async () => {
        await testClick({
            variant: "primary" /* PRIMARY */,
            disabled: true,
        }, 0);
    });
    it('secondary button can be clicked', async () => {
        await testClick({
            variant: "secondary" /* SECONDARY */,
        });
    });
    it('disabled secondary button cannot be clicked', async () => {
        await testClick({
            variant: "secondary" /* SECONDARY */,
            disabled: true,
        }, 0);
    });
    it('toolbar button can be clicked', async () => {
        await testClick({
            variant: "toolbar" /* TOOLBAR */,
            iconUrl,
        });
    });
    it('disabled toolbar button cannot be clicked', async () => {
        await testClick({
            variant: "toolbar" /* TOOLBAR */,
            iconUrl,
            disabled: true,
        }, 0);
    });
    it('gets the no additional classes set for the inner button if only text is provided', async () => {
        const button = await renderButton();
        const innerButton = button.shadowRoot?.querySelector('button');
        assert.isTrue(!innerButton.classList.contains('text-with-icon'));
        assert.isTrue(!innerButton.classList.contains('only-icon'));
    });
    it('gets title set', async () => {
        const button = await renderButton({
            variant: "primary" /* PRIMARY */,
            title: 'Custom',
        });
        const innerButton = button.shadowRoot?.querySelector('button');
        assert.strictEqual(innerButton.title, 'Custom');
        button.title = 'Custom2';
        await coordinator.done();
        assert.strictEqual(innerButton.title, 'Custom2');
    });
    it('gets the text-with-icon class set for the inner button if text and icon is provided', async () => {
        const button = await renderButton({
            variant: "primary" /* PRIMARY */,
            iconUrl,
        }, 'text');
        const innerButton = button.shadowRoot?.querySelector('button');
        assert.isTrue(innerButton.classList.contains('text-with-icon'));
        assert.isTrue(!innerButton.classList.contains('only-icon'));
    });
    it('gets the only-icon class set for the inner button if only icon is provided', async () => {
        const button = await renderButton({
            variant: "primary" /* PRIMARY */,
            iconUrl,
        }, '');
        const innerButton = button.shadowRoot?.querySelector('button');
        assert.isTrue(!innerButton.classList.contains('text-with-icon'));
        assert.isTrue(innerButton.classList.contains('only-icon'));
    });
    it('gets the `small` class set for the inner button if size === SMALL', async () => {
        const button = await renderButton({
            variant: "primary" /* PRIMARY */,
            size: "SMALL" /* SMALL */,
        }, '');
        const innerButton = button.shadowRoot?.querySelector('button');
        assert.isTrue(innerButton.classList.contains('small'));
    });
    it('does not get the `small` class set for the inner button if size === MEDIUM', async () => {
        const button = await renderButton({
            variant: "primary" /* PRIMARY */,
            iconUrl,
        }, '');
        const innerButton = button.shadowRoot?.querySelector('button');
        assert.isFalse(innerButton.classList.contains('small'));
    });
    describe('in forms', () => {
        async function renderForm(data = {
            variant: "primary" /* PRIMARY */,
        }) {
            const form = document.createElement('form');
            const input = document.createElement('input');
            const button = new Buttons.Button.Button();
            const reference = {
                submitCount: 0,
                form,
                button,
                input,
            };
            form.onsubmit = (event) => {
                event.preventDefault();
                reference.submitCount++;
            };
            button.data = data;
            button.innerText = 'button';
            form.append(input);
            form.append(button);
            renderElementIntoDOM(form);
            await coordinator.done();
            return reference;
        }
        it('submits a form with button[type=submit]', async () => {
            const state = await renderForm({
                variant: "primary" /* PRIMARY */,
                type: 'submit',
            });
            state.button.click();
            assert.strictEqual(state.submitCount, 1);
        });
        it('does not submit a form with button[type=button]', async () => {
            const state = await renderForm({
                variant: "primary" /* PRIMARY */,
                type: 'button',
            });
            state.button.click();
            assert.strictEqual(state.submitCount, 0);
        });
        it('resets a form with button[type=reset]', async () => {
            const state = await renderForm({
                variant: "primary" /* PRIMARY */,
                type: 'reset',
            });
            state.input.value = 'test';
            state.button.click();
            assert.strictEqual(state.input.value, '');
        });
    });
});
//# sourceMappingURL=Button_test.js.map