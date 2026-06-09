import { ok as assert } from 'uvu/assert';
import type { CamlValData } from 'caml-mkdn';
import { resolve } from 'caml-mkdn';
import { CompileContext } from 'micromark-util-types';
import { Token } from 'micromark/lib/create-tokenizer';

import type {
  AttrData,
  AttrDataPrimitive,
  CamlOptions,
  OptCssNames,
} from '../util/types';


// defaults
const defaultCssNames: OptCssNames = {
  attr: 'attr',
  attrbox: 'attrbox',
  attrboxTitle: 'attrbox-title',
  wiki: 'wiki',
  invalid: 'invalid',
  reftype: 'reftype__',
  doctype: 'doctype__',
};

const defaultAttrs = {
  render: true,
  title: 'Attributes',
};

export function htmlCaml(opts: Partial<CamlOptions> = {}) {
  const cssNames = { ...defaultCssNames, ...opts?.cssNames };
  const attrsOpts = { ...defaultAttrs, ...opts?.attrs };

  // note: enter/exit keys should match a token name
  return {
    enter: {
      attrBox: enterAttrBox,
    },
    exit: {
      attrKey: exitAttrKey,
      attrVal: exitAttrVal,
      attrBox: exitAttrBox,
    },
  };

  function enterAttrBox (this: CompileContext): void {
    // attrs
    let stack = this.getData('attrStack') as unknown as AttrData[];
    if (!stack) this.setData('attrStack', (stack = []));
    stack.push({} as AttrData);
    // current key
    const curKey: string = this.getData('curKey') as unknown as string;
    if (!curKey) this.setData('curKey', '');
  }

  function exitAttrKey (this: CompileContext, token: Token): void {
    const key: string = this.sliceSerialize(token).trim();
    const stack: AttrData[] = this.getData('attrStack') as unknown as AttrData[];
    const current: AttrData = top(stack);
    if (!Object.keys(current).includes(key)) {
      current[key] = [] as AttrDataPrimitive[];
    }
    this.setData('curKey', key);
  }

  function exitAttrVal (this: CompileContext, token: Token): void {
    const value: string = this.sliceSerialize(token);
    const stack: AttrData[] = this.getData('attrStack') as unknown as AttrData[];
    const current: AttrData = top(stack);
    const resolvedVal: CamlValData = resolve(value);
    const curKey: string = this.getData('curKey') as unknown as string;
    current[curKey].push(resolvedVal);
  }

  function exitAttrBox (this: CompileContext): void {
    const attrs: AttrData | undefined = (this.getData('attrStack') as unknown as AttrData[]).pop();
    assert((attrs !== undefined), 'in exitAttrBox(): problem with \'attrs\'');
    if (!attrs || !attrsOpts.render) return;
    // render attrbox html
    const keys = Object.keys(attrs);
    if (keys.length === 0) return;
    this.raw('<aside class="' + cssNames.attrbox + '">\n');
    this.raw('<span class="' + cssNames.attrboxTitle + '">' + attrsOpts.title + '</span>\n');
    this.raw('<dl>\n');
    for (const key of keys) {
      this.raw('<dt>' + key + '</dt>\n');
      const items = attrs[key] as AttrDataPrimitive[];
      for (const item of items) {
        const keySlug = key.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        // for multi-line strings, display the resolved value
        const displayText = (item.string && item.string.includes('\n'))
          ? String(item.value)
          : item.string;
        // convert newlines to <br> for proper HTML rendering of multi-line values
        const htmlText = displayText.replace(/\n/g, '<br>');
        this.raw('<dd><span class="'
          + cssNames.attr + ' '
          + item.type + ' '
          + keySlug
          + '">' + htmlText + '</span></dd>\n');
      }
    }
    this.raw('</dl>\n</aside>\n');
  }

  // util

  function top<T>(stack: T[]): T {
    return stack[stack.length - 1];
  }
}
