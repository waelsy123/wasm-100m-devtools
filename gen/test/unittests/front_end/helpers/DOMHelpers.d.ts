interface RenderOptions {
    allowMultipleChildren?: boolean;
}
/**
 * Renders a given element into the DOM. By default it will error if it finds an element already rendered but this can be controlled via the options.
 **/
export declare const renderElementIntoDOM: (element: HTMLElement, renderOptions?: RenderOptions) => HTMLElement | undefined;
/**
 * Completely cleans out the test DOM to ensure it's empty for the next test run.
 * This is run automatically between tests - you should not be manually calling this yourself.
 **/
export declare const resetTestDOM: () => void;
/**
 * An easy way to assert the component's shadowRoot exists so you're able to assert on its contents.
 */
export declare function assertShadowRoot(shadowRoot: ShadowRoot | null): asserts shadowRoot is ShadowRoot;
declare type Constructor<T> = {
    new (...args: unknown[]): T;
};
/**
 * Asserts that `element` is of type `T`.
 */
export declare function assertElement<T extends Element>(element: Element | null, elementClass: Constructor<T>): asserts element is T;
/**
 * Asserts that all emenents of `nodeList` are at least of type `T`.
 */
export declare function assertElements<T extends Element>(nodeList: NodeListOf<Element>, elementClass: Constructor<T>): asserts nodeList is NodeListOf<T>;
export declare function getElementWithinComponent<T extends HTMLElement, V extends Element>(component: T, selector: string, elementClass: Constructor<V>): V;
export declare function getElementsWithinComponent<T extends HTMLElement, V extends Element>(component: T, selector: string, elementClass: Constructor<V>): NodeListOf<V>;
export declare function waitForScrollLeft<T extends Element>(element: T, desiredScrollLeft: number): Promise<void>;
/**
 * Dispatches a mouse click event.
 */
export declare function dispatchClickEvent<T extends Element>(element: T, options?: MouseEventInit): void;
export declare function dispatchFocusEvent<T extends Element>(element: T, options?: FocusEventInit): void;
export declare function dispatchFocusOutEvent<T extends Element>(element: T, options?: FocusEventInit): void;
/**
 * Dispatches a keydown event. Errors if the event was not dispatched successfully.
 */
export declare function dispatchKeyDownEvent<T extends Element>(element: T, options?: KeyboardEventInit): void;
/**
 * Dispatches a mouse over event.
 */
export declare function dispatchMouseOverEvent<T extends Element>(element: T, options?: MouseEventInit): void;
/**
 * Dispatches a mouse out event.
 */
export declare function dispatchMouseOutEvent<T extends Element>(element: T, options?: MouseEventInit): void;
/**
 * Dispatches a mouse move event.
 */
export declare function dispatchMouseMoveEvent<T extends Element>(element: T, options?: MouseEventInit): void;
/**
 * Dispatches a mouse leave event.
 */
export declare function dispatchMouseLeaveEvent<T extends Element>(element: T, options?: MouseEventInit): void;
/**
 * Listens to an event of an element and returns a Promise that resolves to the
 * specified event type.
 */
export declare function getEventPromise<T extends Event>(element: HTMLElement, eventName: string): Promise<T>;
export declare function doubleRaf(): Promise<unknown>;
export declare function raf(): Promise<unknown>;
/**
  * It's useful to use innerHTML in the tests to have full confidence in the
  * renderer output, but LitHtml uses comment nodes to split dynamic from
  * static parts of a template, and we don't want our tests full of noise
  * from those.
  */
export declare function stripLitHtmlCommentNodes(text: string): string;
/**
 * Returns an array of textContents.
 * Multiple consecutive newLine and space characters are removed.
 */
export declare function getCleanTextContentFromElements(shadowRoot: ShadowRoot, selector: string): string[];
export {};
