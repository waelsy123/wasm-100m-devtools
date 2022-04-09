// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { assertNotNullOrUndefined } from '../../../../../../front_end/core/platform/platform.js';
import * as Common from '../../../../../../front_end/core/common/common.js';
import * as RequestLinkIcon from '../../../../../../front_end/ui/components/request_link_icon/request_link_icon.js';
import * as IconButton from '../../../../../../front_end/ui/components/icon_button/icon_button.js';
import { assertElement, assertShadowRoot, renderElementIntoDOM } from '../../../helpers/DOMHelpers.js';
import * as Coordinator from '../../../../../../front_end/ui/components/render_coordinator/render_coordinator.js';
import { describeWithLocale } from '../../../helpers/EnvironmentHelpers.js';
const { assert } = chai;
const coordinator = Coordinator.RenderCoordinator.RenderCoordinator.instance();
const renderRequestLinkIcon = async (data) => {
    const component = new RequestLinkIcon.RequestLinkIcon.RequestLinkIcon();
    component.data = data;
    renderElementIntoDOM(component);
    assertShadowRoot(component.shadowRoot);
    await coordinator.done();
    return { component, shadowRoot: component.shadowRoot };
};
export const extractElements = (shadowRoot) => {
    const icon = shadowRoot.querySelector('devtools-icon');
    assertElement(icon, IconButton.Icon.Icon);
    const container = shadowRoot.querySelector('span');
    assertNotNullOrUndefined(container);
    const label = shadowRoot.querySelector('span > span');
    if (label !== null) {
        assertElement(label, HTMLSpanElement);
        return {
            icon,
            container,
            label,
        };
    }
    return { icon, container };
};
export const extractData = (shadowRoot) => {
    const { icon, container, label } = extractElements(shadowRoot);
    return {
        iconData: icon.data,
        label: label ? label.textContent : null,
        containerClasses: Array.from(container.classList),
    };
};
class MockRequestResolver {
    promiseMap = new Map();
    waitFor(requestId) {
        if (!requestId) {
            if (this.promiseMap.size !== 1) {
                throw new Error('more than one request being awaited, specify a request id');
            }
            requestId = this.promiseMap.keys().next().value;
        }
        requestId = requestId || '';
        const entry = this.promiseMap.get(requestId);
        if (entry) {
            return entry.promise;
        }
        let resolve = () => { };
        const promise = new Promise(r => {
            resolve = r;
        });
        this.promiseMap.set(requestId, { resolve, promise });
        return promise;
    }
    resolve(result, requestId) {
        if (!requestId && this.promiseMap.size === 1) {
            requestId = this.promiseMap.keys().next().value;
        }
        requestId = requestId || result?.requestId() || '';
        const entry = this.promiseMap.get(requestId);
        if (!entry) {
            throw new Error('resolve uninitialized');
        }
        entry.resolve(result);
        this.promiseMap.delete(requestId);
    }
}
describeWithLocale('RequestLinkIcon', () => {
    const requestId1 = 'r1';
    const requestId2 = 'r2';
    describe('with simple requests', () => {
        const mockRequest = {
            url() {
                return 'http://foo.bar/baz';
            },
        };
        const mockRequestWithTrailingSlash = {
            url() {
                return 'http://foo.bar/baz/';
            },
        };
        const failingRequestResolver = {
            async waitFor() {
                throw new Error('Couldn\'t resolve');
            },
        };
        it('renders correctly without a request', async () => {
            const { shadowRoot } = await renderRequestLinkIcon({
                affectedRequest: { requestId: requestId1 },
                requestResolver: failingRequestResolver,
            });
            const { iconData, label } = extractData(shadowRoot);
            assert.strictEqual('iconName' in iconData ? iconData.iconName : null, 'network_panel_icon');
            assert.strictEqual(iconData.color, 'var(--issue-color-yellow)');
            assert.isNull(label, 'Didn\'t expect a label');
        });
        it('renders correctly with a request', async () => {
            const { shadowRoot } = await renderRequestLinkIcon({
                request: mockRequest,
            });
            const { iconData, label } = extractData(shadowRoot);
            assert.strictEqual('iconName' in iconData ? iconData.iconName : null, 'network_panel_icon');
            assert.strictEqual(iconData.color, 'var(--color-link)');
            assert.isNull(label, 'Didn\'t expect a label');
        });
        it('renders the request label correctly without a trailing slash', async () => {
            const { shadowRoot } = await renderRequestLinkIcon({
                request: mockRequest,
                displayURL: true,
            });
            const { label } = extractData(shadowRoot);
            assert.strictEqual(label, 'baz');
        });
        it('renders the request label correctly with a trailing slash', async () => {
            const { shadowRoot } = await renderRequestLinkIcon({
                request: mockRequestWithTrailingSlash,
                displayURL: true,
            });
            const { label } = extractData(shadowRoot);
            assert.strictEqual(label, 'baz/');
        });
        it('renders the request label correctly without a request', async () => {
            const { shadowRoot } = await renderRequestLinkIcon({
                affectedRequest: { requestId: requestId1, url: 'https://alpha.beta/gamma' },
                requestResolver: failingRequestResolver,
                displayURL: true,
            });
            const { label } = extractData(shadowRoot);
            assert.strictEqual(label, 'gamma');
        });
        it('the style reacts to the presence of a request', async () => {
            const { shadowRoot } = await renderRequestLinkIcon({
                request: mockRequest,
            });
            const { containerClasses } = extractData(shadowRoot);
            assert.include(containerClasses, 'link');
        });
        it('the style reacts to the absence of a request', async () => {
            const { shadowRoot } = await renderRequestLinkIcon({
                affectedRequest: { requestId: requestId1, url: 'https://alpha.beta/gamma' },
                requestResolver: failingRequestResolver,
            });
            const { containerClasses } = extractData(shadowRoot);
            assert.notInclude(containerClasses, 'link');
        });
    });
    describe('transitions upon request resolution', () => {
        const mockRequest = {
            url() {
                return 'http://foo.bar/baz';
            },
        };
        it('to change the style correctly', async () => {
            const resolver = new MockRequestResolver();
            const { shadowRoot } = await renderRequestLinkIcon({
                affectedRequest: { requestId: requestId1, url: 'https://alpha.beta/gamma' },
                requestResolver: resolver,
            });
            const { containerClasses: containerClassesBefore } = extractData(shadowRoot);
            assert.notInclude(containerClassesBefore, 'link');
            resolver.resolve(mockRequest);
            await new Promise(r => setTimeout(r)); // Drain Microtask queue to get the cooridnator.write posted.
            await coordinator.done();
            const { containerClasses: containerClassesAfter } = extractData(shadowRoot);
            assert.include(containerClassesAfter, 'link');
        });
        it('to set the label correctly', async () => {
            const resolver = new MockRequestResolver();
            const { shadowRoot } = await renderRequestLinkIcon({
                affectedRequest: { requestId: requestId1, url: 'https://alpha.beta/gamma' },
                requestResolver: resolver,
                displayURL: true,
            });
            const { label: labelBefore } = extractData(shadowRoot);
            assert.strictEqual(labelBefore, 'gamma');
            resolver.resolve(mockRequest);
            await new Promise(r => setTimeout(r)); // Drain Microtask queue to get the cooridnator.write posted.
            await coordinator.done();
            const { label: labelAfter } = extractData(shadowRoot);
            assert.strictEqual(labelAfter, 'baz');
        });
        it('to set icon color correctly', async () => {
            const resolver = new MockRequestResolver();
            const { shadowRoot } = await renderRequestLinkIcon({
                affectedRequest: { requestId: requestId1, url: 'https://alpha.beta/gamma' },
                requestResolver: resolver,
                displayURL: true,
            });
            const { iconData: iconDataBefore } = extractData(shadowRoot);
            assert.strictEqual(iconDataBefore.color, 'var(--issue-color-yellow)');
            resolver.resolve(mockRequest);
            await new Promise(r => setTimeout(r)); // Drain Microtask queue to get the cooridnator.write posted.
            await coordinator.done();
            const { iconData: iconDataAfter } = extractData(shadowRoot);
            assert.strictEqual(iconDataAfter.color, 'var(--color-link)');
        });
        it('handles multiple data assignments', async () => {
            const resolver = new MockRequestResolver();
            const { shadowRoot, component } = await renderRequestLinkIcon({
                affectedRequest: { requestId: requestId2, url: 'https://alpha.beta/gamma' },
                requestResolver: resolver,
                displayURL: true,
            });
            const { label: labelBefore } = extractData(shadowRoot);
            assert.strictEqual(labelBefore, 'gamma');
            const mockRequest2 = {
                url() {
                    return 'http://foo.bar/baz';
                },
                requestId() {
                    return requestId1;
                },
            };
            component.data = {
                affectedRequest: { requestId: requestId1, url: 'https://alpha.beta/gamma' },
                requestResolver: resolver,
                displayURL: true,
            };
            resolver.resolve(mockRequest2);
            await new Promise(r => setTimeout(r)); // Drain Microtask queue to get the cooridnator.write posted.
            await coordinator.done();
            const { label: labelAfter } = extractData(shadowRoot);
            assert.strictEqual(labelAfter, 'baz');
        });
    });
    describe('handles clicks correctly', () => {
        const mockRequest = {
            url() {
                return 'http://foo.bar/baz';
            },
        };
        it('if the icon is clicked', async () => {
            const revealOverride = sinon.fake(Common.Revealer.reveal);
            const { shadowRoot } = await renderRequestLinkIcon({
                request: mockRequest,
                displayURL: true,
                revealOverride,
            });
            const { icon } = extractElements(shadowRoot);
            icon.click();
            assert.isTrue(revealOverride.called);
        });
        it('if the container is clicked', async () => {
            const revealOverride = sinon.fake(Common.Revealer.reveal);
            const { shadowRoot } = await renderRequestLinkIcon({
                request: mockRequest,
                displayURL: true,
                revealOverride,
            });
            const { container } = extractElements(shadowRoot);
            container.click();
            assert.isTrue(revealOverride.called);
        });
        it('if the label is clicked', async () => {
            const revealOverride = sinon.fake(Common.Revealer.reveal);
            const { shadowRoot } = await renderRequestLinkIcon({
                request: mockRequest,
                displayURL: true,
                revealOverride,
            });
            const { label } = extractElements(shadowRoot);
            label?.click();
            assert.isTrue(revealOverride.called);
        });
    });
});
//# sourceMappingURL=RequestLinkIcon_test.js.map