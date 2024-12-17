# `micromark-extension-caml`

[![A WikiBonsai Project](https://img.shields.io/badge/%F0%9F%8E%8B-A%20WikiBonsai%20Project-brightgreen)](https://github.com/wikibonsai/wikibonsai)
[![NPM package](https://img.shields.io/npm/v/micromark-extension-caml)](https://npmjs.org/package/micromark-extension-caml)

A **[`micromark`](https://github.com/micromark/micromark)** syntax extension for [CAML](https://github.com/wikibonsai/caml) attributes, providing the low-level modules for integrating with the micromark tokenizer and the micromark HTML compiler.

You probably shouldn’t use this package directly, but instead use [`mdast-util-caml`](https://github.com/wikibonsai/remark-caml/tree/master/mdast-util-caml) with [mdast](https://github.com/syntax-tree/mdast) or [`remark-caml`](https://github.com/wikibonsai/remark-caml/tree/master/remark-caml) with [remark](https://github.com/remarkjs/remark).

Note that this extension only parses the input -- it is up to you to track and store attribute metadata.

🕸 Weave a semantic web in your [🎋 WikiBonsai](https://github.com/wikibonsai/wikibonsai) digital garden.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). Install [`micromark-extension-caml`]() on `npm`.

```
npm install micromark-extension-caml 
```

## Usage

```js
import micromark from 'micromark';
import { syntaxCaml, htmlCaml } from 'micromark-extension-caml';

let serialized = micromark(':attrtype::value\n', {
    extensions: [syntaxCaml()],
    htmlExtensions: [htmlCaml()]
});
```

The serialized result will be the following.  To get an abstract syntax tree, use `mdast-util-caml` instead.

While data is extracted and stored in data tokens, no HTML is generated at the `micromark` level. To render directly to html, use [`mdast-util-caml`](https://github.com/wikibonsai/remark/caml/tree/main/mdast-util-caml).

## Options

```js
let opts = {
  attrs: {
    render: boolean;
    title: string;
  },
  cssNames: {
    attr: string;
    attrbox: string;
    attrboxTitle: string;
    // [[wikilinks]]-related
    invalid: string;
    valid: string;
  },
};
```

## Syntax

For syntax specifications, see the [caml-spec](https://github.com/caml-mkdn/tree/main/spec) repo.

### Options Descriptions

See [`remark-caml` readme](https://github.com/wikibonsai/remark-caml#options-descriptions) for option descriptions.
