const COLUMNS = 8
const SHIFT = 3

/**
 * A BoolArray is a space-efficient TypedArray-like container for booleans.
 */
export default class BoolArray {
  readonly length: number
  #bin: Uint8Array

  /**
   * Create a new BoolArray with the given length.
   *
   * @param length The number of bits to contain.
   */
  constructor(length: number) {
    this.length = length
    const buf = new ArrayBuffer(((length - 1) >> SHIFT) + 1)
    this.#bin = new Uint8Array(buf)
  }

  /**
   * Get the value of the bit at the given offset.
   *
   * @param offset The offset of the bit to get.
   * @returns The value of the bit at the given offset.
   */
  get(offset: number): boolean {
    const row = offset >> SHIFT
    const col = offset % COLUMNS
    const bit = 1 << col
    return (this.#bin[row] & bit) > 0
  }

  /**
   * Set the value of the bit at the given offset.
   *
   * @param offset The offset of the bit to set.
   * @param on The value to set the bit to.
   */
  set(offset: number, on: boolean) {
    const row = offset >> SHIFT
    const col = offset % COLUMNS
    let bit = 1 << col
    if (on) {
      this.#bin[row] |= bit
    } else {
      bit = 255 ^ bit
      this.#bin[row] &= bit
    }
  }

  /**
   * Set bits at given offsets to true.
   *
   * @param ...offset The offset of the bit to set.
   */
  on(...offsets: number[]) {
    for (const offset of offsets) {
      this.set(offset, true)
    }
  }

  /**
   * Set bits at given offsets to false.
   *
   * @param ...offset The offset of the bit to set.
   */
  off(...offsets: number[]) {
    for (const offset of offsets) {
      this.set(offset, false)
    }
  }

  /**
   * Flip value of bits at given offsets.
   *
   * @param ...offset The offset of the bit to flip.
   */
  flip(...offsets: number[]) {
    for (const offset of offsets) {
      const row = Math.floor(offset / COLUMNS)
      const col = offset % COLUMNS
      const bit = 1 << col
      this.#bin[row] ^= bit
    }
  }

  /**
   * Set all bits to the given value.
   *
   * @param on The value to set all bits to.
   */
  fill(on: boolean) {
    this.#bin.fill(on ? 255 : 0)
  }

  /**
   * Clear all bits.
   */
  clear() {
    this.fill(false)
  }

  /**
   * Find the index of the first bit with the given value.
   * Returns -1 if no such bit is found.
   *
   * @param on The value to search for.
   * @returns The index of the first bit with the given value.
   */
  firstWith(on: boolean): number {
    const { length } = this
    for (let i = 0; i < length; i++) {
      if (this.get(i) === on) {
        return i
      }
    }
    return -1
  }

  /**
   * Check if any bits have the given value.
   *
   * @param on The value to search for.
   * @returns True if any bits have the given value, false otherwise.
   */
  any(on: boolean): boolean {
    return this.firstWith(on) >= 0
  }

  /**
   * Check if no bits have the given value.
   *
   * @param on The value to search for.
   * @returns True if no bits have the given value, false otherwise.
   */
  none(on: boolean): boolean {
    return this.firstWith(on) < 0
  }

  /**
   * Get the indexes of all active bits.
   *
   * @returns An array or indexes of all active bits.
   */
  active(): number[] {
    const { length } = this
    const indexes: number[] = []
    for (let i = 0; i < length; i++) {
      if (this.get(i)) {
        indexes.push(i)
      }
    }
    return indexes
  }

  /**
   * Get the indexes of all inactive bits.
   *
   * @returns An array or indexes of all inactive bits.
   */
  inactive(): number[] {
    const { length } = this
    const indexes: number[] = []
    for (let i = 0; i < length; i++) {
      if (!this.get(i)) {
        indexes.push(i)
      }
    }
    return indexes
  }

  /**
   * Create a new BoolArray which is the union of this one and another.
   *
   * @param other The other BoolArray to union with.
   * @returns A new BoolArray representing the union of this one and another.
   */
  union(other: BoolArray): BoolArray {
    const { length } = this
    if (length !== other.length) {
      throw new Error('BoolArray sizes do not match')
    }
    const result = new BoolArray(length)
    for (let i = 0; i < this.#bin.length; i++) {
      result.#bin[i] = this.#bin[i] | other.#bin[i]
    }
    return result
  }

  /**
   * Create a new BoolArray which is the intersection of this one and another.
   *
   * @param other The other BoolArray to intersect with.
   * @returns A new BoolArray of the intersection of this one and another.
   */
  intersect(other: BoolArray): BoolArray {
    const { length } = this
    if (length !== other.length) {
      throw new Error('BoolArray sizes do not match')
    }
    const result = new BoolArray(length)
    for (let i = 0; i < this.#bin.length; i++) {
      result.#bin[i] = this.#bin[i] & other.#bin[i]
    }
    return result
  }

  /**
   * Create a new BoolArray which is an inversion of this one.
   *
   * @returns A new BoolArray which is an inversion of this one.
   */
  invert(): BoolArray {
    const result = new BoolArray(this.length);
    for (let i = 0; i < this.#bin.length; i++) {
      result.#bin[i] = ~this.#bin[i];
    }
    return result;
  }

  /**
   * Make the values iterable with for-of loops.
   */
  *[Symbol.iterator](): Generator<boolean> {
    const { length } = this
    for (let i = 0; i < length; i++) {
      yield this.get(i)
    }
  }
}
