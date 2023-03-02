import type { TestCaseMdast } from '../types';
import { nodeKinds } from './astNode';


export const unprefixedListMkdnCases: TestCaseMdast[] = [
  {
    descr: 'unprefixed; list; mkdn-separated; w/out pad; w/out whitespace',
    mkdn: 'attrtype::\n- string-a\n- string-b\n- string-c\n',
    node: nodeKinds['list'],
    opts: {
      attrs: {
        toMarkdown: {
          prefixed: false,
          listKind: 'mkdn',
        },
      },
    },
  },
  {
    descr: 'unprefixed; padded; list; mkdn-separated; w/out whitespace',
    mkdn: 'attrtype :: \n- string-a\n- string-b\n- string-c\n',
    node: nodeKinds['list'],
    opts: {
      attrs: {
        toMarkdown: {
          format: 'pad',
          prefixed: false,
          listKind: 'mkdn',
        },
      },
    },
  },
];