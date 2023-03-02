import { merge } from 'lodash-es';

import type { Token } from 'micromark-util-types';

import { resolve } from 'caml-mkdn';

import type {
  AttrData,
  AttrDataPrimitive,
  CamlOptions,
  OptAttr,
  OptCssNames,
  WikiAttrData,
} from 'micromark-extension-caml';

import type {
  AttrBoxNode,
  AttrBoxTitleNode,
  AttrBoxListNode,
  AttrKeyNode,
  AttrValNode,
  PrimitiveAttrNode,
  WikiAttrNode,
} from '../util/types';


// required options
interface ReqOpts {
  attrbox: {
    render: boolean;
    title: string;
  };
  cssNames: OptCssNames;
}

export function fromMarkdownCaml(this: any, opts?: Partial<CamlOptions>) {
  // opts
  const defaults: ReqOpts = {
    attrbox: {
      render: true,
      title: 'Attributes',
    } as OptAttr,
    cssNames: {
      attr: 'attr',
      attrbox: 'attrbox',
      attrboxTitle: 'attrbox-title',
      // [[wikiattrs]]-related
      wiki: 'wiki',
      invalid: 'invalid',
    } as OptCssNames,
  };
  const fullOpts: ReqOpts = merge(defaults, opts);

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

  function enterAttrBox (this: any, token: Token) {
    // is accessible via 'this.stack' (see below)
    this.enter(
      {
        type: 'attrbox',
        children: [] as (AttrBoxTitleNode | AttrBoxListNode)[],
        data: {
          items: {} as AttrData,
        }
      } as AttrBoxNode,
      token,
    );
    // current key
    const curKey = this.getData('curKey');
    if (!curKey) this.setData('curKey', '');
  }

  function exitAttrKey (this: any, token: Token) {
    const key: string = this.sliceSerialize(token).trim();
    const current: AttrBoxNode = top(this.stack);
    if (current.data && current.data.items && !Object.keys(current.data.items).includes(key)) {
      current.data.items[key] = [] as AttrDataPrimitive[];
    }
    this.setData('curKey', key);
  }

  function exitAttrVal (this: any, token: Token) {
    const stringValue: string = this.sliceSerialize(token);
    const item: AttrDataPrimitive = resolve(stringValue);
    const current: AttrBoxNode = top(this.stack);
    const curKey: string = this.getData('curKey');
    if (current.data && current.data.items && !current.data.items[curKey].push(item)) {
      current.data.items[curKey].push(item);
    }
  }

  // html properties are meant to build an element like this:
  // 
  // <aside class="attrbox">
  //  <span class="attrbox-title">Attributes</span>
  //    <dl>
  //      <dt>key</dt>
  //        <dd><span class="attr type key">val a</span></dd>
  //        <dd><span class="attr type key">val b</span></dd>
  //        <dd><span class="attr type key">val c</span></dd>
  //        ...
  //    </dl>
  // </aside>

  // by the time 'exitAttrs()' is run, attributes should already have been
  // grouped in the front of the token stream (due to the 'camlResolve()')
  function exitAttrBox (this: any, token: Token) {
    const attrbox: AttrBoxNode = this.exit(token);
    // if we have attr items, process them
    if (Object.values(attrbox.data.items).length > 0) {
      // css
      const cssAttrbox: string = fullOpts.cssNames.attrbox;
      const cssAttrboxTitle: string = fullOpts.cssNames.attrboxTitle;
      // rehype properties:
      // https://github.com/rehypejs/rehype
      // https://github.com/syntax-tree/mdast-util-to-hast
      // attrbox
      attrbox.data.hName = 'aside';
      attrbox.data.hProperties = {
        className: [cssAttrbox],
      };
      attrbox.children = [];
      attrbox.children.push({
        type: 'attrbox-title',
        children: [{
          type: 'text',
          value: fullOpts.attrbox.title,
        }],
        data: {
          hName: 'span',
          hProperties: {
            className: [cssAttrboxTitle],
          },
        }
      });
      attrbox.children.push({
        type: 'attrbox-list',
        children: [] as (AttrKeyNode | AttrValNode)[],
        data: { hName: 'dl' },
      });
      // finish building rehype properties below...
      // items
      for (const [key, items] of Object.entries(attrbox.data.items)) {
        // key / key
        const keyTxt: string | undefined = key ? key.trim() : undefined;
        (attrbox.children[1].children as unknown as (AttrKeyNode | AttrValNode)[]).push({
          type: 'attr-key',
          children: [{
            type: 'text',
            value: keyTxt ? keyTxt : 'key error',
          }],
          data: { hName: 'dt' },
        } as AttrKeyNode);
        // val / filenames
        for (const item of Array.from(items)) {
          // primitive
          if (item.type !== 'wiki') {
            const camlItem: AttrDataPrimitive = <AttrDataPrimitive> item;
            (attrbox.children[1].children as unknown as (AttrKeyNode | AttrValNode)[]).push({
              type: 'attr-val',
              children: [
                {
                  type: 'camlAttr' + camlItem.type,
                  children: [{
                    type: 'text',
                    value: camlItem.string,
                  }],
                  data: {
                    hName: 'span',
                    hProperties: {
                      className: [
                        fullOpts.cssNames.attr,
                        item.type ? item.type.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'valtype-error',
                        keyTxt ? keyTxt.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'key-error',
                      ],
                    },
                  },
                } as PrimitiveAttrNode,
              ],
              data: { hName: 'dd' },
            } as unknown as AttrValNode);
          // [[wikilink]] (taken from mdast-util-wikirefs)
          } else {
            const wikiItem: WikiAttrData = item as unknown as WikiAttrData;
            // only add item if valid
            if (wikiItem.htmlHref) {
              attrbox.children[1].children.push({
                type: 'attr-val',
                children: [],
                data: { hName: 'dd' },
              });
              const wikiItem: WikiAttrData = <WikiAttrData> item;
              // invalid
              if (!wikiItem.htmlHref) {
                (attrbox.children[1].children as unknown as (AttrKeyNode | AttrValNode)[]).push({
                  type: 'attr-val',
                  children: [
                    {
                      type: 'wikiattr',
                      children: [{
                        type: 'text',
                        value: `[[${wikiItem.filename}]]`,
                      }],
                      data: {
                        hName: 'a',
                        hProperties: {
                          className: [ fullOpts.cssNames.invalid ],
                        },
                      },
                    } as WikiAttrNode,
                  ],
                  data: { hName: 'dd' },
                } as unknown as AttrValNode);

              // valid
              } else {
                (attrbox.children[1].children as unknown as (AttrKeyNode | AttrValNode)[]).push({
                  type: 'attr-val',
                  children: [
                    {
                      type: 'wikiattr',
                      children: [{
                        type: 'text',
                        value: wikiItem.htmlText ? wikiItem.htmlText : wikiItem.filename,
                      }],
                      data: {
                        hName: 'a',
                        hProperties: {
                          className: [
                            fullOpts.cssNames.attr,
                            fullOpts.cssNames.wiki,
                            keyTxt ? keyTxt.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'attrtype-error',
                          ],
                          href: wikiItem.baseUrl + wikiItem.htmlHref,
                          dataHref: wikiItem.baseUrl + wikiItem.htmlHref,
                        },
                      },
                    } as WikiAttrNode,
                  ],
                  data: { hName: 'dd' },
                } as unknown as AttrValNode);
              }
            }
          }
        }
      }
    }
  }

  // util

  function top<T>(stack: Set<T>): T {
    return Array.from(stack)[Array.from(stack).length - 1];
  }
}
