// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as utils from '../../../../../front_end/panels/utils/utils.js';
import * as Diff from '../../../../../front_end/third_party/diff/diff.js';
const { assert } = chai;
describe('panels/utils', async () => {
    it('formats CSS changes from diff arrays', async () => {
        const original = `
      .container {
        width: 10px;
        height: 10px;
      }

      .child {
        display: grid;
        --child-theme-color: 100, 200, 0;
      }
      `;
        const current = `
      .container {
        width: 15px;
        margin: 0;
      }

      .child {
        display: grid;
        --child-theme-color: 5, 10, 15;
        padding: 10px;
      }`;
        const diff = Diff.Diff.DiffWrapper.lineDiff(original.split('\n'), current.split('\n'));
        const changes = await utils.formatCSSChangesFromDiff(diff);
        assert.strictEqual(changes, `.container {
  /* width: 10px; */
  /* height: 10px; */
  width: 15px;
  margin: 0;
}

.child {
  /* --child-theme-color: 100, 200, 0; */
  --child-theme-color: 5, 10, 15;
  padding: 10px;
}`, 'formatted CSS changes are not correct');
    });
});
//# sourceMappingURL=utils_test.js.map