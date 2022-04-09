"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const datagrid_helpers_js_1 = require("../helpers/datagrid-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
async function getDataGridText(datagrid) {
    const table = [];
    for (const row of datagrid) {
        const textRow = [];
        for (const [i, cell] of row.entries()) {
            let node = cell;
            // First column is a Linkifier
            if (i === 0) {
                const link = await (0, helper_js_1.waitFor)('devtools-linkifier', cell);
                const linkText = await (0, helper_js_1.waitFor)('a.link', link);
                node = linkText;
            }
            const text = await node.evaluate(x => {
                if (x instanceof HTMLElement) {
                    return x.innerText;
                }
                return '';
            });
            textRow.push(text);
        }
        table.push(textRow);
    }
    return table;
}
async function waitForDataGridText(selector, expectedRows) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const cspViolationsPane = await (0, helper_js_1.waitFor)('.csp-violations-pane');
        const actualRows = await getDataGridText(await (0, datagrid_helpers_js_1.getDataGridRows)(expectedRows.length, cspViolationsPane));
        for (let i = 0; i < actualRows.length; ++i) {
            const result = (0, helper_js_1.matchStringArray)(actualRows[i], expectedRows[i]);
            if (result !== true) {
                return undefined;
            }
        }
        return true;
    });
}
(0, mocha_extensions_js_1.describe)('CSP Violations Tab', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.enableExperiment)('cspViolationsView');
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('CSP Violations');
        await (0, helper_js_1.goToResource)('network/trusted-type-violations-report-only.rawresponse');
    });
    (0, mocha_extensions_js_1.it)('should display all csp violations', async () => {
        const cspViolationsPane = await (0, helper_js_1.waitFor)('.csp-violations-pane');
        const rows = await getDataGridText(await (0, datagrid_helpers_js_1.getDataGridRows)(2, cspViolationsPane));
        const expectedRows = [
            ['trusted-type-violations-report-only.rawresponse:1', 'trusted-types', 'Policy Violation', 'report-only'],
            [
                'trusted-type-violations-report-only.rawresponse:1',
                'require-trusted-types-for',
                'Sink Violation',
                'report-only',
            ],
        ];
        chai_1.assert.deepEqual(rows, expectedRows);
    });
    (0, mocha_extensions_js_1.it)('should update violations when changing page', async () => {
        const cspViolationsPane = await (0, helper_js_1.waitFor)('.csp-violations-pane');
        const rows = await getDataGridText(await (0, datagrid_helpers_js_1.getDataGridRows)(2, cspViolationsPane));
        const expectedRows = [
            ['trusted-type-violations-report-only.rawresponse:1', 'trusted-types', 'Policy Violation', 'report-only'],
            [
                'trusted-type-violations-report-only.rawresponse:1',
                'require-trusted-types-for',
                'Sink Violation',
                'report-only',
            ],
        ];
        chai_1.assert.deepEqual(rows, expectedRows);
        await (0, helper_js_1.goToResource)('network/trusted-type-violations-enforced.rawresponse');
        const expectedRows2 = [
            ['trusted-type-violations-enforced.rawresponse:1', 'trusted-types', 'Policy Violation', 'blocked'],
        ];
        await waitForDataGridText('.csp-violations-pane', expectedRows2);
    });
    (0, mocha_extensions_js_1.it)('should not display sink violations', async () => {
        await (0, helper_js_1.click)('[aria-label="Categories"]');
        await (0, helper_js_1.click)('[aria-label="Trusted Type Sink, checked"]');
        const cspViolationsPane = await (0, helper_js_1.waitFor)('.csp-violations-pane');
        const rows = await getDataGridText(await (0, datagrid_helpers_js_1.getDataGridRows)(1, cspViolationsPane));
        const expectedRows = [
            ['trusted-type-violations-report-only.rawresponse:1', 'trusted-types', 'Policy Violation', 'report-only'],
        ];
        chai_1.assert.deepEqual(rows, expectedRows);
    });
    (0, mocha_extensions_js_1.it)('should not display matching violations', async () => {
        await (0, helper_js_1.click)('.toolbar-input-prompt');
        await (0, helper_js_1.typeText)('Sink');
        const cspViolationsPane = await (0, helper_js_1.waitFor)('.csp-violations-pane');
        const rows = await getDataGridText(await (0, datagrid_helpers_js_1.getDataGridRows)(1, cspViolationsPane));
        const expectedRows = [
            [
                'trusted-type-violations-report-only.rawresponse:1',
                'require-trusted-types-for',
                'Sink Violation',
                'report-only',
            ],
        ];
        chai_1.assert.deepEqual(rows, expectedRows);
    });
});
//# sourceMappingURL=csp-violations-tab_test.js.map