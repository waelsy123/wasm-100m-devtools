// Copyright 2021 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
import { createTarget } from '../../helpers/EnvironmentHelpers.js';
import { describeWithMockConnection, dispatchEvent } from '../../helpers/MockConnection.js';
const { assert } = chai;
describeWithMockConnection('ResourceTreeModel', () => {
    let target;
    let resourceTreeModel;
    let networkManager;
    beforeEach(() => {
        target = createTarget();
        resourceTreeModel = target.model(SDK.ResourceTreeModel.ResourceTreeModel);
        networkManager = target.model(SDK.NetworkManager.NetworkManager);
    });
    it('calls clearRequests on reloadPage', () => {
        if (!networkManager) {
            throw new Error('No networkManager');
        }
        const clearRequests = sinon.stub(networkManager, 'clearRequests');
        resourceTreeModel?.reloadPage();
        assert.isTrue(clearRequests.calledOnce, 'Not called just once');
    });
    it('calls clearRequests on frameNavigated', () => {
        if (!networkManager) {
            throw new Error('No networkManager');
        }
        const clearRequests = sinon.stub(networkManager, 'clearRequests');
        dispatchEvent(target, 'Page.frameNavigated', {
            frame: {
                id: 'main',
                loaderId: 'foo',
                url: 'http://example.com',
                domainAndRegistry: 'example.com',
                securityOrigin: 'http://example.com',
                mimeType: 'text/html',
                secureContextType: "Secure" /* Secure */,
                crossOriginIsolatedContextType: "Isolated" /* Isolated */,
                gatedAPIFeatures: [],
            },
        });
        assert.isTrue(clearRequests.calledOnce, 'Not called just once');
    });
});
//# sourceMappingURL=ResourceTreeModel_test.js.map