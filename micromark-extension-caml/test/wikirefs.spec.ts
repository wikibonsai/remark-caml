// todo: html data tests

// import assert from 'node:assert/strict';

// import { micromark } from 'micromark';

// // import type { CamlOptions } from '../../src';
// import type { WikiRefsOptions } from 'micromark-extension-wikirefs';

// import { htmlWikiRefs, syntaxWikiRefs } from 'micromark-extension-wikirefs';

// import { htmlCaml, syntaxCaml } from '../src';

// // import type { TestCaseHtml } from '../types';
// // import { makeMockOptsForRenderOnly } from '../config';


// // let env: any;
// // let mockCamlOpts: Partial<CamlOptions>;
// let mockWikiOpts: Partial<WikiRefsOptions>;

// // todo: fix failing tests
// describe('caml + wikirefs compatibility', () => {

//   describe('both installed', () => {

//     it('short; only wikiref', () => {
//       // setup
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `:attr::[[wikiattr]]
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxWikiRefs(),
//             syntaxCaml(),
//           ],
//           htmlExtensions: [
//             htmlWikiRefs(),
//             htmlCaml(),
//           ],
//         },
//       );
//       const expdHtml: string = '<aside class="attrbox"><span class="attrbox-title">Attributes</span><dl><dt>attr</dt><dd><a class="attr wiki reftype__attr" href="/wikiattr" data-href="/wikiattr">wikiattr</a></dd></dl></aside>';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//     it('short; only caml', () => {
//       // setup
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `:attr::string
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxWikiRefs(),
//             syntaxCaml(),
//           ],
//           htmlExtensions: [
//             htmlWikiRefs(),
//             htmlCaml(),
//           ],
//         },
//       );
//       const expdHtml: string = '<aside class="attrbox"><span class="attrbox-title">Attributes</span><dl><dt>attr</dt><dd><span class="attr string attr">string</span></dd></dl></aside>\n';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//     it('long', () => {
//       // setup
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `attr1::[[wikiattr1]]
// :attr2::[[wikiattr2]]
// :attr3::[[wikiattr3]], [[wikiattr4]]
// :attr4::
// - [[wikiattr5]]
// - [[wikiattr6]]
// attr5::string1
// :attr6::string2
// :attr7::string3, string4
// :attr8::
// - string5
// - string6
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxWikiRefs(),
//             syntaxCaml(),
//           ],
//           htmlExtensions: [
//             htmlWikiRefs(),
//             htmlCaml(),
//           ],
//         },
//       );
//       const expdHtml: string = '<aside class="attrbox"><span class="attrbox-title">Attributes</span><dl><dt>attr1</dt><dd><a class="attr wiki attr1 reftype__attr1" href="/wikiattr1" data-href="/wikiattr1">wikiattr1</a></dd><dt>attr2</dt><dd><a class="attr wiki attr2" href="/wikiattr2" data-href="/wikiattr2">wikiattr2</a></dd><dt>attr3</dt><dd><a class="attr wiki attr3" href="/wikiattr3" data-href="/wikiattr3">wikiattr3</a></dd><dd><a class="attr wiki attr3" href="/wikiattr4" data-href="/wikiattr4">wikiattr4</a></dd><dt>attr4</dt><dd><a class="attr wiki attr4" href="/wikiattr5" data-href="/wikiattr5">wikiattr5</a></dd><dd><a class="attr wiki attr4" href="/wikiattr6" data-href="/wikiattr6">wikiattr6</a></dd><dt>attr5</dt><dd><span class="attr string attr5">string1</span></dd><dt>attr6</dt><dd><span class="attr string attr6">string2</span></dd><dt>attr7</dt><dd><span class="attr string attr7">string3</span></dd><dd><span class="attr string attr7">string4</span></dd><dt>attr8</dt><dd><span class="attr string attr8">string5</span></dd><dd><span class="attr string attr8">string6</span></dd></dl></aside>\n\n\n\n\n\n\n';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//   });

//   describe('only \'wikirefs\' installed', () => {


//     it('short; only wikiref', () => {
//       // setup
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `:attr::[[wikiattr]]
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxWikiRefs(),
//           ],
//           htmlExtensions: [
//             htmlWikiRefs(),
//           ],
//         },
//       );
//       const expdHtml: string = '<aside class="attrbox"><span class="attrbox-title">Attributes</span><dl><dt>attr</dt><dd><a class="attr wiki reftype__attr" href="/wikiattr" data-href="/wikiattr">wikiattr</a></dd></dl></aside>';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//     it('short; only caml', () => {
//       // setup
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `:attr::string
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxWikiRefs(),
//           ],
//           htmlExtensions: [
//             htmlWikiRefs(),
//           ],
//         },
//       );
//       const expdHtml: string = '<p>:attr::string</p>\n';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//     it('long', () => {
//       // render
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `attr1::[[wikiattr1]]
// :attr2::[[wikiattr2]]
// :attr3::[[wikiattr3]], [[wikiattr4]]
// :attr4::
// - [[wikiattr5]]
// - [[wikiattr6]]
// attr5::string1
// :attr6::string2
// :attr7::string3, string4
// :attr8::
// - string5
// - string6
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxWikiRefs(),
//           ],
//           htmlExtensions: [
//             htmlWikiRefs(mockWikiOpts),
//           ],
//         },
//       );
//       // assert
//       const expdHtml: string = '<aside class="attrbox">\n<span class="attrbox-title">Attributes</span>\n<dl>\n<dt>attr1</dt>\n<dd><a class="attr wiki attr1" href="/wikiattr1" data-href="/wikiattr1">wikiattr1</a></dd>\n<dt>attr2</dt>\n<dd><a class="attr wiki attr2" href="/wikiattr2" data-href="/wikiattr2">wikiattr2</a></dd>\n<dt>attr3</dt>\n<dd><a class="attr wiki attr3" href="/wikiattr3" data-href="/wikiattr3">wikiattr3</a></dd>\n<dd><a class="attr wiki attr3" href="/wikiattr4" data-href="/wikiattr4">wikiattr4</a></dd><dt>attr4</dt>\n<dd><a class="attr wiki attr4" href="/wikiattr5" data-href="/wikiattr5">wikiattr5</a></dd>\n<dd><a class="attr wiki attr4" href="/wikiattr6" data-href="/wikiattr6">wikiattr6</a></dd>\n</dl>\n</aside>\n<p>attr5::string1\n:attr6::string2\n:attr7::string3, string4\n:attr8::\n</p>\n<ul>\n<li>string5</li>\n<li>string6</li>\n</ul>';
//       assert.strictEqual(
//         actlHtml.replace(/\n/g, ''),
//         expdHtml.replace(/\n/g, ''),
//       );
//     });

//   });

//   describe('only \'caml\' installed', () => {


//     it('short; only wikiref', () => {
//       // setup
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `:attr::[[wikiattr]]
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxCaml(),
//           ],
//           htmlExtensions: [
//             htmlCaml(),
//           ],
//         },
//       );
//       const expdHtml: string = '<p>:attr::[[wikiattr]]</p>\n';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//     it('short; only caml', () => {
//       // setup
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `:attr::string
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxCaml(),
//           ],
//           htmlExtensions: [
//             htmlCaml(),
//           ],
//         },
//       );
//       const expdHtml: string = '<aside class="attrbox"><span class="attrbox-title">Attributes</span><dl><dt>attr</dt><dd><span class="attr string attr">string</span></dd></dl></aside>\n';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//     it('long', () => {
//       // render
//       /* eslint-disable indent */
//       const actlHtml: string = micromark(
// `attr1::[[wikiattr1]]
// :attr2::[[wikiattr2]]
// :attr3::[[wikiattr3]], [[wikiattr4]]
// :attr4::
// - [[wikiattr5]]
// - [[wikiattr6]]
// attr5::string1
// :attr6::string2
// :attr7::string3, string4
// :attr8::
// - string5
// - string6
// `
//         /* eslint-enable indent */
//         , {
//           extensions: [
//             syntaxCaml(),
//           ],
//           htmlExtensions: [
//             htmlCaml(),
//           ],
//         },
//       );
//       const expdHtml: string = '<aside class="attrbox"><span class="attrbox-title">Attributes</span><dl><dt>attr5</dt><dd><span class="attr attr5 string">string1</span></dd><dt>attr6</dt><dd><span class="attr attr6 string">string2</span></dd><dt>attr7</dt><dd><span class="attr attr7 string">string3</span></dd><dd><span class="attr attr7 string">string4</span></dd><dt>attr8</dt><dd><span class="attr attr8 string">string5</span></dd><dd><span class="attr attr8 string">string6</span></dd></dl></aside>\n<p>attr1::[[wikiattr1]]\n:attr2::[[wikiattr2]]\n:attr3::[[wikiattr3]], [[wikiattr4]]\n:attr4::\n- [[wikiattr5]]</p>\n<ul>\n<li>[[wikiattr6]]</li>\n</ul>\n';
//       assert.strictEqual(actlHtml, expdHtml);
//     });

//   });

// });
