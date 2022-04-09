// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as IssuesManager from '../../../../../front_end/models/issues_manager/issues_manager.js';
import { MockIssuesModel } from '../../models/issues_manager/MockIssuesModel.js';
import { describeWithLocale } from '../../helpers/EnvironmentHelpers.js';
describeWithLocale('DeprecationIssue', async () => {
    const mockModel = new MockIssuesModel([]);
    function createDeprecationIssueDetails(message, deprecationType, type) {
        return {
            code: "DeprecationIssue" /* DeprecationIssue */,
            details: {
                deprecationIssueDetails: {
                    sourceCodeLocation: {
                        url: 'empty.html',
                        lineNumber: 1,
                        columnNumber: 1,
                    },
                    message,
                    deprecationType,
                    type,
                },
            },
        };
    }
    it('deprecation issue with good translated details works', () => {
        const details = createDeprecationIssueDetails('', '', "DeprecationExample" /* DeprecationExample */);
        const issue = IssuesManager.DeprecationIssue.DeprecationIssue.fromInspectorIssue(mockModel, details);
        assert.isNotEmpty(issue);
    });
    it('deprecation issue with bad translated details fails', () => {
        const details = createDeprecationIssueDetails('Test', 'Test', "DeprecationExample" /* DeprecationExample */);
        const issue = IssuesManager.DeprecationIssue.DeprecationIssue.fromInspectorIssue(mockModel, details);
        assert.isEmpty(issue);
    });
    it('deprecation issue with good untranslated details works', () => {
        const details = createDeprecationIssueDetails('Test', 'Test', "Untranslated" /* Untranslated */);
        const issue = IssuesManager.DeprecationIssue.DeprecationIssue.fromInspectorIssue(mockModel, details);
        assert.isNotEmpty(issue);
    });
    it('deprecation issue with bad untranslated details fails', () => {
        const details = createDeprecationIssueDetails('', '', "Untranslated" /* Untranslated */);
        const issue = IssuesManager.DeprecationIssue.DeprecationIssue.fromInspectorIssue(mockModel, details);
        assert.isEmpty(issue);
    });
});
//# sourceMappingURL=DeprecationIssue_test.js.map