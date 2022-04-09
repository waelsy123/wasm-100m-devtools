import * as UI from '../../ui/legacy/legacy.js';
import type { LighthouseController } from './LighthouseController.js';
export declare class StartView extends UI.Widget.Widget {
    protected controller: LighthouseController;
    private readonly settingsToolbarInternal;
    protected startButton: HTMLButtonElement;
    private helpText?;
    private warningText?;
    private shouldConfirm?;
    constructor(controller: LighthouseController);
    settingsToolbar(): UI.Toolbar.Toolbar;
    protected populateRuntimeSettingAsRadio(settingName: string, label: string, parentElement: Element): void;
    private populateRuntimeSettingAsToolbarCheckbox;
    private populateFormControls;
    protected render(): void;
    updateStartButton(): void;
    onResize(): void;
    focusStartButton(): void;
    setStartButtonEnabled(isEnabled: boolean): void;
    setUnauditableExplanation(text: string | null): void;
    setWarningText(text: string | null): void;
    wasShown(): void;
}
