"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrollDataGridDown = exports.waitForScrollTopOfDataGrid = exports.assertDataGridNotScrolled = exports.getDataGridScrollTop = exports.getDataGridFillerCellAtColumnIndex = exports.getDataGridCellAtIndex = exports.getInnerTextOfDataGridCells = exports.getDataGridController = exports.getDataGrid = exports.getDataGridRows = void 0;
const helper_js_1 = require("../../shared/helper.js");
const chai_1 = require("chai");
async function getDataGridRows(expectedNumberOfRows, root, matchExactNumberOfRows = true) {
    const dataGrid = await (0, helper_js_1.waitFor)('devtools-data-grid', root);
    const rowsSelector = 'tbody > tr:not(.padding-row):not(.hidden)';
    const rowsHandler = await (0, helper_js_1.waitForFunction)(async () => {
        const rows = (await (0, helper_js_1.$$)(rowsSelector, dataGrid));
        if (matchExactNumberOfRows) {
            return (rows.length === expectedNumberOfRows) ? rows : undefined;
        }
        return (rows.length >= expectedNumberOfRows) ? rows : undefined;
    });
    const tableElements = [];
    for (const rowHandler of rowsHandler) {
        const cells = await (0, helper_js_1.$$)('td[data-row-index]:not(.hidden)', rowHandler);
        tableElements.push(cells);
    }
    return tableElements;
}
exports.getDataGridRows = getDataGridRows;
async function getDataGrid(root) {
    const dataGrid = await (0, helper_js_1.waitFor)('devtools-data-grid', root);
    if (!dataGrid) {
        chai_1.assert.fail('Could not find data-grid');
    }
    return dataGrid;
}
exports.getDataGrid = getDataGrid;
async function getDataGridController() {
    const dataGrid = await (0, helper_js_1.waitFor)('devtools-data-grid-controller');
    if (!dataGrid) {
        chai_1.assert.fail('Could not find data-grid-controller');
    }
    return dataGrid;
}
exports.getDataGridController = getDataGridController;
async function getInnerTextOfDataGridCells(dataGridElement, expectedNumberOfRows, matchExactNumberOfRows = true) {
    const gridRows = await getDataGridRows(expectedNumberOfRows, dataGridElement, matchExactNumberOfRows);
    const table = [];
    for (const row of gridRows) {
        const textRow = [];
        for (const cell of row.values()) {
            const text = await cell.evaluate(x => {
                return x.innerText || '';
            });
            textRow.push(text);
        }
        table.push(textRow);
    }
    return table;
}
exports.getInnerTextOfDataGridCells = getInnerTextOfDataGridCells;
async function getDataGridCellAtIndex(dataGrid, position) {
    const cell = await (0, helper_js_1.$)(`td[data-row-index="${position.row}"][data-col-index="${position.column}"]`, dataGrid);
    if (!cell) {
        chai_1.assert.fail(`Could not load column at position ${JSON.stringify(position)}`);
    }
    return cell;
}
exports.getDataGridCellAtIndex = getDataGridCellAtIndex;
async function getDataGridFillerCellAtColumnIndex(dataGrid, columnIndex) {
    const cell = await (0, helper_js_1.$)(`tr.filler-row > td[data-filler-row-column-index="${columnIndex}"]`, dataGrid);
    if (!cell) {
        chai_1.assert.fail(`Could not load filler column at position ${columnIndex}`);
    }
    return cell;
}
exports.getDataGridFillerCellAtColumnIndex = getDataGridFillerCellAtColumnIndex;
async function getDataGridScrollTop(dataGrid) {
    const wrappingContainer = await (0, helper_js_1.$)('.wrapping-container', dataGrid);
    if (!wrappingContainer) {
        throw new Error('Could not find wrapping container.');
    }
    return await wrappingContainer.evaluate((elem) => {
        return elem.scrollTop;
    });
}
exports.getDataGridScrollTop = getDataGridScrollTop;
async function assertDataGridNotScrolled(dataGrid) {
    const scrollTop = await getDataGridScrollTop(dataGrid);
    chai_1.assert.strictEqual(scrollTop, 0, 'The data-grid did not have 0 scrollTop');
}
exports.assertDataGridNotScrolled = assertDataGridNotScrolled;
async function waitForScrollTopOfDataGrid(dataGrid, targetTop) {
    return (0, helper_js_1.waitForFunction)(async () => {
        const scrollTop = await getDataGridScrollTop(dataGrid);
        return scrollTop === targetTop;
    });
}
exports.waitForScrollTopOfDataGrid = waitForScrollTopOfDataGrid;
async function scrollDataGridDown(dataGrid, targetDown) {
    const scrollWrapper = await (0, helper_js_1.$)('.wrapping-container', dataGrid);
    if (!scrollWrapper) {
        throw new Error('Could not find wrapping container.');
    }
    const wrappingBox = await scrollWrapper.boundingBox();
    if (!wrappingBox) {
        throw new Error('Wrapping box did not have a bounding box.');
    }
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    // +20 to move from the top left point so we are definitely scrolling
    // within the container
    await frontend.mouse.move(wrappingBox.x + 20, wrappingBox.y + 20);
    await frontend.mouse.wheel({ deltaY: targetDown });
    await waitForScrollTopOfDataGrid(dataGrid, targetDown);
}
exports.scrollDataGridDown = scrollDataGridDown;
//# sourceMappingURL=datagrid-helpers.js.map