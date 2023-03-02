// some useful references:
// mdast-util-to-hast: https://github.com/syntax-tree/mdast-util-to-hast
// mdast             : https://github.com/syntax-tree/mdast
// hast              : https://github.com/syntax-tree/hast

export { fromMarkdownCaml } from './lib/fromMarkdown';
export { toMarkdownCaml } from './lib/toMarkdown';

/**********************************************/
/*** !!! types need to be exported last !!! ***/
/**********************************************/
// ...because 'type' will be applied to other exports otherwise
// (not sure why...)

export * from './util/types';
