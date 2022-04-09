"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const PROPERTIES_TO_DELETE_SELECTOR = '#properties-to-delete';
const PROPERTIES_TO_INSPECT_SELECTOR = '#properties-to-inspect';
const KEYFRAMES_100_PERCENT_RULE_SELECTOR = '100%';
const FIRST_PROPERTY_NAME_SELECTOR = '.tree-outline li:nth-of-type(1) > .webkit-css-property';
const SECOND_PROPERTY_NAME_SELECTOR = '.tree-outline li:nth-of-type(2) > .webkit-css-property';
const FIRST_PROPERTY_VALUE_SELECTOR = '.tree-outline li:nth-of-type(1) > .value';
const RULE1_SELECTOR = '.rule1';
const RULE2_SELECTOR = '.rule2';
const LAYER_SEPARATOR_SELECTOR = '.layer-separator';
const SIDEBAR_SEPARATOR_SELECTOR = '.sidebar-separator';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deletePropertyByBackspace = async (selector, root) => {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.click)(selector, { root });
    await frontend.keyboard.press('Backspace');
    await frontend.keyboard.press('Tab');
    await (0, helper_js_1.waitFor)('.tree-outline .child-editing', root);
};
const goToResourceAndWaitForStyleSection = async (path) => {
    await (0, helper_js_1.goToResource)(path);
    await (0, elements_helpers_js_1.waitForElementsStyleSection)();
    // Check to make sure we have the correct node selected after opening a file.
    await (0, elements_helpers_js_1.waitForPartialContentOfSelectedElementsNode)('<body>\u200B');
    // FIXME(crbug/1112692): Refactor test to remove the timeout.
    await (0, helper_js_1.timeout)(50);
};
(0, mocha_extensions_js_1.describe)('The Styles pane', async () => {
    (0, mocha_extensions_js_1.it)('can display the CSS properties of the selected element', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/simple-styled-page.html');
        // Select the H1 element by pressing down, since <body> is the default selected element.
        const onH1RuleAppeared = (0, elements_helpers_js_1.waitForStyleRule)('h1');
        await frontend.keyboard.press('ArrowDown');
        await onH1RuleAppeared;
        const h1Rules = await (0, elements_helpers_js_1.getDisplayedStyleRules)();
        // Checking the first h1 rule, that's the authored rule, right after the element style.
        chai_1.assert.deepEqual(h1Rules[1], { selectorText: 'body h1', propertyNames: ['color'] }, 'The correct rule is displayed');
        // Select the H2 element by pressing down.
        const onH2RuleAppeared = (0, elements_helpers_js_1.waitForStyleRule)('h2');
        await frontend.keyboard.press('ArrowDown');
        await onH2RuleAppeared;
        const h2Rules = await (0, elements_helpers_js_1.getDisplayedStyleRules)();
        // Checking the first h2 rule, that's the authored rule, right after the element style.
        chai_1.assert.deepEqual(h2Rules[1], { selectorText: 'h2', propertyNames: ['background-color', 'color'] }, 'The correct rule is displayed');
    });
    (0, mocha_extensions_js_1.it)('can jump to a CSS variable definition', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-variables.html');
        // Select div that we will inspect the CSS variables for
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"properties-to-inspect">\u200B</div>\u200B');
        const testElementRule = await (0, elements_helpers_js_1.getStyleRule)(PROPERTIES_TO_INSPECT_SELECTOR);
        await (0, helper_js_1.click)(FIRST_PROPERTY_VALUE_SELECTOR, { root: testElementRule });
        await (0, elements_helpers_js_1.waitForPropertyToHighlight)('html', '--title-color');
    });
    (0, mocha_extensions_js_1.it)('can jump to an unexpanded CSS variable definition', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-variables-many.html');
        // Select div that we will inspect the CSS variables for
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"properties-to-inspect">\u200B</div>\u200B');
        const testElementRule = await (0, elements_helpers_js_1.getStyleRule)(PROPERTIES_TO_INSPECT_SELECTOR);
        await (0, helper_js_1.click)(FIRST_PROPERTY_VALUE_SELECTOR, { root: testElementRule });
        await (0, elements_helpers_js_1.waitForPropertyToHighlight)('html', '--color56');
    });
    (0, mocha_extensions_js_1.it)('displays the correct value when editing CSS var() functions', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-variables.html');
        // Select div that we will inspect the CSS variables for
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"properties-to-inspect">\u200B</div>\u200B');
        const propertiesSection = await (0, elements_helpers_js_1.getStyleRule)(PROPERTIES_TO_INSPECT_SELECTOR);
        const propertyValue = await (0, helper_js_1.waitFor)(FIRST_PROPERTY_VALUE_SELECTOR, propertiesSection);
        // Specifying 10px from the left of the value to click on the word var rather than in the middle which would jump to
        // the property definition.
        await (0, helper_js_1.click)(propertyValue, { maxPixelsFromLeft: 10 });
        const editedValueText = await propertyValue.evaluate(node => node.textContent);
        chai_1.assert.strictEqual(editedValueText, 'var(--title-color)', 'The value is incorrect when being edited');
    });
    (0, mocha_extensions_js_1.it)('generates links inside var() functions for defined properties', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-variables.html');
        // Select div that we will inspect the CSS variables for
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"properties-to-inspect">\u200B</div>\u200B');
        const propertiesSection = await (0, elements_helpers_js_1.getStyleRule)(PROPERTIES_TO_INSPECT_SELECTOR);
        const propertyValue = await (0, helper_js_1.waitFor)(FIRST_PROPERTY_VALUE_SELECTOR, propertiesSection);
        const link = await (0, helper_js_1.$$)('.css-var-link', propertyValue);
        chai_1.assert.strictEqual(link.length, 1, 'The expected var link was not created');
    });
    (0, mocha_extensions_js_1.it)('renders computed CSS variables in @keyframes rules', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-variables.html');
        // Select div that we will inspect the CSS variables for
        await frontend.keyboard.press('ArrowRight');
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"keyframes-rule">\u200B</div>\u200B');
        const propertiesSection = await (0, elements_helpers_js_1.getStyleRule)(KEYFRAMES_100_PERCENT_RULE_SELECTOR);
        const propertyValue = await (0, helper_js_1.waitFor)(FIRST_PROPERTY_VALUE_SELECTOR, propertiesSection);
        const propertyValueText = await propertyValue.evaluate(node => node.textContent);
        chai_1.assert.strictEqual(propertyValueText, 'var( --move-final-width)', 'CSS variable in @keyframes rule is not correctly rendered');
    });
    (0, mocha_extensions_js_1.it)('can remove a CSS property when its name or value is deleted', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/style-pane-properties.html');
        // Select div that we will remove the CSS properties from
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"properties-to-delete">\u200B</div>\u200B');
        const propertiesSection = await (0, elements_helpers_js_1.getStyleRule)(PROPERTIES_TO_DELETE_SELECTOR);
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(propertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'height',
                'width',
            ], 'incorrectly displayed style after initialization');
        }
        // select second property's name and delete
        await deletePropertyByBackspace(SECOND_PROPERTY_NAME_SELECTOR, propertiesSection);
        // verify the second CSS property entry has been removed
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(propertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'height',
            ], 'incorrectly displayed style after removing second property\'s value');
        }
        // select first property's name and delete
        await deletePropertyByBackspace(FIRST_PROPERTY_NAME_SELECTOR, propertiesSection);
        // verify the first CSS property entry has been removed
        {
            const displayedValues = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(propertiesSection);
            chai_1.assert.deepEqual(displayedValues, [], 'incorrectly displayed style after removing first property\'s name');
        }
    });
    (0, mocha_extensions_js_1.it)('can display the source names for stylesheets', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/stylesheets-with-various-sources.html');
        // Select the div element by pressing down, since <body> is the default selected element.
        const onDivRuleAppeared = (0, elements_helpers_js_1.waitForStyleRule)('div');
        await frontend.keyboard.press('ArrowDown');
        await onDivRuleAppeared;
        const subtitles = await (0, elements_helpers_js_1.getStyleSectionSubtitles)();
        chai_1.assert.deepEqual(subtitles, [
            '',
            'css-module.css:1',
            'constructed stylesheet',
            'stylesheets…ces.html:10',
            'stylesheets…rces.html:7',
            'user agent stylesheet',
        ], 'incorrectly displayed style sources');
        const divRules = await (0, elements_helpers_js_1.getDisplayedStyleRules)();
        chai_1.assert.deepEqual(divRules, [
            { selectorText: 'element.style', propertyNames: [] },
            { selectorText: '#properties-to-inspect', propertyNames: ['height'] },
            { selectorText: '#properties-to-inspect', propertyNames: ['color'] },
            { selectorText: '#properties-to-inspect', propertyNames: ['text-align'] },
            { selectorText: '#properties-to-inspect', propertyNames: ['width'] },
            { selectorText: 'div', propertyNames: ['display'] },
        ], 'The correct rule is displayed');
    });
    // Flaky on mac after introducing pooled frontend instances.
    mocha_extensions_js_1.it.skipOnPlatforms(['mac'], '[crbug.com/1297458] can edit multiple constructed stylesheets', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/multiple-constructed-stylesheets.html');
        // Select div that we will remove a CSS property from.
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div class=\u200B"rule1 rule2">\u200B</div>\u200B');
        // Verify that initial CSS properties correspond to the ones in the test file.
        const rule1PropertiesSection = await (0, elements_helpers_js_1.getStyleRule)(RULE1_SELECTOR);
        const rule2PropertiesSection = await (0, elements_helpers_js_1.getStyleRule)(RULE2_SELECTOR);
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(rule1PropertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'background-color',
            ], 'incorrectly displayed style after initialization');
        }
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(rule2PropertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'background-color',
                'color',
            ], 'incorrectly displayed style after initialization');
        }
        // Select the first property's name of .rule2 (background-color) and delete.
        await deletePropertyByBackspace(FIRST_PROPERTY_NAME_SELECTOR, rule2PropertiesSection);
        // Verify that .rule1 has background-color.
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(rule1PropertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'background-color',
            ], 'incorrectly displayed style after property removal');
        }
        // Verify that .rule2 has background-color removed and only color remains.
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(rule2PropertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'color',
            ], 'incorrectly displayed style after property removal');
        }
        // Verify that computed styles correspond to the changes made.
        const computedStyles = [
            await (0, elements_helpers_js_1.getComputedStylesForDomNode)(RULE1_SELECTOR, 'color'),
            await (0, elements_helpers_js_1.getComputedStylesForDomNode)(RULE1_SELECTOR, 'background-color'),
        ];
        chai_1.assert.deepEqual(computedStyles, ['rgb(255, 0, 0)', 'rgb(255, 0, 0)'], 'Styles are not correct after the update');
    });
    (0, mocha_extensions_js_1.it)('can display and edit container queries', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-container-queries.html');
        // Select the child that has container queries.
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div class=\u200B"rule1 rule2">\u200B</div>\u200B');
        // Verify that initial CSS properties correspond to the ones in the test file.
        const rule1PropertiesSection = await (0, elements_helpers_js_1.getStyleRule)(RULE1_SELECTOR);
        const rule2PropertiesSection = await (0, elements_helpers_js_1.getStyleRule)(RULE2_SELECTOR);
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(rule1PropertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'width',
            ], 'incorrectly displayed style after initialization');
        }
        {
            const displayedNames = await (0, elements_helpers_js_1.getDisplayedCSSPropertyNames)(rule2PropertiesSection);
            chai_1.assert.deepEqual(displayedNames, [
                'height',
            ], 'incorrectly displayed style after initialization');
        }
        await (0, elements_helpers_js_1.editQueryRuleText)(rule1PropertiesSection, '(min-width: 300px)');
        await (0, elements_helpers_js_1.editQueryRuleText)(rule2PropertiesSection, '(max-width: 300px)');
        // Verify that computed styles correspond to the changes made.
        const computedStyles = [
            await (0, elements_helpers_js_1.getComputedStylesForDomNode)(RULE1_SELECTOR, 'width'),
            await (0, elements_helpers_js_1.getComputedStylesForDomNode)(RULE2_SELECTOR, 'height'),
        ];
        chai_1.assert.deepEqual(computedStyles, ['0px', '10px'], 'Styles are not correct after the update');
    });
    (0, mocha_extensions_js_1.it)('can display container link', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-container-queries.html');
        // Select the child that has container queries.
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div class=\u200B"rule1 rule2">\u200B</div>\u200B');
        const rule1PropertiesSection = await (0, elements_helpers_js_1.getStyleRule)(RULE1_SELECTOR);
        const containerLink = await (0, helper_js_1.waitFor)('.container-link', rule1PropertiesSection);
        const nodeLabelName = await (0, helper_js_1.waitFor)('.node-label-name', containerLink);
        const nodeLabelNameContent = await nodeLabelName.evaluate(node => node.textContent);
        chai_1.assert.strictEqual(nodeLabelNameContent, 'body', 'container link name does not match');
        containerLink.hover();
        const queriedSizeDetails = await (0, helper_js_1.waitFor)('.queried-size-details');
        const queriedSizeDetailsContent = await queriedSizeDetails.evaluate(node => node.innerText);
        chai_1.assert.strictEqual(queriedSizeDetailsContent, '(size) width: 200px height: 0px', 'container queried details does not match');
    });
    (0, mocha_extensions_js_1.it)('can display @supports at-rules', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-supports.html');
        // Select the child that has @supports rules.
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div class=\u200B"rule1">\u200B</div>\u200B');
        const rule1PropertiesSection = await (0, elements_helpers_js_1.getStyleRule)(RULE1_SELECTOR);
        const supportsQuery = await (0, helper_js_1.waitFor)('.query.editable', rule1PropertiesSection);
        const supportsQueryText = await supportsQuery.evaluate(node => node.innerText);
        chai_1.assert.deepEqual(supportsQueryText, '@supports (width: 10px)', 'incorrectly displayed @supports rule');
    });
    (0, mocha_extensions_js_1.it)('can display @layer separators', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-layers.html');
        // Select the child that has @layer rules.
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div class=\u200B"rule1">\u200B</div>\u200B');
        const layerSeparators = await (0, helper_js_1.waitForFunction)(async () => {
            const layers = await (0, helper_js_1.$$)(LAYER_SEPARATOR_SELECTOR);
            return layers.length === 6 ? layers : null;
        });
        (0, helper_js_1.assertNotNullOrUndefined)(layerSeparators);
        const layerText = await Promise.all(layerSeparators.map(element => element.evaluate(node => node.textContent)));
        chai_1.assert.deepEqual(layerText, [
            'Layer<anonymous>',
            'Layerimportant',
            'Layeroverrule',
            'Layeroverrule.<anonymous>',
            'Layerbase',
            'Layer\xa0user\xa0agent\xa0stylesheet',
        ]);
    });
    (0, mocha_extensions_js_1.it)('can click @layer separators to open layer tree', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/css-layers.html');
        // Select the child that has @layer rules.
        await frontend.keyboard.press('ArrowDown');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div class=\u200B"rule1">\u200B</div>\u200B');
        const overruleButton = await (0, helper_js_1.waitFor)('overrule[role="button"]', undefined, undefined, 'aria');
        await (0, helper_js_1.click)(overruleButton);
        const treeElement = await (0, helper_js_1.waitFor)('[data-node-key="2: overrule"]');
        (0, helper_js_1.assertNotNullOrUndefined)(treeElement);
    });
    (0, mocha_extensions_js_1.it)('can display inherited CSS highlight pseudo styles', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await goToResourceAndWaitForStyleSection('elements/highlight-pseudo-inheritance.html');
        const onH1RuleAppeared = (0, elements_helpers_js_1.waitForStyleRule)('h1');
        // Select the h1 for which we will inspect the pseudo styles
        await frontend.keyboard.press('ArrowRight');
        await onH1RuleAppeared;
        const h1Rules = await (0, elements_helpers_js_1.getDisplayedStyleRules)();
        // The 6 rule blocks for the h1 are:
        // 1. Inline styles from the style attribute
        // 2. The h1's user agent styles
        // 3. The h1's own highlight pseudo
        // 4. The h1's inherited highlight pseudo
        // 5. The h1's own selection pseudo
        // 6. The h1's inherited selection pseudo
        // And there is no 6th block for the ::first-letter style, since only
        // highlight pseudos are inherited.
        chai_1.assert.strictEqual(h1Rules.length, 6, 'The h1 should have 6 style rule blocks');
        chai_1.assert.deepEqual(h1Rules[2], { selectorText: 'h1::highlight(foo)', propertyNames: ['background-color'] }, 'The h1\'s own highlight pseudo is displayed');
        chai_1.assert.deepEqual(h1Rules[3], { selectorText: 'body::highlight(bar)', propertyNames: ['color'] }, 'The h1\'s inherited highlight pseudo is displayed');
        chai_1.assert.deepEqual(h1Rules[4], { selectorText: 'h1::selection', propertyNames: ['background-color'] }, 'The h1\'s own selection pseudo is displayed');
        chai_1.assert.deepEqual(h1Rules[5], { selectorText: 'body::selection', propertyNames: ['text-shadow'] }, 'The h1\'s inherited selection pseudo is displayed');
        const sidebarSeparators = await (0, helper_js_1.waitForFunction)(async () => {
            const separators = await (0, helper_js_1.$$)(SIDEBAR_SEPARATOR_SELECTOR);
            return separators.length === 4 ? separators : null;
        });
        (0, helper_js_1.assertNotNullOrUndefined)(sidebarSeparators);
        const layerText = await Promise.all(sidebarSeparators.map(element => element.evaluate(node => node.textContent)));
        chai_1.assert.deepEqual(layerText, [
            'Pseudo ::highlight element',
            'Inherited from ::highlight pseudo of ',
            'Pseudo ::selection element',
            'Inherited from ::selection pseudo of ',
        ]);
    });
});
//# sourceMappingURL=style-pane-properties_test.js.map