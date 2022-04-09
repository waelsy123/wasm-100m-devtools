import '../../../../../front_end/core/dom_extension/dom_extension.js';
declare global {
    interface HTMLElement {
        traverseNextNode(node: HTMLElement): HTMLElement;
        createChild(tagName: string, className?: string, content?: string): HTMLElement;
    }
}
