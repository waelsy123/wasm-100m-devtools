// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as i18n from '../../core/i18n/i18n.js';
import { Issue, IssueCategory, IssueKind } from './Issue.js';
import { resolveLazyDescription } from './MarkdownIssueDescription.js';
const UIStrings = {
    /**
    *@description Title of issue raised when a deprecated feature is used
    */
    title: 'Deprecated Feature Used',
    // Store alphabetized messages per DeprecationIssueType in this block.
    /**
    *@description This message is shown when the example deprecated feature is used
    */
    deprecationExample: 'This is an example of a translated deprecation issue message.',
};
const str_ = i18n.i18n.registerUIStrings('models/issues_manager/DeprecationIssue.ts', UIStrings);
const i18nLazyString = i18n.i18n.getLazilyComputedLocalizedString.bind(undefined, str_);
export class DeprecationIssue extends Issue {
    #issueDetails;
    constructor(issueDetails, issuesModel) {
        let type = issueDetails.type;
        // TODO(crbug.com/1264960): Remove legacy type when issues are translated.
        if (issueDetails.deprecationType === "Untranslated" /* Untranslated */) {
            type = issueDetails.deprecationType;
        }
        const issueCode = [
            "DeprecationIssue" /* DeprecationIssue */,
            type,
        ].join('::');
        super({ code: issueCode, umaCode: 'DeprecationIssue' }, issuesModel);
        this.#issueDetails = issueDetails;
    }
    getCategory() {
        return IssueCategory.Other;
    }
    details() {
        return this.#issueDetails;
    }
    getDescription() {
        let messageFunction = () => '';
        // Keep case statements alphabetized per DeprecationIssueType.
        switch (this.#issueDetails.type) {
            case "DeprecationExample" /* DeprecationExample */:
                messageFunction = i18nLazyString(UIStrings.deprecationExample);
                break;
            // TODO(crbug.com/1264960): Remove legacy type when issues are translated.
            case "Untranslated" /* Untranslated */:
                messageFunction = () => this.#issueDetails.message ?? '';
                break;
        }
        return resolveLazyDescription({
            file: 'deprecation.md',
            substitutions: new Map([
                ['PLACEHOLDER_title', i18nLazyString(UIStrings.title)],
                ['PLACEHOLDER_message', messageFunction],
            ]),
            links: [],
        });
    }
    sources() {
        if (this.#issueDetails.sourceCodeLocation) {
            return [this.#issueDetails.sourceCodeLocation];
        }
        return [];
    }
    primaryKey() {
        return JSON.stringify(this.#issueDetails);
    }
    getKind() {
        return IssueKind.BreakingChange;
    }
    static fromInspectorIssue(issuesModel, inspectorIssue) {
        const details = inspectorIssue.details.deprecationIssueDetails;
        if (!details) {
            console.warn('Deprecation issue without details received.');
            return [];
        }
        if (details.type !== "Untranslated" /* Untranslated */ &&
            (details.deprecationType || details.message)) {
            console.warn('Translated deprecation issue with malformed details received.');
            return [];
        }
        if (details.type === "Untranslated" /* Untranslated */ &&
            (!details.deprecationType || !details.message)) {
            console.warn('Untranslated deprecation issue with malformed details received.');
            return [];
        }
        return [new DeprecationIssue(details, issuesModel)];
    }
}
//# sourceMappingURL=DeprecationIssue.js.map