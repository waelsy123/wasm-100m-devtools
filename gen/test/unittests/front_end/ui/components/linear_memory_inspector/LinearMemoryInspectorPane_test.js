// Copyright (c) 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import { describeWithEnvironment } from '../../../helpers/EnvironmentHelpers.js';
import { assertNotNullOrUndefined } from '../../../../../../front_end/core/platform/platform.js';
import { assertElement } from '../../../helpers/DOMHelpers.js';
function createArray() {
    const array = [];
    for (let i = 0; i < 100; ++i) {
        array.push(i);
    }
    return new Uint8Array(array);
}
describeWithEnvironment('LinearMemoryInspectorPane', () => {
    let LinearMemoryInspector;
    before(async () => {
        LinearMemoryInspector =
            await import('../../../../../../front_end/ui/components/linear_memory_inspector/linear_memory_inspector.js');
    });
    class Uint8Wrapper {
        array;
        constructor(array) {
            this.array = array;
        }
        getRange(start, end) {
            return Promise.resolve(this.array.slice(start, end));
        }
        length() {
            return this.array.length;
        }
    }
    it('can be created', () => {
        const instance = LinearMemoryInspector.LinearMemoryInspectorPane.LinearMemoryInspectorPaneImpl.instance();
        const arrayWrapper = new Uint8Wrapper(createArray());
        const scriptId = 'scriptId';
        const title = 'Test Title';
        instance.create(scriptId, title, arrayWrapper, 10);
        const tabbedPane = instance.contentElement.querySelector('.tabbed-pane');
        assertNotNullOrUndefined(tabbedPane);
        const inspector = tabbedPane.querySelector('devtools-linear-memory-inspector-inspector');
        assertElement(inspector, LinearMemoryInspector.LinearMemoryInspector.LinearMemoryInspector);
    });
});
//# sourceMappingURL=LinearMemoryInspectorPane_test.js.map