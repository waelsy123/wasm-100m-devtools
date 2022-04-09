"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const application_helpers_js_1 = require("../helpers/application-helpers.js");
const WEB_SQL_SELECTOR = '[aria-label="Web SQL"]';
const DATABASES_SELECTOR = `${WEB_SQL_SELECTOR} + ol`;
(0, mocha_extensions_js_1.describe)('The Application Tab', async () => {
    (0, mocha_extensions_js_1.it)('shows WebSQL database', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        await (0, application_helpers_js_1.navigateToApplicationTab)(target, 'websql-database');
        await (0, application_helpers_js_1.doubleClickSourceTreeItem)(WEB_SQL_SELECTOR);
        await (0, helper_js_1.debuggerStatement)(frontend);
        const databaseList = await (0, helper_js_1.waitFor)(DATABASES_SELECTOR);
        const databaseNames = await databaseList.evaluate((list) => {
            return Array.from(list.querySelectorAll('li')).map(node => node.textContent);
        });
        chai_1.assert.deepEqual(databaseNames, ['InspectorDatabaseTest', 'InspectorDatabaseTest2']);
    });
});
//# sourceMappingURL=websql-database_test.js.map