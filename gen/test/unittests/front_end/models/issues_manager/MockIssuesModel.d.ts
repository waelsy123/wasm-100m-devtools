import * as Common from '../../../../../front_end/core/common/common.js';
import type * as IssuesManager from '../../../../../front_end/models/issues_manager/issues_manager.js';
import type * as SDK from '../../../../../front_end/core/sdk/sdk.js';
export declare class MockIssuesModel extends Common.ObjectWrapper.ObjectWrapper<SDK.IssuesModel.EventTypes> {
    private mockIssues;
    constructor(issues: Iterable<IssuesManager.Issue.Issue>);
    issues(): Iterable<IssuesManager.Issue.Issue<string>>;
    target(): {
        id: () => string;
    };
}
