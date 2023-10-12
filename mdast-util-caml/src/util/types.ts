import * as Uni from 'unist';
import type { AttrData, AttrDataPrimitive } from 'micromark-extension-caml';


// Add custom data tracked to turn markdown into a tree.
declare module 'mdast-util-from-markdown' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface CompileData {
    /**
     * track the current attribute key
     */
    curKey?: string;
  }
}

// node types

// node data note:
// 
// it might feel like some data properties commit data duplicatation (because they are),
// but this is intentional.
// this data provides the end-user with a more direct means of inspecting
// the shape of the attribute-wikilink data, as opposed to sifting through
// html properties (hName, hProperties, hChildren...) to figure it out.

// attr nodes

// note: this node simply holds data from markdown caml-attributes,
//       which is used to build the html attrbox
export interface AttrBoxDataNode extends Uni.Data {
  type: 'attrbox-data';
  data: {
    items: AttrData;
  }
}

export interface AttrBoxNode extends Uni.Parent {
  type: 'attrbox';
  children: (AttrBoxTitleNode | AttrBoxListNode)[];
  data: {
    items: AttrData;
    // rehype properties
    hName: 'aside';
    hProperties: any;
  };
}

export interface AttrBoxTitleNode extends Uni.Parent {
  type: 'attrbox-title';
  children: any[], // text node: https://github.com/syntax-tree/mdast#text
  data: {
    hName: 'span';
    hProperties: any | null;
  };
}

export interface AttrBoxListNode extends Uni.Parent {
  type: 'attrbox-list';
  children: (AttrKeyNode | AttrValNode)[];
  data: {
    hName: 'dl';
  };
}

export interface AttrKeyNode extends Uni.Parent {
  type: 'attr-key';
  children: any[]; // text node: https://github.com/syntax-tree/mdast#text
  data: {
    hName: 'dt';
  }
}

export interface AttrValNode extends Uni.Parent {
  type: 'attr-val';
  children: (AttrDataPrimitive | any)[]; // ...or caml's 'WikiAttrNode' (using 'any' to avoid importing wikirefs)
  data: {
    hName: 'dd';
  }
}

// caml primitives

export interface PrimitiveAttrNode extends Uni.Parent {
  type: string;
  children: any[]; // text node: https://github.com/syntax-tree/mdast#text
  data: {
    // 'item' data stored in top-level 'AttrNode'
    hName: 'span';
    hProperties: any | null;
  };
}

// todo: link to micromark-extension-wikirefs instance
// this interface is to help cut down on interdependencies between caml + wikirefs

export interface WikiAttrNode extends Uni.Parent {
  type: 'wikiattr';
  children: any[]; // text node: https://github.com/syntax-tree/mdast#text
  data: {
    // 'item' data stored in top-level 'AttrBoxNode'
    hName: 'a';
    hProperties: any | null;
  };
}