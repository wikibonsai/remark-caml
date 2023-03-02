# `remark-caml`

![[A WikiBonsai Project](https://github.com/wikibonsai/wikibonsai)](https://img.shields.io/badge/%F0%9F%8E%8B-A%20WikiBonsai%20Project-brightgreen)
[![NPM package](https://img.shields.io/npm/v/remark-caml)](https://npmjs.org/package/remark-caml)

Plugin for [`remark`](https://github.com/remarkjs/remark) to support [CAML](https://github.com/wikibonsai/caml) attributes.  Relies on [`micromark-extension-caml`](https://github.com/wikibonsai/remark-caml/tree/master/micromark-extension-caml) for tokenization and [`mdast-util-caml`](https://github.com/wikibonsai/remark-caml/tree/master/mdast-util-caml) for converting markdown to/from abstract syntax trees.

Note that this extension only parses the input -- it is up to you to track and store attribute metadata.

🕸 Weave a semantic web in your [🎋 WikiBonsai](https://github.com/wikibonsai/wikibonsai) digital garden.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). Install [`remark-caml`]() on `npm`.

```
npm install remark-caml
```

## Usage

```javascript
const unified = require('unified')
const markdown = require('remark-parse')
const { remarkCaml } = require('remark-caml');

let processor = unified()
    .use(markdown)
    .use(remarkCaml, {})
```

Running the processor on the following markdown:

```markdown
:attrtype::value
```

Will produce the following `caml` node:

```json
{
	"type": "attrbox",
	"data": {
		"items": {
			"attrtype": [{
				"type": "string",
				"value": "string",
				"string": "string",
			}, ],
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

### Options Descriptions

#### `attrs`

These are options wikiattrs-specific options.

#### `attrs.enable`

A boolean property that toggles parsing and rendering wikiattrs on/off.

#### `attrs.render`

A boolean property that toggles rendering wikiattrs on/off. This is useful in the scenario where wikiattrs are used for metadata and not for display purposes; like a yaml-stand-in.

#### `attrs.title`

A string to be rendered in the wikiattrs' attrbox.

#### `cssNames`

CSS classnames may be overridden here.

#### `cssNames.attr`

Classname for wikiattrs. Default is `attr`.

#### `cssNames.wiki`

Classname for valid wikiattrs. Default is `wiki`.

#### `cssNames.invalid`

Classname for invalid wikiattrs. Default is `invalid`.

#### `cssNames.attrbox`

Classname for the wikiattr attrbox. Default is `attrbox`.

#### `cssNames.attrboxTitle`

Classname for the wikiattr attrbox title. Default is `attrbox-title`.
