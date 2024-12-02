# boolarray

A space-efficient and performant typed array for boolean values.

## Install

```sh
npm install boolarray
```

## Usage

```ts
import BoolArray from 'boolarray'

// Construct a BoolArray of n bits
const bits = new BoolArray(8)
const indexes = [1, 3, 5]

// Turn on the nth bit
bits.on(...indexes)

// Turn off the nth bit
bits.off(...indexes)

// Set the state of the nth bit to on
for (const index of indexes) {
  bits.set(index, true)
}

// Toggle nth bit, if on will switch off, if off will switch on
bits.flip(...indexes)

// Get the value of the nth bit
const isSet = bits.get(indexes[0])

// Set the state of all bits to on
bits.fill(true)

// Set the state of all bits to off
bits.clear()

// Check if any bits are on
const anyOn = bits.any(true)

// Check if no bits are off
const noneOff = bits.none(false)

// Get the index of the first bit which is on
const index = bits.firstWith(true)

// Gets an array of indexes of all bits which are on
const activeIndexes = bits.active()

// Gets an array of indexes of all bits which are off
const inactiveIndexes = bits.inactive()

// Creates new BoolArray which has enabled any bits on in either
const union = bits.union(other)

// Create new BoolArray which has enabled any bits on in both
const intersection = bits.intersection(other)

// Create new BoolArray with all bits set to the opposite of the original
const inverted = bits.invert()

// It is also iterable
for (const bit of bits) {
  console.log(bit)
}
```
