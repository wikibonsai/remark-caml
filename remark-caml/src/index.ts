import type * as Uni from 'unist';
import type { AttrBoxNode } from 'mdast-util-caml';

import { /*htmlCaml,*/ syntaxCaml, CamlOptions } from 'micromark-extension-caml';
import { initAttrBox, fromMarkdownCaml, toMarkdownCaml } from 'mdast-util-caml';

import { remarkV13Warning } from './warn';


export function remarkCaml(this: any, opts?: Partial<CamlOptions>) {
  const doRenderAttrBox: boolean = opts?.attrs?.render ?? true;
  const data = this.data();

  // warn for earlier versions
  remarkV13Warning(this);

  add('micromarkExtensions', syntaxCaml(opts));
  add('fromMarkdownExtensions', fromMarkdownCaml(opts));
  add('toMarkdownExtensions', toMarkdownCaml(opts));

  function add(field: string, value: any) {
    if (data[field]) { data[field].push(value); }
    else { data[field] = [value]; }
  }

  // ref: https://github.com/remarkjs/remark-toc/blob/main/lib/index.js#L36
  return function (tree: Uni.Parent): void {
    if (doRenderAttrBox) {
      const attrbox: AttrBoxNode | undefined = initAttrBox(tree, opts);
      // place attrbox at the beginning of the tree content
      if (attrbox !== undefined) { tree.children.unshift(attrbox); }
    }
  };
}
