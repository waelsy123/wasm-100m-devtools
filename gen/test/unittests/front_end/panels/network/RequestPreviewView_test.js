// Copyright 2022 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
import * as Network from '../../../../../front_end/panels/network/network.js';
import { renderElementIntoDOM } from '../../helpers/DOMHelpers.js';
import { describeWithLocale } from '../../helpers/EnvironmentHelpers.js';
async function contentData() {
    const content = '<style> p { color: red; }</style><link rel="stylesheet" ref="http://devtools-frontend.test/style">';
    return { error: null, content, encoded: false };
}
function renderPreviewView(request) {
    const component = new Network.RequestPreviewView.RequestPreviewView(request);
    const div = document.createElement('div');
    renderElementIntoDOM(div);
    component.markAsRoot();
    component.show(div);
    return component;
}
describeWithLocale('RequestPreviewView', () => {
    it('prevents previewed html from making same-site requests', async () => {
        const request = SDK.NetworkRequest.NetworkRequest.create('requestId', 'http://devtools-frontend.test/content', '', null, null, null);
        request.setContentDataProvider(contentData);
        request.mimeType = SDK.NetworkRequest.MIME_TYPE.HTML;
        const component = renderPreviewView(request);
        const widget = await component.showPreview();
        const frame = widget.contentElement.querySelector('iframe');
        expect(frame).to.be.not.null;
        expect(frame?.getAttribute('csp')).to.eql('default-src \'none\'');
        component.detach();
    });
});
//# sourceMappingURL=RequestPreviewView_test.js.map