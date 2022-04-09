// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as IssuesManager from '../../../../../front_end/models/issues_manager/issues_manager.js';
import { MockIssuesModel } from './MockIssuesModel.js';
describe('AttributionReportingIssue', () => {
    const mockModel = new MockIssuesModel([]);
    function createProtocolIssueWithDetails(attributionReportingIssueDetails) {
        return {
            code: "AttributionReportingIssue" /* AttributionReportingIssue */,
            details: { attributionReportingIssueDetails },
        };
    }
    it('creates different frontend issues for the same InvalidAttributionData protocol issue', () => {
        const violationType = "InvalidAttributionData" /* InvalidAttributionData */;
        const invalidDataDetails = { violationType, invalidParameter: 'NotANumber' };
        const missingDataDetails = { violationType };
        const invalidDataFrontendIssue = IssuesManager.AttributionReportingIssue.AttributionReportingIssue.fromInspectorIssue(mockModel, createProtocolIssueWithDetails(invalidDataDetails));
        const missingDataFrontendIssue = IssuesManager.AttributionReportingIssue.AttributionReportingIssue.fromInspectorIssue(mockModel, createProtocolIssueWithDetails(missingDataDetails));
        assert.notStrictEqual(invalidDataFrontendIssue[0].code(), missingDataFrontendIssue[0].code());
    });
    it('creates different frontend issues for the same AttributionSourceUntrustworthyOrigin protocol issue', () => {
        const violationType = "AttributionSourceUntrustworthyOrigin" /* AttributionSourceUntrustworthyOrigin */;
        const withFrameDetails = { violationType, frame: { frameId: 'frameId1' } };
        const withoutFrameDetails = { violationType };
        const frontendIssueWithFrame = IssuesManager.AttributionReportingIssue.AttributionReportingIssue.fromInspectorIssue(mockModel, createProtocolIssueWithDetails(withFrameDetails));
        const frontendIssueWithoutFrame = IssuesManager.AttributionReportingIssue.AttributionReportingIssue.fromInspectorIssue(mockModel, createProtocolIssueWithDetails(withoutFrameDetails));
        assert.notStrictEqual(frontendIssueWithFrame[0].code(), frontendIssueWithoutFrame[0].code());
    });
    it('creates different frontend issues for the same AttributionUntrustworthyOrigin protocol issue', () => {
        const violationType = "AttributionUntrustworthyOrigin" /* AttributionUntrustworthyOrigin */;
        const withFrameDetails = { violationType, frame: { frameId: 'frameId1' } };
        const withoutFrameDetails = { violationType };
        const frontendIssueWithFrame = IssuesManager.AttributionReportingIssue.AttributionReportingIssue.fromInspectorIssue(mockModel, createProtocolIssueWithDetails(withFrameDetails));
        const frontendIssueWithoutFrame = IssuesManager.AttributionReportingIssue.AttributionReportingIssue.fromInspectorIssue(mockModel, createProtocolIssueWithDetails(withoutFrameDetails));
        assert.notStrictEqual(frontendIssueWithFrame[0].code(), frontendIssueWithoutFrame[0].code());
    });
});
//# sourceMappingURL=AttributionReportingIssue_test.js.map