// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as Resources from '../../../../../front_end/panels/application/application.js';
import { describeWithLocale } from '../../helpers/EnvironmentHelpers.js';
var View = Resources.ServiceWorkerUpdateCycleView;
describeWithLocale('ServiceWorkerUpdateCycleView', () => {
    let versionId = 0;
    let SDK;
    before(async () => {
        SDK = await import('../../../../../front_end/core/sdk/sdk.js');
    });
    const registrationId = 'fake-sw-id';
    it('calculates update cycle ranges', () => {
        const payload = { registrationId, scopeURL: '', isDeleted: false };
        const registration = new SDK.ServiceWorkerManager.ServiceWorkerRegistration(payload);
        let view = new View.ServiceWorkerUpdateCycleView(registration);
        let ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 0, 'A nascent registration has no ranges to display.');
        versionId++;
        let versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "new" /* New */,
            runningStatus: "starting" /* Starting */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 0, 'A new registration has no ranges to display.');
        versionId++;
        versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "installing" /* Installing */,
            runningStatus: "running" /* Running */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 1, 'An installing registration has a range to display.');
        versionId++;
        versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "installing" /* Installing */,
            runningStatus: "running" /* Running */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 1, 'An installing registration (reported multiple times) has a range to display.');
        versionId++;
        versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "installed" /* Installed */,
            runningStatus: "running" /* Running */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 1, 'An installed registration has a range to display. ');
        versionId++;
        versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "activating" /* Activating */,
            runningStatus: "running" /* Running */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 3, 'An activating registration has ranges to display.');
        versionId++;
        versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "activating" /* Activating */,
            runningStatus: "running" /* Running */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 3, 'An activating registration has ranges to display.');
        versionId++;
        versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "activated" /* Activated */,
            runningStatus: "running" /* Running */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 3, 'An activated registration has ranges to display.');
        versionId++;
        versionPayload = {
            registrationId,
            versionId: versionId.toString(),
            scriptURL: '',
            status: "redundant" /* Redundant */,
            runningStatus: "stopped" /* Stopped */,
        };
        registration.updateVersion(versionPayload);
        view = new View.ServiceWorkerUpdateCycleView(registration);
        ranges = view.calculateServiceWorkerUpdateRanges();
        assert.strictEqual(ranges.length, 3, 'A redundent registration has ranges to display.');
    });
});
//# sourceMappingURL=ServiceWorkerUpdateCycleView_test.js.map