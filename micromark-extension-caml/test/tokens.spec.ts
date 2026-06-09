import assert from 'node:assert/strict';

import { parse } from 'micromark/lib/parse';
import { preprocess } from 'micromark/lib/preprocess';
import { postprocess } from 'micromark/lib/postprocess';
import type { Event } from 'micromark-util-types';

import { syntaxCaml } from '../src';


/**
 * Helper: run micromark's low-level parse pipeline and return the
 * resolved event list so we can inspect token types and boundaries.
 */
function getEvents(mkdn: string): Event[] {
  const parser = parse({ extensions: [syntaxCaml()] });
  const chunks = preprocess()(mkdn, undefined, true);
  const events = postprocess(parser.document().write(chunks));
  return events;
}

/**
 * Helper: extract events matching a given token type.
 */
function filterEvents(events: Event[], tokenType: string): Event[] {
  return events.filter((e) => e[1].type === tokenType);
}

/**
 * Helper: get the source text for a token from an event, using the
 * token's start/end points to slice the original markdown.
 */
function tokenText(mkdn: string, event: Event): string {
  const lines = mkdn.split('\n');
  const start = event[1].start;
  const end = event[1].end;

  if (start.line === end.line) {
    return lines[start.line - 1].slice(start.column - 1, end.column - 1);
  }

  // multi-line: stitch together
  const parts: string[] = [];
  for (let line = start.line; line <= end.line; line++) {
    const lineText = lines[line - 1] || '';
    if (line === start.line) {
      parts.push(lineText.slice(start.column - 1));
    } else if (line === end.line) {
      parts.push(lineText.slice(0, end.column - 1));
    } else {
      parts.push(lineText);
    }
  }
  return parts.join('\n');
}


describe('micromark token assertions', () => {

  describe('attrBox enter/exit events', () => {

    it('single prefixed attr should have matching attrBox enter and exit', () => {
      const mkdn = ':title::Hello World\n';
      const events = getEvents(mkdn);
      const attrBoxEvents = filterEvents(events, 'attrBox');
      const enters = attrBoxEvents.filter((e) => e[0] === 'enter');
      const exits = attrBoxEvents.filter((e) => e[0] === 'exit');
      assert.strictEqual(enters.length, 1, 'should have 1 attrBox enter');
      assert.strictEqual(exits.length, 1, 'should have 1 attrBox exit');
    });

    it('single unprefixed attr should have matching attrBox enter and exit', () => {
      const mkdn = 'title::Hello World\n';
      const events = getEvents(mkdn);
      const attrBoxEvents = filterEvents(events, 'attrBox');
      const enters = attrBoxEvents.filter((e) => e[0] === 'enter');
      const exits = attrBoxEvents.filter((e) => e[0] === 'exit');
      assert.strictEqual(enters.length, 1, 'should have 1 attrBox enter');
      assert.strictEqual(exits.length, 1, 'should have 1 attrBox exit');
    });

    it('multiple attrs should each have their own attrBox enter/exit pair', () => {
      const mkdn = ':title::Hello\n:author::World\n';
      const events = getEvents(mkdn);
      const attrBoxEvents = filterEvents(events, 'attrBox');
      const enters = attrBoxEvents.filter((e) => e[0] === 'enter');
      const exits = attrBoxEvents.filter((e) => e[0] === 'exit');
      assert.strictEqual(enters.length, 2, 'should have 2 attrBox enters');
      assert.strictEqual(exits.length, 2, 'should have 2 attrBox exits');
    });

  });

  describe('attrKey token content', () => {

    it('prefixed attr key should contain correct text', () => {
      const mkdn = ':title::value\n';
      const events = getEvents(mkdn);
      const keyEvents = filterEvents(events, 'attrKey');
      assert.ok(keyEvents.length > 0, 'should have attrKey events');
      // find the exit event (has the final boundaries)
      const keyExit = keyEvents.find((e) => e[0] === 'exit');
      assert.ok(keyExit, 'should have an attrKey exit event');
      const text = tokenText(mkdn, keyExit!);
      assert.strictEqual(text, 'title');
    });

    it('unprefixed attr key should contain correct text', () => {
      const mkdn = 'author::value\n';
      const events = getEvents(mkdn);
      const keyEvents = filterEvents(events, 'attrKey');
      const keyExit = keyEvents.find((e) => e[0] === 'exit');
      assert.ok(keyExit, 'should have an attrKey exit event');
      const text = tokenText(mkdn, keyExit!);
      assert.strictEqual(text, 'author');
    });

    it('key with spaces should preserve internal spaces', () => {
      const mkdn = ':my key::value\n';
      const events = getEvents(mkdn);
      const keyEvents = filterEvents(events, 'attrKey');
      const keyExit = keyEvents.find((e) => e[0] === 'exit');
      assert.ok(keyExit, 'should have an attrKey exit event');
      const text = tokenText(mkdn, keyExit!);
      assert.strictEqual(text, 'my key');
    });

  });

  describe('attrVal token content', () => {

    it('single value should contain correct text', () => {
      const mkdn = ':title::Hello World\n';
      const events = getEvents(mkdn);
      const valEvents = filterEvents(events, 'attrVal');
      assert.ok(valEvents.length > 0, 'should have attrVal events');
      const valExit = valEvents.find((e) => e[0] === 'exit');
      assert.ok(valExit, 'should have an attrVal exit event');
      const text = tokenText(mkdn, valExit!);
      assert.strictEqual(text, 'Hello World');
    });

    it('comma-separated values should produce multiple attrVal tokens', () => {
      const mkdn = ':tags::foo, bar, baz\n';
      const events = getEvents(mkdn);
      const valExits = filterEvents(events, 'attrVal').filter((e) => e[0] === 'exit');
      assert.strictEqual(valExits.length, 3, 'should have 3 attrVal exits for comma list');
      const texts = valExits.map((e) => tokenText(mkdn, e).trim());
      assert.deepStrictEqual(texts, ['foo', 'bar', 'baz']);
    });

    it('mkdn list values should produce multiple attrVal tokens', () => {
      const mkdn = ':tags::\n- alpha\n- beta\n';
      const events = getEvents(mkdn);
      const valExits = filterEvents(events, 'attrVal').filter((e) => e[0] === 'exit');
      assert.strictEqual(valExits.length, 2, 'should have 2 attrVal exits for mkdn list');
      const texts = valExits.map((e) => tokenText(mkdn, e));
      assert.strictEqual(texts[0], 'alpha');
      assert.strictEqual(texts[1], 'beta');
    });

  });

  describe('token boundaries', () => {

    it('attrBox should span from start of line to end of attr', () => {
      const mkdn = ':title::value\n';
      const events = getEvents(mkdn);
      const attrBoxEnter = filterEvents(events, 'attrBox').find((e) => e[0] === 'enter');
      assert.ok(attrBoxEnter, 'should have attrBox enter');
      assert.strictEqual(attrBoxEnter![1].start.column, 1, 'attrBox should start at column 1');
      assert.strictEqual(attrBoxEnter![1].start.line, 1, 'attrBox should start at line 1');
    });

    it('attrKey start column should account for prefix marker', () => {
      const mkdn = ':title::value\n';
      const events = getEvents(mkdn);
      const keyEnter = filterEvents(events, 'attrKey').find((e) => e[0] === 'enter');
      assert.ok(keyEnter, 'should have attrKey enter');
      // prefix ':' is column 1, so key starts at column 2
      assert.strictEqual(keyEnter![1].start.column, 2, 'attrKey should start after prefix marker');
    });

    it('unprefixed attrKey should start at column 1', () => {
      const mkdn = 'title::value\n';
      const events = getEvents(mkdn);
      const keyEnter = filterEvents(events, 'attrKey').find((e) => e[0] === 'enter');
      assert.ok(keyEnter, 'should have attrKey enter');
      assert.strictEqual(keyEnter![1].start.column, 1, 'unprefixed attrKey should start at column 1');
    });

  });

});
