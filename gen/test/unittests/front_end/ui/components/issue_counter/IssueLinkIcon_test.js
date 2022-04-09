// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../../../../../front_end/core/common/common.js';
import { assertNotNullOrUndefined } from '../../../../../../front_end/core/platform/platform.js';
import * as IconButton from '../../../../../../front_end/ui/components/icon_button/icon_button.js';
import * as IssueCounter from '../../../../../../front_end/ui/components/issue_counter/issue_counter.js';
import * as Coordinator from '../../../../../../front_end/ui/components/render_coordinator/render_coordinator.js';
import { assertElement, assertShadowRoot, renderElementIntoDOM } from '../../../helpers/DOMHelpers.js';
import { describeWithLocale } from '../../../helpers/EnvironmentHelpers.js';
import * as IssuesManager from '../../../../../../front_end/models/issues_manager/issues_manager.js';
const { assert } = chai;
const coordinator = Coordinator.RenderCoordinator.RenderCoordinator.instance();
const renderIssueLinkIcon = async (data) => {
    const component = new IssueCounter.IssueLinkIcon.IssueLinkIcon();
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
    return { icon, container };
};
export const extractData = (shadowRoot) => {
    const { icon, container } = extractElements(shadowRoot);
    return {
        iconData: icon.data,
        containerClasses: Array.from(container.classList),
    };
};
class MockIssueResolver {
    promiseMap = new Map();
    waitFor(issueId) {
        if (!issueId) {
            if (this.promiseMap.size !== 1) {
                throw new Error('more than one issue being awaited, specify a issue id');
            }
            issueId = this.promiseMap.keys().next().value;
        }
        issueId = issueId || '';
        const entry = this.promiseMap.get(issueId);
        if (entry) {
            return entry.promise;
        }
        let resolve = () => { };
        const promise = new Promise(r => {
            resolve = r;
        });
        this.promiseMap.set(issueId, { resolve, promise });
        return promise;
    }
    resolve(result, issueId) {
        if (!issueId && this.promiseMap.size === 1) {
            issueId = this.promiseMap.keys().next().value;
        }
        issueId = issueId || result?.getIssueId() || '';
        const entry = this.promiseMap.get(issueId);
        if (!entry) {
            throw new Error('resolve uninitialized');
        }
        entry.resolve(result);
        this.promiseMap.delete(issueId);
    }
}
describeWithLocale('IssueLinkIcon', () => {
    const issueId = 'issue1';
    const defaultIcon = { iconName: 'issue-questionmark-icon', color: 'var(--color-text-secondary)' };
    const breakingChangeIcon = IssueCounter.IssueCounter.getIssueKindIconData(IssuesManager.Issue.IssueKind.BreakingChange);
    const pageErrorIcon = IssueCounter.IssueCounter.getIssueKindIconData(IssuesManager.Issue.IssueKind.PageError);
    const mockIssue = {
        getKind() {
            return IssuesManager.Issue.IssueKind.PageError;
        },
        getIssueId() {
            return issueId;
        },
    };
    describe('with simple issues', () => {
        const failingIssueResolver = {
            async waitFor() {
                throw new Error('Couldn\'t resolve');
            },
        };
        it('renders correctly without an issue', async () => {
            const { shadowRoot } = await renderIssueLinkIcon({
                issueId,
                issueResolver: failingIssueResolver,
            });
            const { iconData } = extractData(shadowRoot);
            assert.strictEqual('iconName' in iconData ? iconData.iconName : null, defaultIcon.iconName);
            assert.strictEqual(iconData.color, defaultIcon.color);
        });
        it('renders correctly with an issue', async () => {
            const { shadowRoot } = await renderIssueLinkIcon({
                issue: mockIssue,
            });
            const { iconData } = extractData(shadowRoot);
            assert.strictEqual('iconName' in iconData ? iconData.iconName : null, pageErrorIcon.iconName);
            assert.strictEqual(iconData.color, pageErrorIcon.color);
        });
        it('the style reacts to the presence of the issue', async () => {
            const { shadowRoot } = await renderIssueLinkIcon({
                issue: mockIssue,
            });
            const { containerClasses } = extractData(shadowRoot);
            assert.include(containerClasses, 'link');
        });
        it('the style reacts to the absence of an issue', async () => {
            const { shadowRoot } = await renderIssueLinkIcon({
                issueId,
                issueResolver: failingIssueResolver,
            });
            const { containerClasses } = extractData(shadowRoot);
            assert.notInclude(containerClasses, 'link');
        });
    });
    describe('transitions upon issue resolution', () => {
        it('to change the style correctly', async () => {
            const resolver = new MockIssueResolver();
            const { shadowRoot } = await renderIssueLinkIcon({
                issueId,
                issueResolver: resolver,
            });
            const { containerClasses: containerClassesBefore } = extractData(shadowRoot);
            assert.notInclude(containerClassesBefore, 'link');
            resolver.resolve(mockIssue);
            await new Promise(r => setTimeout(r)); // Drain Microtask queue to get the cooridnator.write posted.
            await coordinator.done();
            const { containerClasses: containerClassesAfter } = extractData(shadowRoot);
            assert.include(containerClassesAfter, 'link');
        });
        it('to set icon color correctly', async () => {
            const resolver = new MockIssueResolver();
            const { shadowRoot } = await renderIssueLinkIcon({
                issueId,
                issueResolver: resolver,
            });
            const { iconData: iconDataBefore } = extractData(shadowRoot);
            assert.strictEqual(iconDataBefore.color, defaultIcon.color);
            resolver.resolve(mockIssue);
            await new Promise(r => setTimeout(r)); // Drain Microtask queue to get the cooridnator.write posted.
            await coordinator.done();
            const { iconData: iconDataAfter } = extractData(shadowRoot);
            assert.strictEqual(iconDataAfter.color, pageErrorIcon.color);
        });
        it('handles multiple data assignments', async () => {
            const { shadowRoot, component } = await renderIssueLinkIcon({
                issue: mockIssue,
            });
            const { iconData: iconDataBefore } = extractData(shadowRoot);
            assert.strictEqual(iconDataBefore.color, pageErrorIcon.color);
            const mockIssue2 = {
                getKind() {
                    return IssuesManager.Issue.IssueKind.BreakingChange;
                },
            };
            component.data = {
                issue: mockIssue2,
            };
            await new Promise(r => setTimeout(r)); // Drain Microtask queue to get the cooridnator.write posted.
            await coordinator.done();
            const { iconData: iconDataAfter } = extractData(shadowRoot);
            assert.strictEqual(iconDataAfter.color, breakingChangeIcon.color);
        });
    });
    describe('handles clicks correctly', () => {
        it('if the icon is clicked', async () => {
            const revealOverride = sinon.fake(Common.Revealer.reveal);
            const { shadowRoot } = await renderIssueLinkIcon({
                issue: mockIssue,
                revealOverride,
            });
            const { icon } = extractElements(shadowRoot);
            icon.click();
            assert.isTrue(revealOverride.called);
        });
        it('if the container is clicked', async () => {
            const revealOverride = sinon.fake(Common.Revealer.reveal);
            const { shadowRoot } = await renderIssueLinkIcon({
                issue: mockIssue,
                revealOverride,
            });
            const { container } = extractElements(shadowRoot);
            container.click();
            assert.isTrue(revealOverride.called);
        });
    });
});
//# sourceMappingURL=IssueLinkIcon_test.js.map