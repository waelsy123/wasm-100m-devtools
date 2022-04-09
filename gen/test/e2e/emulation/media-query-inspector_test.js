"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const emulation_helpers_js_1 = require("../helpers/emulation-helpers.js");
const MEDIA_INSPECTOR_MARKER_SELECTOR = '.media-inspector-marker';
(0, mocha_extensions_js_1.describe)('Media query inspector', async () => {
    beforeEach(async function () {
        await (0, emulation_helpers_js_1.reloadDockableFrontEnd)();
        await (0, helper_js_1.goToResource)('emulation/media-query-inspector.html');
        await (0, helper_js_1.waitFor)('.tabbed-pane-left-toolbar');
        await (0, emulation_helpers_js_1.openDeviceToolbar)();
        await (0, emulation_helpers_js_1.showMediaQueryInspector)();
    });
    (0, mocha_extensions_js_1.it)('lists all the media queries', async () => {
        const inspectorMarkers = await (0, helper_js_1.waitForFunction)(async () => {
            const markers = await (0, helper_js_1.$$)(MEDIA_INSPECTOR_MARKER_SELECTOR);
            return markers.length >= 3 ? markers : undefined;
        });
        const markersContent = await Promise.all(inspectorMarkers.map(node => {
            return node.evaluate(node => node.textContent);
        }));
        chai_1.assert.deepEqual(markersContent, [
            // They are duplicated, as the markers are added both on the left and right of the viewport
            '300px100px',
            '100px300px',
            '800px500px',
            '500px800px',
            '801px',
            '801px',
        ], 'missed media query rule(s)');
    });
});
//# sourceMappingURL=media-query-inspector_test.js.map