import type * as Platform from '../../../../front_end/core/platform/platform.js';
import * as Bindings from '../../../../front_end/models/bindings/bindings.js';
import * as Workspace from '../../../../front_end/models/workspace/workspace.js';
export declare function createUISourceCode(options: {
    url: Platform.DevToolsPath.UrlString;
    content?: string;
    mimeType: string;
    projectType?: Workspace.Workspace.projectTypes;
    projectId?: string;
}): {
    project: Bindings.ContentProviderBasedProject.ContentProviderBasedProject;
    uiSourceCode: Workspace.UISourceCode.UISourceCode;
};
