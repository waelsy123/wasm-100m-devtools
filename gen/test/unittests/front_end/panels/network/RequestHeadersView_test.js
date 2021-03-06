// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Network from '../../../../../front_end/panels/network/network.js';
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
import { createTarget, deinitializeGlobalVars } from '../../helpers/EnvironmentHelpers.js';
import * as Root from '../../../../../front_end/core/root/root.js';
import * as Workspace from '../../../../../front_end/models/workspace/workspace.js';
import * as Persistence from '../../../../../front_end/models/persistence/persistence.js';
import * as Bindings from '../../../../../front_end/models/bindings/bindings.js';
import { assertElement, renderElementIntoDOM } from '../../helpers/DOMHelpers.js';
import { describeWithMockConnection } from '../../helpers/MockConnection.js';
import { createUISourceCode } from '../../helpers/UISourceCodeHelpers.js';
const { assert } = chai;
function setUpEnvironment() {
    createTarget();
    const workspace = Workspace.Workspace.WorkspaceImpl.instance();
    const targetManager = SDK.TargetManager.TargetManager.instance();
    const debuggerWorkspaceBinding = Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance({ forceNew: true, targetManager, workspace });
    const breakpointManager = Bindings.BreakpointManager.BreakpointManager.instance({ forceNew: true, targetManager, workspace, debuggerWorkspaceBinding });
    Persistence.Persistence.PersistenceImpl.instance({ forceNew: true, workspace, breakpointManager });
    Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance({ forceNew: true, workspace });
}
function renderHeadersView(request) {
    const component = new Network.RequestHeadersView.RequestHeadersView(request);
    const div = document.createElement('div');
    renderElementIntoDOM(div);
    component.markAsRoot();
    component.show(div);
    return component;
}
describeWithMockConnection('RequestHeadersView', () => {
    beforeEach(async () => {
        Root.Runtime.experiments.register(Root.Runtime.ExperimentName.HEADER_OVERRIDES, '');
        Root.Runtime.experiments.enableForTest(Root.Runtime.ExperimentName.HEADER_OVERRIDES);
    });
    afterEach(async () => {
        await deinitializeGlobalVars();
    });
    it('does not render a link to \'.headers\' if that file does not exist', async () => {
        setUpEnvironment();
        const request = SDK.NetworkRequest.NetworkRequest.create('requestId', 'https://www.example.com/foo.html', '', null, null, null);
        request.responseHeaders = [{ name: 'server', value: 'DevTools Test Server' }];
        const component = renderHeadersView(request);
        const headersTitle = component.responseHeadersCategory.treeOutline?.contentElement.querySelector('.headers-title') || null;
        assertElement(headersTitle, HTMLElement);
        const button = headersTitle.querySelector('button.headers-link');
        assert.isNull(button);
        component.detach();
    });
    it('renders a link to \'.headers\'', async () => {
        setUpEnvironment();
        const { project } = createUISourceCode({
            url: 'file:///path/to/overrides/www.example.com/.headers',
            mimeType: 'text/plain',
        });
        // @ts-ignore
        project.fileSystemPath = () => 'file:///path/to/overrides';
        // @ts-ignore
        project.fileSystemBaseURL = 'file:///path/to/overrides';
        await Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance().setProject(project);
        const request = SDK.NetworkRequest.NetworkRequest.create('requestId', 'https://www.example.com/foo.html', '', null, null, null);
        request.responseHeaders = [{ name: 'server', value: 'DevTools Test Server' }];
        const component = renderHeadersView(request);
        const headersTitle = component.responseHeadersCategory.treeOutline?.contentElement.querySelector('.headers-title') || null;
        assertElement(headersTitle, HTMLElement);
        const button = headersTitle.querySelector('button.headers-link');
        assertElement(button, HTMLButtonElement);
        assert.strictEqual(button.textContent, 'Header overrides');
        component.detach();
    });
    it('renders without error when no overrides folder specified (i.e. there is no project)', async () => {
        createTarget();
        const workspace = Workspace.Workspace.WorkspaceImpl.instance();
        const targetManager = SDK.TargetManager.TargetManager.instance();
        const debuggerWorkspaceBinding = Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance({ forceNew: true, targetManager, workspace });
        const breakpointManager = Bindings.BreakpointManager.BreakpointManager.instance({ forceNew: true, targetManager, workspace, debuggerWorkspaceBinding });
        Persistence.Persistence.PersistenceImpl.instance({ forceNew: true, workspace, breakpointManager });
        Persistence.NetworkPersistenceManager.NetworkPersistenceManager.instance({ forceNew: true, workspace });
        const request = SDK.NetworkRequest.NetworkRequest.create('requestId', 'https://www.example.com/foo.html', '', null, null, null);
        request.responseHeaders = [{ name: 'server', value: 'DevTools Test Server' }];
        const component = renderHeadersView(request);
        const headersTitle = component.responseHeadersCategory.treeOutline?.contentElement.querySelector('.headers-title') || null;
        assertElement(headersTitle, HTMLElement);
        const button = headersTitle.querySelector('button.headers-link');
        assert.isNull(button);
        component.detach();
    });
});
//# sourceMappingURL=RequestHeadersView_test.js.map