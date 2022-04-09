"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const css_overview_helpers_js_1 = require("../helpers/css-overview-helpers.js");
const elements_helpers_js_1 = require("../helpers/elements-helpers.js");
const quick_open_helpers_js_1 = require("../helpers/quick_open-helpers.js");
const security_helpers_js_1 = require("../helpers/security-helpers.js");
const settings_helpers_js_1 = require("../helpers/settings-helpers.js");
function retrieveRecordedHistogramEvents(frontend) {
    // @ts-ignore
    return frontend.evaluate(() => window.InspectorFrontendHost.recordedEnumeratedHistograms);
}
function retrieveRecordedPerformanceHistogramEvents(frontend) {
    // @ts-ignore
    return frontend.evaluate(() => window.InspectorFrontendHost.recordedPerformanceHistograms);
}
async function assertHistogramEventsInclude(expected) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    const events = await retrieveRecordedHistogramEvents(frontend);
    chai_1.assert.includeDeepMembers(events, expected);
}
async function waitForHistogramEvent(expected) {
    const { frontend } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.waitForFunction)(async () => {
        const events = await retrieveRecordedHistogramEvents(frontend);
        return events.find(e => e.actionName === expected.actionName && (!('value' in expected) || e.actionCode === expected.actionCode));
    });
}
(0, mocha_extensions_js_1.describe)('User Metrics', () => {
    (0, mocha_extensions_js_1.it)('dispatches dock and undock events', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.evaluate(() => {
            self.Host.userMetrics.actionTaken(self.Host.UserMetrics.Action.WindowDocked);
            self.Host.userMetrics.actionTaken(self.Host.UserMetrics.Action.WindowUndocked);
        });
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.ActionTaken',
                actionCode: 1, // WindowDocked.
            },
            {
                actionName: 'DevTools.ActionTaken',
                actionCode: 2, // WindowUndocked.
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches a metric event the console drawer', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.keyboard.press('Escape');
        await frontend.waitForSelector('.console-view');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 10, // drawer-console-view.
            },
            {
                actionName: 'DevTools.KeyboardShortcutFired',
                actionCode: 17, // main.toggle-drawer
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches a metric event for show CORS errors console settings', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.keyboard.press('Escape');
        await frontend.waitForSelector('.console-view');
        await (0, console_helpers_js_1.toggleShowCorsErrors)();
        await (0, console_helpers_js_1.toggleShowCorsErrors)();
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 10, // drawer-console-view.
            },
            {
                actionName: 'DevTools.ConsoleShowsCorsErrors',
                actionCode: 0, // disabled
            },
            {
                actionName: 'DevTools.ConsoleShowsCorsErrors',
                actionCode: 1, // enabled
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches events for views', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        // Head to the Timeline tab.
        await (0, helper_js_1.click)('#tab-timeline');
        await frontend.waitForSelector('.timeline');
        await assertHistogramEventsInclude([{
                actionName: 'DevTools.PanelShown',
                actionCode: 5, // Timeline.
            }]);
    });
    (0, mocha_extensions_js_1.it)('dispatches events for triple dot items', async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Animations');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 10, // 'console-view'.
            },
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 11, // 'animations'.
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches events for opening issues drawer via hamburger menu', async () => {
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Issues');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssuesPanelOpenedFrom',
                actionCode: 3, // 'HamburgerMenu'.
            },
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 10, // 'console-view'.
            },
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 37, // 'issues-pane'.
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches event when opening issues drawer via command menu', async () => {
        await (0, quick_open_helpers_js_1.openCommandMenu)();
        await (0, helper_js_1.typeText)('issues');
        await (0, helper_js_1.waitFor)('.filtered-list-widget-title');
        await (0, helper_js_1.pressKey)('Enter');
        await (0, helper_js_1.waitFor)('[aria-label="Issues panel"]');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssuesPanelOpenedFrom',
                actionCode: 5, // CommandMenu
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when F1 is used to open settings', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.keyboard.press('F1');
        await (0, helper_js_1.waitFor)('.settings-window-main');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 29,
            },
            {
                actionName: 'DevTools.KeyboardShortcutFired',
                actionCode: 22, // settings.show
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when Ctrl/Meta+F8 is used to deactivate breakpoints', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.click)('#tab-sources');
        await (0, helper_js_1.waitFor)('#sources-panel-sources-view');
        switch (helper_js_1.platform) {
            case 'mac':
                await frontend.keyboard.down('Meta');
                break;
            case 'linux':
            case 'win32':
                await frontend.keyboard.down('Control');
                break;
        }
        await frontend.keyboard.press('F8');
        switch (helper_js_1.platform) {
            case 'mac':
                await frontend.keyboard.up('Meta');
                break;
            case 'linux':
            case 'win32':
                await frontend.keyboard.up('Control');
                break;
        }
        await (0, helper_js_1.waitFor)('[aria-label="Activate breakpoints"]');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 4, // sources
            },
            {
                actionName: 'DevTools.KeyboardShortcutFired',
                actionCode: 35, // debugger.toggle-breakpoints-active
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when the keybindSet setting is changed', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.keyboard.press('F1');
        await (0, helper_js_1.waitFor)('.settings-window-main');
        await (0, helper_js_1.click)('[aria-label="Shortcuts"]');
        await (0, helper_js_1.waitFor)('.keybinds-set-select');
        const keybindSetSelect = await (0, helper_js_1.$)('.keybinds-set-select select');
        keybindSetSelect.select('vsCode');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 29, // settings-preferences
            },
            {
                actionName: 'DevTools.KeyboardShortcutFired',
                actionCode: 22, // settings.show
            },
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 38, // settings-keybinds
            },
            {
                actionName: 'DevTools.KeybindSetSettingChanged',
                actionCode: 1, // vsCode
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches closed panel events for views', async () => {
        // Focus and close a tab
        await (0, security_helpers_js_1.navigateToSecurityTab)();
        await (0, security_helpers_js_1.closeSecurityTab)();
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 16, // Security
            },
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 1,
            },
            {
                actionName: 'DevTools.PanelClosed',
                actionCode: 16, // Security
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when experiments are enabled and disabled', async () => {
        await (0, settings_helpers_js_1.openSettingsTab)('Experiments');
        const customThemeCheckbox = await (0, helper_js_1.waitFor)('[aria-label="Allow extensions to load custom stylesheets"]');
        // Enable the experiment
        await customThemeCheckbox.click();
        // Disable the experiment
        await customThemeCheckbox.click();
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 29, // settings-preferences
            },
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 31, // Experiments
            },
            {
                actionName: 'DevTools.ExperimentEnabled',
                actionCode: 0, // Allow extensions to load custom stylesheets
            },
            {
                actionName: 'DevTools.ExperimentDisabled',
                actionCode: 0, // Allow extensions to load custom stylesheets
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('tracks panel loading', async () => {
        // We specify the selected panel here because the default behavior is to go to the
        // elements panel, but this means we won't get the PanelLoaded event. Instead we
        // request that the resetPages helper sets the timeline as the target panel, and
        // we wait for the timeline in the test. This means, in turn, we get the PanelLoaded
        // event.
        await (0, helper_js_1.reloadDevTools)({ selectedPanel: { name: 'timeline' } });
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, helper_js_1.waitFor)('.timeline');
        const events = await retrieveRecordedPerformanceHistogramEvents(frontend);
        chai_1.assert.strictEqual(events.length, 1);
        chai_1.assert.strictEqual(events[0].histogramName, 'DevTools.Launch.Timeline');
    });
    (0, mocha_extensions_js_1.it)('records the selected language', async () => {
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.Language',
                actionCode: 17, // en-US
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('records the sync setting', async () => {
        await assertHistogramEventsInclude([{
                actionName: 'DevTools.SyncSetting',
                actionCode: 1, // Chrome Sync is disabled
            }]);
    });
});
(0, mocha_extensions_js_1.describe)('User Metrics for CSS Overview', () => {
    (0, mocha_extensions_js_1.it)('dispatch events when capture overview button hit', async () => {
        await (0, helper_js_1.goToResource)('css_overview/default.html');
        await (0, css_overview_helpers_js_1.navigateToCssOverviewTab)();
        await (0, css_overview_helpers_js_1.startCaptureCSSOverview)();
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.PanelShown',
                actionCode: 39, // cssoverview
            },
            {
                actionName: 'DevTools.ActionTaken',
                actionCode: 41, // CaptureCssOverviewClicked
            },
        ]);
    });
});
(0, mocha_extensions_js_1.describe)('User Metrics for sidebar panes', () => {
    (0, mocha_extensions_js_1.it)('dispatches sidebar panes events for navigating Elements Panel sidebar panes', async () => {
        await (0, elements_helpers_js_1.navigateToSidePane)('Computed');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.SidebarPaneShown',
                actionCode: 2, // Computed
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('should not dispatch sidebar panes events for navigating to the same pane', async () => {
        await (0, elements_helpers_js_1.navigateToSidePane)('Styles');
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        const events = await retrieveRecordedHistogramEvents(frontend);
        const eventNames = events.map(event => event.actionName);
        chai_1.assert.notInclude(eventNames, 'DevTools.SidebarPaneShown');
    });
});
(0, mocha_extensions_js_1.describe)('User Metrics for Issue Panel', () => {
    beforeEach(async () => {
        await (0, helper_js_1.enableExperiment)('contrastIssues');
        await (0, settings_helpers_js_1.openPanelViaMoreTools)('Issues');
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when a LowTextContrastIssue is created', async () => {
        await (0, helper_js_1.goToResource)('elements/low-contrast.html');
        await (0, helper_js_1.waitFor)('.issue');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 41, // LowTextContrastIssue
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 41, // LowTextContrastIssue
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 41, // LowTextContrastIssue
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 41, // LowTextContrastIssue
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when a SharedArrayBufferIssue is created', async () => {
        await (0, helper_js_1.goToResource)('issues/sab-issue.rawresponse');
        await (0, helper_js_1.waitFor)('.issue');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 37, // SharedArrayBufferIssue::CreationIssue
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 60, // DeprecationIssue
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 36, // SharedArrayBufferIssue::TransferIssue
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatch events when a link to an element is clicked', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, helper_js_1.waitFor)('.issue');
        await (0, helper_js_1.click)('.issue');
        await (0, helper_js_1.waitFor)('.element-reveal-icon');
        await (0, helper_js_1.scrollElementIntoView)('.element-reveal-icon');
        await (0, helper_js_1.click)('.element-reveal-icon');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 1, // ContentSecurityPolicyIssue
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 1, // ContentSecurityPolicyIssue
            },
            {
                actionName: 'DevTools.IssuesPanelIssueExpanded',
                actionCode: 4, // ContentSecurityPolicy
            },
            {
                actionName: 'DevTools.IssuesPanelResourceOpened',
                actionCode: 7, // ContentSecurityPolicyElement
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatch events when a "Learn More" link is clicked', async () => {
        await (0, helper_js_1.goToResource)('elements/element-reveal-inline-issue.html');
        await (0, helper_js_1.waitFor)('.issue');
        await (0, helper_js_1.click)('.issue');
        await (0, helper_js_1.waitFor)('.link-list x-link');
        await (0, helper_js_1.scrollElementIntoView)('.link-list x-link');
        await (0, helper_js_1.click)('.link-list x-link');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 1, // ContentSecurityPolicyIssue
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 1, // ContentSecurityPolicyIssue
            },
            {
                actionName: 'DevTools.IssuesPanelIssueExpanded',
                actionCode: 4, // ContentSecurityPolicy
            },
            {
                actionName: 'DevTools.IssuesPanelResourceOpened',
                actionCode: 12, // ContentSecurityPolicyLearnMore
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches events when Quirks Mode issues are created', async () => {
        await (0, helper_js_1.goToResource)('elements/quirks-mode-iframes.html');
        await (0, helper_js_1.waitFor)('.issue');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 58, // QuirksModeIssue::QuirksMode
            },
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 59, // QuirksModeIssue::LimitedQuirksMode
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when a Client Hints are used with invalid origin', async () => {
        await (0, helper_js_1.goToResource)('issues/client-hint-issue-MetaTagAllowListInvalidOrigin.html');
        await (0, helper_js_1.waitFor)('.issue');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 61, // ClientHintIssue::MetaTagAllowListInvalidOrigin
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatches an event when a Client Hints are modified by javascript', async () => {
        await (0, helper_js_1.goToResource)('issues/client-hint-issue-MetaTagModifiedHTML.html');
        await (0, helper_js_1.waitFor)('.issue');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.IssueCreated',
                actionCode: 62, // ClientHintIssue::MetaTagModifiedHTML
            },
        ]);
    });
});
(0, mocha_extensions_js_1.describe)('User Metrics for CSS custom properties in the Styles pane', () => {
    beforeEach(async () => {
        await (0, helper_js_1.goToResource)('elements/css-variables.html');
        await (0, elements_helpers_js_1.navigateToSidePane)('Styles');
        await (0, elements_helpers_js_1.waitForElementsStyleSection)();
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<body>\u200B');
        await (0, elements_helpers_js_1.focusElementsTree)();
    });
    (0, mocha_extensions_js_1.it)('dispatch events when capture overview button hit', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        await frontend.keyboard.press('ArrowRight');
        await (0, elements_helpers_js_1.waitForContentOfSelectedElementsNode)('<div id=\u200B"properties-to-inspect">\u200B</div>\u200B');
        await (0, helper_js_1.click)('.css-var-link');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.ActionTaken',
                actionCode: 47, // CustomPropertyLinkClicked
            },
        ]);
    });
    (0, mocha_extensions_js_1.it)('dispatch events when a custom property value is edited', async () => {
        await (0, elements_helpers_js_1.editCSSProperty)('body, body', '--color', '#f06');
        await assertHistogramEventsInclude([
            {
                actionName: 'DevTools.ActionTaken',
                actionCode: 14, // StyleRuleEdited
            },
            {
                actionName: 'DevTools.ActionTaken',
                actionCode: 48, // CustomPropertyEdited
            },
        ]);
    });
});
(0, mocha_extensions_js_1.describe)('User Metrics for the Page Resource Loader', () => {
    (0, mocha_extensions_js_1.it)('dispatches an event when a source map is loaded', async () => {
        await (0, helper_js_1.goToResource)('sources/script-with-sourcemap-without-mappings.html');
        await waitForHistogramEvent({
            actionName: 'DevTools.DeveloperResourceLoaded',
            actionCode: 0, // LoadThroughPageViaTarget
        });
        await waitForHistogramEvent({
            actionName: 'DevTools.DeveloperResourceScheme',
        });
    });
});
//# sourceMappingURL=user-metrics_test.js.map