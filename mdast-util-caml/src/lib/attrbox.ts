import type {
  AttrData,
  AttrDataPrimitive,
  CamlOptions,
  OptCssNames,
} from 'micromark-extension-caml';
import type {
  AttrBoxNode,
  AttrBoxDataNode,
  AttrBoxTitleNode,
  AttrBoxListNode,
  AttrKeyNode,
  AttrValNode,
} from '../util/types';

import { merge } from 'lodash-es';
import * as Uni from 'unist';
import { selectAll } from 'unist-util-select';
import * as wikirefs from 'wikirefs';


// required options
interface ReqOpts {
  attrs: {
    render: boolean;
    title: string;
  };
  cssNames: OptCssNames;
}

export function initAttrBox(tree: Uni.Node, opts?: Partial<CamlOptions>): AttrBoxNode | undefined {
  // opts
  const defaults: ReqOpts = {
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
  const fullOpts: ReqOpts = merge(defaults, opts);

  // todo: should i be making node assertions...?
  //       https://github.com/syntax-tree/unist-util-is#isnode-test-index-parent-context
  // extract attr data nodes
  const attrDataNodes: AttrBoxDataNode[] = selectAll('attrbox-data', tree) as AttrBoxDataNode[];
  // extract attr data
  const attrData: any = attrDataNodes.reduce((acc: any, node: AttrBoxDataNode) => {
    Object.entries(node.data.items).forEach(([key, value]) => {
      if (acc[key]) {
        acc[key] = acc[key].concat(value);
      } else {
        acc[key] = value;
      }
    });
    return acc;
  }, {});
  // build attrbox and return
  return (Object.keys(attrData).length > 0)
    ? buildAttrBox(attrData, fullOpts)
    : undefined;
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

export function buildAttrBox(
  attrData: any,
  fullOpts: ReqOpts,
): AttrBoxNode | undefined {
  // init
  const attrbox: AttrBoxNode = {
    type: 'attrbox',
    children: [] as (AttrBoxTitleNode | AttrBoxListNode)[],
    data: {
      items: {} as AttrData,
      hName: 'aside',
      hProperties: {
        className: [ fullOpts.cssNames.attrbox ],
      },
    },
  };
  const attrboxTitle: AttrBoxTitleNode = {
    type: 'attrbox-title',
    children: [{
      type: 'text',
      value: fullOpts.attrs.title,
    }],
    data: {
      hName: 'span',
      hProperties: {
        className: [ fullOpts.cssNames.attrboxTitle ]
      },
    }
  };
  const attrBoxListNode: AttrBoxListNode = {
    type: 'attrbox-list',
    children: [] as (AttrKeyNode | AttrValNode)[],
    data: { hName: 'dl' },
  };
  // construct
  attrbox.children.push(attrboxTitle);
  attrbox.children.push(attrBoxListNode);
  // if we have attr items, process them
  if (Object.keys(attrData).length > 0) {
    // copy item data
    attrbox.data.items = { ...attrData };
    // build item hProperties from item data
    for (const [attrtype, items] of Object.entries(attrData)) {
      addAttrKey(attrbox, attrtype, fullOpts);
      for (const item of items as unknown as any) {
        if (item.type === 'wiki') {
          addWikiAttrVal(attrbox, attrtype, item, fullOpts);
        } else {
          addAttrVal(attrbox, attrtype, item, fullOpts);
        }
      }
    }
  }

  return attrbox;
}

export function addAttrKey(
  attrbox: AttrBoxNode,
  key: string | undefined,
  fullOpts: ReqOpts,
): void {
  const keyTxt: string | undefined = key ? key.trim() : undefined;
  const keyNode: AttrKeyNode = {
    type: 'attr-key',
    children: [{
      type: 'text',
      value: keyTxt ? keyTxt : 'key error',
    }],
    data: { hName: 'dt' },
  };
  // add to attrbox-list
  attrbox.children[1].children.push(keyNode);
}

export function addAttrVal(
  attrbox: AttrBoxNode,
  key: string | undefined,
  val: AttrDataPrimitive,
  fullOpts: ReqOpts,
): void {
  const valNode: AttrValNode = {
    type: 'attr-val',
    children: [
      {
        type: val.type,
        children: [{
          type: 'text',
          value: val.string,
        }],
        data: {
          hName: 'span',
          hProperties: {
            className: [
              fullOpts.cssNames.attr,
              val.type ? val.type.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'valtype-error',
              key ? key.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : 'key-error',
            ],
          },
        },
      },
    ],
    data: { hName: 'dd' },
  };
  // add to attrbox-list
  attrbox.children[1].children.push(valNode);
}

// todo: link to mdast-util-wikirefs instance
// this interface is to help cut down on interdependencies between caml + wikirefs

export function addWikiAttrVal(
  attrbox: AttrBoxNode,
  attrtype: string | undefined,
  wikiVal: any, // wikiVal: WikiAttrData,
  fullOpts: any, // fullOpts: DefaultsWikiRefs & DefaultsWikiAttrs,
): void {
  let wikiNode: any; // let wikiNode: WikiAttrNode;
  const valNode: AttrValNode = {
    type: 'attr-val',
    children: [],
    data: { hName: 'dd' },
  };
  // invalid
  if (!wikiVal.htmlHref) {
    wikiNode = {
      type: 'wikiattr',
      children: [{
        type: 'text',
        value: wikirefs.CONST.MARKER.OPEN + wikiVal.filename + wikirefs.CONST.MARKER.CLOSE,
      }],
      data: {
        hName: 'a',
        hProperties: {
          className: [
            fullOpts.cssNames.attr,
            fullOpts.cssNames.wiki,
            fullOpts.cssNames.invalid,
          ],
        },
      },
    };
  // valid
  } else {
    wikiNode = {
      type: 'wikiattr',
      children: [{
        type: 'text',
        value: wikiVal.htmlText ? wikiVal.htmlText : wikiVal.filename,
      }],
      data: {
        hName: 'a',
        hProperties: {
          className: (wikiVal.doctype.length > 0)
          // with doctype
            ? [
              fullOpts.cssNames.attr,
              fullOpts.cssNames.wiki,
              attrtype
                ? fullOpts.cssNames.reftype + attrtype.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                : fullOpts.cssNames.reftype + 'attrtype-error',
              fullOpts.cssNames.doctype + wikiVal.doctype.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            ]
            // without doctype
            : [
              fullOpts.cssNames.attr,
              fullOpts.cssNames.wiki,
              attrtype
                ? fullOpts.cssNames.reftype + attrtype.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
                : fullOpts.cssNames.reftype + 'attrtype-error',
            ],
          href: wikiVal.baseUrl + wikiVal.htmlHref,
          dataHref: wikiVal.baseUrl + wikiVal.htmlHref,
        },
      },
    };
  }
  // add wikiattr to attr-val
  valNode.children.push(wikiNode);
  // add to attrbox-list
  attrbox.children[1].children.push(valNode);
}