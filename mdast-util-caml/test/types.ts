import type { TestCase } from '../../micromark-extension-caml/test/types';
import type { AttrBoxNode, AttrBoxDataNode } from '../src/util/types';


export interface TestCaseMdast extends TestCase {
  descr: string;          // test description
  error?: boolean;        // test reflects an error state
  opts?: any;             // options
  mkdn: string;           // markdown input
  node:                   // ast node
    Partial<AttrBoxNode>
    | {                   // base expected properties
      type: string,
      data: any,
    },
}

export interface TestCaseMdastBuilder {
  descr: string;    // test description
  error?: boolean;  // test reflects an error state
  opts?: any;       // options
  inNodes:          // ast nodes
    (Partial<AttrBoxDataNode>
    | {             // base expected properties
      type: string,
      data: any,
    })[],
  outNode:          // ast node
    Partial<AttrBoxNode>
    | {             // base expected properties
      type: string,
      data: any,
    },
}
