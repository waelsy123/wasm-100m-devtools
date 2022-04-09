"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const application_helpers_js_1 = require("../helpers/application-helpers.js");
const datagrid_helpers_js_1 = require("../helpers/datagrid-helpers.js");
const REPORTING_API_SELECTOR = '[aria-label="Reporting API"]';
(0, mocha_extensions_js_1.describe)('The Reporting API Page', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.enableExperiment)('reportingApiDebugging');
    });
    (0, mocha_extensions_js_1.it)('shows reports', async () => {
        const { target } = (0, helper_js_1.getBrowserAndPages)();
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'reporting-api');
        await (0, helper_js_1.click)(REPORTING_API_SELECTOR);
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
        const innerText = await (0, datagrid_helpers_js_1.getInnerTextOfDataGridCells)(dataGrid, 1, false);
        const reportBody = '{"columnNumber":10,"id":"PrefixedStorageInfo","lineNumber":9,"message":"' +
            '\'window.webkitStorageInfo\' is deprecated. Please use \'navigator.webkitTemporaryStorage\' or ' +
            '\'navigator.webkitPersistentStorage\' instead.","sourceFile":' +
            `"https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/reporting-api.html"}`;
        chai_1.assert.strictEqual(innerText[0][0], `https://localhost:${(0, helper_js_1.getTestServerPort)()}/test/e2e/resources/application/reporting-api.html`);
        chai_1.assert.strictEqual(innerText[0][1], 'deprecation');
        chai_1.assert.strictEqual(innerText[0][2], 'Queued');
        chai_1.assert.strictEqual(innerText[0][3], 'default');
        chai_1.assert.strictEqual(innerText[0][5], reportBody);
        const rows = await (0, datagrid_helpers_js_1.getDataGridRows)(1, dataGrid, false);
        await (0, helper_js_1.click)(rows[rows.length - 1][0]);
        const jsonView = await (0, helper_js_1.waitFor)('.json-view');
        const jsonViewText = await jsonView.evaluate(el => el.innerText);
        chai_1.assert.strictEqual(jsonViewText, '{columnNumber: 10, id: "PrefixedStorageInfo", lineNumber: 9,…}');
    });
    (0, mocha_extensions_js_1.it)('shows endpoints', async () => {
        await (0, helper_js_1.goToResource)('application/reporting-api.rawresponse');
        await (0, helper_js_1.click)('#tab-resources');
        await (0, helper_js_1.waitFor)('.storage-group-list-item'); // Make sure the application navigation list is shown
        await (0, helper_js_1.click)(REPORTING_API_SELECTOR);
        const endpointsGrid = await (0, helper_js_1.$)('devtools-resources-endpoints-grid');
        if (!endpointsGrid) {
            chai_1.assert.fail('Could not find data-grid');
        }
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)(endpointsGrid);
        const innerText = await (0, datagrid_helpers_js_1.getInnerTextOfDataGridCells)(dataGrid, 2, true);
        chai_1.assert.strictEqual(innerText[0][0], `https://localhost:${(0, helper_js_1.getTestServerPort)()}`);
        chai_1.assert.strictEqual(innerText[0][1], 'default');
        chai_1.assert.strictEqual(innerText[0][2], 'https://reports.example/default');
        chai_1.assert.strictEqual(innerText[1][0], `https://localhost:${(0, helper_js_1.getTestServerPort)()}`);
        chai_1.assert.strictEqual(innerText[1][1], 'main-endpoint');
        chai_1.assert.strictEqual(innerText[1][2], 'https://reports.example/main');
    });
});
//# sourceMappingURL=reporting-api_test.js.map