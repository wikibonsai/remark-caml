import assert from 'node:assert/strict';

import { CamlToken } from '../../micromark-extension-caml/src/util/const';
import { fromMarkdownCaml, toMarkdownCaml } from '../src';

describe('cross-module', () => {

  describe('fromMarkdown', () => {

    it('enter keys must match expected keys (token converted in resolve)', () => {
      const fromMarkdownPlugin = fromMarkdownCaml();
      if (!fromMarkdownPlugin.enter) { assert.fail(); }
      assert.deepStrictEqual(Object.keys(fromMarkdownPlugin.enter), [
        // see 'resolveAttrs()'
        'attrBox',
      ]);
    });

    it('exit keys must match expected keys (token converted in resolve)', () => {
      const fromMarkdownPlugin = fromMarkdownCaml();
      if (!fromMarkdownPlugin.exit) { assert.fail(); }
      assert.deepStrictEqual(Object.keys(fromMarkdownPlugin.exit), [
        // see 'resolveAttrs()'
        'attrKey',
        'attrVal',
        'attrBox',
      ]);
    });

  });

  describe('toMarkdown', () => {

    it('handler keys must match expected keys', () => {
      const toMarkdownPlugin = toMarkdownCaml();
      if (!toMarkdownPlugin.handlers) { assert.fail(); }
      assert.deepStrictEqual(Object.keys(toMarkdownPlugin.handlers), [
        // see 'startAttrBoxDataNode.type'
        // note: redundant naming because 'case-conversion' <-> caseConversion seems to not be working...
        'attrbox-data',
        'attrboxData',
      ]);
    });

  });

});
