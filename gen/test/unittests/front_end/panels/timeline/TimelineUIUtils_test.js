// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as Timeline from '../../../../../front_end/panels/timeline/timeline.js';
const { assert } = chai;
function makeFakeLayoutShift(properties) {
    const fakeLayoutShift = {
        args: {
            data: {
                had_recent_input: properties.hadRecentInput,
                weighted_score_delta: properties.weightedScoreDelta,
            },
        },
        startTime: properties.startTime,
    };
    return fakeLayoutShift;
}
describe('groupLayoutShiftsIntoClusters', () => {
    it('does not include layout shifts that have recent user input', () => {
        const shiftWithUserInput = makeFakeLayoutShift({
            hadRecentInput: true,
            weightedScoreDelta: 0.01,
            startTime: 2000,
        });
        const layoutShifts = [shiftWithUserInput];
        Timeline.TimelineUIUtils.assignLayoutShiftsToClusters(layoutShifts);
        assert.isUndefined(shiftWithUserInput.args.data._current_cluster_id);
    });
    it('does not include layout shifts that have no weighted_score_delta', () => {
        const shiftWithNoWeightedScore = makeFakeLayoutShift({
            hadRecentInput: false,
            weightedScoreDelta: undefined,
            startTime: 2000,
        });
        const layoutShifts = [shiftWithNoWeightedScore];
        Timeline.TimelineUIUtils.assignLayoutShiftsToClusters(layoutShifts);
        assert.isUndefined(shiftWithNoWeightedScore.args.data._current_cluster_id);
    });
    it('correctly combines events that are within the same session', () => {
        const shiftOne = makeFakeLayoutShift({
            hadRecentInput: false,
            weightedScoreDelta: 0.01,
            startTime: 2000,
        });
        const shiftTwo = makeFakeLayoutShift({
            hadRecentInput: false,
            weightedScoreDelta: 0.02,
            startTime: shiftOne.startTime + 100,
        });
        const layoutShifts = [shiftOne, shiftTwo];
        Timeline.TimelineUIUtils.assignLayoutShiftsToClusters(layoutShifts);
        assert.strictEqual(shiftOne.args.data._current_cluster_id, 1);
        assert.strictEqual(shiftTwo.args.data._current_cluster_id, 1);
        assert.strictEqual(shiftOne.args.data._current_cluster_score, 0.03);
        assert.strictEqual(shiftTwo.args.data._current_cluster_score, 0.03);
    });
    it('correctly splits events into multiple clusters', () => {
        const shiftOne = makeFakeLayoutShift({
            hadRecentInput: false,
            weightedScoreDelta: 0.01,
            startTime: 2000,
        });
        const shiftTwo = makeFakeLayoutShift({
            hadRecentInput: false,
            weightedScoreDelta: 0.02,
            startTime: shiftOne.startTime + 100,
        });
        const shiftThree = makeFakeLayoutShift({
            hadRecentInput: false,
            weightedScoreDelta: 0.05,
            startTime: 10000,
        });
        const layoutShifts = [shiftOne, shiftTwo, shiftThree];
        Timeline.TimelineUIUtils.assignLayoutShiftsToClusters(layoutShifts);
        assert.strictEqual(shiftOne.args.data._current_cluster_id, 1);
        assert.strictEqual(shiftTwo.args.data._current_cluster_id, 1);
        assert.strictEqual(shiftOne.args.data._current_cluster_score, 0.03);
        assert.strictEqual(shiftTwo.args.data._current_cluster_score, 0.03);
        assert.strictEqual(shiftThree.args.data._current_cluster_id, 2);
        assert.strictEqual(shiftThree.args.data._current_cluster_score, 0.05);
    });
});
//# sourceMappingURL=TimelineUIUtils_test.js.map