export { syntaxCaml } from './lib/syntax';
export { htmlCaml } from './lib/html';

/**********************************************/
/*** !!! types need to be exported last !!! ***/
/**********************************************/
// ...because 'type' will be applied to other exports otherwise
// (not sure why...)

export * from './util/types';
export * from '../test/types';
