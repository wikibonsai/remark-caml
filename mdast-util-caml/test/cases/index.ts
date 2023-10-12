// import

import { TestCaseMdast, TestCaseMdastBuilder } from '../types';

import { prefixedSingleCases } from './prefixed-single';
import { prefixedListCommaCases } from './prefixed-list-comma';
import { prefixedListMkdnCases } from './prefixed-list-mkdn';
import { unprefixedSingleCases } from './unprefixed-single';
import { unprefixedListCommaCases } from './unprefixed-list-comma';
import { unprefixedListMkdnCases } from './unprefixed-list-mkdn';

import { mdastAttrBoxCases } from './mdast-attrbox-builder';

/* eslint-disable indent */
const mdastSingleCases   : TestCaseMdast[] = ([] as TestCaseMdast[]).concat(prefixedSingleCases)
                                                                    .concat(unprefixedSingleCases);
const mdastListCommaCases: TestCaseMdast[] = ([] as TestCaseMdast[]).concat(prefixedListCommaCases)
                                                                    .concat(unprefixedListCommaCases);
const mdastListMkdnCases : TestCaseMdast[] = ([] as TestCaseMdast[]).concat(prefixedListMkdnCases)
                                                                    .concat(unprefixedListMkdnCases);
const mdastCases         : TestCaseMdast[] = ([] as TestCaseMdast[]).concat(mdastSingleCases)
                                                                    .concat(mdastListCommaCases)
                                                                    .concat(mdastListMkdnCases);
const mdastBuilderCases  : TestCaseMdastBuilder[] = ([] as TestCaseMdastBuilder[]).concat(mdastAttrBoxCases);
/* eslint-enable indent */

// export

export { prefixedSingleCases } from './prefixed-single';
export { unprefixedSingleCases } from './unprefixed-single';
export { prefixedListCommaCases } from './prefixed-list-comma';
export { unprefixedListCommaCases } from './unprefixed-list-comma';
export { prefixedListMkdnCases } from './prefixed-list-mkdn';
export { unprefixedListMkdnCases } from './unprefixed-list-mkdn';

export {
  // render cases
  mdastCases,
  mdastSingleCases,
  mdastListCommaCases,
  mdastListMkdnCases,
  // builder cases
  mdastBuilderCases
};
