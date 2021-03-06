"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.color = void 0;
function color(msg, color) {
    if (!process.env['TERM']) {
        return msg;
    }
    const preamble = '\x1b[';
    const postamble = 'm';
    const reset = `${preamble}0${postamble}`;
    let code = 0;
    switch (color) {
        case "DIM" /* DIM */:
            code = 2;
            break;
        case "GREEN" /* GREEN */:
            code = 32;
            break;
        case "RED" /* RED */:
            code = 31;
            break;
        case "MAGENTA" /* MAGENTA */:
            code = 35;
            break;
        case "CYAN" /* CYAN */:
            code = 36;
            break;
    }
    return `${preamble}${code}${postamble}${msg}${reset}`;
}
exports.color = color;
//# sourceMappingURL=text-color.js.map