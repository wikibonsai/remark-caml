import assert from 'node:assert/strict';

import { merge } from 'lodash-es';

import * as Uni from 'unist';
import { Processor, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkStringify from 'remark-stringify';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

import type { CamlOptions } from 'micromark-extension-caml';
import type { AttrBoxNode } from 'mdast-util-caml';

import { remarkCaml } from '../src';

import type { CamlTestCase} from 'caml-spec';
import type { TestCaseMdast } from '../../mdast-util-caml/test/types';
import { visitNodeType } from '../../mdast-util-caml/test/util/visit';

import { camlCases } from 'caml-spec';
import { mdastCases } from '../../mdast-util-caml/test/cases';


// setup

let mockOpts: Partial<CamlOptions>;

function runMkdnToMdast(contextMsg: string, tests: TestCaseMdast[]): void {
  context(contextMsg, () => {
    let i: number = 0;
    for(const test of tests) {
      const desc: string = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        // test vars
        // merge suite options with case options
        const opts: Partial<CamlOptions> = merge(test.opts, mockOpts);
        const mkdn: string = test.mkdn;
        const expdNode: Partial<AttrBoxNode> = test.node as AttrBoxNode;
        // setup / go
        /* eslint-disable indent */
        const processor: Processor = unified().use(remarkParse)
                                              .use(remarkCaml, opts);
        /* eslint-enable indent */
        const actlAst: Uni.Parent = processor.parse(mkdn) as Uni.Parent;
        // assert
        let visited: boolean = false;
        visitNodeType(actlAst, expdNode.type as string, (actlNode: any) => {
          visited = true;
          assert.strictEqual(actlNode.type, expdNode.type);
          assert.deepStrictEqual(actlNode.data, expdNode.data);
        });
        if (!visited) {
          console.error('ast node not visited');
        }
        assert.strictEqual(visited, true);
      });
    }
  });
}

function runMkdnToHtml(contextMsg: string, tests: CamlTestCase[]): void {
  context(contextMsg, () => {
    let i: number = 0;
    for(const test of tests) {
      const desc: string = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        // test vars
        // merge suite options with case options
        const opts: Partial<CamlOptions> = merge(test.opts, mockOpts);
        const mkdn: string = test.mkdn;
        const expdHtml: string = test.html;
        // setup
        /* eslint-disable indent */
        const processor: Processor = unified().use(remarkParse)
                                              // .use(remarkRehype as any)
                                              // .use(rehypeStringify as any)
                                              .use(remarkCaml, opts)
                                              .use(remarkRehype)
                                              .use(rehypeStringify);
        /* eslint-enable indent */
        // go
        const actlHtml: string = String(processor.processSync(mkdn));
        // assert
        assert.strictEqual(
          actlHtml.replace(/\n/g, '').replace(/<div>\s*<\/div>/g, ''),
          expdHtml.replace(/\n/g, ''),
        );
      });
    }
  });
}

function runMdastToMkdn(contextMsg: string, tests: TestCaseMdast[]): void {
  context(contextMsg, () => {
    let i: number = 0;
    for(const test of tests) {
      const desc = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        // test vars
        // merge suite options with case options
        const opts: Partial<CamlOptions> = merge(test.opts, mockOpts);
        const node: Partial<AttrBoxNode> = test.node as AttrBoxNode;
        const expdMkdn: string = test.mkdn;
        // setup
        // build ast: ast nodes will normally appear in paragraph
        //            context, which can affect symbol escaping
        const paragraph: Uni.Parent = {
          type: 'paragraph',
          children: [node as AttrBoxNode],
        };
        const root: Uni.Parent = {
          type: 'root',
          children: [paragraph],
        };
        /* eslint-disable indent */
        const processor: Processor = unified().use(remarkStringify)
                                              .use(remarkCaml, opts);
        /* eslint-enable indent */
        // go
        const actlMkdn: string = <string> processor.stringify(root);
        // assert
        assert.strictEqual(actlMkdn, expdMkdn);
      });
    }
  });
}

// function runHtmlToMkdn(contextMsg: string, tests: CamlTestCase[]): void {
//   context(contextMsg, () => {
//     let i = 0;
//     for(let test of tests) {
//       const desc = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
//       it(desc, () => {
//         // test vars
//         // merge suite options with case options
//         const opts: Partial<CamlOptions> = merge(test.opts, mockOpts);
//         const html: string = test.html;
//         const expdMkdn: string = test.mkdn;
//         // setup
//         // init -- processor build from: https://github.com/rehypejs/rehype/tree/main/packages/rehype-parse#use
//         const processor: Processor = unified().use(rehypeParse)
//                                               .use(rehypeRemark)
//                                               // .use(rehypeParse as any)
//                                               // .use(rehypeRemark as any)
//                                               .use(remarkStringify)
//                                               .use(camlPlugin, opts);
//         // go
//         var actlMkdn: string = String(processor.processSync(html));
//         // assert
//         assert.strictEqual(actlMkdn, expdMkdn);
//       });
//     }
//   });
// }


describe('remark-caml', () => {

  describe('mdast', () => {

    runMkdnToMdast('mkdn -> mdast', mdastCases);
    runMdastToMkdn('mdast -> mkdn', mdastCases);

  });

  describe('html', () => {

    runMkdnToHtml('mkdn -> html', camlCases);
    it.skip('html -> mkdn');

  });

});
