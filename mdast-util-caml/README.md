# `mdast-util-caml`

[![A WikiBonsai Project](https://img.shields.io/badge/%F0%9F%8E%8B-A%20WikiBonsai%20Project-brightgreen)](https://github.com/wikibonsai/wikibonsai)
[![NPM package](https://img.shields.io/npm/v/mdast-util-caml)](https://npmjs.org/package/mdast-util-caml)

Extension for [`mdast-util-from-markdown`](https://github.com/syntax-tree/mdast-util-from-markdown) and
[`mdast-util-to-markdown`](https://github.com/syntax-tree/mdast-util-to-markdown) to support [CAML](https://github.com/wikibonsai/caml) attributes.  Converts the token stream produced by [`micromark-extension-caml`](https://github.com/wikibonsai/remark-caml/tree/master/micromark-extension-caml) into an abstract syntax tree.  

Note that this extension only parses the input -- it is up to you to track and store attribute metadata.

Using [`remark`](https://github.com/remarkjs/remark)?  You probably shouldn’t use this package directly, but instead use [`remark-caml`](https://github.com/wikibonsai/remark-caml/tree/master/remark-caml).  See [`micromark-extension-caml`](https://github.com/wikibonsai/remark-caml/tree/master/micromark-extension-caml) for a full description of the supported syntax.


🕸 Weave a semantic web in your [🎋 WikiBonsai](https://github.com/wikibonsai/wikibonsai) digital garden.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). Install [`mdast-util-caml`]() on `npm`.

```
npm install mdast-util-caml
```

## Usage

### Markdown to AST

```javascript
import fromMarkdown from 'mdast-util-from-markdown';
import { camlSyntax } from 'micromark-extension-caml';
import { fromMarkdownCaml } from 'mdast-util-caml';

let ast = fromMarkdown(':attrtype::value\n', {
  extensions: [camlSyntax()],
  mdastExtensions: [fromMarkdownCaml]
})
```

...is first converted to a data node which takes the form below:

```json
{
  "type": "attrbox-data",
  "data": {
    "items": {
      "attrtype": [
        {
          "type": "string",
          "value": "string",
          "string": "string",
        }
      ],
    },
  }
}
```

Data nodes like this are then extracted after render, are merged, and a single attrbox node is generated and inserted at the top of the document in the abstract syntax tree. It has the form below, where:

* `data.items` contains the original markdown source parsed into the individual components of the caml attr.

```json
{
  "type": "attrbox",
  "data": {
    "items": {
      "attrtype": [
        {
          "type": "string",
          "value": "string",
          "string": "string",
        }
      ],
    },
    "hName": "aside",
    "hProperties": {
      "className": ["attrbox"],
    },
  },
  "children": [
    {
      "type": "attrbox-title",
      "data": {
        "hName": "span",
        "hProperties": {
          "className": ["attrbox-title"],
        },
      }
    },
    {
      "type": "attrbox-list",
      "children": [{
          "type": "attr-key",
          "data": {
            "hName": "dt"
          },
          "children": [{
            "type": "text",
            "value": "attrtype",
          }],
        },
        {
          "type": "attr-val",
          "data": {
            "hName": "dd"
          },
          "children": [{
            "type": "text",
            "value": "value",
          }],
        },
      ],
      "data": {
        "hName": "dl"
      },
    },
  ],
}
```


### Options

```js
let opts = {
  attrs: {
    render: boolean;
    title: string;
    css: {
      attr: string;
      attrbox: string;
      attrboxTitle: string;
      // [[wikiattrs]]-related
      invalid: string;
      wiki: string;
    }
  }
};

### AST to Markdown

Taking the `ast` from the previous example,

```js
import fromMarkdown from 'mdast-util-from-markdown'
import { camlToMarkdown } from 'mdast-util-caml'

let markdownString = toMarkdown(ast, {
  extensions: [camlToMarkdown(defaultOptions)]
}).trim();
```

The result will be:

```markdown
:attrtype::value
```

### Options

```js
let opts = {
  attrs: {
    enable: true,
    toMarkdown: {
      format: 'none',
      listKind: 'mkdn',
      prefixed: true,
    }
  }
};

### Options Descriptions

See [`remark-caml` readme](https://github.com/wikibonsai/remark-caml#options-descriptions) for option descriptions.
