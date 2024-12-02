import { deepStrictEqual, strictEqual } from 'node:assert'
import test from 'node:test'

import BoolArray from './index.js'

test('construct with length', () => {
  const bits = new BoolArray(10)
  strictEqual(bits.length, 10)
})

test('set and get', () => {
  const bits = new BoolArray(8)
  bits.set(3, true)
  bits.set(5, true)

  const expected = [ 0, 0, 0, 1, 0, 1, 0, 0 ].map(Boolean)
  deepStrictEqual(Array.from(bits), expected)
})

test('on', () => {
  const bits = new BoolArray(8)
  bits.on(3, 5)

  const expected = [ 0, 0, 0, 1, 0, 1, 0, 0 ].map(Boolean)
  deepStrictEqual(Array.from(bits), expected)
})

test('off', () => {
  const bits = new BoolArray(8)
  bits.on(3, 5)
  bits.off(3)

  const expected = [ 0, 0, 0, 0, 0, 1, 0, 0 ].map(Boolean)
  deepStrictEqual(Array.from(bits), expected)
})

test('flip', () => {
  const bits = new BoolArray(8)
  bits.flip(3, 5)

  const expected = [ 0, 0, 0, 1, 0, 1, 0, 0 ].map(Boolean)
  deepStrictEqual(Array.from(bits), expected)
})

test('fill', () => {
  const bits = new BoolArray(8)
  bits.fill(true)
  bits.off(3, 5)

  const expected = [ 1, 1, 1, 0, 1, 0, 1, 1 ].map(Boolean)
  deepStrictEqual(Array.from(bits), expected)
})

test('clear', () => {
  const bits = new BoolArray(8)
  bits.set(3, true)
  bits.clear()

  const expected = [ 0, 0, 0, 0, 0, 0, 0, 0 ].map(Boolean)
  deepStrictEqual(Array.from(bits), expected)
})

test('firstWith', () => {
  const some = new BoolArray(8)
  some.set(3, true)
  strictEqual(some.firstWith(true), 3)
  strictEqual(some.firstWith(false), 0)

  const none = new BoolArray(8)
  strictEqual(none.firstWith(true), -1)

  const all = new BoolArray(8)
  all.fill(true)
  strictEqual(all.firstWith(false), -1)
})

test('any', () => {
  const all = new BoolArray(8)
  all.fill(true)

  strictEqual(all.any(true), true)
  strictEqual(all.any(false), false)

  const some = new BoolArray(8)
  some.on(3)

  strictEqual(some.any(true), true)
  strictEqual(some.any(false), true)

  const none = new BoolArray(8)

  strictEqual(none.any(true), false)
  strictEqual(none.any(false), true)
})

test('none', () => {
  const all = new BoolArray(8)
  all.fill(true)

  strictEqual(all.none(true), false)
  strictEqual(all.none(false), true)

  const some = new BoolArray(8)
  some.on(3)

  strictEqual(some.none(true), false)
  strictEqual(some.none(false), false)

  const none = new BoolArray(8)

  strictEqual(none.none(true), true)
  strictEqual(none.none(false), false)
})

test('active', () => {
  const bits = new BoolArray(8)
  bits.on(3, 5)

  deepStrictEqual(bits.active(), [ 3, 5 ])
})

test('inactive', () => {
  const bits = new BoolArray(8)
  bits.fill(true)
  bits.off(3, 5)

  deepStrictEqual(bits.inactive(), [ 3, 5 ])
})

test('union', () => {
  const a = new BoolArray(8)
  a.on(0, 2, 4, 6)

  const b = new BoolArray(8)
  b.on(1, 3, 5, 7)

  const expected = [ 1, 1, 1, 1, 1, 1, 1, 1 ].map(Boolean)
  deepStrictEqual(Array.from(a.union(b)), expected)
})

test('intersection', () => {
  const a = new BoolArray(8)
  a.on(0, 3, 5, 6)

  const b = new BoolArray(8)
  b.on(1, 3, 5, 7)

  const expected = [ 0, 0, 0, 1, 0, 1, 0, 0 ].map(Boolean)
  deepStrictEqual(Array.from(a.intersect(b)), expected)
})

test('invert', () => {
  const bits = new BoolArray(8)
  bits.on(0, 2, 4, 6)

  const expected = [ 0, 1, 0, 1, 0, 1, 0, 1 ].map(Boolean)
  deepStrictEqual(Array.from(bits.invert()), expected)
})
