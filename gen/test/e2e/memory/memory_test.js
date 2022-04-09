"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const memory_helpers_js_1 = require("../helpers/memory-helpers.js");
(0, mocha_extensions_js_1.describe)('The Memory Panel', async function () {
    // These tests render large chunks of data into DevTools and filter/search
    // through it. On bots with less CPU power, these can fail because the
    // rendering takes a long time, so we allow a much larger timeout.
    if (this.timeout() !== 0) {
        this.timeout(100000);
    }
    (0, mocha_extensions_js_1.it)('Loads content', async () => {
        await (0, helper_js_1.goToResource)('memory/default.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
    });
    (0, mocha_extensions_js_1.it)('Can take several heap snapshots ', async () => {
        await (0, helper_js_1.goToResource)('memory/default.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        const heapSnapShots = await (0, helper_js_1.$$)('.heap-snapshot-sidebar-tree-item');
        chai_1.assert.strictEqual(heapSnapShots.length, 2);
    });
    (0, mocha_extensions_js_1.it)('Shows a DOM node and its JS wrapper as a single node', async () => {
        await (0, helper_js_1.goToResource)('memory/detached-node.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        await (0, memory_helpers_js_1.setSearchFilter)('leaking');
        await (0, memory_helpers_js_1.waitForSearchResultNumber)(4);
        await (0, memory_helpers_js_1.findSearchResult)(async (p) => {
            const el = await p.$(':scope > td > div > .object-value-function');
            return el !== null && await el.evaluate(el => el.textContent === 'leaking()');
        });
        await (0, memory_helpers_js_1.waitForRetainerChain)([
            'Detached V8EventListener',
            'Detached EventListener',
            'Detached InternalNode',
            'Detached InternalNode',
            'Detached HTMLDivElement',
            'Retainer',
            'Window',
        ]);
    });
    // Flaky test
    mocha_extensions_js_1.it.skipOnPlatforms(['mac', 'linux'], '[crbug.com/1134602] Correctly retains the path for event listeners', async () => {
        await (0, helper_js_1.goToResource)('memory/event-listeners.html');
        await (0, helper_js_1.step)('taking a heap snapshot', async () => {
            await (0, memory_helpers_js_1.navigateToMemoryTab)();
            await (0, memory_helpers_js_1.takeHeapSnapshot)();
            await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        });
        await (0, helper_js_1.step)('searching for the event listener', async () => {
            await (0, memory_helpers_js_1.setSearchFilter)('myEventListener');
            await (0, memory_helpers_js_1.waitForSearchResultNumber)(4);
        });
        await (0, helper_js_1.step)('selecting the search result that we need', async () => {
            await (0, memory_helpers_js_1.findSearchResult)(async (p) => {
                const el = await p.$(':scope > td > div > .object-value-function');
                return el !== null && await el.evaluate(el => el.textContent === 'myEventListener()');
            });
        });
        await (0, helper_js_1.step)('waiting for retainer chain', async () => {
            await (0, memory_helpers_js_1.waitForRetainerChain)([
                'V8EventListener',
                'EventListener',
                'InternalNode',
                'InternalNode',
                'HTMLBodyElement',
                'HTMLHtmlElement',
                'HTMLDocument',
                'Window',
            ]);
        });
    });
    (0, mocha_extensions_js_1.it)('Puts all ActiveDOMObjects with pending activities into one group', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('memory/dom-objects.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        // The test ensures that the following structure is present:
        // Pending activities
        // -> Pending activities
        //    -> InternalNode
        //       -> MediaQueryList
        //       -> MediaQueryList
        await (0, memory_helpers_js_1.setSearchFilter)('Pending activities');
        // Here and below we have to wait until the elements are actually created
        // and visible.
        const [pendingActivitiesSpan] = await (0, helper_js_1.waitForFunction)(async () => {
            const elements = await frontend.$x('//span[text()="Pending activities"]');
            return elements.length > 0 ? elements : undefined;
        });
        const [pendingActiviesRow] = await pendingActivitiesSpan.$x('ancestor-or-self::tr');
        await (0, helper_js_1.waitForFunction)(async () => {
            await (0, helper_js_1.click)(pendingActivitiesSpan);
            const res = await pendingActiviesRow.evaluate(x => x.classList.toString());
            return res.includes('selected');
        });
        await frontend.keyboard.press('ArrowRight');
        const [internalNodeSpan] = await (0, helper_js_1.waitForFunction)(async () => {
            const elements = await frontend.$x('//span[text()="InternalNode"][ancestor-or-self::tr[preceding-sibling::*[1][//span[text()="Pending activities"]]]]');
            return elements.length === 1 ? elements : undefined;
        });
        const [internalNodeRow] = await internalNodeSpan.$x('ancestor-or-self::tr');
        await (0, helper_js_1.waitForFunction)(async () => {
            await (0, helper_js_1.click)(internalNodeSpan);
            const res = await internalNodeRow.evaluate(x => x.classList.toString());
            return res.includes('selected');
        });
        await frontend.keyboard.press('ArrowRight');
        await (0, helper_js_1.waitForFunction)(async () => {
            const pendingActiviesChildren = await (0, helper_js_1.waitForElementsWithTextContent)('MediaQueryList');
            return pendingActiviesChildren.length === 2;
        });
    });
    (0, mocha_extensions_js_1.it)('Shows the correct number of divs for a detached DOM tree correctly', async () => {
        await (0, helper_js_1.goToResource)('memory/detached-dom-tree.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        await (0, memory_helpers_js_1.setSearchFilter)('Detached HTMLDivElement');
        await (0, memory_helpers_js_1.waitForSearchResultNumber)(3);
    });
    (0, mocha_extensions_js_1.it)('Shows the correct output for an attached iframe', async () => {
        await (0, helper_js_1.goToResource)('memory/attached-iframe.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        await (0, memory_helpers_js_1.setSearchFilter)('Retainer');
        await (0, memory_helpers_js_1.waitForSearchResultNumber)(8);
        await (0, memory_helpers_js_1.findSearchResult)(async (p) => {
            const el = await p.$(':scope > td > div > .object-value-object');
            return el !== null && await el.evaluate(el => el.textContent === 'Retainer');
        });
        // The following line checks two things: That the property 'aUniqueName'
        // in the iframe is retaining the Retainer class object, and that the
        // iframe window is not detached.
        await (0, memory_helpers_js_1.waitUntilRetainerChainSatisfies)(retainerChain => retainerChain.some(({ propertyName, retainerClassName }) => propertyName === 'aUniqueName' && retainerClassName === 'Window'));
    });
    (0, mocha_extensions_js_1.it)('Correctly shows multiple retainer paths for an object', async () => {
        await (0, helper_js_1.goToResource)('memory/multiple-retainers.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        await (0, memory_helpers_js_1.setSearchFilter)('leaking');
        await (0, memory_helpers_js_1.waitForSearchResultNumber)(4);
        await (0, memory_helpers_js_1.findSearchResult)(async (p) => {
            const el = await p.$(':scope > td > div > .object-value-string');
            return el !== null && await el.evaluate(el => el.textContent === '"leaking"');
        });
        await (0, helper_js_1.waitForFunction)(async () => {
            // Wait for all the rows of the data-grid to load.
            const retainerGridElements = await (0, memory_helpers_js_1.getDataGridRows)('.retaining-paths-view table.data');
            return retainerGridElements.length === 9;
        });
        const sharedInLeakingElementRow = await (0, helper_js_1.waitForFunction)(async () => {
            const results = await (0, memory_helpers_js_1.getDataGridRows)('.retaining-paths-view table.data');
            const findPromises = await Promise.all(results.map(async (e) => {
                const textContent = await e.evaluate(el => el.textContent);
                // Can't search for "shared in leaking()" because the different parts are spaced with CSS.
                return textContent && textContent.startsWith('sharedinleaking()') ? e : null;
            }));
            return findPromises.find(result => result !== null);
        });
        if (!sharedInLeakingElementRow) {
            chai_1.assert.fail('Could not find data-grid row with "shared in leaking()" text.');
        }
        const textOfEl = await sharedInLeakingElementRow.evaluate(e => e.textContent || '');
        // Double check we got the right element to avoid a confusing text failure
        // later down the line.
        chai_1.assert.isTrue(textOfEl.startsWith('sharedinleaking()'));
        // Have to click it not in the middle as the middle can hold the link to the
        // file in the sources pane and we want to avoid clicking that.
        await (0, helper_js_1.click)(sharedInLeakingElementRow, { maxPixelsFromLeft: 10 });
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        // Expand the data-grid for the shared list
        await frontend.keyboard.press('ArrowRight');
        // check that we found two V8EventListener objects
        await (0, helper_js_1.waitForFunction)(async () => {
            const pendingActiviesChildren = await (0, helper_js_1.waitForElementsWithTextContent)('V8EventListener');
            return pendingActiviesChildren.length === 2;
        });
        // Now we want to get the two rows below the "shared in leaking()" row and assert on them.
        // Unfortunately they are not structured in the data-grid as children, despite being children in the UI
        // So the best way to get at them is to grab the two subsequent siblings of the "shared in leaking()" row.
        const nextRow = await sharedInLeakingElementRow.evaluateHandle(e => e.nextSibling);
        if (!nextRow) {
            chai_1.assert.fail('Could not find row below "shared in leaking()" row');
        }
        const nextNextRow = await nextRow.evaluateHandle(e => e.nextSibling);
        if (!nextNextRow) {
            chai_1.assert.fail('Could not find 2nd row below "shared in leaking()" row');
        }
        const childText = await Promise.all([nextRow, nextNextRow].map(async (row) => await row.evaluate(r => r.innerText)));
        chai_1.assert.isTrue(childText[0].includes('inV8EventListener'));
        chai_1.assert.isTrue(childText[1].includes('inEventListener'));
    });
    // Flaky test causing build failures
    mocha_extensions_js_1.it.skip('[crbug.com/1239550] Shows the correct output for a detached iframe', async () => {
        await (0, helper_js_1.goToResource)('memory/detached-iframe.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        await (0, memory_helpers_js_1.setSearchFilter)('Leak');
        await (0, memory_helpers_js_1.waitForSearchResultNumber)(8);
        await (0, memory_helpers_js_1.waitUntilRetainerChainSatisfies)(retainerChain => retainerChain.some(({ retainerClassName }) => retainerClassName === 'Detached Window'));
    });
    (0, mocha_extensions_js_1.it)('Shows the a tooltip', async () => {
        await (0, helper_js_1.goToResource)('memory/detached-dom-tree.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        await (0, memory_helpers_js_1.takeHeapSnapshot)();
        await (0, memory_helpers_js_1.waitForNonEmptyHeapSnapshotData)();
        await (0, memory_helpers_js_1.setSearchFilter)('Detached HTMLDivElement');
        await (0, memory_helpers_js_1.waitForSearchResultNumber)(3);
        await (0, memory_helpers_js_1.waitUntilRetainerChainSatisfies)(retainerChain => {
            return retainerChain.length > 0 && retainerChain[0].propertyName === 'retaining_wrapper';
        });
        const rows = await (0, memory_helpers_js_1.getDataGridRows)('.retaining-paths-view table.data');
        const propertyNameElement = await rows[0].$('span.property-name');
        (0, helper_js_1.assertNotNullOrUndefined)(propertyNameElement);
        propertyNameElement.hover();
        const el = await (0, helper_js_1.waitFor)('div.vbox.flex-auto.no-pointer-events');
        await (0, helper_js_1.waitFor)('.source-code', el);
    });
    (0, mocha_extensions_js_1.it)('shows the flamechart for an allocation sample', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('memory/allocations.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        void (0, memory_helpers_js_1.takeAllocationProfile)(frontend);
        void (0, memory_helpers_js_1.changeAllocationSampleViewViaDropdown)('Chart');
        await (0, helper_js_1.waitFor)('canvas.flame-chart-canvas');
    });
    (0, mocha_extensions_js_1.it)('shows allocations for an allocation timeline', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('memory/allocations.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        void (0, memory_helpers_js_1.takeAllocationTimelineProfile)(frontend, { recordStacks: true });
        await (0, memory_helpers_js_1.changeViewViaDropdown)('Allocation');
        const header = await (0, helper_js_1.waitForElementWithTextContent)('Live Count');
        const table = await header.evaluateHandle(node => {
            return node.closest('.data-grid');
        });
        await (0, helper_js_1.waitFor)('.data-grid-data-grid-node', table);
    });
    (0, mocha_extensions_js_1.it)('does not show allocations perspective when stacks not recorded', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.goToResource)('memory/allocations.html');
        await (0, memory_helpers_js_1.navigateToMemoryTab)();
        void (0, memory_helpers_js_1.takeAllocationTimelineProfile)(frontend, { recordStacks: false });
        const dropdown = await (0, helper_js_1.waitFor)('select[aria-label="Perspective"]');
        await (0, helper_js_1.waitForNoElementsWithTextContent)('Allocation', dropdown);
    });
});
//# sourceMappingURL=memory_test.js.map