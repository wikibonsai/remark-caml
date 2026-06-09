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

// remark preserves leading whitespace after <br> using \u00a0 (non-breaking space)
// via hChildren in the mdast-util-caml attrbox builder. Convert the spec's regular
// spaces after <br> to \u00a0 to match.
function remarkifyHtml(html: string): string {
  return html.replace(
    /(<span[^>]*>)([\s\S]*?)(<\/span>)/g,
    (match, open, content, close) => {
      const withNbsp = content.replace(/<br>( +)/g,
        (m: string, spaces: string) => '<br>' + '\u00a0'.repeat(spaces.length)
      );
      return open + withNbsp + close;
    }
  );
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
        const expdHtml: string = remarkifyHtml(test.html);
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

  describe('state management', () => {

    it('consecutive processSync calls should produce independent results', () => {
      const processor1: Processor = unified().use(remarkParse)
                                              .use(remarkCaml)
                                              .use(remarkRehype)
                                              .use(rehypeStringify);
      const processor2: Processor = unified().use(remarkParse)
                                              .use(remarkCaml)
                                              .use(remarkRehype)
                                              .use(rehypeStringify);
      const html1: string = String(processor1.processSync(':title::First Document\n'));
      const html2: string = String(processor2.processSync(':author::Jane Doe\n'));

      assert.ok(html1.includes('<dt>title</dt>'), 'first output should contain "title" key');
      assert.ok(html1.includes('First Document'), 'first output should contain "First Document"');
      assert.ok(!html1.includes('<dt>author</dt>'), 'first output should NOT contain "author" key');

      assert.ok(html2.includes('<dt>author</dt>'), 'second output should contain "author" key');
      assert.ok(html2.includes('Jane Doe'), 'second output should contain "Jane Doe"');
      assert.ok(!html2.includes('<dt>title</dt>'), 'second output should NOT contain "title" key');
    });

    it('consecutive parse calls should produce independent ASTs', () => {
      const processor: Processor = unified().use(remarkParse)
                                            .use(remarkCaml);
      const ast1: Uni.Parent = processor.parse(':color::blue\n') as Uni.Parent;
      const ast2: Uni.Parent = processor.parse(':shape::circle\n') as Uni.Parent;

      // verify ast1 has 'color' attr data
      let found1: boolean = false;
      visitNodeType(ast1, 'attrbox-data', (node: any) => {
        found1 = true;
        assert.ok(node.data?.hName || node.data, 'ast1 attrbox node should have data');
      });
      // verify ast2 has 'shape' attr data
      let found2: boolean = false;
      visitNodeType(ast2, 'attrbox-data', (node: any) => {
        found2 = true;
        assert.ok(node.data?.hName || node.data, 'ast2 attrbox node should have data');
      });

      assert.ok(found1, 'ast1 should contain an attrbox-data node');
      assert.ok(found2, 'ast2 should contain an attrbox-data node');
    });

  });

});
