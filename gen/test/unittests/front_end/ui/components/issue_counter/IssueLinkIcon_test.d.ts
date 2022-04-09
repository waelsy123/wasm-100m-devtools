import * as IconButton from '../../../../../../front_end/ui/components/icon_button/icon_button.js';
export declare const extractElements: (shadowRoot: ShadowRoot) => {
    icon: IconButton.Icon.Icon;
    container: HTMLSpanElement;
};
export declare const extractData: (shadowRoot: ShadowRoot) => {
    iconData: IconButton.Icon.IconData;
    containerClasses: string[];
};
