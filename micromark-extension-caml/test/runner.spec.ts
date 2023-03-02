import assert from 'node:assert/strict';

// import type { CamlValData } from 'caml-mkdn';

import { micromark } from 'micromark';

import type { CamlOptions } from '../src/util/types';
import { htmlCaml, syntaxCaml } from '../src';

import type { CamlTestCase } from 'caml-spec';
import { camlCases } from 'caml-spec';


let mockOpts: Partial<CamlOptions>;

function run(contextMsg: string, tests: CamlTestCase[]): void {
  context(contextMsg, () => {
    let i: number = 0;
    for(const test of tests) {
      const desc: string = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        const mkdn: string = test.mkdn;
        const expdHTML: string = test.html;
        // const expdData: CamlValData = test.data;
        const actlHTML: string = micromark(mkdn, {
          extensions: [syntaxCaml()],
          htmlExtensions: [htmlCaml(mockOpts)],
        });
        // const actlData: CamlValData = {};
        assert.strictEqual(actlHTML.replace(/\n/g, ''), expdHTML.replace(/\n/g, ''));
        // assert.deepStrictEqual(actlData, expdData);
      });
    }
  });
}

describe('micromark-extension-caml', () => {

  // go
  run('mkdn -> html', camlCases);
  it.skip('html -> mkdn; precision newlines');

});
