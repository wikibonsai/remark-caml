import type { TestCaseMdast } from '../types';
import { nodeKinds } from './astNode';


export const prefixedSingleCases: TestCaseMdast[] = [
  {
    descr: 'prefixed; single; prefixed; w/out pad',
    mkdn: ':attrtype::string\n',
    node: nodeKinds['single'],
    opts: {},
  },
  {
    descr: 'prefixed; single; w/out whitespace',
    mkdn: ':attrtype::string\n',
    node: nodeKinds['single'],
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
    descr: 'prefixed; single; w/ pad',
    mkdn: ': attrtype :: string\n',
    node: nodeKinds['single'],
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
