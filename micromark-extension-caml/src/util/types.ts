// option types

export interface OptCssNames {
  attr: string;
  attrbox: string;
  attrboxTitle: string;
  // [[wikiattrs]]-related
  invalid: string;
  wiki: string;
  // types
  reftype: string;
  doctype: string;
}

export interface OptAttr {
  render: boolean;
  title: string;
}

export interface OptToMarkdown {
  format:  'none' | 'pad';// | 'pretty';   // whitespace formatting type
  listKind:  'comma' | 'mkdn';
  prefixed: boolean;                       // colon ':' prefix before linktype text for attr wikilinks
}

// 'mdast-toMarkdown'
export interface OptAttrToMkdn extends OptAttr {
  toMarkdown: Partial<OptToMarkdown>;
}

export interface CamlOptions {
  attrs: Partial<OptAttr | OptAttrToMkdn>;
  cssNames: Partial<OptCssNames>;
}

// required options

export interface ReqSyntaxOpts {
  attrs: {
    render: boolean;
    title: string;
  };
}

export interface ReqHtmlOpts {
  attrs: {
    render: boolean;
    title: string;
  };
  cssNames: OptCssNames;
}

// construct data types
// (for html and ast)

export type AttrData = {
  [key: string]: AttrDataItem[];
}

// same in remark-wikilinks
// todo: link
export interface AttrDataItem {
  type: string,
}

// AttrItemPrimitive === CamlValData from 'caml'
export interface AttrDataPrimitive extends AttrDataItem {
  type: string;
  string: string,
  value: null | boolean | number | bigint | Date | string, // | NaN
}

// todo: link to micromark-extension-wikirefs instance
// this interface is to help cut down on interdependencies between caml + wikirefs
export interface WikiAttrData extends AttrDataItem {
  type: 'wiki';
  doctype: string;
  filename: string;
  htmlHref: string;
  htmlText: string;
  baseUrl: string; // this is so remark-caml plugins can rebuild baseUrl + href
}
