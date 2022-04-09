"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const datagrid_helpers_js_1 = require("../../e2e/helpers/datagrid-helpers.js");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const shared_js_1 = require("../helpers/shared.js");
function assertNumberBetween(number, min, max) {
    chai_1.assert.isAbove(number, min);
    chai_1.assert.isBelow(number, max);
}
async function clickAndDragCellToResizeHorizontally(cell, mouseXChange) {
    const cellBoundingBoxData = await cell.evaluate(cellElement => {
        const box = cellElement.getBoundingClientRect();
        return {
            right: box.right,
            top: box.top,
        };
    });
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const startX = cellBoundingBoxData.right - 5;
    const startY = cellBoundingBoxData.top + 5;
    await frontend.mouse.move(startX, startY);
    await frontend.mouse.down();
    await frontend.mouse.move(startX + mouseXChange, startY);
    await frontend.mouse.up();
}
async function getColumnPixelWidths(columns) {
    return Promise.all(columns.map(col => {
        return col.evaluate(cell => cell.clientWidth);
    }));
}
async function getColumnPercentageWidthsRounded(dataGrid) {
    const cols = await (0, helper_js_1.$$)('col', dataGrid);
    return Promise.all(cols.map(col => {
        return col.evaluate(cell => Math.round(window.parseFloat(cell.style.width)));
    }));
}
describe('data grid', async () => {
    (0, shared_js_1.preloadForCodeCoverage)('data_grid/basic.html');
    (0, mocha_extensions_js_1.it)('lists the data grid contents', async () => {
        await (0, shared_js_1.loadComponentDocExample)('data_grid/basic.html');
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
        const renderedText = await (0, datagrid_helpers_js_1.getInnerTextOfDataGridCells)(dataGrid, 3);
        chai_1.assert.deepEqual([
            ['Bravo', 'Letter B'],
            ['Alpha', 'Letter A'],
            ['Charlie', 'Letter C'],
        ], renderedText);
    });
    (0, mocha_extensions_js_1.it)('can resize two columns', async () => {
        await (0, shared_js_1.loadComponentDocExample)('data_grid/basic.html');
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
        const columns = [
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 0 }),
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 1 }),
        ];
        let columnWidths = await getColumnPixelWidths(columns);
        assertNumberBetween(columnWidths[0], 500, 515);
        assertNumberBetween(columnWidths[1], 500, 515);
        const firstRowFirstCell = await (0, helper_js_1.waitFor)('td[data-row-index="1"][data-col-index="0"]', dataGrid);
        await clickAndDragCellToResizeHorizontally(firstRowFirstCell, -50);
        columnWidths = await getColumnPixelWidths(columns);
        assertNumberBetween(columnWidths[0], 450, 465);
        assertNumberBetween(columnWidths[1], 545, 565);
    });
    (0, mocha_extensions_js_1.it)('can resize empty columns', async () => {
        await (0, shared_js_1.loadComponentDocExample)('data_grid/empty.html');
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
        await (0, helper_js_1.waitFor)('.cell-resize-handle', dataGrid);
        const emptyTableFillerFirstColumn = await (0, helper_js_1.waitFor)('td[data-filler-row-column-index="0"]', dataGrid);
        const columns = [
            await (0, datagrid_helpers_js_1.getDataGridFillerCellAtColumnIndex)(dataGrid, 0),
            await (0, datagrid_helpers_js_1.getDataGridFillerCellAtColumnIndex)(dataGrid, 1),
        ];
        let columnWidths = await getColumnPixelWidths(columns);
        assertNumberBetween(columnWidths[0], 485, 500);
        assertNumberBetween(columnWidths[1], 485, 500);
        await clickAndDragCellToResizeHorizontally(emptyTableFillerFirstColumn, -50);
        columnWidths = await getColumnPixelWidths(columns);
        assertNumberBetween(columnWidths[0], 435, 450);
        assertNumberBetween(columnWidths[1], 530, 550);
    });
    (0, mocha_extensions_js_1.it)('can resize two columns in a grid of 3 and leave the other column untouched', async () => {
        await (0, shared_js_1.loadComponentDocExample)('data_grid/three_columns.html');
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
        await (0, helper_js_1.waitFor)('.cell-resize-handle', dataGrid);
        await (0, datagrid_helpers_js_1.getDataGridRows)(3, dataGrid);
        const firstRowFirstCell = await (0, helper_js_1.waitFor)('td[data-row-index="1"][data-col-index="0"]', dataGrid);
        const columns = [
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 0 }),
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 1 }),
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 2 }),
        ];
        let columnWidths = await getColumnPixelWidths(columns);
        // The container is 900px wide so we expect each column to be ~300
        assertNumberBetween(columnWidths[0], 295, 305);
        assertNumberBetween(columnWidths[1], 295, 305);
        assertNumberBetween(columnWidths[2], 295, 305);
        await clickAndDragCellToResizeHorizontally(firstRowFirstCell, -100);
        /* The resize calculation is roughly as follows
         * mouse delta = 100px (-100, but we Math.abs it)
         * delta as a % = (100 / (leftCellWidth + rightCellWidth)) * 100
         * % delta = (100 / 300 + 300) * 100
         * % delta = 16.6%
         * therefore left column % = -16.6%
         * and right column % = + 16.6%
         */
        const newColumnPercentageWidths = await getColumnPercentageWidthsRounded(dataGrid);
        chai_1.assert.deepEqual([
            16, 50,
            33, // left alone
        ], newColumnPercentageWidths);
        columnWidths = await getColumnPixelWidths(columns);
        assertNumberBetween(columnWidths[0], 145, 150); // 16.31% of 900 = 146.79
        assertNumberBetween(columnWidths[1], 447, 454); // 50% of 900 = 450
        assertNumberBetween(columnWidths[2], 297, 304); // 33% of 900 = 300
    });
    (0, mocha_extensions_js_1.it)('lets the user resize columns when there is a middle hidden column inbetween', async () => {
        /** Imagine we have a data grid with 3 columns:
         * A | B | C And then we hide B, so the user sees:
         * A | C
         * If the user clicks and drags between A and C,
         * it should resize them accordingly, and leave B alone, even though
         * there is technically the B column inbetween them, but it's hidden.
         */
        await (0, shared_js_1.loadComponentDocExample)('data_grid/hide-cols.html');
        /**
         * The value column is visible by default, so clicking this will hide it.
         */
        const toggleValueColumnButton = await (0, helper_js_1.$)('.value-visibility-toggle');
        if (!toggleValueColumnButton) {
            chai_1.assert.fail('Could not find value column toggle button.');
        }
        await (0, helper_js_1.click)(toggleValueColumnButton);
        await (0, helper_js_1.waitForFunction)(async () => {
            const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
            const hiddenCells = await (0, helper_js_1.$$)('tbody td.hidden', dataGrid);
            const resizerHandlers = await (0, helper_js_1.$$)('.cell-resize-handle', dataGrid);
            // Now there are only 2 columns visible, there should be 1 resize handler.
            return hiddenCells.length === 3 && resizerHandlers.length === 1;
        });
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
        await (0, datagrid_helpers_js_1.getDataGridRows)(3, dataGrid);
        const renderedText = await (0, datagrid_helpers_js_1.getInnerTextOfDataGridCells)(dataGrid, 3);
        // Make sure that the middle column ("value") is hidden now.
        chai_1.assert.deepEqual(renderedText, [
            ['Bravo', '1'],
            ['Alpha', '2'],
            ['Charlie', '3'],
        ]);
        const firstRowFirstCell = await (0, helper_js_1.waitFor)('td[data-row-index="1"][data-col-index="0"]', dataGrid);
        const columns = [
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 0 }),
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 2 }),
        ];
        let columnWidths = await getColumnPixelWidths(columns);
        // The container is 900px wide and the first column has a weighting of 2 and
        // the last column has a waiting of 1, so we expect one column to be ~600
        // and the other ~300
        assertNumberBetween(columnWidths[0], 602, 607);
        assertNumberBetween(columnWidths[1], 294, 300);
        await clickAndDragCellToResizeHorizontally(firstRowFirstCell, -100);
        /* The resize calculation is roughly as follows
         * mouse delta = 100px (-100, but we Math.abs it)
         * delta as a % = (100 / (leftCellWidth + rightCellWidth)) * 100
         * % delta = (100 / 666 + 333) * 100
         * % delta = 11.1%
         * therefore left column % = -11.1%
         * and right column % = + 11.1%
         */
        const newColumnPercentageWidths = await getColumnPercentageWidthsRounded(dataGrid);
        chai_1.assert.deepEqual(newColumnPercentageWidths, [
            56,
            44, // 33.33 + 11.1 rounded
        ]);
        columnWidths = await getColumnPixelWidths(columns);
        assertNumberBetween(columnWidths[0], 500, 504); // 55.8% of 900 = 502
        assertNumberBetween(columnWidths[1], 395, 400); // 44.12% of 900 = 397
    });
    (0, mocha_extensions_js_1.it)('persists the column resizes when new data is added', async () => {
        await (0, shared_js_1.loadComponentDocExample)('data_grid/adding-data.html');
        const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
        await (0, datagrid_helpers_js_1.getDataGridRows)(10, dataGrid);
        await (0, helper_js_1.waitFor)('.cell-resize-handle', dataGrid);
        const firstRowFirstCell = await (0, helper_js_1.waitFor)('td[data-row-index="1"][data-col-index="0"]', dataGrid);
        const columns = [
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 0 }),
            await (0, datagrid_helpers_js_1.getDataGridCellAtIndex)(dataGrid, { row: 1, column: 1 }),
        ];
        let columnPixelWidths = await getColumnPixelWidths(columns);
        // The container is 600px and both columns have weighting of 1, so they
        // should both be ~300.
        assertNumberBetween(columnPixelWidths[0], 297, 303);
        assertNumberBetween(columnPixelWidths[1], 297, 303);
        await clickAndDragCellToResizeHorizontally(firstRowFirstCell, 50);
        const newColumnPercentageWidths = await getColumnPercentageWidthsRounded(dataGrid);
        chai_1.assert.deepEqual(newColumnPercentageWidths, [
            58,
            42, // 50 - 8.3 rounded
        ]);
        columnPixelWidths = await getColumnPixelWidths(columns);
        assertNumberBetween(columnPixelWidths[0], 348, 352); // 58.35% of 600 = ~350
        assertNumberBetween(columnPixelWidths[1], 247, 252); // 42% of 600 = ~249
        const addButton = await (0, helper_js_1.waitFor)('#add');
        await (0, helper_js_1.click)(addButton);
        await (0, datagrid_helpers_js_1.getDataGridRows)(11, dataGrid);
        const newColumnPixelWidths = await getColumnPixelWidths(columns);
        // Ensure that after resizing and then adding a row that the widths are not changed
        chai_1.assert.deepEqual(newColumnPixelWidths, columnPixelWidths);
    });
    describe('auto-scrolling on new data', () => {
        async function clickAddButton() {
            const addButton = await (0, helper_js_1.$)('#add');
            if (!addButton) {
                throw new Error('Could not find add button');
            }
            await addButton.click();
        }
        beforeEach(async function () {
            await (0, shared_js_1.loadComponentDocExample)('data_grid/adding-data.html');
            const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
            await (0, datagrid_helpers_js_1.getDataGridRows)(10, dataGrid);
        });
        (0, mocha_extensions_js_1.it)('.auto-scrolls by default if a new row is added', async () => {
            const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
            await (0, datagrid_helpers_js_1.assertDataGridNotScrolled)(dataGrid);
            await clickAddButton();
            await (0, datagrid_helpers_js_1.getDataGridRows)(11, dataGrid);
            await (0, datagrid_helpers_js_1.waitForScrollTopOfDataGrid)(dataGrid, 89);
        });
        (0, mocha_extensions_js_1.it)('does not auto-scroll if the user has clicked on a cell', async () => {
            const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
            await (0, datagrid_helpers_js_1.assertDataGridNotScrolled)(dataGrid);
            const firstBodyCell = await (0, helper_js_1.$)('tr[aria-rowindex="1"] > td[aria-colindex="1"]', dataGrid);
            if (!firstBodyCell) {
                throw new Error('Could not find first body cell to click.');
            }
            await (0, helper_js_1.click)(firstBodyCell);
            await (0, helper_js_1.waitFor)('tr.selected', dataGrid);
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            await frontend.evaluate('window.addNewRow()');
            await (0, datagrid_helpers_js_1.getDataGridRows)(11, dataGrid);
            await (0, datagrid_helpers_js_1.waitForScrollTopOfDataGrid)(dataGrid, 0);
        });
        (0, mocha_extensions_js_1.it)('does not auto-scroll if the user has scrolled in the data-grid', async () => {
            const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
            await (0, datagrid_helpers_js_1.assertDataGridNotScrolled)(dataGrid);
            await (0, datagrid_helpers_js_1.scrollDataGridDown)(dataGrid, 20);
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            await frontend.evaluate('window.addNewRow()');
            await (0, datagrid_helpers_js_1.getDataGridRows)(11, dataGrid);
            // Ensure the scrollTop hasn't changed.
            await (0, datagrid_helpers_js_1.waitForScrollTopOfDataGrid)(dataGrid, 20);
        });
        (0, mocha_extensions_js_1.it)('will autoscroll if the user has a cell selected, but then clicks elsewhere in the UI, causing a new row to be added', async () => {
            const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
            await (0, datagrid_helpers_js_1.assertDataGridNotScrolled)(dataGrid);
            const firstBodyCell = await (0, helper_js_1.$)('tr[aria-rowindex="1"] > td[aria-colindex="1"]', dataGrid);
            if (!firstBodyCell) {
                throw new Error('Could not find first body cell to click.');
            }
            await (0, helper_js_1.click)(firstBodyCell);
            await (0, helper_js_1.waitFor)('tr.selected', dataGrid);
            await clickAddButton();
            await (0, datagrid_helpers_js_1.getDataGridRows)(11, dataGrid);
            await (0, datagrid_helpers_js_1.waitForScrollTopOfDataGrid)(dataGrid, 89);
        });
        (0, mocha_extensions_js_1.it)('will resume autoscroll if the user clicks a cell but then scrolls to the bottom', async () => {
            const { frontend } = (0, helper_js_1.getBrowserAndPages)();
            const dataGrid = await (0, datagrid_helpers_js_1.getDataGrid)();
            await (0, datagrid_helpers_js_1.assertDataGridNotScrolled)(dataGrid);
            const firstBodyCell = await (0, helper_js_1.$)('tr[aria-rowindex="1"] > td[aria-colindex="1"]', dataGrid);
            if (!firstBodyCell) {
                throw new Error('Could not find first body cell to click.');
            }
            await (0, helper_js_1.click)(firstBodyCell);
            await (0, helper_js_1.waitFor)('tr.selected', dataGrid);
            // And new row and ensure we have not auto scrolled as we have a cell selected.
            await frontend.evaluate('window.addNewRow()');
            await (0, datagrid_helpers_js_1.getDataGridRows)(11, dataGrid);
            await (0, datagrid_helpers_js_1.waitForScrollTopOfDataGrid)(dataGrid, 0);
            // Now scroll down to the very bottom of the grid
            await (0, datagrid_helpers_js_1.scrollDataGridDown)(dataGrid, 89);
            await frontend.evaluate('window.addNewRow()');
            await (0, datagrid_helpers_js_1.getDataGridRows)(12, dataGrid);
            // Ensure the scrollTop has changed: we are auto-scrolling again as the
            // user scrolled to the bottom
            await (0, datagrid_helpers_js_1.waitForScrollTopOfDataGrid)(dataGrid, 109);
        });
    });
});
//# sourceMappingURL=data_grid_test.js.map