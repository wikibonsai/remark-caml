import { merge } from 'lodash-es';
import type { CamlValData } from 'caml-mkdn';
import * as Uni from 'unist';
import type {
  ConstructName,
  Context,
  Handle,
  SafeOptions
} from 'mdast-util-to-markdown';
import { safe } from 'mdast-util-to-markdown/lib/util/safe.js';
import type {
  CamlOptions,
  OptToMarkdown,
} from 'micromark-extension-caml';
import { WikiAttrData } from 'micromark-extension-caml';

import type { AttrBoxNode } from '../util/types';


// required options
interface ReqOpts {
  attrs: {
    enable: boolean;
    toMarkdown: OptToMarkdown;
  };
}

export function toMarkdownCaml(this: any, opts: Partial<CamlOptions> = {}) {
  // opts
  const defaults: ReqOpts = {
    attrs: {
      enable: true,
      toMarkdown: {
        format: 'none',
        listKind: 'mkdn',
        prefixed: true,
      } as OptToMarkdown,
    },
  };
  const fullOpts: ReqOpts = merge(defaults, opts);

  return {
    // TODO: I don't fully understand what this does, but I did my
    // best to fill it in based on what I saw in other mdast utils
    // (e.g. https://github.com/syntax-tree/mdast-util-math/blob/main/index.js#L135)
    unsafe: [{
      character: '[',
      inConstruct: ['phrasing', 'label', 'reference'],
    }, {
      character: ']',
      inConstruct: ['label', 'reference'],
    }],
    handlers: {
      // as of (2021-05-07), the typings for Handle do not reflect
      // that the handler will be passed nodes of a specific type

      // note: name should match 'Node.type'
      attrbox: handler as unknown as Handle,
    }
  };

  function handler(
    node: AttrBoxNode,
    _: Uni.Parent | null | undefined,
    context: Context,
  ): string {
    const exit = context.enter('attrbox' as ConstructName);

    // 'defaults' ensure 'fullOpts.attrs' will be populated above
    const format: string = fullOpts.attrs.toMarkdown.format;
    const listKind: string = fullOpts.attrs.toMarkdown.listKind;
    const prefixed: boolean = fullOpts.attrs.toMarkdown.prefixed;

    // init vars / build string value
    let value: string = '';

    if (prefixed) {
      value += ':';
      if (format === 'pad') { value += ' '; }
    }

    for (const [key, items] of Object.entries(node.data.items)) {
      // key
      /* eslint-disable indent */
      const nodeKey: string = safe(
                                    context,
                                    key,
                                    { before: ':', after: ':' } as SafeOptions,
                                  );
      /* eslint-enable indent */
      if (nodeKey) {
        value += nodeKey;
        if (format === 'pad') { value += ' '; }
        value += '::';
        if (format === 'pad') { value += ' '; }
      }
      // values / items
      for (let i = 0; i < items.length; i++) {
        // [[wikilink]] (taken from mdast-util-wikirefs)
        if (items[i].type === 'wiki') {
          const isLastItem: boolean = (i === (items.length - 1));
          /* eslint-disable indent */
          const nodeFileName: string = safe(
                                              context, // todo: 'context' -> 'state' (see: https://github.com/syntax-tree/mdast-util-to-markdown/commit/e812c7954f8b8ea5dd68476c856cbfd7cc4c442b)
                                              (<WikiAttrData> items[i]).filename,
                                              { before: '[', after: ']' } as SafeOptions,
                                            );
          /* eslint-enable indent */
          // single item or list comma-separated
          if ((items.length === 1) || (listKind === 'comma')) {
            value += `[[${nodeFileName}]]`;
            if (!isLastItem) {
              value += ',';
              if (format === 'pad') { value += ' '; }
            }
          }
          // multiple items, list mkdn-separated
          if ((items.length > 1) && listKind === 'mkdn') {
            value += `\n- [[${nodeFileName}]]`;
          }
          // add last newline after last item
          if (isLastItem) {
            value += '\n';
          }
        // primitive
        } else {
          const camlItem: CamlValData = <CamlValData> items[i];
          const isLastItem: boolean = (i === (items.length - 1));
          /* eslint-disable indent */
          const nodeValue: string = safe(
                                          context,
                                          camlItem.string,
                                          { before: '[', after: ']' } as SafeOptions,
                                        );
          /* eslint-enable indent */
          // single item or list comma-separated
          if ((items.length === 1) || (listKind === 'comma')) {
            value += nodeValue;
            if (!isLastItem) {
              value += ',';
              if (format === 'pad') { value += ' '; }
            }
          }
          // multiple items, list mkdn-separated
          if ((items.length > 1) && listKind === 'mkdn') {
            value += `\n- ${nodeValue}`;
          }
          // add last newline after last item
          if (isLastItem) {
            value += '\n';
          }
        }
      }
    }

    exit();
    return value;
  }
}
