"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitForPlayerButtonTexts = exports.getPlayerButtonText = exports.getPlayerButton = exports.playMediaFile = void 0;
const helper_js_1 = require("../../shared/helper.js");
async function playMediaFile(media) {
    const { target } = (0, helper_js_1.getBrowserAndPages)();
    await (0, helper_js_1.goToResource)(`media/${media}`);
    // Need to click play manually - autoplay policy prevents it otherwise.
    return new Promise(async (resolve) => {
        await target.exposeFunction('resolve', resolve);
        await target.evaluate(() => {
            const videoElement = document.getElementsByName('media')[0];
            videoElement.addEventListener('play', () => {
                resolve();
            });
            // Just in case autoplay started before we could attach an event listener.
            if (!videoElement.paused || videoElement.readyState > 2) {
                resolve();
            }
            else {
                void videoElement.play();
            }
        });
    });
}
exports.playMediaFile = playMediaFile;
async function getPlayerButton() {
    return await (0, helper_js_1.waitFor)('.player-entry-player-title');
}
exports.getPlayerButton = getPlayerButton;
async function getPlayerButtonText() {
    const playerEntry = await getPlayerButton();
    return await playerEntry.evaluate(element => element.textContent);
}
exports.getPlayerButtonText = getPlayerButtonText;
async function waitForPlayerButtonTexts(count) {
    return (0, helper_js_1.waitForFunction)(async () => {
        return await (0, helper_js_1.waitForMany)('.player-entry-player-title', count);
    });
}
exports.waitForPlayerButtonTexts = waitForPlayerButtonTexts;
//# sourceMappingURL=media-helpers.js.map