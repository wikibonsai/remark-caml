import { CamlOptions } from '../src/util/types';

// types

export interface TestCase {
  descr: string,               // test description
  error?: boolean,             // test reflects an error state
  opts?: Partial<CamlOptions>, // plugin options
  mkdn: string,                // markdown input
  data?: any,
}

export interface TestCaseHtml extends TestCase {
  html: string,                // html output
}
