import type { TestCaseMdast } from '../types';
import { nodeKinds } from './astNode';


export const prefixedListMkdnCases: TestCaseMdast[] = [
  {
    descr: 'prefixed; list; mkdn-separated; w/out pad; w/out whitespace',
    mkdn: ':attrtype::\n- string-a\n- string-b\n- string-c\n',
    node: nodeKinds['list'],
    opts: {
      attrs: {
        toMarkdown: {
          prefixed: true,
          listKind: 'mkdn',
        },
      },
    },
  },
  {
    descr: 'prefixed; list; mkdn-separated; w/ pad; w/out whitespace',
    mkdn: ': attrtype :: \n- string-a\n- string-b\n- string-c\n',
    node: nodeKinds['list'],
    opts: {
      attrs: {
        toMarkdown: {
          format: 'pad',
          prefixed: true,
          listKind: 'mkdn',
        },
      },
    },
  },
];
