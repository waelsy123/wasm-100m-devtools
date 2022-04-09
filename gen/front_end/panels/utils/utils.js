// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Formatter from '../../models/formatter/formatter.js';
import * as DiffView from '../../ui/components/diff_view/diff_view.js';
export function imageNameForResourceType(resourceType) {
    if (resourceType.isDocument()) {
        return 'ic_file_document';
    }
    if (resourceType.isImage()) {
        return 'ic_file_image';
    }
    if (resourceType.isFont()) {
        return 'ic_file_font';
    }
    if (resourceType.isScript()) {
        return 'ic_file_script';
    }
    if (resourceType.isStyleSheet()) {
        return 'ic_file_stylesheet';
    }
    if (resourceType.isWebbundle()) {
        return 'ic_file_webbundle';
    }
    return 'ic_file_default';
}
export async function formatCSSChangesFromDiff(diff) {
    const { originalLines, currentLines, rows } = DiffView.DiffView.buildDiffRows(diff);
    const { propertyToSelector: originalPropertyToSelector, ruleToSelector: originalRuleToSelector } = await buildPropertyRuleMaps(originalLines.join('\n'));
    const { propertyToSelector: currentPropertyToSelector, ruleToSelector: currentRuleToSelector } = await buildPropertyRuleMaps(currentLines.join('\n'));
    let changes = '';
    let recordedOriginalSelector, recordedCurrentSelector;
    for (const { currentLineNumber, originalLineNumber, type } of rows) {
        // diff line arrays starts at 0, but line numbers start at 1.
        const currentLineIndex = currentLineNumber - 1;
        const originalLineIndex = originalLineNumber - 1;
        switch (type) {
            case "deletion" /* Deletion */: {
                const originalLine = originalLines[originalLineIndex].trim();
                if (originalRuleToSelector.has(originalLineIndex)) {
                    changes += `/* ${originalLine} { */\n`;
                    recordedOriginalSelector = originalLine;
                    continue;
                }
                const originalSelector = originalPropertyToSelector.get(originalLineIndex);
                if (!originalSelector) {
                    continue;
                }
                if (originalSelector !== recordedOriginalSelector && originalSelector !== recordedCurrentSelector) {
                    if (recordedOriginalSelector || recordedCurrentSelector) {
                        changes += '}\n\n';
                    }
                    changes += `${originalSelector} {\n`;
                }
                recordedOriginalSelector = originalSelector;
                changes += `  /* ${originalLine} */\n`;
                break;
            }
            case "addition" /* Addition */: {
                const currentLine = currentLines[currentLineIndex].trim();
                if (currentRuleToSelector.has(currentLineIndex)) {
                    changes += `${currentLine} {\n`;
                    recordedCurrentSelector = currentLine;
                    continue;
                }
                const currentSelector = currentPropertyToSelector.get(currentLineIndex);
                if (!currentSelector) {
                    continue;
                }
                if (currentSelector !== recordedOriginalSelector && currentSelector !== recordedCurrentSelector) {
                    if (recordedOriginalSelector || recordedCurrentSelector) {
                        changes += '}\n\n';
                    }
                    changes += `${currentSelector} {\n`;
                }
                recordedCurrentSelector = currentSelector;
                changes += `  ${currentLine}\n`;
                break;
            }
            default:
                break;
        }
    }
    if (changes.length > 0) {
        changes += '}';
    }
    return changes;
}
async function buildPropertyRuleMaps(content) {
    const rules = await new Promise(res => {
        const rules = [];
        Formatter.FormatterWorkerPool.formatterWorkerPool().parseCSS(content, (isLastChunk, currentRules) => {
            rules.push(...currentRules);
            if (isLastChunk) {
                res(rules);
            }
        });
    });
    const propertyToSelector = new Map();
    const ruleToSelector = new Map();
    for (const rule of rules) {
        if ('styleRange' in rule) {
            const selector = rule.selectorText.split('\n').pop()?.trim();
            if (!selector) {
                continue;
            }
            ruleToSelector.set(rule.styleRange.startLine, selector);
            for (const property of rule.properties) {
                propertyToSelector.set(property.range.startLine, selector);
            }
        }
    }
    return { propertyToSelector, ruleToSelector };
}
//# sourceMappingURL=utils.js.map