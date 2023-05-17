# `remark-caml`

[![A WikiBonsai Project](https://img.shields.io/badge/%F0%9F%8E%8B-A%20WikiBonsai%20Project-brightgreen)](https://github.com/wikibonsai/wikibonsai)

Following [convention](https://github.com/micromark/micromark/discussions/56), this repository contains **three separate `npm` packages** related to support for [`pandoc`-style](https://pandoc.org/MANUAL.html#extension-citations) citation syntax for the `remark` Markdown parser.

* [`micromark-extension-caml`](https://www.npmjs.com/package/micromark-extension-caml) defines a new [syntax extension](https://github.com/micromark/micromark#syntaxextension) for `micromark`, which is responsible for converting markdown syntax to a token stream
* [`mdast-util-caml`](https://www.npmjs.com/package/mdast-util-caml) describes how to convert tokens output by `micromark-extension-caml` into either an HTML string or `mdast` syntax tree.
* [`remark-caml`](https://www.npmjs.com/package/remark-caml) encapsulates the above functionality into a `remark` plugin.

For more information, see the individual folders for each package.

🕸 Weave a semantic web in your [🎋 WikiBonsai](https://github.com/wikibonsai/wikibonsai) digital garden.

## Contributing

Pull requests for bugfixes or new features / options are welcome.  Be aware that changes to the syntax extension `micromark-extension-caml` may also have an impact on the other two packages, and you will need to test all three.
