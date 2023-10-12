import { ok as assert } from 'uvu/assert';
import type { CamlValData } from 'caml-mkdn';
import { resolve } from 'caml-mkdn';
import { CompileContext } from 'micromark-util-types';
import { Token } from 'micromark/lib/create-tokenizer';

import type {
  AttrData,
  AttrDataPrimitive,
  CamlOptions,
} from '../util/types';


export function htmlCaml(opts: Partial<CamlOptions> = {}) {

  // note: enter/exit keys should match a token name
  return {
    enter: {
      attrBox: enterAttrBox,
    },
    exit: {
      attrKey: exitAttrKey,
      attrVal: exitAttrVal,
      attrBox: exitAttrBox,
    },
  };

  function enterAttrBox (this: CompileContext): void {
    // attrs
    let stack = this.getData('attrStack') as unknown as AttrData[];
    if (!stack) this.setData('attrStack', (stack = []));
    stack.push({} as AttrData);
    // current key
    const curKey: string = this.getData('curKey') as unknown as string;
    if (!curKey) this.setData('curKey', '');
  }

  function exitAttrKey (this: CompileContext, token: Token): void {
    const key: string = this.sliceSerialize(token);
    const stack: AttrData[] = this.getData('attrStack') as unknown as AttrData[];
    const current: AttrData = top(stack);
    if (!Object.keys(current).includes(key)) {
      current[key] = [] as AttrDataPrimitive[];
    }
    this.setData('curKey', key);
  }

  function exitAttrVal (this: CompileContext, token: Token): void {
    const value: string = this.sliceSerialize(token);
    const stack: AttrData[] = this.getData('attrStack') as unknown as AttrData[];
    const current: AttrData = top(stack);
    const resolvedVal: CamlValData = resolve(value);
    const curKey: string = this.getData('curKey') as unknown as string;
    current[curKey].push(resolvedVal);
  }

  // note: leaving this here to "close the token"
  function exitAttrBox (this: CompileContext): void {
    const attrs: AttrData | undefined = (this.getData('attrStack') as unknown as AttrData[]).pop();
    assert((attrs !== undefined), 'in exitAttrBox(): problem with \'attrs\'');
  }

  // util

  function top<T>(stack: T[]): T {
    return stack[stack.length - 1];
  }
}
