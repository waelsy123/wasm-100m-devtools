// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../../../../front_end/core/common/common.js';
import * as IssuesManager from '../../../../../front_end/models/issues_manager/issues_manager.js';
import { MockIssuesModel } from './MockIssuesModel.js';
export class MockIssuesManager extends Common.ObjectWrapper.ObjectWrapper {
    mockIssues;
    issueCounts = new Map([
        [IssuesManager.Issue.IssueKind.Improvement, 0],
        [IssuesManager.Issue.IssueKind.BreakingChange, 1],
        [IssuesManager.Issue.IssueKind.PageError, 2],
    ]);
    // An empty model to pass along for the IssuesManager.Events.IssueAdded event.
    mockModel = new MockIssuesModel([]);
    constructor(issues) {
        super();
        this.mockIssues = Array.from(issues);
    }
    issues() {
        return this.mockIssues;
    }
    getIssueById(id) {
        for (const issue of this.mockIssues) {
            if (issue.getIssueId() === id) {
                return issue;
            }
        }
        return null;
    }
    numberOfIssues(kind) {
        if (kind) {
            return this.issueCounts.get(kind) ?? 0;
        }
        return Array.from(this.issueCounts.values()).reduce((sum, v) => sum + v, 0);
    }
    setNumberOfIssues(counts) {
        this.issueCounts = counts;
    }
    incrementIssueCountsOfAllKinds() {
        for (const [key, value] of this.issueCounts) {
            this.issueCounts.set(key, value + 1);
        }
        this.dispatchEventToListeners("IssuesCountUpdated" /* IssuesCountUpdated */);
    }
    addIssue(mockIssue) {
        this.mockIssues.push(mockIssue);
        this.dispatchEventToListeners("IssueAdded" /* IssueAdded */, { issue: mockIssue, issuesModel: this.mockModel });
    }
}
//# sourceMappingURL=MockIssuesManager.js.map