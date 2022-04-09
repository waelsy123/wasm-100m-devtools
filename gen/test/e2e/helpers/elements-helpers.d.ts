import type * as puppeteer from 'puppeteer';
export declare const INACTIVE_GRID_ADORNER_SELECTOR = "[aria-label=\"Enable grid mode\"]";
export declare const ACTIVE_GRID_ADORNER_SELECTOR = "[aria-label=\"Disable grid mode\"]";
export declare const openLayoutPane: () => Promise<void>;
export declare const waitForAdorners: (expectedAdorners: {
    textContent: string;
    isActive: boolean;
}[]) => Promise<void>;
export declare const waitForAdornerOnSelectedNode: (expectedAdornerText: string) => Promise<void>;
export declare const toggleElementCheckboxInLayoutPane: () => Promise<void>;
export declare const getGridsInLayoutPane: () => Promise<puppeteer.ElementHandle<Element>[]>;
export declare const waitForSomeGridsInLayoutPane: (minimumGridCount: number) => Promise<void>;
export declare const waitForContentOfSelectedElementsNode: (expectedTextContent: string) => Promise<void>;
export declare const waitForPartialContentOfSelectedElementsNode: (expectedPartialTextContent: string) => Promise<void>;
/**
 * Gets the text content of the currently selected element.
 */
export declare const getContentOfSelectedNode: () => Promise<string>;
export declare const waitForSelectedNodeChange: (initialValue: string, maxTotalTimeout?: number) => Promise<string>;
export declare const assertSelectedElementsNodeTextIncludes: (expectedTextContent: string) => Promise<void>;
export declare const waitForSelectedTreeElementSelectorWithTextcontent: (expectedTextContent: string) => Promise<void>;
export declare const waitForSelectedTreeElementSelectorWhichIncludesText: (expectedTextContent: string) => Promise<void>;
export declare const waitForChildrenOfSelectedElementNode: () => Promise<void>;
export declare const clickNthChildOfSelectedElementNode: (childIndex: number) => Promise<void>;
export declare const focusElementsTree: () => Promise<void>;
export declare const navigateToSidePane: (paneName: string) => Promise<void>;
export declare const waitForElementsStyleSection: () => Promise<void>;
export declare const waitForElementsComputedSection: () => Promise<void>;
export declare const getContentOfComputedPane: () => Promise<string>;
export declare const waitForComputedPaneChange: (initialValue: string) => Promise<void>;
export declare const getAllPropertiesFromComputedPane: () => Promise<({
    name: string;
    value: string;
} | null)[]>;
export declare const getPropertyFromComputedPane: (name: string) => Promise<puppeteer.ElementHandle<Element> | undefined>;
export declare const waitForPropertyValueInComputedPane: (name: string, value: string) => Promise<void>;
export declare const expandSelectedNodeRecursively: () => Promise<void>;
export declare const forcePseudoState: (pseudoState: string) => Promise<void>;
export declare const removePseudoState: (pseudoState: string) => Promise<void>;
export declare const getComputedStylesForDomNode: (elementSelector: string, styleAttribute: string) => Promise<string>;
export declare const toggleShowAllComputedProperties: () => Promise<void>;
export declare const toggleGroupComputedProperties: () => Promise<void>;
export declare const waitForDomNodeToBeVisible: (elementSelector: string) => Promise<void>;
export declare const waitForDomNodeToBeHidden: (elementSelector: string) => Promise<void>;
export declare const assertGutterDecorationForDomNodeExists: () => Promise<void>;
export declare const getStyleRuleSelector: (selector: string) => string;
export declare const waitForStyleRule: (expectedSelector: string) => Promise<void>;
export declare const getDisplayedStyleRules: () => Promise<{
    selectorText: string;
    propertyNames: (string | null)[];
}[]>;
export declare const getDisplayedCSSPropertyNames: (propertiesSection: puppeteer.ElementHandle<Element>) => Promise<(string | null)[]>;
export declare const getStyleRule: (selector: string) => Promise<puppeteer.ElementHandle<Element>>;
export declare const getStyleRuleWithSourcePosition: (styleSelector: string, sourcePosition?: string | undefined) => Promise<puppeteer.ElementHandle<Element>>;
export declare const getColorSwatch: (parent: puppeteer.ElementHandle<Element>, index: number) => Promise<puppeteer.ElementHandle<Element>>;
export declare const getColorSwatchColor: (parent: puppeteer.ElementHandle<Element>, index: number) => Promise<string>;
export declare const shiftClickColorSwatch: (ruleSection: puppeteer.ElementHandle<Element>, index: number) => Promise<void>;
export declare const getElementStyleFontEditorButton: () => Promise<puppeteer.ElementHandle<Element> | null>;
export declare const getFontEditorButtons: () => Promise<puppeteer.ElementHandle<Element>[]>;
export declare const getHiddenFontEditorButtons: () => Promise<puppeteer.ElementHandle<Element>[]>;
export declare const getStyleSectionSubtitles: () => Promise<(string | null)[]>;
export declare const getCSSPropertyInRule: (ruleSection: puppeteer.ElementHandle<Element> | string, name: string, sourcePosition?: string | undefined) => Promise<puppeteer.ElementHandle<Element> | undefined>;
export declare const focusCSSPropertyValue: (selector: string, propertyName: string) => Promise<void>;
/**
 * Edit a CSS property value in a given rule
 * @param selector The selector of the rule to be updated. Note that because of the way the Styles populates, it is
 * important to provide a rule selector that is unique here, to avoid editing a property in the wrong rule.
 * @param propertyName The name of the property to be found and edited. If several properties have the same names, the
 * first one is edited.
 * @param newValue The new value to be used.
 */
export declare function editCSSProperty(selector: string, propertyName: string, newValue: string): Promise<void>;
export declare function editQueryRuleText(queryStylesSections: puppeteer.ElementHandle<Element>, newQueryText: string): Promise<void>;
export declare function waitForCSSPropertyValue(selector: string, name: string, value: string, sourcePosition?: string): Promise<puppeteer.ElementHandle<Element>>;
export declare function waitForPropertyToHighlight(ruleSelector: string, propertyName: string): Promise<void>;
export declare const getBreadcrumbsTextContent: ({ expectedNodeCount }: {
    expectedNodeCount: number;
}) => Promise<string[]>;
export declare const getSelectedBreadcrumbTextContent: () => Promise<string>;
export declare const navigateToElementsTab: () => Promise<void>;
export declare const clickOnFirstLinkInStylesPanel: () => Promise<void>;
export declare const toggleClassesPane: () => Promise<void>;
export declare const typeInClassesPaneInput: (text: string, commitWith?: puppeteer.KeyInput, waitForNodeChange?: Boolean) => Promise<void>;
export declare const toggleClassesPaneCheckbox: (checkboxLabel: string) => Promise<void>;
export declare const assertSelectedNodeClasses: (expectedClasses: string[]) => Promise<void>;
export declare const toggleAccessibilityPane: () => Promise<void>;
export declare const toggleAccessibilityTree: () => Promise<void>;
