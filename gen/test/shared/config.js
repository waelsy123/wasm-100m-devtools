"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVar = void 0;
function getEnvVar(name, defaultValue) {
    const envVar = process.env[name];
    if (typeof defaultValue === 'boolean') {
        return (Boolean(envVar));
    }
    if (typeof defaultValue === 'number') {
        let value = Number(envVar);
        if (Number.isNaN(value)) {
            value = defaultValue;
        }
        return value;
    }
    return (envVar || defaultValue);
}
exports.getEnvVar = getEnvVar;
//# sourceMappingURL=config.js.map