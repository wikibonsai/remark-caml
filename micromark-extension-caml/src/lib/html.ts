import { merge } from 'lodash-es';
import { ok as assert } from 'uvu/assert';
import type { CamlValData } from 'caml-mkdn';
import { resolve } from 'caml-mkdn';
import { CompileContext } from 'micromark-util-types';
import { Token } from 'micromark/lib/create-tokenizer';

import type {
  AttrData,
  AttrDataPrimitive,
  CamlOptions,
  ReqHtmlOpts,
  WikiAttrData,
} from '../util/types';


// should match 'wikirefs.CONST.MARKER.OPEN'
const openMarker: string = '[[';
// should match 'wikirefs.CONST.MARKER.CLOSE'
const closeMarker: string = ']]';

export function htmlCaml(opts: Partial<CamlOptions> = {}) {
  // opts
  const defaults: ReqHtmlOpts = {
    attrs: {
      render: true,
      title: 'Attributes',
    },
    cssNames: {
      attr: 'attr',
      attrbox: 'attrbox',
      attrboxTitle: 'attrbox-title',
      // [[wikiattrs]]-related
      wiki: 'wiki',
      invalid: 'invalid',
      // types
      reftype: 'reftype__',
      doctype: 'doctype__',
    },
  };
  const fullOpts: ReqHtmlOpts = <ReqHtmlOpts> merge(defaults, opts);

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
    const key: string = this.sliceSerialize(token);
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

  // html properties are meant to build an element like this:
  // 
  // <aside class='attrbox'>
  //  <span class='attrbox-title'>Attributes</span>
  //    <dl>
  //      <dt>key</dt>
  //        <dd><span class='attr type key'>val a</span></dd>
  //        <dd><span class='attr type key'>val b</span></dd>
  //        <dd><span class='attr type key'>val c</span></dd>
  //        ...
  //    </dl>
  // </aside>

  // by the time 'exitAttrs()' is run, attributes should already have been
  // grouped in the front of the token stream (due to the 'camlResolve()')
  function exitAttrBox (this: CompileContext): void {
    const attrs: AttrData | undefined = (this.getData('attrStack') as unknown as AttrData[]).pop();
    assert((attrs !== undefined), 'in exitAttrBox(): problem with \'attrs\'');
    if ((attrs !== undefined) && Object.keys(attrs).length !== 0) {
      // open
      this.tag(`<aside class="${fullOpts.cssNames.attrbox}">`);
      this.tag(`<span class="${fullOpts.cssNames.attrboxTitle}">`);
      this.raw(fullOpts.attrs.title);
      this.tag('</span>');
      this.tag('<dl>');
      // content
      for (const [key, values] of Object.entries(attrs)) {
        // key
        this.tag('<dt>');
        if (key === undefined) {
          this.raw('missing key');
        } else {
          this.raw(key.trim());
        }
        this.tag('</dt>');
        // values
        for (const val of values) {
          this.tag('<dd>');
          // attr caml primitive
          if (!val.type.includes('wiki')) {
            const item: AttrDataPrimitive = <AttrDataPrimitive> val;
            const keySlug: string = key.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            this.tag(`<span class="${fullOpts.cssNames.attr} ${item.type} ${keySlug}">`);
            this.raw(item.string);
            this.tag('</span>');
          // attr [[wikilink]]
          } else {
            const wikiItem: WikiAttrData = val as WikiAttrData;
            // css
            const cssClassArray: string[] = [];
            cssClassArray.push(fullOpts.cssNames.attr);
            const htmlHref: string | undefined = wikiItem.htmlHref;
            const htmlText: string = wikiItem.htmlText ? wikiItem.htmlText : wikiItem.filename;
            // invalid
            if (htmlHref === '') {
              this.tag(`<a class="${fullOpts.cssNames.attr} ${fullOpts.cssNames.wiki} ${fullOpts.cssNames.invalid}">`);
              this.raw(openMarker + wikiItem.filename + closeMarker);
            // valid
            } else {
              cssClassArray.push(fullOpts.cssNames.wiki);
              cssClassArray.push(fullOpts.cssNames.reftype + key.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
              if (wikiItem.doctype.length > 0) {
                cssClassArray.push(fullOpts.cssNames.doctype + wikiItem.doctype.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
              }
              const css: string = cssClassArray.join(' ');
              this.tag(`<a class="${css}" href="${wikiItem.baseUrl + htmlHref}" data-href="${wikiItem.baseUrl + htmlHref}">`);
              this.raw(htmlText);
            }
            this.tag('</a>');
          }
          this.tag('</dd>');
        }
      }
      // close
      this.tag('</dl>');
      this.tag('</aside>');
    }
  }

  // util

  function top<T>(stack: T[]): T {
    return stack[stack.length - 1];
  }
}
