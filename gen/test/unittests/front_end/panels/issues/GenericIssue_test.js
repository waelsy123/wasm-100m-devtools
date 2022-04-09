// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as IssuesManager from '../../../../../front_end/models/issues_manager/issues_manager.js';
import { MockIssuesModel } from '../../models/issues_manager/MockIssuesModel.js';
import { describeWithLocale } from '../../helpers/EnvironmentHelpers.js';
describeWithLocale('GenericIssue', async () => {
    const mockModel = new MockIssuesModel([]);
    function createProtocolIssueWithoutDetails() {
        return {
            code: "GenericIssue" /* GenericIssue */,
            details: {},
        };
    }
    function createProtocolIssueWithDetails(genericIssueDetails) {
        return {
            code: "GenericIssue" /* GenericIssue */,
            details: { genericIssueDetails },
        };
    }
    it('adds a cross origin portal post message issue with valid details', () => {
        const issueDetails = {
            errorType: "CrossOriginPortalPostMessageError" /* CrossOriginPortalPostMessageError */,
            frameId: 'main',
        };
        const issue = createProtocolIssueWithDetails(issueDetails);
        const genericIssues = IssuesManager.GenericIssue.GenericIssue.fromInspectorIssue(mockModel, issue);
        assert.strictEqual(genericIssues.length, 1);
        const genericIssue = genericIssues[0];
        assert.strictEqual(genericIssue.getCategory(), IssuesManager.Issue.IssueCategory.Generic);
        assert.strictEqual(genericIssue.primaryKey(), `GenericIssue::CrossOriginPortalPostMessageError-(${'main'})`);
        assert.strictEqual(genericIssue.getKind(), IssuesManager.Issue.IssueKind.Improvement);
        assert.isNotNull(genericIssue.getDescription());
    });
    it('adds a cross origin portal post message issue without details', () => {
        const inspectorIssueWithoutGenericDetails = createProtocolIssueWithoutDetails();
        const genericIssues = IssuesManager.GenericIssue.GenericIssue.fromInspectorIssue(mockModel, inspectorIssueWithoutGenericDetails);
        assert.isEmpty(genericIssues);
    });
});
//# sourceMappingURL=GenericIssue_test.js.map