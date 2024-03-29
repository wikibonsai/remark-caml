import type { TestCaseMdast } from '../types';
import { attrboxDataNode } from './astNode-data';


export const unprefixedListCommaCases: TestCaseMdast[] = [
  {
    descr: 'unprefixed; list; comma-separated; w/out pad; w/out whitespace',
    mkdn: 'attrtype::string-a,string-b,string-c\n',
    node: attrboxDataNode['list'],
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
    descr: 'unprefixed; list; comma-separated; w/ pad; w/out whitespace',
    mkdn: 'attrtype :: string-a, string-b, string-c\n',
    node: attrboxDataNode['list'],
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