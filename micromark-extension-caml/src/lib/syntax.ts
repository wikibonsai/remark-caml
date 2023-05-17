import type { Code, Extension, Point } from 'micromark-util-types';
import { ConstructRecord } from 'micromark/dev/lib/create-tokenizer';

import { codes } from 'micromark-util-symbol/codes';

import { CamlOptions } from '../util/types';
import { keyUsableCharCodes } from '../util/const';

import { ok as assert } from 'uvu/assert';
import { push } from 'micromark-util-chunked';
import type { Event } from 'micromark/dev/lib/compile';
import type { Tokenizer } from 'micromark/dev/lib/initialize/document';
import type { State, Effects, TokenizeContext } from 'micromark/dev/lib/create-tokenizer';
import type { /*Code,*/ Resolver } from 'micromark-util-types';

import { types as UnifiedTypeToken } from 'micromark-util-symbol/types';
import {
  markdownLineEnding,
  markdownLineEndingOrSpace,
  markdownSpace,
} from 'micromark-util-character';
import { factorySpace } from 'micromark-factory-space';

import { RGX } from 'caml-mkdn';

import {
  markdownBullet,
  CamlToken,
} from '../util/const';


const keyPrefixMarker = ':';
const keyMarker = '::';
const listBulletMarker = '- '; // only listBulletMarker.length used -- have to use markdownBullet() function to test for -*+

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const syntaxCaml = (function (opts?: Partial<CamlOptions>): Extension {
  const flow: ConstructRecord = {} as ConstructRecord;
  /* eslint-disable indent */
  // hooks                            // w/ prefix
  const hooks: Code[] = ([] as Code[]).concat([codes.colon])
                                      // w/out prefix
                                      .concat(Object.values(keyUsableCharCodes));
  /* eslint-enable indent */
  // todo: any way to make this...nicer?
  for (const code of hooks) {
    if (code !== null) {
      flow[code] = {
        name: 'caml',
        tokenize: tokenizeCaml as Tokenizer,
        concrete: true,
        resolveAll: resolveAttrs as Resolver,
      };
    }
  }
  // assemble extension
  return { flow };

  // construct functions

  function resolveAttrs(this: Resolver, events: Event[], context: TokenizeContext): Event[] {
    // current index
    let index: number = -1;
    // track wikiattr events
    const attrEnterEvents: number[] = [];
    const attrExitEvents: number[] = [];
    const attrEvents: number[] = [];
    // markers, newlines, etc. are completely removed
    const attrToss: number[] = [];

    while (++index < events.length) {
      // convert wikiattr token types to caml-friendly token types
      if ((events[index][1].type.indexOf('caml') === 0)
      || (events[index][1].type.indexOf('wiki') === 0)
      || (events[index][1].type.indexOf('attr') === 0)
      ) {
        switch (events[index][1].type) {
        // caml primitives
        case CamlToken.camlAttr:
          if (events[index][0] === 'enter') {
            events[index][1].type = 'attrBox';
            attrEnterEvents.push(index);
          }
          if (events[index][0] === 'exit') {
            events[index][1].type = 'attrBox';
            attrExitEvents.push(index);
          }
          break;
        case CamlToken.camlKeyTxt:
          events[index][1].type = 'attrKey';
          attrEvents.push(index);
          break;
        case CamlToken.camlValTxt:
          events[index][1].type = 'attrVal';
          attrEvents.push(index);
          break;
        // [[wikiattrs]]
        // (this is necessary in the scenario where caml is used, but only
        //  wikiattrs exist and no caml attr primitives exist)
        case 'wikiAttr':
          if (events[index][0] === 'enter') {
            events[index][1].type = 'attrBox';
            attrEnterEvents.push(index);
          }
          if (events[index][0] === 'exit') {
            events[index][1].type = 'attrBox';
            attrExitEvents.push(index);
          }
          break;
        case 'wikiAttrTypeTxt':
          events[index][1].type = 'wikiAttrKey';
          attrEvents.push(index);
          break;
        case 'wikiAttrFileNameTxt':
          events[index][1].type = 'wikiAttrVal';
          attrEvents.push(index);
          break;
        // todo: perform type re-name below when we build the attrs section...
        // type name-changes seem to percolate farther than just the current event,
        // if that happens, indices should still be tracked.
        case 'attrBox':
          if (events[index][0] === 'enter') {
            attrEnterEvents.push(index);
          }
          if (events[index][0] === 'exit') {
            attrExitEvents.push(index);
          }
          break;
        case 'attrKey':
          attrEvents.push(index);
          break;
        case 'attrVal':
          attrEvents.push(index);
          break;
        case 'wikiAttrKey':
          attrEvents.push(index);
          break;
        case 'wikiAttrVal':
          attrEvents.push(index);
          break;
        default: { break; }
        }
      }
    }

    // make sure attrs section enter, key/val, and exit all exist //

    assert(
      !((attrEvents.length === 0)
      &&
      ((attrEnterEvents.length !== 0) || (attrExitEvents.length === 0))
      ),
      'attr key/val tokens expected',
    );
    assert(
      !((attrEvents.length > 0) && (attrEnterEvents.length === 0)),
      'camlAttr enter token expected',
    );
    assert(
      !((attrEvents.length > 0) && (attrExitEvents.length === 0)),
      'camlAttr exit token expected',
    );

    // build attrs section //

    // todo?
    // type: (string | Event | TokenizeContext)[][]
    let attrs: any = [];
    // enter attrs
    attrs = push(attrs, [['enter', events[attrEnterEvents[0]][1], context]]);
    // attr keys/vals
    for (const attr of attrEvents) {
      // 0: 'enter' or 'exit'
      // 1: construct ('attrKey', 'attrVal', 'wikiAttrKey', 'wikiAttrVal')
      // 2: 'context'
      attrs = push(attrs, [[events[attr][0], events[attr][1], context]]);
    }
    // exit attrs
    attrs = push(attrs, [['exit', events[attrExitEvents[attrExitEvents.length - 1]][1], context]]);

    // remove all attr events from original events array //
    const toss: number[] = attrToss.concat(attrEnterEvents).concat(attrEvents).concat(attrExitEvents);
    for (let i = (events.length - 1); i >= 0; i--) {
      if (toss.includes(i)) {
        events.splice(i, 1);
      }
      // todo: 'data'...?
      // ref: https://github.com/micromark/micromark/blob/main/packages/micromark-core-commonmark/dev/lib/label-end.js#L52
      // token.type = UnifiedTypeToken.data;
    }

    // stick attr events to front of events array //

    events.splice(0, 0, ...attrs); // 'unshift'
    return events;
  }

  function tokenizeCaml (this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
    // skip '@typescript-eslint/no-this-alias'
    // eslint-disable-next-line
    const self: TokenizeContext = this;
    // in-
    let inListComma: boolean;
    // is-
    // 'is-' signifies the kind of list the current construct might be.
    // if values continue on the same line, it can only be a comma-separated list
    // if values continue on the next line, it can only be a mkdn-separated list
    // then, if no valid value is found, it is either a single variant (from comma) or
    // an invalid value
    let isListComma: boolean;
    let isListMkdn: boolean;
    // has-
    let hasKey: boolean;
    let hasValue: boolean;
    // consumed-
    let consumedKeyWhiteSpace: boolean;
    let consumedBulletWhiteSpace: boolean;
    // cursors
    let cursorKeyPrefixMarker: number = 0;
    let cursorKeyMarker: number = 0;
    // cursors below need to be reset for each value (for list attrs)
    let cursorListBulletMarker: number = 0;
    // escape comma-separation when in double or single quotes
    let inDoubleQuote: boolean = false;
    let inSingleQuote: boolean = false;

    return start;

    // each function is given an 'end', 'invalid', and 'continue' comment
    // to help guide the eye more quickly to the desired line...:
    // 
    // 'end'     : is the condition by which to kick out of this function.
    // 'invalid' : are checks on whether or not to kick out and invalidate the current token ('nok')
    // 'continue': continue on to the next function ('ok')

    function start (code: Code): State | void {
      // 'attr' must start at the start of a line
      // from: https://github.com/micromark/micromark-extension-frontmatter/blob/main/dev/lib/syntax.js#L75
      const position: Point = self.now();
      const lineFirstChar: boolean = (position.column === 1);
      if (!lineFirstChar) {
        return nok(code);
      }
      effects.enter(CamlToken.camlAttr);
      // w/ prefix
      if (code === codes.colon) {
        effects.enter(CamlToken.camlKeyPrfxMarker);
        return consumeKeyPrefixMarker(code);
      }
      // w/out prefix
      if ((code !== null) && RGX.VALID_CHARS.KEY.test(String.fromCharCode(code))) {
        effects.enter(CamlToken.camlKeyTxt);
        return consumeKeyTxt(code);
      }
      // invalid
      return nok(code);
    }

    function consumeKeyPrefixMarker (code: Code): State | void {
      // end
      if (cursorKeyPrefixMarker === keyPrefixMarker.length) {
        effects.exit(CamlToken.camlKeyPrfxMarker);
        effects.enter(CamlToken.camlKeyTxt);
        return consumeKeyTxt(code);
      }
      // invalid
      if (code !== keyPrefixMarker.charCodeAt(cursorKeyPrefixMarker)) {
        return nok(code);
      }
      // continue...
      effects.consume(code);
      cursorKeyPrefixMarker++;
      return consumeKeyPrefixMarker;
    }

    function consumeKeyTxt (code: Code): State | void {
      // end
      if (code === keyMarker.charCodeAt(cursorKeyMarker)) {
        if (!hasKey) return nok(code);
        effects.exit(CamlToken.camlKeyTxt);
        effects.enter(CamlToken.camlKeyMarker);
        return consumeKeyMarker(code);
      }
      // invalid
      if (markdownLineEnding(code) || code === codes.eof) {
        return nok(code);
      }
      if (!RGX.VALID_CHARS.KEY.test(String.fromCharCode(code))) {
        return nok(code);
      }
      // continue
      if (!markdownLineEndingOrSpace(code)) {
        hasKey = true;
      }
      effects.consume(code);
      return consumeKeyTxt;
    }

    function consumeKeyMarker (code: Code): State | void {
      // end
      if (cursorKeyMarker === keyMarker.length) {
        effects.exit(CamlToken.camlKeyMarker);
        return forkKind(code);
      }
      // invalid
      if (code !== keyMarker.charCodeAt(cursorKeyMarker)) {
        return nok(code);
      }
      // continue
      effects.consume(code);
      cursorKeyMarker++;
      return consumeKeyMarker;
    }

    function forkKind (code: Code): State | void {
      // one whitespace is allowed for padding between
      // attrtype marker '::' and left marker '[['
      // todo:
      //  https://github.com/micromark/micromark-extension-gfm-footnote/blob/main/dev/lib/syntax.js#L405
      //  return factorySpace(effects, done, 'gfmFootnoteDefinitionWhitespace')
      // 	- padding? https://github.com/micromark/micromark-extension-math/blob/main/dev/lib/math-text.js#L169
      // 	- factorySpace? https://github.com/micromark/micromark-extension-math/blob/main/dev/lib/math-flow.js#L162
      if (markdownSpace(code)) {
        if (consumedKeyWhiteSpace) {
          return nok(code);
        }
        consumedKeyWhiteSpace = true;
        effects.enter(UnifiedTypeToken.whitespace);
        effects.consume(code);
        effects.exit(UnifiedTypeToken.whitespace);
        return forkKind;
      }
      // mkdn
      if (markdownLineEnding(code)) {
        isListMkdn = true;
        return listMkdnItemStart(code);
      }
      // single / first comma
      if ((code !== null) && RGX.VALID_CHARS.KEY.test(String.fromCharCode(code))) {
        isListComma = true;
        effects.enter(CamlToken.camlValTxt);
        return consumeValue(code);
      }
      return nok(code);
    }

    // ref: https://github.com/micromark/micromark/blob/main/packages/micromark-core-commonmark/dev/lib/code-fenced.js#L125
    function listMkdnItemStart(code: Code): State | void {
      // continue
      if (code === codes.eof) {
        return done(code);
      }
      if (markdownLineEnding(code)) {
        return effects.attempt(
          { partial: true, tokenize: consumeMkdnListLineEnding as any, },
          consumeListBullet,
          done,
        )(code);
      }
      // invalid
      if (!markdownBullet(code)) { return nok(code); }
      // end
      effects.enter(CamlToken.camlListBullet);
      return consumeListBullet(code);
    }

    function consumeListBullet (code: Code): State | void {
      const bulletAndSpace: number = 2;
      // end
      if (cursorListBulletMarker === bulletAndSpace) {
        effects.exit(CamlToken.camlListBullet);
        consumedBulletWhiteSpace = false;
        cursorListBulletMarker = 0;
        effects.enter(CamlToken.camlValTxt);
        return consumeValue(code);
      }
      // invalid
      if ((cursorListBulletMarker < listBulletMarker.length)
          && !markdownLineEnding(code)
          && !markdownBullet(code)
          && !markdownSpace(code)
      ) {
        // end if hasValue
        return nok(code);
      }
      // bullet: -*+
      if (markdownBullet(code)) {
        effects.enter(CamlToken.camlListBullet);
        effects.consume(code);
        cursorListBulletMarker++;
      }
      // single space
      if (markdownSpace(code) && !consumedBulletWhiteSpace) {
        consumedBulletWhiteSpace = true;
        cursorListBulletMarker++;
        effects.consume(code);
      }
      return consumeListBullet;
    }

    function consumeListComma (code: Code): State | void {
      // continue
      if (markdownSpace(code)) {
        return factorySpace(effects, consumeListComma, UnifiedTypeToken.whitespace)(code);
      }
      if (code === codes.comma) {
        inListComma = true;
        effects.enter(CamlToken.camlListComma);
        effects.consume(code);
        effects.exit(CamlToken.camlListComma);
        return consumeListComma;
      }
      // end
      if (hasValue && (markdownLineEnding(code) || (code === codes.eof))) {
        return done(code);
      }
      if ((code !== null) && RGX.VALID_CHARS.KEY.test(String.fromCharCode(code))) {
        if (!inListComma) { return nok(code); }
        effects.enter(CamlToken.camlValTxt);
        return consumeValue(code);
      }
      return nok(code);
    }

    function consumeValue (code: Code): State | void {
      // end
      if ((!inDoubleQuote && !inSingleQuote && (code === codes.comma))
        || markdownLineEnding(code)
      ) {
        if (!hasValue) { return nok(code); }
        effects.exit(CamlToken.camlValTxt);
        // fork or end
        // list-comma-separated
        if (isListComma) {
          return consumeListComma(code);
        }
        // list-mkdn-separated
        if (isListMkdn) {
          return listMkdnItemStart(code);
        }
      }
      // invalid
      if ((code === null) || !RGX.VALID_CHARS.VAL.test(String.fromCharCode(code))) {
        return nok(code);
      }
      // continue
      if (!markdownLineEndingOrSpace(code)) {
        hasValue = true;
        // double quote
        if (codes.quotationMark === code) {
          inDoubleQuote = !inDoubleQuote;
        }
        // single quote
        if (codes.apostrophe === code) {
          inSingleQuote = !inSingleQuote;
        }
      }
      effects.consume(code);
      return consumeValue;
    }
    // fin(ish)
    function done (code: Code): State | void {
      if (!markdownLineEnding(code) && (code !== codes.eof)) { return nok(code); }
      if (!hasKey || !hasValue) { return nok(code); }
      effects.exit(CamlToken.camlAttr);
      return ok(code);
    }
  }

  // partial tokenizers

  function bulletLookahead(this: Tokenizer, effects: Effects, ok: State, nok: State): State {
    return start;

    // function start (code: Code): State | void {
    //   self._gfmTableDynamicInterruptHack = true;

    //   effects.check(
    //     self.parser.constructs.flow,
    //     function (code) {
    //       self._gfmTableDynamicInterruptHack = false;
    //       return nok(code);
    //     },
    //     function (code) {
    //       self._gfmTableDynamicInterruptHack = false;
    //       return isBullet(code);
    //     }
    //   )(code);
    // };

    function start(code: Code) {
      if (markdownBullet(code)) {
        return ok(code);
      }
      return nok(code);
    }
  }

  function consumeMkdnListLineEnding(this: Tokenizer, effects: Effects, ok: State, nok: State): State {
    return start;

    function start (code: Code): State | void {
      if (!markdownLineEnding(code)) { return nok(code); }
      effects.enter(CamlToken.listLineEnding);
      effects.consume(code);
      effects.exit(CamlToken.listLineEnding);
      return prefix;
    }

    function prefix (code: Code): State | void {
      return factorySpace(effects, effects.check(
        { partial: true, tokenize: bulletLookahead as any, },
        // isBullet,
        ok,
        nok,
      ), UnifiedTypeToken.linePrefix)(code);
    }

    // function isBullet(code: Code) {
    //   if (markdownBullet(code)) {
    //     return ok(code);
    //   }
    //   return nok(code);
    // }
  }
});
