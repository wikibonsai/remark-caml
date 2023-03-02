import type { TestCaseMdast } from '../types';
import { nodeKinds } from './astNode';


export const unprefixedSingleCases: TestCaseMdast[] = [
  {
    descr: 'unprefixed; single; w/out pad; w/out whitespace',
    mkdn: 'attrtype::string\n',
    node: nodeKinds['single'],
    opts: {
      attrs: {
        toMarkdown: {
          prefixed: false,
          listKind: 'comma',
        },
      },
    },
  },
  {
    descr: 'unprefixed; single; w/ pad; w/out whitespace',
    mkdn: 'attrtype :: string\n',
    node: nodeKinds['single'],
    opts: {
      attrs: {
        toMarkdown: {
          format: 'pad',
          prefixed: false,
          listKind: 'comma',
        },
      },
    },
  },
];
