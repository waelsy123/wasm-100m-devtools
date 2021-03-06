import * as SDK from '../../core/sdk/sdk.js';
import * as Adorners from '../../ui/components/adorners/adorners.js';
import * as TextEditor from '../../ui/components/text_editor/text_editor.js';
import * as UI from '../../ui/legacy/legacy.js';
import type { ElementsTreeOutline, UpdateRecord } from './ElementsTreeOutline.js';
export declare class ElementsTreeElement extends UI.TreeOutline.TreeElement {
    nodeInternal: SDK.DOMModel.DOMNode;
    treeOutline: ElementsTreeOutline | null;
    private gutterContainer;
    private readonly decorationsElement;
    private isClosingTagInternal;
    private readonly canAddAttributes;
    private searchQuery;
    private expandedChildrenLimitInternal;
    private readonly decorationsThrottler;
    private inClipboard;
    private hoveredInternal;
    private editing;
    private highlightResult;
    private readonly adornerContainer;
    private adorners;
    private styleAdorners;
    private readonly adornersThrottler;
    private htmlEditElement;
    expandAllButtonElement: UI.TreeOutline.TreeElement | null;
    private searchHighlightsVisible?;
    selectionElement?: HTMLDivElement;
    private hintElement?;
    private contentElement;
    constructor(node: SDK.DOMModel.DOMNode, isClosingTag?: boolean);
    static animateOnDOMUpdate(treeElement: ElementsTreeElement): void;
    static visibleShadowRoots(node: SDK.DOMModel.DOMNode): SDK.DOMModel.DOMNode[];
    static canShowInlineText(node: SDK.DOMModel.DOMNode): boolean;
    static populateForcedPseudoStateItems(contextMenu: UI.ContextMenu.ContextMenu, node: SDK.DOMModel.DOMNode): void;
    isClosingTag(): boolean;
    node(): SDK.DOMModel.DOMNode;
    isEditing(): boolean;
    highlightSearchResults(searchQuery: string): void;
    hideSearchHighlights(): void;
    private hideSearchHighlight;
    setInClipboard(inClipboard: boolean): void;
    get hovered(): boolean;
    set hovered(isHovered: boolean);
    expandedChildrenLimit(): number;
    setExpandedChildrenLimit(expandedChildrenLimit: number): void;
    private createSelection;
    private createHint;
    onbind(): void;
    onunbind(): void;
    onattach(): void;
    onpopulate(): Promise<void>;
    expandRecursively(): Promise<void>;
    onexpand(): void;
    oncollapse(): void;
    select(omitFocus?: boolean, selectedByUser?: boolean): boolean;
    onselect(selectedByUser?: boolean): boolean;
    ondelete(): boolean;
    onenter(): boolean;
    selectOnMouseDown(event: MouseEvent): void;
    ondblclick(event: Event): boolean;
    hasEditableNode(): boolean;
    private insertInLastAttributePosition;
    private startEditingTarget;
    private showContextMenu;
    populateTagContextMenu(contextMenu: UI.ContextMenu.ContextMenu, event: Event): void;
    populateScrollIntoView(contextMenu: UI.ContextMenu.ContextMenu): void;
    populateTextContextMenu(contextMenu: UI.ContextMenu.ContextMenu, textNode: Element): void;
    populateNodeContextMenu(contextMenu: UI.ContextMenu.ContextMenu): void;
    private startEditing;
    private addNewAttribute;
    private triggerEditAttribute;
    private startEditingAttribute;
    private startEditingTextNode;
    private startEditingTagName;
    private updateEditorHandles;
    private startEditingAsHTML;
    private attributeEditingCommitted;
    private tagNameEditingCommitted;
    private textNodeEditingCommitted;
    private editingCancelled;
    private distinctClosingTagElement;
    updateTitle(updateRecord?: UpdateRecord | null, onlySearchQueryChanged?: boolean): void;
    private computeLeftIndent;
    updateDecorations(): void;
    private updateDecorationsInternal;
    private buildAttributeDOM;
    private buildPseudoElementDOM;
    private buildTagDOM;
    private convertWhitespaceToEntities;
    private nodeTitleInfo;
    remove(): void;
    toggleEditAsHTML(callback?: ((arg0: boolean) => void), startEditing?: boolean): void;
    private copyCSSPath;
    private copyJSPath;
    private copyXPath;
    private copyFullXPath;
    copyStyles(): Promise<void>;
    private highlightSearchResultsInternal;
    private editAsHTML;
    adorn({ name }: {
        name: string;
    }): Adorners.Adorner.Adorner;
    removeAdorner(adornerToRemove: Adorners.Adorner.Adorner): void;
    removeAllAdorners(): void;
    private updateAdorners;
    private updateAdornersInternal;
    updateStyleAdorners(): Promise<void>;
    createGridAdorner(): Adorners.Adorner.Adorner | null;
    createScrollSnapAdorner(): Adorners.Adorner.Adorner | null;
    createFlexAdorner(): Adorners.Adorner.Adorner | null;
    createContainerAdorner(): Adorners.Adorner.Adorner | null;
}
export declare const InitialChildrenLimit = 500;
export declare const ForbiddenClosingTagElements: Set<string>;
export declare const EditTagBlocklist: Set<string>;
export declare function adornerComparator(adornerA: Adorners.Adorner.Adorner, adornerB: Adorners.Adorner.Adorner): number;
export interface EditorHandles {
    commit: () => void;
    cancel: () => void;
    editor?: TextEditor.TextEditor.TextEditor;
    resize: () => void;
}
