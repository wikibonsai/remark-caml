import type { TestCase } from '../../micromark-extension-caml/test/types';
import type { AttrBoxNode } from '../src/util/types';


export interface TestCaseMdast extends TestCase {
  node:                        // ast node
    Partial<AttrBoxNode>
    | {                        // base expected properties
      type: string,
      data: any,
    },
}
