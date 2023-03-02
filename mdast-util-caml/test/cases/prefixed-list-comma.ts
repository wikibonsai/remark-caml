import type { TestCaseMdast } from '../types';
import { nodeKinds } from './astNode';


export const prefixedListCommaCases: TestCaseMdast[] = [
  {
    descr: 'prefixed; list; mkdn-separated',
    mkdn: ':attrtype::\n- string-a\n- string-b\n- string-c\n',
    node: nodeKinds['list'],
    opts: {},
  },
  {
    descr: 'prefixed; list; comma-separated; w/out pad; w/out whitespace',
    mkdn: ':attrtype::string-a,string-b,string-c\n',
    node: nodeKinds['list'],
    opts: {
      attrs: {
        toMarkdown: {
          listKind: 'comma',
          prefixed: true,
        },
      },
    },
  },
  {
    descr: 'prefixed; padded; list; comma-separated; w/out pad',
    mkdn: ': attrtype :: string-a, string-b, string-c\n',
    node: nodeKinds['list'],
    opts: {
      attrs: {
        toMarkdown: {
          format: 'pad',
          prefixed: true,
          listKind: 'comma',
        },
      },
    },
  },
];