import type { TestCaseMdast } from '../types';
import { attrboxDataNode } from './astNode-data';


export const unprefixedSingleCases: TestCaseMdast[] = [
  {
    descr: 'unprefixed; single; w/out pad; w/out whitespace',
    mkdn: 'attrtype::string\n',
    node: attrboxDataNode['single'],
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
    node: attrboxDataNode['single'],
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
