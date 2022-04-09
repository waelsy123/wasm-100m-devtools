// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as SDK from '../../../../../front_end/core/sdk/sdk.js';
function ensureCookiesExistOrFailTest(cookies) {
    if (!cookies) {
        assert.fail('expected cookies to exist');
        return false;
    }
    return true;
}
const requestDate = new Date('Mon Oct 18 2010 17:00:00 GMT+0000');
const cookieExpectationDefaults = {
    name: 'name',
    value: 'value',
    httpOnly: false,
    sameSite: undefined,
    secure: false,
    session: true,
    path: undefined,
    domain: undefined,
    expires: null,
    size: undefined,
    priority: "Medium" /* Medium */,
};
function expectCookie(cookie, cookieExpectation) {
    const expectation = { ...cookieExpectationDefaults, ...cookieExpectation };
    assert.strictEqual(cookie.name(), expectation.name, 'name');
    assert.strictEqual(cookie.value(), expectation.value, 'value');
    assert.strictEqual(cookie.httpOnly(), expectation.httpOnly, 'httpOnly');
    assert.strictEqual(cookie.sameSite(), expectation.sameSite, 'sameSite');
    assert.strictEqual(cookie.secure(), expectation.secure, 'secure');
    assert.strictEqual(cookie.session(), expectation.session, 'session');
    assert.strictEqual(cookie.path(), expectation.path, 'path');
    assert.strictEqual(cookie.domain(), expectation.domain, 'domain');
    const date = cookie.expiresDate(requestDate);
    if (typeof expectation.expires === 'string') {
        assert.isNotNull(date);
        assert.strictEqual(date.toISOString(), expectation.expires, 'expires');
    }
    else if (typeof expectation.expires === 'number') {
        assert.isNotNull(date);
        assert.strictEqual(date.getTime(), expectation.expires, 'expires');
    }
    else {
        assert.strictEqual(date, expectation.expires, 'expires');
    }
    assert.strictEqual(cookie.size(), expectation.size, 'size');
    assert.strictEqual(cookie.priority(), expectation.priority, 'priority');
}
describe('CookieParser', () => {
    function parseAndExpectSetCookies(setCookieString, cookieExpectations) {
        const cookies = SDK.CookieParser.CookieParser.parseSetCookie(setCookieString);
        if (ensureCookiesExistOrFailTest(cookies)) {
            assert.lengthOf(cookies, cookieExpectations.length, 'Expected number of parsed cookies to agree with number of expected cookies');
            for (let i = 0; i < cookieExpectations.length; ++i) {
                expectCookie(cookies[i], cookieExpectations[i]);
            }
        }
    }
    describe('parseSetCookie', () => {
        it('parses basic cookies', () => {
            parseAndExpectSetCookies('foo=bar', [{ name: 'foo', value: 'bar', size: 7 }]);
        });
        it('recognises expires attribute', () => {
            parseAndExpectSetCookies('foo=bar; expires=Wed, 21 Oct 2015 07:28:00 GMT;', [{ name: 'foo', value: 'bar', expires: '2015-10-21T07:28:00.000Z', session: false, size: 47 }]);
            parseAndExpectSetCookies('foo=bar; expires=Wed, 21 Oct 2015 07:28:00 GMT;', [{ name: 'foo', value: 'bar', expires: '2015-10-21T07:28:00.000Z', session: false, size: 47 }]);
        });
        it('handles multiple SetCookies separated by line breaks', () => {
            parseAndExpectSetCookies(`a=b
      c=d
      f`, [{ name: 'a', value: 'b', size: 10 }, { name: 'c', value: 'd', size: 10 }, { name: '', value: 'f', size: 1 }]);
        });
        it('handles path and domain values ', () => {
            parseAndExpectSetCookies('cookie1 = value; Path=/; Domain=.example.com;', [{ name: 'cookie1', value: 'value', path: '/', domain: '.example.com', size: 45 }]);
        });
        it('handles a domain value with leading spaces', () => {
            parseAndExpectSetCookies('cookie1 = value; Path=/; Domain=  .example.com;', [{ name: 'cookie1', value: 'value', path: '/', domain: '.example.com', size: 47 }]);
        });
        it('handles multiple cookies with path and domain values', () => {
            parseAndExpectSetCookies(`cookie1 = value; Path=/; Domain=  .example.com
      Cookie2 = value2; Path = /foo; Domain = foo.example.com`, [
                { name: 'cookie1', value: 'value', path: '/', domain: '.example.com', size: 53 },
                { name: 'Cookie2', value: 'value2', path: '/foo', domain: 'foo.example.com', size: 55 },
            ]);
        });
        it('handles multiple cookies with an invalid attribute', () => {
            parseAndExpectSetCookies(`cookie1 = value; expires = Mon, Oct 18 2010 17:00 GMT+0000; Domain   =.example.com
      Cookie2 = value2; Path = /foo; DOMAIN = foo.example.com; HttpOnly; Secure; Discard;`, [
                { name: 'cookie1', value: 'value', expires: 1287421200000, domain: '.example.com', session: false, size: 89 },
                {
                    name: 'Cookie2',
                    value: 'value2',
                    path: '/foo',
                    domain: 'foo.example.com',
                    httpOnly: true,
                    secure: true,
                    size: 83,
                },
            ]);
        });
        it('handles multiple cookies with an invalid attribute', () => {
            parseAndExpectSetCookies(`cookie1 = value; max-age= 1440; Domain   =.example.com
      Cookie2 = value2; Path = /foo; DOMAIN = foo.example.com; HttpOnly; Secure; Discard;`, [
                { name: 'cookie1', value: 'value', expires: 1287422640000, domain: '.example.com', session: false, size: 61 },
                {
                    name: 'Cookie2',
                    value: 'value2',
                    path: '/foo',
                    domain: 'foo.example.com',
                    httpOnly: true,
                    secure: true,
                    size: 83,
                },
            ]);
        });
        describe('handles the SameSite attribute', () => {
            it('with value Lax', () => {
                parseAndExpectSetCookies('cookie1 = value; HttpOnly; Secure; SameSite=Lax', [{
                        name: 'cookie1',
                        value: 'value',
                        httpOnly: true,
                        secure: true,
                        sameSite: "Lax" /* Lax */,
                        size: 47,
                    }]);
            });
            it('with value None', () => {
                parseAndExpectSetCookies('cookie1 = value; HttpOnly; Secure; SameSite=None', [{
                        name: 'cookie1',
                        value: 'value',
                        httpOnly: true,
                        secure: true,
                        sameSite: "None" /* None */,
                        size: 48,
                    }]);
            });
            it('with value Strict', () => {
                parseAndExpectSetCookies('cookie1 = value; HttpOnly; Secure; SameSite=Strict', [{
                        name: 'cookie1',
                        value: 'value',
                        httpOnly: true,
                        secure: true,
                        sameSite: "Strict" /* Strict */,
                        size: 50,
                    }]);
            });
        });
        it('handles cookies without a name', () => {
            parseAndExpectSetCookies('cookie1; Path=/; Domain=.example.com;', [{ name: '', value: 'cookie1', path: '/', domain: '.example.com', size: 37 }]);
        });
        it('handles cookies without a value', () => {
            parseAndExpectSetCookies('cookie1=; Path=/; Domain=.example.com;', [{ name: 'cookie1', value: '', path: '/', domain: '.example.com', size: 38 }]);
        });
        it('handles cookies with whitespace in the name', () => {
            parseAndExpectSetCookies('   cookie 1  =value1; Path=/; Domain=.example.com;', [{ name: 'cookie 1', value: 'value1', path: '/', domain: '.example.com', size: 50 }]);
        });
        describe('it handles the priority attribute', () => {
            it('with value Low', () => {
                parseAndExpectSetCookies('cookie1=; Path=/; Domain=.example.com; Priority=Low', [{
                        name: 'cookie1',
                        value: '',
                        path: '/',
                        domain: '.example.com',
                        priority: "Low" /* Low */,
                        size: 51,
                    }]);
            });
            it('with value Medium', () => {
                parseAndExpectSetCookies('cookie1=; Path=/; Domain=.example.com; Priority=Medium', [{
                        name: 'cookie1',
                        value: '',
                        path: '/',
                        domain: '.example.com',
                        priority: "Medium" /* Medium */,
                        size: 54,
                    }]);
            });
            it('with value High', () => {
                parseAndExpectSetCookies('cookie1=; Path=/; Domain=.example.com; Priority=High', [{
                        name: 'cookie1',
                        value: '',
                        path: '/',
                        domain: '.example.com',
                        priority: "High" /* High */,
                        size: 52,
                    }]);
            });
        });
    });
});
//# sourceMappingURL=CookieParser_test.js.map