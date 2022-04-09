"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPieChartLegendRows = exports.waitForQuotaUsage = exports.selectCookieByName = exports.clearStorageItems = exports.clearStorageItemsFilter = exports.filterStorageItems = exports.getStorageItemsData = exports.getFrameTreeTitles = exports.getTrimmedTextContent = exports.getDataGridData = exports.doubleClickSourceTreeItem = exports.navigateToServiceWorkers = exports.navigateToApplicationTab = void 0;
const helper_js_1 = require("../../shared/helper.js");
async function navigateToApplicationTab(target, testName) {
    await (0, helper_js_1.goToResource)(`application/${testName}.html`);
    await (0, helper_js_1.click)('#tab-resources');
    // Make sure the application navigation list is shown
    await (0, helper_js_1.waitFor)('.storage-group-list-item');
}
exports.navigateToApplicationTab = navigateToApplicationTab;
async function navigateToServiceWorkers() {
    const SERVICE_WORKER_ROW_SELECTOR = '[aria-label="Service Workers"]';
    await (0, helper_js_1.click)(SERVICE_WORKER_ROW_SELECTOR);
}
exports.navigateToServiceWorkers = navigateToServiceWorkers;
async function doubleClickSourceTreeItem(selector) {
    const element = await (0, helper_js_1.waitFor)(selector);
    element.evaluate(el => el.scrollIntoView(true));
    await (0, helper_js_1.click)(selector, { clickOptions: { clickCount: 2 } });
}
exports.doubleClickSourceTreeItem = doubleClickSourceTreeItem;
async function getDataGridData(selector, columns) {
    // Wait for Storage data-grid to show up
    await (0, helper_js_1.waitFor)(selector);
    const dataGridNodes = await (0, helper_js_1.$$)('.data-grid-data-grid-node:not(.creation-node)');
    const dataGridRowValues = await Promise.all(dataGridNodes.map(node => node.evaluate((row, columns) => {
        const data = {};
        for (const column of columns) {
            const columnElement = row.querySelector(`.${column}-column`);
            data[column] = columnElement ? columnElement.textContent : '';
        }
        return data;
    }, columns)));
    return dataGridRowValues;
}
exports.getDataGridData = getDataGridData;
async function getTrimmedTextContent(selector) {
    const elements = await (0, helper_js_1.$$)(selector);
    return Promise.all(elements.map(element => element.evaluate(e => {
        return (e.textContent || '').trim().replace(/[ \n]{2,}/gm, ''); // remove multiple consecutive whitespaces
    })));
}
exports.getTrimmedTextContent = getTrimmedTextContent;
async function getFrameTreeTitles() {
    const treeTitles = await (0, helper_js_1.$$)('[aria-label="Resources Section"] ~ ol .tree-element-title');
    return Promise.all(treeTitles.map(node => node.evaluate(e => e.textContent)));
}
exports.getFrameTreeTitles = getFrameTreeTitles;
async function getStorageItemsData(columns) {
    return getDataGridData('.storage-view table', columns);
}
exports.getStorageItemsData = getStorageItemsData;
async function filterStorageItems(filter) {
    const element = await (0, helper_js_1.$)('.toolbar-input-prompt');
    await element.type(filter);
}
exports.filterStorageItems = filterStorageItems;
async function clearStorageItemsFilter() {
    await (0, helper_js_1.click)('.toolbar-input .toolbar-input-clear-button');
}
exports.clearStorageItemsFilter = clearStorageItemsFilter;
async function clearStorageItems() {
    await (0, helper_js_1.waitFor)('#storage-items-delete-all');
    await (0, helper_js_1.click)('#storage-items-delete-all');
}
exports.clearStorageItems = clearStorageItems;
async function selectCookieByName(name) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.waitFor)('.cookies-table');
    const cell = await (0, helper_js_1.waitForFunction)(async () => {
        const tmp = await frontend.evaluateHandle(name => {
            const result = [...document.querySelectorAll('.cookies-table .name-column')]
                .map(c => ({ cell: c, textContent: c.textContent || '' }))
                .find(({ textContent }) => textContent.trim() === name);
            return result ? result.cell : undefined;
        }, name);
        return tmp.asElement() || undefined;
    });
    await cell.click();
}
exports.selectCookieByName = selectCookieByName;
async function waitForQuotaUsage(p) {
    await (0, helper_js_1.waitForFunction)(async () => {
        const storageRow = await (0, helper_js_1.waitFor)('.quota-usage-row');
        const quotaString = await storageRow.evaluate(el => el.textContent || '');
        const [usedQuotaText, modifier] = quotaString.replace(/^\D*([\d.]+)\D*(kM?)B.used.out.of\D*\d+\D*.?B.*$/, '$1 $2').split(' ');
        let usedQuota = Number.parseInt(usedQuotaText, 10);
        if (modifier === 'k') {
            usedQuota *= 1000;
        }
        else if (modifier === 'M') {
            usedQuota *= 1000000;
        }
        return p(usedQuota);
    });
}
exports.waitForQuotaUsage = waitForQuotaUsage;
async function getPieChartLegendRows() {
    const pieChartLegend = await (0, helper_js_1.waitFor)('.pie-chart-legend');
    const rows = await pieChartLegend.evaluate(legend => {
        const rows = [];
        for (const tableRow of legend.children) {
            const row = [];
            for (const cell of tableRow.children) {
                row.push(cell.textContent);
            }
            rows.push(row);
        }
        return rows;
    });
    return rows;
}
exports.getPieChartLegendRows = getPieChartLegendRows;
//# sourceMappingURL=application-helpers.js.map