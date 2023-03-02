// import { Plugin } from 'unified';

import { /*htmlCaml,*/ syntaxCaml, CamlOptions } from 'micromark-extension-caml';
import { fromMarkdownCaml, toMarkdownCaml } from 'mdast-util-caml';

import { remarkV13Warning } from './warn';


export function remarkCaml(this: any, opts?: Partial<CamlOptions>): void {
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
}
