import type { ElementHandle } from 'puppeteer';
export declare function getDataGridRows(expectedNumberOfRows: number, root?: ElementHandle<Element>, matchExactNumberOfRows?: boolean): Promise<ElementHandle<Element>[][]>;
export declare function getDataGrid(root?: ElementHandle): Promise<ElementHandle<Element>>;
export declare function getDataGridController(): Promise<ElementHandle<Element>>;
export declare function getInnerTextOfDataGridCells(dataGridElement: ElementHandle<Element>, expectedNumberOfRows: number, matchExactNumberOfRows?: boolean): Promise<string[][]>;
export declare function getDataGridCellAtIndex(dataGrid: ElementHandle<Element>, position: {
    row: number;
    column: number;
}): Promise<ElementHandle<Element>>;
export declare function getDataGridFillerCellAtColumnIndex(dataGrid: ElementHandle<Element>, columnIndex: number): Promise<ElementHandle<Element>>;
export declare function getDataGridScrollTop(dataGrid: ElementHandle): Promise<number>;
export declare function assertDataGridNotScrolled(dataGrid: ElementHandle): Promise<void>;
export declare function waitForScrollTopOfDataGrid(dataGrid: ElementHandle, targetTop: number): Promise<boolean>;
export declare function scrollDataGridDown(dataGrid: ElementHandle, targetDown: number): Promise<void>;
