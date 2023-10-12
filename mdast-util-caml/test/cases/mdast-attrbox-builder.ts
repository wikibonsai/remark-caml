import { attrboxDataNode } from './astNode-data';
import { attrBoxNode } from './astNode';

import { TestCaseMdastBuilder } from '../types';


export const mdastAttrBoxCases: TestCaseMdastBuilder[] = [
  {
    descr: 'attrbox; single',
    inNodes: [attrboxDataNode['single']],
    outNode: attrBoxNode['single'],
  },
  {
    descr: 'attrbox; list',
    inNodes: [attrboxDataNode['list']],
    outNode: attrBoxNode['list'],
  },
  {
    descr: 'attrbox; merged',
    inNodes: [
      attrboxDataNode['merge-1a'],
      attrboxDataNode['merge-1b'],
      attrboxDataNode['merge-2c']
    ],
    outNode: attrBoxNode['merged'],
  },
];
