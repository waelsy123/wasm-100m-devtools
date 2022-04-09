// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Common from '../../../../front_end/core/common/common.js';
import * as TextUtils from '../../../../front_end/models/text_utils/text_utils.js';
import * as Bindings from '../../../../front_end/models/bindings/bindings.js';
import * as Workspace from '../../../../front_end/models/workspace/workspace.js';
export function createUISourceCode(options) {
    const workspace = Workspace.Workspace.WorkspaceImpl.instance();
    const project = new Bindings.ContentProviderBasedProject.ContentProviderBasedProject(workspace, options.projectId || 'PROJECT_ID', Workspace.Workspace.projectTypes.Formatter, 'Test project', false /* isServiceProject*/);
    const resourceType = Common.ResourceType.ResourceType.fromMimeType(options.mimeType);
    const uiSourceCode = project.createUISourceCode(options.url, resourceType || Workspace.Workspace.projectTypes.FileSystem);
    const contentProvider = TextUtils.StaticContentProvider.StaticContentProvider.fromString(options.url, resourceType, options.content || '');
    project.addUISourceCodeWithProvider(uiSourceCode, contentProvider, null /* metadata*/, options.mimeType);
    return { uiSourceCode, project };
}
//# sourceMappingURL=UISourceCodeHelpers.js.map