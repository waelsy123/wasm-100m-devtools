"use strict";
// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTestRunnerConfigSetting = exports.getTestRunnerConfigSetting = void 0;
function getTestRunnerConfig() {
    if (!process.env.TEST_RUNNER_JSON_CONFIG) {
        return null;
    }
    try {
        return JSON.parse(process.env.TEST_RUNNER_JSON_CONFIG);
    }
    catch {
        // Return an empty object so any lookups return undefined
        return {};
    }
}
function getTestRunnerConfigSetting(settingKey, fallbackValue) {
    const config = getTestRunnerConfig();
    if (config && config.hasOwnProperty(settingKey)) {
        return config[settingKey];
    }
    if (fallbackValue !== undefined) {
        return fallbackValue;
    }
    return undefined;
}
exports.getTestRunnerConfigSetting = getTestRunnerConfigSetting;
function requireTestRunnerConfigSetting(settingKey, errorMessage) {
    const config = getTestRunnerConfig();
    if (config[settingKey] === undefined) {
        throw new Error(errorMessage || `Test runner error: could not find required setting ${settingKey}`);
    }
    return config[settingKey];
}
exports.requireTestRunnerConfigSetting = requireTestRunnerConfigSetting;
//# sourceMappingURL=test_runner_config.js.map