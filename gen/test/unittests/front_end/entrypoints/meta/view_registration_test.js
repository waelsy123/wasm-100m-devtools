// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as QuickOpen from '../../../../../front_end/ui/legacy/components/quick_open/quick_open.js';
import * as UI from '../../../../../front_end/ui/legacy/legacy.js';
import { describeWithEnvironment } from '../../helpers/EnvironmentHelpers.js';
const { assert } = chai;
class MockView extends UI.Widget.Widget {
    resolveLocation(_location) {
        return UI.ViewManager.ViewManager.instance().createStackLocation();
    }
}
const viewId = 'mockView';
const viewTitle = 'Mock';
const commandPrompt = 'Show Mock';
const order = 10;
describeWithEnvironment('View registration', () => {
    before(() => {
        UI.ViewManager.registerViewExtension({
            location: "panel" /* PANEL */,
            id: viewId,
            commandPrompt: () => commandPrompt,
            title: () => viewTitle,
            order,
            persistence: "permanent" /* PERMANENT */,
            hasToolbar: false,
            async loadView() {
                return new MockView();
            },
        });
        // The location resolver needs to be registered to add the command to show a view
        // from the command menu.
        UI.ViewManager.registerLocationResolver({
            name: "panel" /* PANEL */,
            category: UI.ViewManager.ViewLocationCategoryValues.PANEL,
            async loadResolver() {
                return new MockView();
            },
        });
    });
    it('retrieves a registered view', async () => {
        const preRegisteredView = UI.ViewManager.ViewManager.instance().view(viewId);
        const mockWidget = await preRegisteredView.widget();
        assert.instanceOf(mockWidget, MockView, 'View did not load correctly');
        assert.strictEqual(preRegisteredView.title(), viewTitle, 'View title is not returned correctly');
        assert.strictEqual(preRegisteredView.commandPrompt(), commandPrompt, 'Command for view is not returned correctly');
    });
    it('adds command for showing a pre registered view', () => {
        const allCommands = QuickOpen.CommandMenu.CommandMenu.instance({ forceNew: true }).commands();
        const filteredCommands = allCommands.filter(command => command.title() === commandPrompt &&
            command.category() === UI.ViewManager.ViewLocationCategoryValues.PANEL);
        assert.strictEqual(filteredCommands.length, 1, 'Command for showing a preregistered view was not added correctly');
    });
    it('deletes a registered view using its id', () => {
        const removalResult = UI.ViewManager.maybeRemoveViewExtension(viewId);
        assert.isTrue(removalResult);
        assert.doesNotThrow(() => {
            UI.ViewManager.registerViewExtension({
                id: viewId,
                commandPrompt: () => commandPrompt,
                title: () => viewTitle,
                async loadView() {
                    return new MockView();
                },
            });
        });
    });
});
//# sourceMappingURL=view_registration_test.js.map