// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { Issue, IssueCategory, IssueKind } from '../../../../../front_end/models/issues_manager/Issue.js'; // eslint-disable-line rulesdir/es_modules_import
export class StubIssue extends Issue {
    requestIds;
    cookieNames;
    issueKind;
    locations = [];
    mockIssueId;
    constructor(code, requestIds, cookieNames, issueKind = IssueKind.Improvement) {
        super(code);
        this.requestIds = requestIds;
        this.cookieNames = cookieNames;
        this.issueKind = issueKind;
    }
    getDescription() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return {};
    }
    primaryKey() {
        return `${this.code()}-(${this.cookieNames.join(';')})-(${this.requestIds.join(';')})`;
    }
    requests() {
        return this.requestIds.map(id => {
            return { requestId: id, url: '' };
        });
    }
    getCategory() {
        return IssueCategory.Other;
    }
    sources() {
        return this.locations;
    }
    getKind() {
        return this.issueKind;
    }
    cookies() {
        return this.cookieNames.map(name => {
            return { name, domain: '', path: '' };
        });
    }
    getIssueId() {
        return this.mockIssueId;
    }
    static createFromRequestIds(requestIds) {
        return new StubIssue('StubIssue', requestIds, []);
    }
    static createFromCookieNames(cookieNames) {
        return new StubIssue('StubIssue', [], cookieNames);
    }
    static createFromIssueKinds(issueKinds) {
        return issueKinds.map(k => new StubIssue('StubIssue', [], [], k));
    }
    static createFromAffectedLocations(locations) {
        const issue = new StubIssue('StubIssue', [], []);
        issue.locations = locations;
        return issue;
    }
    static createFromIssueId(issueId) {
        const issue = new StubIssue('StubIssue', [], []);
        issue.mockIssueId = issueId;
        return issue;
    }
}
export class ThirdPartyStubIssue extends StubIssue {
    isThirdParty;
    constructor(code, isThirdParty) {
        super(code, [], []);
        this.isThirdParty = isThirdParty;
    }
    isCausedByThirdParty() {
        return this.isThirdParty;
    }
}
export function mkInspectorCspIssue(blockedURL) {
    return {
        code: "ContentSecurityPolicyIssue" /* ContentSecurityPolicyIssue */,
        details: {
            contentSecurityPolicyIssueDetails: {
                isReportOnly: true,
                violatedDirective: 'testdirective',
                contentSecurityPolicyViolationType: "kURLViolation" /* KURLViolation */,
                blockedURL,
            },
        },
    };
}
//# sourceMappingURL=StubIssue.js.map