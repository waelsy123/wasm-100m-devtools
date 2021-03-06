// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
import * as Workspace from '../../../../../front_end/models/workspace/workspace.js';
import * as Bindings from '../../../../../front_end/models/bindings/bindings.js';
import { describeWithRealConnection } from '../../helpers/RealConnection.js';
import { createUISourceCode } from '../../helpers/UISourceCodeHelpers.js';
import { assertNotNullOrUndefined } from '../../../../../front_end/core/platform/platform.js';
describeWithRealConnection('BreakpointManager', () => {
    it('allows awaiting on scheduled update in debugger', async () => {
        const breakpointManager = Bindings.BreakpointManager.BreakpointManager.instance();
        assertNotNullOrUndefined(breakpointManager);
        const URL = 'file:///tmp/example.html';
        const SCRIPT_ID = 'SCRIPT_ID';
        const BREAKPOINT_ID = 'BREAKPOINT_ID';
        const { uiSourceCode, project } = createUISourceCode({ url: URL, mimeType: 'text/javascript' });
        const targetManager = SDK.TargetManager.TargetManager.instance();
        const target = targetManager.mainTarget();
        assertNotNullOrUndefined(target);
        class TestDebuggerModel extends SDK.DebuggerModel.DebuggerModel {
            constructor(target) {
                super(target);
            }
            async setBreakpointByURL(_url, _lineNumber, _columnNumber, _condition) {
                return Promise.resolve({ breakpointId: BREAKPOINT_ID, locations: [new SDK.DebuggerModel.Location(debuggerModel, SCRIPT_ID, 42)] });
            }
            scriptForId(scriptId) {
                if (scriptId === SCRIPT_ID) {
                    return new SDK.Script.Script(this, scriptId, URL, 0, 0, 0, 0, 0, '', false, false, undefined, false, 0, null, null, null, null, null, null);
                }
                return null;
            }
        }
        const debuggerModel = new TestDebuggerModel(target);
        const breakpoint = await breakpointManager.setBreakpoint(uiSourceCode, 42, 0, '', true);
        const modelBreakpoint = new Bindings.BreakpointManager.ModelBreakpoint(debuggerModel, breakpoint, breakpointManager.debuggerWorkspaceBinding);
        const mapping = {
            rawLocationToUILocation: (_) => null,
            uiLocationToRawLocations: (_uiSourceCode, _lineNumber, _columnNumber) => [new SDK.DebuggerModel.Location(debuggerModel, SCRIPT_ID, 13)],
        };
        Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().addSourceMapping(mapping);
        assert.isNull(breakpoint.currentState);
        const update = modelBreakpoint.scheduleUpdateInDebugger();
        assert.isNull(breakpoint.currentState);
        await update;
        assert.strictEqual(breakpoint.currentState?.positions[0]?.lineNumber, 13);
        Bindings.DebuggerWorkspaceBinding.DebuggerWorkspaceBinding.instance().removeSourceMapping(mapping);
        breakpointManager.removeBreakpoint(breakpoint, true);
        Workspace.Workspace.WorkspaceImpl.instance().removeProject(project);
    });
});
//# sourceMappingURL=BreakpointManager_test.js.map