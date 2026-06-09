import assert from 'node:assert/strict';

import { micromark } from 'micromark';

import type { CamlOptions } from '../src/util/types';
import { htmlCaml, syntaxCaml } from '../src';

import type { CamlTestCase } from 'caml-spec';
import { camlCases } from 'caml-spec';


let mockOpts: Partial<CamlOptions>;

// micromark renders the attrbox inline where the CAML appears in the source,
// while higher-level parsers (markdown-it, marked, remark) prepend it to the top.
// Override expected HTML for cases where this ordering difference matters.
const MICROMARK_HTML_OVERRIDES: Record<string, string> = {
  'prefixed; single; w/ other mkdn constructs; near headers; after':
    '<h1>heading</h1>\n'
    + '<aside class="attrbox">\n'
    + '<span class="attrbox-title">Attributes</span>\n'
    + '<dl>\n'
    + '<dt>attribute</dt>\n'
    + '<dd><span class="attr string attribute">value</span></dd>\n'
    + '</dl>\n'
    + '</aside>\n',
  'unprefixed; single; w/ other mkdn constructs; near headers; after':
    '<h1>heading</h1>\n'
    + '<aside class="attrbox">\n'
    + '<span class="attrbox-title">Attributes</span>\n'
    + '<dl>\n'
    + '<dt>attribute</dt>\n'
    + '<dd><span class="attr string attribute">value</span></dd>\n'
    + '</dl>\n'
    + '</aside>\n',
  'prefixed; single; w/ other mkdn constructs; near blockquotes; after':
    '<blockquote>\n'
    + '<p>some text</p>\n'
    + '</blockquote>\n'
    + '<aside class="attrbox">\n'
    + '<span class="attrbox-title">Attributes</span>\n'
    + '<dl>\n'
    + '<dt>attribute</dt>\n'
    + '<dd><span class="attr string attribute">value</span></dd>\n'
    + '</dl>\n'
    + '</aside>\n',
  'unprefixed; single; w/ other mkdn constructs; near blockquotes; after':
    '<blockquote>\n'
    + '<p>some text</p>\n'
    + '</blockquote>\n'
    + '<aside class="attrbox">\n'
    + '<span class="attrbox-title">Attributes</span>\n'
    + '<dl>\n'
    + '<dt>attribute</dt>\n'
    + '<dd><span class="attr string attribute">value</span></dd>\n'
    + '</dl>\n'
    + '</aside>\n',
  'prefixed; single; w/ other mkdn constructs; near lists; after':
    '<ul>\n'
    + '<li>list item</li>\n'
    + '</ul>\n'
    + '<aside class="attrbox">\n'
    + '<span class="attrbox-title">Attributes</span>\n'
    + '<dl>\n'
    + '<dt>attribute</dt>\n'
    + '<dd><span class="attr string attribute">value</span></dd>\n'
    + '</dl>\n'
    + '</aside>\n',
  'unprefixed; single; w/ other mkdn constructs; near lists; after':
    '<ul>\n'
    + '<li>list item</li>\n'
    + '</ul>\n'
    + '<aside class="attrbox">\n'
    + '<span class="attrbox-title">Attributes</span>\n'
    + '<dl>\n'
    + '<dt>attribute</dt>\n'
    + '<dd><span class="attr string attribute">value</span></dd>\n'
    + '</dl>\n'
    + '</aside>\n',
};

function run(contextMsg: string, tests: CamlTestCase[]): void {
  context(contextMsg, () => {
    let i: number = 0;
    for(const test of tests) {
      const desc: string = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        const mkdn: string = test.mkdn;
        const expdHTML: string = MICROMARK_HTML_OVERRIDES[test.descr] || test.html;
        const actlHTML: string = micromark(mkdn, {
          extensions: [syntaxCaml()],
          htmlExtensions: [htmlCaml(mockOpts)],
        });
        assert.strictEqual(actlHTML.replace(/\n/g, ''), expdHTML.replace(/\n/g, ''));
      });
    }
  });
}

describe('micromark-extension-caml', () => {

  run('mkdn -> html', camlCases);
  it.skip('html -> mkdn; precision newlines');

});
