import type { Token } from 'micromark-util-types';
import { CompileContext } from 'mdast-util-from-markdown';
import type { Node } from 'mdast-util-from-markdown/lib';

import { resolve } from 'caml-mkdn';

import type {
  AttrData,
  AttrDataPrimitive,
  CamlOptions,
} from 'micromark-extension-caml';

import type { AttrBoxDataNode } from '../util/types';


// required options

export function fromMarkdownCaml(this: any, opts?: Partial<CamlOptions>) {
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

  function enterAttrBox (this: CompileContext, token: Token) {
    const attrBoxDataNode: AttrBoxDataNode = {
      type: 'attrbox-data',
      data: {
        items: {} as AttrData,
      },
    };
    // is accessible via 'this.stack' (see below)
    this.enter(attrBoxDataNode as AttrBoxDataNode as unknown as Node, token);
    // current key
    const curKey: string | undefined = this.getData('curKey');
    if (curKey === undefined) { this.setData('curKey', ''); }
  }

  function exitAttrKey (this: CompileContext, token: Token) {
    const key: string = this.sliceSerialize(token).trim();
    const current: AttrBoxDataNode = top(this.stack as Node[] as unknown as Set<AttrBoxDataNode>);
    if (current.data && current.data.items && !Object.keys(current.data.items).includes(key)) {
      current.data.items[key] = [] as AttrDataPrimitive[];
    }
    this.setData('curKey', key);
  }

  function exitAttrVal (this: CompileContext, token: Token) {
    const stringValue: string = this.sliceSerialize(token);
    const item: AttrDataPrimitive = resolve(stringValue);
    const current: AttrBoxDataNode = top(this.stack as Node[] as unknown as Set<AttrBoxDataNode>);
    const curKey: string | undefined = this.getData('curKey');
    if (current.data && current.data.items) {
      if (curKey !== undefined) { current.data.items[curKey].push(item); }
    }
  }

  // note: leaving this here to close the token
  function exitAttrBox (this: CompileContext, token: Token) {
    this.exit(token) as Node as unknown as AttrBoxDataNode;
    return;
  }

  // util

  function top<T>(stack: Set<T>): T {
    return Array.from(stack)[Array.from(stack).length - 1];
  }
}
