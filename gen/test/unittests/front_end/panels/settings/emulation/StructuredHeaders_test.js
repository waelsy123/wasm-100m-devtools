// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
const { assert } = chai;
import * as EmulationUtils from '../../../../../../front_end/panels/settings/emulation/utils/utils.js';
var StructuredHeaders = EmulationUtils.StructuredHeaders;
function assertItemError(result) {
    assert.strictEqual(result.kind, 0 /* ERROR */);
}
function assertItemValue(result, expectedKind, expected) {
    if (result.kind === 0 /* ERROR */) {
        assert.fail('Got error instead of Item containing kind ' + expectedKind);
        return;
    }
    const bareItem = result.value;
    if (bareItem.kind !== expectedKind) {
        assert.fail('Item type is ' + bareItem.kind + ' instead of ' + expectedKind);
        return;
    }
    assert.strictEqual(bareItem.value, expected);
}
function assertItemInteger(result, expected) {
    assertItemValue(result, 5 /* INTEGER */, expected);
}
function assertItemDecimal(result, expected) {
    assertItemValue(result, 6 /* DECIMAL */, expected);
}
function assertItemString(result, expected) {
    assertItemValue(result, 7 /* STRING */, expected);
}
function assertItemToken(result, expected) {
    assertItemValue(result, 8 /* TOKEN */, expected);
}
function assertItemBinary(result, expected) {
    assertItemValue(result, 9 /* BINARY */, expected);
}
function assertItemBoolean(result, expected) {
    assertItemValue(result, 10 /* BOOLEAN */, expected);
}
function assertParams(result, expectParams) {
    assert.lengthOf(result.items, expectParams.length);
    for (let i = 0; i < expectParams.length; ++i) {
        assert.strictEqual(result.items[i].name.value, expectParams[i][0]);
        assert.deepStrictEqual(result.items[i].value, expectParams[i][1], 'Param ' + i + ' value mismatch');
    }
}
function assertItemParams(result, expectParams) {
    if (result.kind === 0 /* ERROR */) {
        assert.fail('No params on parse error');
        return;
    }
    assertParams(result.parameters, expectParams);
}
function assertListError(result) {
    assert.strictEqual(result.kind, 0 /* ERROR */);
}
function assertListAndGetItems(result) {
    if (result.kind === 0 /* ERROR */) {
        assert.fail('Got error instead of List');
        return [];
    }
    return result.items;
}
function assertListItem(item, expectValue, expectParams) {
    if (item.kind === 12 /* INNER_LIST */) {
        assert.fail('Unexpected inner list when an item expected');
        return;
    }
    assert.deepStrictEqual(item.value, expectValue, 'List item bare value mismatch, ' + item.value.value + ' vs expected ' + expectValue.value);
    assertItemParams(item, expectParams);
}
function assertInnerListAndGetItems(item, expectParams) {
    if (item.kind !== 12 /* INNER_LIST */) {
        assert.fail('Expected inner list, got:' + item.kind);
        return [];
    }
    assertParams(item.parameters, expectParams);
    return item.items;
}
function assertSerializeResult(result, expected) {
    if (result.kind === 0 /* ERROR */) {
        assert.fail('Got error instead of serialization result');
        return;
    }
    assert.strictEqual(result.value, expected);
}
function assertSerializeError(result) {
    assert.strictEqual(result.kind, 0 /* ERROR */);
}
function makeItem(bareItem) {
    return {
        kind: 4 /* ITEM */,
        value: bareItem,
        parameters: { kind: 3 /* PARAMETERS */, items: [] },
    };
}
function makeParams(params) {
    const typedParams = { kind: 3 /* PARAMETERS */, items: [] };
    for (const param of params) {
        typedParams.items.push({
            kind: 2 /* PARAMETER */,
            name: { kind: 1 /* PARAM_NAME */, value: param[0] },
            value: param[1],
        });
    }
    return typedParams;
}
function makeItemWithParams(bareItem, params) {
    return { kind: 4 /* ITEM */, value: bareItem, parameters: makeParams(params) };
}
function makeList(items) {
    return { kind: 11 /* LIST */, items: items };
}
function makeInnerList(items, params) {
    return { kind: 12 /* INNER_LIST */, items: items, parameters: makeParams(params) };
}
describe('StructuredHeaders', () => {
    describe('Parsing', () => {
        it('Parses integers', () => {
            assertItemInteger(StructuredHeaders.parseItem('23'), 23);
            assertItemInteger(StructuredHeaders.parseItem('023'), 23);
            assertItemInteger(StructuredHeaders.parseItem('-100'), -100);
            assertItemInteger(StructuredHeaders.parseItem('-0'), 0);
            assertItemInteger(StructuredHeaders.parseItem('-999999999999999'), -999999999999999);
            assertItemInteger(StructuredHeaders.parseItem('999999999999999'), 999999999999999);
            assertItemError(StructuredHeaders.parseItem('1999999999999999'));
            assertItemError(StructuredHeaders.parseItem('-1999999999999999'));
            assertItemError(StructuredHeaders.parseItem('-'));
            assertItemError(StructuredHeaders.parseItem('--1'));
        });
        it('Parses decimals', () => {
            assertItemDecimal(StructuredHeaders.parseItem('23.4'), 23.4);
            assertItemDecimal(StructuredHeaders.parseItem('023.4'), 23.4);
            assertItemDecimal(StructuredHeaders.parseItem('-100.3'), -100.3);
            assertItemDecimal(StructuredHeaders.parseItem('-100.32'), -100.32);
            assertItemDecimal(StructuredHeaders.parseItem('100.325'), 100.325);
            assertItemDecimal(StructuredHeaders.parseItem('-0.0'), -0);
            assertItemDecimal(StructuredHeaders.parseItem('-999999999999.999'), -999999999999.999);
            assertItemDecimal(StructuredHeaders.parseItem('999999999999.999'), 999999999999.999);
            assertItemError(StructuredHeaders.parseItem('.'));
            assertItemError(StructuredHeaders.parseItem('1.'));
            assertItemError(StructuredHeaders.parseItem('1.0000'));
            assertItemError(StructuredHeaders.parseItem('--1.0'));
            assertItemError(StructuredHeaders.parseItem('1999999999999.9'));
        });
        it('Parses strings', () => {
            assertItemString(StructuredHeaders.parseItem('"abcd"'), 'abcd');
            assertItemString(StructuredHeaders.parseItem('"a\\"\\\\"'), 'a"\\');
            assertItemError(StructuredHeaders.parseItem('"\\n"'));
            assertItemError(StructuredHeaders.parseItem('"\\"'));
            assertItemError(StructuredHeaders.parseItem('"foo'));
            assertItemError(StructuredHeaders.parseItem('"'));
        });
        it('Parses tokens', () => {
            assertItemToken(StructuredHeaders.parseItem('abcd'), 'abcd');
            assertItemToken(StructuredHeaders.parseItem('*'), '*');
            assertItemToken(StructuredHeaders.parseItem('*z/foo:bar'), '*z/foo:bar');
            assertItemError(StructuredHeaders.parseItem('/far'));
        });
        it('Parses binary', () => {
            assertItemBinary(StructuredHeaders.parseItem(':aBcd+/ef0=:'), 'aBcd+/ef0=');
            assertItemError(StructuredHeaders.parseItem(':foo'));
            assertItemError(StructuredHeaders.parseItem(':'));
        });
        it('Parses booleans', () => {
            assertItemBoolean(StructuredHeaders.parseItem('?0'), false);
            assertItemBoolean(StructuredHeaders.parseItem('?1'), true);
            assertItemError(StructuredHeaders.parseItem('?01'));
            assertItemError(StructuredHeaders.parseItem('?2'));
            assertItemError(StructuredHeaders.parseItem('?'));
        });
        it('Parses parameters', () => {
            const r1 = StructuredHeaders.parseItem('token; a=1; b=?0');
            assertItemToken(r1, 'token');
            assertItemParams(r1, [
                ['a', { kind: 5 /* INTEGER */, value: 1 }],
                ['b', { kind: 10 /* BOOLEAN */, value: false }],
            ]);
            const r2 = StructuredHeaders.parseItem('token; a; b=?0');
            assertItemToken(r2, 'token');
            assertItemParams(r2, [
                ['a', { kind: 10 /* BOOLEAN */, value: true }],
                ['b', { kind: 10 /* BOOLEAN */, value: false }],
            ]);
            const r3 = StructuredHeaders.parseItem('token; *a123-456.789_0*');
            assertItemToken(r3, 'token');
            assertItemParams(r3, [
                ['*a123-456.789_0*', { kind: 10 /* BOOLEAN */, value: true }],
            ]);
            assertItemError(StructuredHeaders.parseItem('token; A=1'));
            assertItemError(StructuredHeaders.parseItem('token; aA=1'));
            assertItemError(StructuredHeaders.parseItem('token ;a=1'));
            assertItemError(StructuredHeaders.parseItem('token; a=1;'));
        });
        it('Handles duplicate parameter names per spec', () => {
            const r = StructuredHeaders.parseItem('toooken; a=1; b=?0; a=2; c=4.2; b=?1; a=4; b="hi"');
            assertItemToken(r, 'toooken');
            assertItemParams(r, [
                ['c', { kind: 6 /* DECIMAL */, value: 4.2 }],
                ['a', { kind: 5 /* INTEGER */, value: 4 }],
                ['b', { kind: 7 /* STRING */, value: 'hi' }],
            ]);
        });
        it('Parses lists', () => {
            const items = assertListAndGetItems(StructuredHeaders.parseList('a, \t"b", ?0;d;e=42'));
            assert.lengthOf(items, 3);
            assertListItem(items[0], { kind: 8 /* TOKEN */, value: 'a' }, []);
            assertListItem(items[1], { kind: 7 /* STRING */, value: 'b' }, []);
            assertListItem(items[2], { kind: 10 /* BOOLEAN */, value: false }, [
                ['d', { kind: 10 /* BOOLEAN */, value: true }],
                ['e', { kind: 5 /* INTEGER */, value: 42 }],
            ]);
        });
        it('Parses empty list', () => {
            // Grammar seems to reject it, but the algorithm (which is normative) seems OK
            // with it, and 0-length lists are OK per the data model.
            const items = assertListAndGetItems(StructuredHeaders.parseList(''));
            assert.lengthOf(items, 0);
        });
        it('Parses inner lists', () => {
            const items = assertListAndGetItems(StructuredHeaders.parseList('a, ("b" "c"), (d e)'));
            assert.lengthOf(items, 3);
            assertListItem(items[0], { kind: 8 /* TOKEN */, value: 'a' }, []);
            const itemsL1 = assertInnerListAndGetItems(items[1], []);
            assert.lengthOf(itemsL1, 2);
            assertListItem(itemsL1[0], { kind: 7 /* STRING */, value: 'b' }, []);
            assertListItem(itemsL1[1], { kind: 7 /* STRING */, value: 'c' }, []);
            const itemsL2 = assertInnerListAndGetItems(items[2], []);
            assert.lengthOf(itemsL2, 2);
            assertListItem(itemsL2[0], { kind: 8 /* TOKEN */, value: 'd' }, []);
            assertListItem(itemsL2[1], { kind: 8 /* TOKEN */, value: 'e' }, []);
        });
        it('Parses empty inner lists', () => {
            // Empty inner lists are OK.
            const items = assertListAndGetItems(StructuredHeaders.parseList(' (  )  '));
            assert.lengthOf(items, 1);
            const itemsL0 = assertInnerListAndGetItems(items[0], []);
            assert.lengthOf(itemsL0, 0);
        });
        it('Parses inner list params', () => {
            // Example from spec, with inner list params and item params.
            const items = assertListAndGetItems(StructuredHeaders.parseList('("foo"; a=1;b=2);lvl=5, ("bar" "baz");lvl=1'));
            assert.lengthOf(items, 2);
            const itemsL0 = assertInnerListAndGetItems(items[0], [['lvl', { kind: 5 /* INTEGER */, value: 5 }]]);
            assert.lengthOf(itemsL0, 1);
            assertListItem(itemsL0[0], { kind: 7 /* STRING */, value: 'foo' }, [
                ['a', { kind: 5 /* INTEGER */, value: 1 }],
                ['b', { kind: 5 /* INTEGER */, value: 2 }],
            ]);
            const itemsL1 = assertInnerListAndGetItems(items[1], [['lvl', { kind: 5 /* INTEGER */, value: 1 }]]);
            assert.lengthOf(itemsL1, 2);
            assertListItem(itemsL1[0], { kind: 7 /* STRING */, value: 'bar' }, []);
            assertListItem(itemsL1[1], { kind: 7 /* STRING */, value: 'baz' }, []);
        });
        it('Detects various list syntax errors', () => {
            assertListError(StructuredHeaders.parseList('a,'));
            assertListError(StructuredHeaders.parseList('a b'));
            assertListError(StructuredHeaders.parseList('(a,'));
            assertListError(StructuredHeaders.parseList('(a,b'));
        });
    });
    describe('Serialization', () => {
        it('Serializes integers', () => {
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 5 /* INTEGER */, value: -45 })), '-45');
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 5 /* INTEGER */, value: 999999999999999 })), '999999999999999');
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 5 /* INTEGER */, value: -999999999999999 })), '-999999999999999');
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 5 /* INTEGER */, value: 3.14 })));
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 5 /* INTEGER */, value: -1000000000000000 })));
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 5 /* INTEGER */, value: 1000000000000000 })));
        });
        it('Serializes strings', () => {
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 7 /* STRING */, value: 'str' })), '"str"');
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 7 /* STRING */, value: 'str"\\' })), '"str\\"\\\\"');
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 7 /* STRING */, value: '' })), '""');
            // Only printable ASCII....
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 7 /* STRING */, value: '\u2124' })));
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 7 /* STRING */, value: '\u007f' })));
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 7 /* STRING */, value: '\u001f' })));
        });
        it('Serializes tokens', () => {
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 8 /* TOKEN */, value: 'tok' })), 'tok');
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 8 /* TOKEN */, value: '*foo:bar/baz' })), '*foo:bar/baz');
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 8 /* TOKEN */, value: '/foo' })));
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 8 /* TOKEN */, value: '*,' })));
            assertSerializeError(StructuredHeaders.serializeItem(makeItem({ kind: 8 /* TOKEN */, value: '' })));
        });
        it('Serializes booleans', () => {
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 10 /* BOOLEAN */, value: true })), '?1');
            assertSerializeResult(StructuredHeaders.serializeItem(makeItem({ kind: 10 /* BOOLEAN */, value: false })), '?0');
        });
        it('Serializes parameters', () => {
            assertSerializeResult(StructuredHeaders.serializeItem(makeItemWithParams({ kind: 10 /* BOOLEAN */, value: true }, [
                ['arg1', { kind: 10 /* BOOLEAN */, value: true }],
                ['arg2', { kind: 10 /* BOOLEAN */, value: false }],
            ])), '?1;arg1;arg2=?0');
            assertSerializeResult(StructuredHeaders.serializeItem(makeItemWithParams({ kind: 10 /* BOOLEAN */, value: true }, [
                ['*1', { kind: 8 /* TOKEN */, value: 'Yes' }],
                ['*2', { kind: 5 /* INTEGER */, value: 1 }],
            ])), '?1;*1=Yes;*2=1');
            assertSerializeError(StructuredHeaders.serializeItem(makeItemWithParams({ kind: 10 /* BOOLEAN */, value: true }, [['Arg1', { kind: 10 /* BOOLEAN */, value: true }]])));
            assertSerializeError(StructuredHeaders.serializeItem(makeItemWithParams({ kind: 10 /* BOOLEAN */, value: true }, [['*Arg1', { kind: 10 /* BOOLEAN */, value: true }]])));
        });
    });
    it('Serializes lists', () => {
        assertSerializeResult(StructuredHeaders.serializeList(makeList([])), '');
        assertSerializeResult(StructuredHeaders.serializeList(makeList([
            makeItem({ kind: 10 /* BOOLEAN */, value: false }),
            makeItem({ kind: 10 /* BOOLEAN */, value: true }),
        ])), '?0, ?1');
        assertSerializeResult(StructuredHeaders.serializeList(makeList([
            makeItemWithParams({ kind: 7 /* STRING */, value: 'hi' }, [
                ['arg1', { kind: 10 /* BOOLEAN */, value: true }],
                ['arg2', { kind: 10 /* BOOLEAN */, value: false }],
            ]),
            makeItem({ kind: 10 /* BOOLEAN */, value: true }),
        ])), '"hi";arg1;arg2=?0, ?1');
        assertSerializeResult(StructuredHeaders.serializeList(makeList([makeItem({ kind: 10 /* BOOLEAN */, value: true }), makeInnerList([], [])])), '?1, ()');
        assertSerializeResult(StructuredHeaders.serializeList(makeList([
            makeItem({ kind: 10 /* BOOLEAN */, value: true }),
            makeInnerList([
                makeItem({ kind: 5 /* INTEGER */, value: 1 }),
                makeItem({ kind: 5 /* INTEGER */, value: 2 }),
            ], []),
            makeInnerList([
                makeItem({ kind: 5 /* INTEGER */, value: 3 }),
                makeItemWithParams({ kind: 5 /* INTEGER */, value: 4 }, [['p1', { kind: 10 /* BOOLEAN */, value: true }]]),
            ], [['o1', { kind: 7 /* STRING */, value: 'val' }]]),
        ])), '?1, (1 2), (3 4;p1);o1="val"');
        assertSerializeError(StructuredHeaders.serializeList(makeList([
            makeItem({ kind: 7 /* STRING */, value: '\u0000' }),
            makeItem({ kind: 10 /* BOOLEAN */, value: true }),
        ])));
        assertSerializeError(StructuredHeaders.serializeList(makeList([
            makeItemWithParams({ kind: 7 /* STRING */, value: 'hi' }, [
                ['Arg1', { kind: 10 /* BOOLEAN */, value: true }],
                ['arg2', { kind: 10 /* BOOLEAN */, value: false }],
            ]),
            makeItem({ kind: 10 /* BOOLEAN */, value: true }),
        ])));
        assertSerializeError(StructuredHeaders.serializeList(makeList([
            makeItem({ kind: 10 /* BOOLEAN */, value: true }),
            makeInnerList([
                makeItem({ kind: 5 /* INTEGER */, value: 1.34 }),
                makeItem({ kind: 5 /* INTEGER */, value: 2 }),
            ], []),
        ])));
        assertSerializeError(StructuredHeaders.serializeList(makeList([makeInnerList([], [['+o1', { kind: 7 /* STRING */, value: 'val' }]])])));
    });
});
//# sourceMappingURL=StructuredHeaders_test.js.map