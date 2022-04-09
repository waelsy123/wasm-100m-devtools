"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.mean = exports.percentile = exports.storeGeneratedResults = void 0;
const fs = require("fs");
const path_1 = require("path");
const storeGeneratedResults = (file, content) => {
    const directory = (0, path_1.join)(__dirname, '..', '..', '..', '..', '..', '..', 'perf-data');
    fs.mkdirSync(directory, { recursive: true });
    const filePath = (0, path_1.join)(directory, file);
    fs.writeFileSync(filePath, content, { encoding: 'utf8' });
};
exports.storeGeneratedResults = storeGeneratedResults;
const percentile = (values, position) => {
    if (values.length === 0) {
        return 0;
    }
    values = Array.from(values).sort((a, b) => a - b);
    const idx = Math.floor(values.length * position);
    if (values.length % 2 === 1) {
        return values[idx];
    }
    return (values[idx] + values[idx - 1]) / 2;
};
exports.percentile = percentile;
const mean = (values) => {
    if (values.length === 0) {
        return 0;
    }
    return values.reduce((prev, curr) => prev + curr, 0) / values.length;
};
exports.mean = mean;
//# sourceMappingURL=perf-helper.js.map