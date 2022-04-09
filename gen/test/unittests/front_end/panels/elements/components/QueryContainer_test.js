// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as SDK from '../../../../../../front_end/core/sdk/sdk.js';
import * as ElementsComponents from '../../../../../../front_end/panels/elements/components/components.js';
import { assertShadowRoot, renderElementIntoDOM } from '../../../helpers/DOMHelpers.js';
import { assertNodeTextContent } from './ElementsComponentsHelper.js';
const { assert } = chai;
const nodeAttributes = new Map([
    ['id', 'container'],
    ['class', 'class-1 class-2'],
]);
const FAKE_LEGACY_SDK_DOM_NODE = {};
const containerTemplate = {
    parentNode: null,
    nodeType: Node.ELEMENT_NODE,
    id: 1,
    pseudoType: '',
    shadowRootType: '',
    nodeName: 'body',
    nodeNameNicelyCased: 'body',
    legacyDomNode: FAKE_LEGACY_SDK_DOM_NODE,
    highlightNode: () => { },
    clearHighlight: () => { },
    getAttribute: x => nodeAttributes.get(x) || '',
};
const assertContainerContent = (container, expectedContent) => {
    assertShadowRoot(container.shadowRoot);
    const nodeText = container.shadowRoot.querySelector(`${ElementsComponents.NodeText.NodeText.litTagName.value}`);
    if (!nodeText || !nodeText.shadowRoot) {
        assert.fail('node text element and its shadowRoot should exist');
        return;
    }
    assertNodeTextContent(nodeText, expectedContent);
};
describe('QueryContainer', () => {
    it('renders an unnamed query container correctly', () => {
        const component = new ElementsComponents.QueryContainer.QueryContainer();
        renderElementIntoDOM(component);
        const clickListener = sinon.spy();
        component.data = {
            container: containerTemplate,
            onContainerLinkClick: clickListener,
        };
        assertContainerContent(component, 'body#container.class-1.class-2');
        component.shadowRoot?.querySelector('a')?.click();
        assert.strictEqual(clickListener.callCount, 1, 'container link click listener should be triggered by clicking');
    });
    it('renders a named query container correctly', () => {
        const component = new ElementsComponents.QueryContainer.QueryContainer();
        renderElementIntoDOM(component);
        const clickListener = sinon.spy();
        const onHighlightNode = sinon.spy();
        const onClearHighlight = sinon.spy();
        component.data = {
            container: {
                ...containerTemplate,
                highlightNode: onHighlightNode,
                clearHighlight: onClearHighlight,
            },
            queryName: 'named-container',
            onContainerLinkClick: clickListener,
        };
        assertContainerContent(component, 'named-container');
        const containerLink = component.shadowRoot?.querySelector('a');
        if (!containerLink) {
            assert.fail('container link element should exist');
            return;
        }
        containerLink.click();
        assert.strictEqual(clickListener.callCount, 1, 'container link click listener should be triggered by clicking');
        containerLink.dispatchEvent(new Event('mouseenter'));
        assert.strictEqual(onHighlightNode.callCount, 1, 'onHighlightNode callback should be triggered by mouseenter');
        containerLink.dispatchEvent(new Event('mouseleave'));
        assert.strictEqual(onHighlightNode.callCount, 1, 'onClearHighlight callback should be triggered by mouseleave');
    });
    it('dispatches QueriedSizeRequestedEvent when hovered correctly', () => {
        const component = new ElementsComponents.QueryContainer.QueryContainer();
        renderElementIntoDOM(component);
        const queriedSizeRequestedListener = sinon.spy();
        component.data = {
            container: containerTemplate,
            onContainerLinkClick: () => { },
        };
        component.addEventListener('queriedsizerequested', queriedSizeRequestedListener);
        assertShadowRoot(component.shadowRoot);
        component.shadowRoot.querySelector('a')?.dispatchEvent(new Event('mouseenter'));
        assert.strictEqual(queriedSizeRequestedListener.callCount, 1, 'queried size requested listener should be triggered by hovering');
    });
    it('renders queried size details correctly', () => {
        const component = new ElementsComponents.QueryContainer.QueryContainer();
        renderElementIntoDOM(component);
        component.data = {
            container: containerTemplate,
            onContainerLinkClick: () => { },
        };
        assertShadowRoot(component.shadowRoot);
        component.shadowRoot.querySelector('a')?.dispatchEvent(new Event('mouseenter'));
        component.updateContainerQueriedSizeDetails({
            physicalAxis: "" /* None */,
            queryAxis: "" /* None */,
            width: '500px',
            height: '300px',
        });
        const nonExistentDetailsElement = component.shadowRoot.querySelector('.queried-size-details');
        assert.strictEqual(nonExistentDetailsElement, null, 'query details without any axis should not be rendered');
        component.updateContainerQueriedSizeDetails({
            physicalAxis: "Horizontal" /* Horizontal */,
            queryAxis: "inline-size" /* Inline */,
            width: '500px',
        });
        const detailsElement = component.shadowRoot.querySelector('.queried-size-details');
        assert.strictEqual(detailsElement?.innerText, '(inline-size) 500px', 'queried size details are not correct');
        component.updateContainerQueriedSizeDetails({
            physicalAxis: "Horizontal" /* Horizontal */,
            queryAxis: "block-size" /* Block */,
            width: '200px',
        });
        assert.strictEqual(detailsElement?.innerText, '(block-size) 200px', 'queried size details are not correct');
        component.updateContainerQueriedSizeDetails({
            physicalAxis: "Both" /* Both */,
            queryAxis: "size" /* Both */,
            width: '500px',
            height: '300px',
        });
        assert.strictEqual(detailsElement?.innerText, '(size) width: 500px height: 300px', 'queried size details are not correct');
    });
});
//# sourceMappingURL=QueryContainer_test.js.map