// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as IssuesManager from '../../../../../front_end/models/issues_manager/issues_manager.js';
import { StubIssue } from './StubIssue.js';
import { MockIssuesManager } from './MockIssuesManager.js';
describe('IssueResolver', () => {
    const issueId1 = 'foo';
    describe('tryGet', () => {
        it('should resolve an existing issue', () => {
            const mockIssue = StubIssue.createFromIssueId(issueId1);
            const issuesManager = new MockIssuesManager([mockIssue]);
            const issueResolver = new IssuesManager.IssueResolver.IssueResolver(issuesManager);
            const issue = issueResolver.tryGet(issueId1, () => {
                throw new Error('This should not get called');
            });
            assert.isFalse(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            assert.strictEqual(issue, mockIssue);
        });
        it('should not resolve an unknown issue', () => {
            const issuesManager = new MockIssuesManager([]);
            const issueResolver = new IssuesManager.IssueResolver.IssueResolver(issuesManager);
            const issue = issueResolver.tryGet(issueId1, () => {
                throw new Error('This should not get called');
            });
            assert.isTrue(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            assert.strictEqual(issue, null);
        });
        it('should resolve a previously unknown issue when it becomes available', async () => {
            const mockIssuesManager = new MockIssuesManager([]);
            const issuesManager = mockIssuesManager;
            const issueResolver = new IssuesManager.IssueResolver.IssueResolver(issuesManager);
            const waitForCall = new Promise(resolve => {
                const issue = issueResolver.tryGet(issueId1, resolve);
                assert.strictEqual(issue, null);
            });
            assert.isTrue(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            const mockIssue = StubIssue.createFromIssueId(issueId1);
            mockIssuesManager.addIssue(mockIssue);
            const issue = await waitForCall;
            assert.isFalse(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            assert.strictEqual(issue, mockIssue);
        });
    });
    describe('waitFor', () => {
        it('should resolve an existing issue', async () => {
            const mockIssue = StubIssue.createFromIssueId(issueId1);
            const issuesManager = new MockIssuesManager([mockIssue]);
            const issueResolver = new IssuesManager.IssueResolver.IssueResolver(issuesManager);
            const issue = await issueResolver.waitFor(issueId1);
            assert.isFalse(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            assert.strictEqual(issue, mockIssue);
        });
        it('should reject the promise after `clear` has been called', async () => {
            const issuesManager = new MockIssuesManager([]);
            const issueResolver = new IssuesManager.IssueResolver.IssueResolver(issuesManager);
            const issue = issueResolver.waitFor(issueId1);
            assert.isTrue(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            issueResolver.clear();
            assert.isFalse(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            try {
                await issue;
            }
            catch (e) {
                return;
            }
            assert.fail('Expected `await issue` to throw.');
        });
        it('should resolve a previously unknown issue when it becomes available', async () => {
            const mockIssuesManager = new MockIssuesManager([]);
            const issuesManager = mockIssuesManager;
            const issueResolver = new IssuesManager.IssueResolver.IssueResolver(issuesManager);
            const issuePromise = issueResolver.waitFor(issueId1);
            assert.isTrue(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            const mockIssue = StubIssue.createFromIssueId(issueId1);
            mockIssuesManager.addIssue(mockIssue);
            const issue = await issuePromise;
            assert.isFalse(issuesManager.hasEventListeners("IssueAdded" /* IssueAdded */));
            assert.strictEqual(issue, mockIssue);
        });
    });
});
//# sourceMappingURL=IssueResolver_test.js.map