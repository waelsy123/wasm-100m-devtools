"use strict";
// Copyright 2020 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const helper_js_1 = require("../../shared/helper.js");
const mocha_extensions_js_1 = require("../../shared/mocha-extensions.js");
const extension_helpers_js_1 = require("../helpers/extension-helpers.js");
const console_helpers_js_1 = require("../helpers/console-helpers.js");
const sources_helpers_js_1 = require("../helpers/sources-helpers.js");
// This testcase reaches into DevTools internals to install the extension plugin. At this point, there is no sensible
// alternative, because loading a real extension is not supported in our test setup.
(0, mocha_extensions_js_1.describe)('The Debugger Language Plugins', async () => {
    beforeEach(async () => {
        await (0, helper_js_1.enableExperiment)('wasmDWARFDebugging');
    });
    // Load a simple wasm file and verify that the source file shows up in the file tree.
    (0, mocha_extensions_js_1.it)('can show C filenames after loading the module', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            // A simple plugin that resolves to a single source file
            class SingleFilePlugin {
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const fileUrl = new URL('/source_file.c', rawModule.url || symbols);
                    return [fileUrl.href];
                }
            }
            RegisterExtension(new SingleFilePlugin(), 'Single File', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openFileInSourcesPanel)('wasm/global_variable.html');
        await (0, sources_helpers_js_1.listenForSourceFilesAdded)(frontend);
        const additionalFilesPromise = (0, sources_helpers_js_1.waitForAdditionalSourceFiles)(frontend);
        await target.evaluate('go();');
        await additionalFilesPromise;
        const capturedFileNames = await (0, sources_helpers_js_1.retrieveSourceFilesAdded)(frontend);
        chai_1.assert.deepEqual(capturedFileNames, ['/test/e2e/resources/sources/wasm/global_variable.wasm', '/source_file.c']);
    });
    // Resolve a single code offset to a source line to test the correctness of offset computations.
    (0, mocha_extensions_js_1.it)('use correct code offsets to interpret raw locations', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            class LocationMappingPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('unreachable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 6, endOffset: 7 },
                        sourceLocation: { rawModuleId, sourceFileURL, lineNumber: 5, columnNumber: 2 },
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocation } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocation && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocation];
                    }
                    return [];
                }
            }
            RegisterExtension(new LocationMappingPlugin(), 'Location Mapping', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        await (0, helper_js_1.goToResource)('sources/wasm/unreachable.html');
        await (0, helper_js_1.waitFor)('.paused-status');
        const callFrameLoc = await (0, helper_js_1.waitFor)('.call-frame-location');
        const scriptLocation = await callFrameLoc.evaluate(location => location.textContent);
        chai_1.assert.deepEqual(scriptLocation, 'unreachable.ll:6');
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        const error = await (0, helper_js_1.waitForFunction)(async () => {
            const messages = await (0, console_helpers_js_1.getStructuredConsoleMessages)();
            return messages.find(message => message.message.startsWith('Uncaught (in promise) RuntimeError: unreachable'));
        });
        const callframes = error.message.split('\n').slice(1);
        chai_1.assert.deepEqual(callframes, ['    at Main (unreachable.ll:6:3)', '    at go (unreachable.html:27:29)']);
    });
    // Resolve the location for a breakpoint.
    (0, mocha_extensions_js_1.it)('resolve locations for breakpoints correctly', async () => {
        const { target, frontend } = (0, helper_js_1.getBrowserAndPages)();
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            // This plugin will emulate a source mapping with a single file and a single corresponding source line and byte
            // code offset pair.
            class LocationMappingPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('global_variable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 25, endOffset: 26 },
                        sourceLocation: { rawModuleId, sourceFileURL, lineNumber: 8, columnNumber: -1 },
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocation } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocation && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocation];
                    }
                    return [];
                }
                async sourceLocationToRawLocation(sourceLocationArg) {
                    const { rawLocationRange, sourceLocation } = this.modules.get(sourceLocationArg.rawModuleId) || {};
                    if (rawLocationRange && sourceLocation &&
                        JSON.stringify(sourceLocation) === JSON.stringify(sourceLocationArg)) {
                        return [rawLocationRange];
                    }
                    return [];
                }
                async getMappedLines(rawModuleId, sourceFileURL) {
                    const { sourceLocation } = this.modules.get(rawModuleId) || {};
                    if (sourceLocation && sourceLocation.sourceFileURL === sourceFileURL) {
                        return [5, 6, 7, 8, 9];
                    }
                    return undefined;
                }
            }
            RegisterExtension(new LocationMappingPlugin(), 'Location Mapping', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openFileInSourcesPanel)('wasm/global_variable.html');
        await target.evaluate('go();');
        await (0, sources_helpers_js_1.openFileInEditor)('global_variable.ll');
        const toolbar = await (0, helper_js_1.waitFor)('.sources-toolbar');
        const itemElements = await (0, helper_js_1.waitForMany)('.toolbar-item', 2, toolbar);
        const items = await Promise.all(itemElements.map(e => e.evaluate(e => e.textContent)));
        chai_1.assert.isAtLeast(items.indexOf('(provided via debug info by global_variable.wasm)'), 0, 'Toolbar debug info hint not found');
        // Line 4 is non-breakable.
        chai_1.assert.include(await (0, sources_helpers_js_1.getNonBreakableLines)(), 4);
        await (0, sources_helpers_js_1.addBreakpointForLine)(frontend, 9);
        const scriptLocation = await (0, sources_helpers_js_1.retrieveTopCallFrameScriptLocation)('main();', target);
        chai_1.assert.deepEqual(scriptLocation, 'global_variable.ll:9');
        await (0, helper_js_1.waitForFunction)(async () => !(await (0, sources_helpers_js_1.isBreakpointSet)(4)));
    });
    (0, mocha_extensions_js_1.it)('shows top-level and nested variables', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluateHandle(() => {
            class VariableListingPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('unreachable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 6, endOffset: 7 },
                        sourceLocation: { rawModuleId, sourceFileURL, lineNumber: 5, columnNumber: 2 },
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocation } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocation && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocation];
                    }
                    return [];
                }
                async getScopeInfo(type) {
                    return { type, typeName: type };
                }
                async listVariablesInScope(rawLocation) {
                    const { rawLocationRange } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [
                            { scope: 'LOCAL', name: 'localX', type: 'int' },
                            { scope: 'GLOBAL', name: 'n1::n2::globalY', nestedName: ['n1', 'n2', 'globalY'], type: 'float' },
                        ];
                    }
                    return [];
                }
            }
            RegisterExtension(new VariableListingPlugin(), 'Location Mapping', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        await (0, helper_js_1.goToResource)('sources/wasm/unreachable.html');
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        const locals = await (0, sources_helpers_js_1.getValuesForScope)('LOCAL', 0, 1);
        chai_1.assert.deepEqual(locals, ['localX: undefined']);
        const globals = await (0, sources_helpers_js_1.getValuesForScope)('GLOBAL', 2, 3);
        chai_1.assert.deepEqual(globals, ['n1: namespace', 'n2: namespace', 'globalY: undefined']);
    });
    (0, mocha_extensions_js_1.it)('shows inline frames', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            class InliningPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('unreachable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 6, endOffset: 7 },
                        sourceLocations: [
                            { rawModuleId, sourceFileURL, lineNumber: 5, columnNumber: 2 },
                            { rawModuleId, sourceFileURL, lineNumber: 10, columnNumber: 2 },
                            { rawModuleId, sourceFileURL, lineNumber: 15, columnNumber: 2 },
                        ],
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocations } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocations && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocations[rawLocation.inlineFrameIndex || 0]];
                    }
                    return [];
                }
                async getFunctionInfo(rawLocation) {
                    const { rawLocationRange } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return { frames: [{ name: 'inner_inline_func' }, { name: 'outer_inline_func' }, { name: 'Main' }] };
                    }
                    return { frames: [] };
                }
                async getScopeInfo(type) {
                    return { type, typeName: type };
                }
                async listVariablesInScope(rawLocation) {
                    const { rawLocationRange } = this.modules.get(rawLocation.rawModuleId) || {};
                    const frame = rawLocation.inlineFrameIndex || 0;
                    if (rawLocationRange && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [
                            { scope: 'LOCAL', name: `localX${frame}`, type: 'int' },
                        ];
                    }
                    return [];
                }
            }
            RegisterExtension(new InliningPlugin(), 'Inlining', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        await (0, helper_js_1.goToResource)('sources/wasm/unreachable.html');
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        // Call stack shows inline function names and source locations.
        const funcNames = await (0, sources_helpers_js_1.getCallFrameNames)();
        chai_1.assert.deepEqual(funcNames, ['inner_inline_func', 'outer_inline_func', 'Main', 'go', 'await in go (async)', '(anonymous)']);
        const sourceLocations = await (0, sources_helpers_js_1.getCallFrameLocations)();
        chai_1.assert.deepEqual(sourceLocations, ['unreachable.ll:6', 'unreachable.ll:11', 'unreachable.ll:16', 'unreachable.html:27', 'unreachable.html:30']);
        // We see variables for innermost frame.
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getValuesForScope)('LOCAL', 0, 1), ['localX0: undefined']);
        // Switching frames affects what variables we see.
        await (0, sources_helpers_js_1.switchToCallFrame)(2);
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getValuesForScope)('LOCAL', 0, 1), ['localX1: undefined']);
        await (0, sources_helpers_js_1.switchToCallFrame)(3);
        chai_1.assert.deepEqual(await (0, sources_helpers_js_1.getValuesForScope)('LOCAL', 0, 1), ['localX2: undefined']);
        await (0, helper_js_1.click)(sources_helpers_js_1.RESUME_BUTTON);
        await (0, helper_js_1.waitForFunction)(async () => {
            const messages = await (0, console_helpers_js_1.getStructuredConsoleMessages)();
            if (!messages.length) {
                return false;
            }
            const message = messages[messages.length - 1];
            return message.message === `Uncaught (in promise) RuntimeError: unreachable
    at inner_inline_func (unreachable.ll:6)
    at outer_inline_func (unreachable.ll:11)
    at Main (unreachable.ll:16)
    at go (unreachable.html:27:29)`;
        });
    });
    (0, mocha_extensions_js_1.it)('falls back to wasm function names when inline info not present', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            class InliningPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('unreachable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 6, endOffset: 7 },
                        sourceLocations: [
                            { rawModuleId, sourceFileURL, lineNumber: 5, columnNumber: 2 },
                        ],
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocations } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocations && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocations[rawLocation.inlineFrameIndex || 0]];
                    }
                    return [];
                }
                async getFunctionInfo(rawLocation) {
                    const { rawLocationRange } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return { frames: [] };
                    }
                    return { frames: [] };
                }
                async getScopeInfo(type) {
                    return { type, typeName: type };
                }
                async listVariablesInScope(_rawLocation) {
                    return [];
                }
            }
            RegisterExtension(new InliningPlugin(), 'Inlining', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        await (0, helper_js_1.goToResource)('sources/wasm/unreachable.html');
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        // Call stack shows inline function names and source locations.
        const funcNames = await (0, sources_helpers_js_1.getCallFrameNames)();
        chai_1.assert.deepEqual(funcNames, ['$Main', 'go', 'await in go (async)', '(anonymous)']);
        const sourceLocations = await (0, sources_helpers_js_1.getCallFrameLocations)();
        chai_1.assert.deepEqual(sourceLocations, ['unreachable.ll:6', 'unreachable.html:27', 'unreachable.html:30']);
    });
    (0, mocha_extensions_js_1.it)('shows variable values with JS formatters', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            class VariableListingPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('unreachable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 6, endOffset: 7 },
                        sourceLocation: { rawModuleId, sourceFileURL, lineNumber: 5, columnNumber: 2 },
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocation } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocation && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocation];
                    }
                    return [];
                }
                async listVariablesInScope(_rawLocation) {
                    return [{ scope: 'LOCAL', name: 'local', type: 'TestType' }];
                }
                async getScopeInfo(type) {
                    return { type, typeName: type };
                }
                async getTypeInfo(expression, _context) {
                    if (expression === 'local') {
                        const typeInfos = [
                            {
                                typeNames: ['TestType'],
                                typeId: 'TestType',
                                members: [{ name: 'member', offset: 1, typeId: 'TestTypeMember' }],
                                alignment: 0,
                                arraySize: 0,
                                size: 4,
                                canExpand: true,
                                hasValue: false,
                            },
                            {
                                typeNames: ['TestTypeMember'],
                                typeId: 'TestTypeMember',
                                members: [{ name: 'member2', offset: 1, typeId: 'TestTypeMember2' }],
                                alignment: 0,
                                arraySize: 0,
                                size: 3,
                                canExpand: true,
                                hasValue: false,
                            },
                            {
                                typeNames: ['TestTypeMember2'],
                                typeId: 'TestTypeMember2',
                                members: [],
                                alignment: 0,
                                arraySize: 0,
                                size: 2,
                                canExpand: false,
                                hasValue: true,
                            },
                            {
                                typeNames: ['int'],
                                typeId: 'int',
                                members: [],
                                alignment: 0,
                                arraySize: 0,
                                size: 4,
                                canExpand: false,
                                hasValue: true,
                            },
                        ];
                        const base = { rootType: typeInfos[0], payload: 28 };
                        return { typeInfos, base };
                    }
                    return null;
                }
                async getFormatter(expressionOrField, _context) {
                    function formatWithDescription(description) {
                        const sym = Symbol('sym');
                        const tag = { className: '$tag', symbol: sym };
                        return { tag, value: 27, description };
                    }
                    function format(description) {
                        const sym = Symbol('sym');
                        const tag = { className: '$tag', symbol: sym };
                        class $tag {
                            [sym];
                            constructor(value) {
                                const rootType = {
                                    typeNames: ['int'],
                                    typeId: 'int',
                                    members: [],
                                    alignment: 0,
                                    arraySize: 0,
                                    size: 4,
                                    canExpand: false,
                                    hasValue: true,
                                };
                                this[sym] = { payload: { value }, rootType };
                            }
                        }
                        const value = { value: 26, recurse: new $tag(19), describe: new $tag(20) };
                        Object.setPrototypeOf(value, null);
                        return { tag, value, description };
                    }
                    if (typeof expressionOrField === 'string') {
                        return null;
                    }
                    const { base, field } = expressionOrField;
                    if (base.payload === 28 && field.length === 2 && field[0].name === 'member' && field[0].offset === 1 &&
                        field[0].typeId === 'TestTypeMember' && field[1].name === 'member2' && field[1].offset === 1 &&
                        field[1].typeId === 'TestTypeMember2') {
                        return { js: `(${format})()` };
                    }
                    if (base.payload.value === 19 && field.length === 0) {
                        return { js: '27' };
                    }
                    if (base.payload.value === 20 && field.length === 0) {
                        return { js: `(${formatWithDescription})('CustomLabel')` };
                    }
                    return null;
                }
            }
            RegisterExtension(new VariableListingPlugin(), 'Location Mapping', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        await (0, helper_js_1.goToResource)('sources/wasm/unreachable.html');
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        const locals = await (0, sources_helpers_js_1.getValuesForScope)('LOCAL', 3, 6);
        chai_1.assert.deepEqual(locals, [
            'local: TestType',
            'member: TestTypeMember',
            'member2: TestTypeMember2',
            'describe: CustomLabel',
            'recurse: 27',
            'value: 26',
        ]);
    });
    (0, mocha_extensions_js_1.it)('shows variable value in popover', async () => {
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            class VariableListingPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('unreachable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 6, endOffset: 7 },
                        sourceLocation: { rawModuleId, sourceFileURL, lineNumber: 5, columnNumber: 2 },
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocation } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocation && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocation];
                    }
                    return [];
                }
                async getScopeInfo(type) {
                    return { type, typeName: type };
                }
                async listVariablesInScope(rawLocation) {
                    const { rawLocationRange } = this.modules.get(rawLocation.rawModuleId) || {};
                    const { codeOffset } = rawLocation;
                    if (!rawLocationRange || rawLocationRange.startOffset > codeOffset ||
                        rawLocationRange.endOffset <= codeOffset) {
                        return [];
                    }
                    // The source code is LLVM IR so there are no meaningful variable names. Most tokens are however
                    // identified as js-variable tokens by codemirror, so we can pretend they're variables. The unreachable
                    // instruction is where we pause at, so it's really easy to find in the page and is a great mock variable
                    // candidate.
                    return [{ scope: 'LOCAL', name: 'unreachable', type: 'int' }];
                }
                async getTypeInfo(expression, _context) {
                    if (expression === 'unreachable') {
                        const typeInfos = [{
                                typeNames: ['int'],
                                typeId: 'int',
                                members: [],
                                alignment: 0,
                                arraySize: 0,
                                size: 4,
                                canExpand: false,
                                hasValue: true,
                            }];
                        const base = { rootType: typeInfos[0], payload: 28 };
                        return { typeInfos, base };
                    }
                    return null;
                }
                async getFormatter(_expressionOrField, _context) {
                    return { js: '23' };
                }
            }
            RegisterExtension(new VariableListingPlugin(), 'Location Mapping', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        await (0, sources_helpers_js_1.openSourceCodeEditorForFile)('unreachable.ll', 'wasm/unreachable.html');
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        const pausedPosition = await (0, helper_js_1.waitForFunction)(async () => {
            const element = await (0, helper_js_1.$)('.cm-executionToken');
            if (element && await element.evaluate(e => e.isConnected)) {
                return element;
            }
            return undefined;
        });
        await pausedPosition.hover();
        const popover = await (0, helper_js_1.waitFor)('[data-stable-name-for-test="object-popover-content"]');
        const value = await (0, helper_js_1.waitFor)('.object-value-number', popover).then(e => e.evaluate(node => node.textContent));
        chai_1.assert.strictEqual(value, '23');
    });
    (0, mocha_extensions_js_1.it)('shows sensible error messages.', async () => {
        const { frontend } = (0, helper_js_1.getBrowserAndPages)();
        const extension = await (0, extension_helpers_js_1.loadExtension)('TestExtension', `${(0, extension_helpers_js_1.getResourcesPathWithDevToolsHostname)()}/extensions/language_extensions.html`);
        await extension.evaluate(() => {
            class FormattingErrorsPlugin {
                modules;
                constructor() {
                    this.modules = new Map();
                }
                async addRawModule(rawModuleId, symbols, rawModule) {
                    const sourceFileURL = new URL('unreachable.ll', rawModule.url || symbols).href;
                    this.modules.set(rawModuleId, {
                        rawLocationRange: { rawModuleId, startOffset: 6, endOffset: 7 },
                        sourceLocation: { rawModuleId, sourceFileURL, lineNumber: 5, columnNumber: 2 },
                    });
                    return [sourceFileURL];
                }
                async rawLocationToSourceLocation(rawLocation) {
                    const { rawLocationRange, sourceLocation } = this.modules.get(rawLocation.rawModuleId) || {};
                    if (rawLocationRange && sourceLocation && rawLocationRange.startOffset <= rawLocation.codeOffset &&
                        rawLocation.codeOffset < rawLocationRange.endOffset) {
                        return [sourceLocation];
                    }
                    return [];
                }
                async getScopeInfo(type) {
                    return { type, typeName: type };
                }
                async listVariablesInScope(rawLocation) {
                    const { rawLocationRange } = this.modules.get(rawLocation.rawModuleId) || {};
                    const { codeOffset } = rawLocation;
                    if (!rawLocationRange || rawLocationRange.startOffset > codeOffset ||
                        rawLocationRange.endOffset <= codeOffset) {
                        return [];
                    }
                    return [{ scope: 'LOCAL', name: 'unreachable', type: 'int' }];
                }
                async getTypeInfo(expression, _context) {
                    if (expression === 'foo') {
                        const typeInfos = [{
                                typeNames: ['int'],
                                typeId: 'int',
                                members: [],
                                alignment: 0,
                                arraySize: 0,
                                size: 4,
                                canExpand: false,
                                hasValue: true,
                            }];
                        const base = { rootType: typeInfos[0], payload: 28 };
                        return { typeInfos, base };
                    }
                    throw new Error(`No typeinfo for ${expression}`);
                }
                async getFormatter(expressionOrField, _context) {
                    if (typeof expressionOrField !== 'string' && expressionOrField.base.payload === 28 &&
                        expressionOrField.field.length === 0) {
                        return { js: '23' };
                    }
                    throw new Error(`cannot format ${expressionOrField}`);
                }
            }
            RegisterExtension(new FormattingErrorsPlugin(), 'Formatter Errors', { language: 'WebAssembly', symbol_types: ['None'] });
        });
        await (0, sources_helpers_js_1.openSourcesPanel)();
        await (0, helper_js_1.click)(sources_helpers_js_1.PAUSE_ON_EXCEPTION_BUTTON);
        await (0, helper_js_1.goToResource)('sources/wasm/unreachable.html');
        await (0, helper_js_1.waitFor)(sources_helpers_js_1.RESUME_BUTTON);
        const locals = await (0, sources_helpers_js_1.getValuesForScope)('LOCAL', 0, 1);
        chai_1.assert.deepStrictEqual(locals, ['unreachable: undefined']);
        const watchPane = await (0, helper_js_1.waitFor)('[aria-label="Watch"]');
        const isExpanded = await watchPane.evaluate(element => {
            return element.getAttribute('aria-expanded') === 'true';
        });
        if (!isExpanded) {
            await (0, helper_js_1.click)('.title-expand-icon', { root: watchPane });
        }
        await (0, helper_js_1.click)('[aria-label="Add watch expression"]');
        await (0, helper_js_1.waitFor)('.watch-expression-editing');
        await (0, helper_js_1.pasteText)('foo');
        await frontend.keyboard.press('Enter');
        await (0, helper_js_1.waitForNone)('.watch-expression-editing');
        await (0, helper_js_1.click)('[aria-label="Add watch expression"]');
        await (0, helper_js_1.waitFor)('.watch-expression-editing');
        await (0, helper_js_1.pasteText)('bar');
        await frontend.keyboard.press('Enter');
        await (0, helper_js_1.waitForNone)('.watch-expression-editing');
        const watchResults = await (0, helper_js_1.waitForMany)('.watch-expression', 2);
        const watchTexts = await Promise.all(watchResults.map(async (watch) => await watch.evaluate(e => e.textContent)));
        chai_1.assert.deepStrictEqual(watchTexts, ['foo: 23', 'bar: <not available>']);
        const tooltipText = await watchResults[1].evaluate(e => {
            const errorElement = e.querySelector('.watch-expression-error');
            if (!errorElement) {
                return 'NO ERROR COULD BE FOUND';
            }
            return errorElement.getAttribute('title');
        });
        chai_1.assert.strictEqual(tooltipText, 'No typeinfo for bar');
        await (0, helper_js_1.click)(console_helpers_js_1.CONSOLE_TAB_SELECTOR);
        await (0, console_helpers_js_1.focusConsolePrompt)();
        await (0, helper_js_1.pasteText)('bar');
        await frontend.keyboard.press('Enter');
        // Wait for the console to be usable again.
        await frontend.waitForFunction(() => {
            return document.querySelectorAll('.console-user-command-result').length === 1;
        });
        const messages = await (0, console_helpers_js_1.getCurrentConsoleMessages)();
        chai_1.assert.deepStrictEqual(messages.filter(m => !m.startsWith('[Formatter Errors]')), ['Uncaught No typeinfo for bar']);
    });
});
//# sourceMappingURL=debugger-language-plugins_test.js.map