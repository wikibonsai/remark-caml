import type { CamlOptions } from 'micromark-extension-caml';
import type { TestCaseMdast, TestCaseMdastBuilder } from './types';
import type {
  AttrBoxNode,
  AttrBoxDataNode,
} from '../src/util/types';

import assert from 'node:assert/strict';
import { merge } from 'lodash-es';
import * as Uni from 'unist';
import { toMarkdown } from 'mdast-util-to-markdown';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { syntaxCaml } from 'micromark-extension-caml';
import { visitNodeType } from './util/patch-visit-util';
import { initAttrBox, fromMarkdownCaml, toMarkdownCaml } from '../src';
import { mdastBuilderCases, mdastCases } from './cases';


// setup

let mockOpts: Partial<CamlOptions>;
let i: number = 0;

function runFromMarkdown(contextMsg: string, tests: TestCaseMdast[]): void {
  context(contextMsg, () => {
    for(const test of tests) {
      const desc: string = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        // test vars
        // merge suite options with case options
        const opts: Partial<CamlOptions> = merge(test.opts, mockOpts);
        const mkdn: string = test.mkdn;
        const expdNode: Partial<AttrBoxDataNode> = test.node as AttrBoxDataNode;
        // setup / go
        const actlAst: any = fromMarkdown(mkdn, {
          extensions: [syntaxCaml()],
          mdastExtensions: [
            fromMarkdownCaml(opts),
          ],
        });
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

function runToMarkdown(contextMsg: string, tests: TestCaseMdast[]): void {
  context(contextMsg, () => {
    for(const test of tests) {
      const desc: string = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        // test vars
        // merge suite options with case options
        const opts: Partial<CamlOptions> = merge(test.opts, mockOpts);
        const node: Partial<AttrBoxDataNode> = test.node as AttrBoxDataNode;
        const expdMkdn: string = test.mkdn;
        // setup
        // build mdast: mdast nodes will normally appear in paragraph
        //            context, which can affect symbol escaping
        const paragraph: Uni.Parent = {
          type: 'paragraph',
          children: [node as AttrBoxDataNode],
        };
        const root: Uni.Parent = {
          type: 'root',
          children: [paragraph],
        };
        // go
        // @ts-expect-error: "Argument of type 'Parent<Node<Data>, Data>' is not assignable to parameter of type 'Node'."
        const actlMkdn: string = toMarkdown(root, {
          extensions: [toMarkdownCaml(opts)],
        });
        // assert
        assert.strictEqual(actlMkdn, expdMkdn);
      });
    }
  });
}

function runInitAttrBox(contextMsg: string, tests: TestCaseMdastBuilder[]): void {
  context(contextMsg, () => {
    for(const test of tests) {
      const desc: string = `[${('00' + (++i)).slice(-3)}] ` + (test.descr || '');
      it(desc, () => {
        // test vars
        // merge suite options with case options
        const opts: any = merge(mockOpts, test.opts);
        const inNodes: AttrBoxDataNode[] = test.inNodes as AttrBoxDataNode[];
        const expdOutNode: AttrBoxNode = test.outNode as AttrBoxNode;
        // setup
        // build ast: ast nodes will normally appear in paragraph
        //            context, which can affect symbol escaping
        const paragraph: Uni.Parent = {
          type: 'paragraph',
          children: inNodes,
        };
        const root: Uni.Parent = {
          type: 'root',
          children: [paragraph],
        };
        const actlOutNode: AttrBoxNode | undefined = initAttrBox(root, opts);
        assert.deepStrictEqual(actlOutNode, expdOutNode);
      });
    }
  });
}

describe('mdast-util-caml', () => {

  // beforeEach(() => {
  //   mockOpts = makeMockOptsForRenderOnly();
  // });

  runFromMarkdown('mkdn -> mdast', mdastCases);
  runToMarkdown('mdast -> mkdn', mdastCases);
  runInitAttrBox('build attrbox', mdastBuilderCases);

});
