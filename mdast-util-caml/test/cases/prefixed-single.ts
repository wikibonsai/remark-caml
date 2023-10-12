import type { TestCaseMdast } from '../types';
import { attrboxDataNode } from './astNode-data';


export const prefixedSingleCases: TestCaseMdast[] = [
  {
    descr: 'prefixed; single; prefixed; w/out pad',
    mkdn: ':attrtype::string\n',
    node: attrboxDataNode['single'],
    opts: {},
  },
  {
    descr: 'prefixed; single; w/out whitespace',
    mkdn: ':attrtype::string\n',
    node: attrboxDataNode['single'],
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
    node: attrboxDataNode['single'],
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
