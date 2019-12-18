import { ArrayCursor } from 'arangojs/lib/cjs/cursor';

class NativeQueryResult {
  constructor(private readonly nativeResult: ArrayCursor) {
  }

  async all() {
    return this.nativeResult.all();
  }

  async next() {
    return this.nativeResult.next();
  }

  hasNext() {
    return this.nativeResult.hasNext();
  }

  async nextBatch() {
    return this.nativeResult.nextBatch();
  }

  async each(fn) {
    return this.nativeResult.each(fn);
  }

  async every(fn) {
    return this.nativeResult.every(fn);
  }

  async some(fn) {
    return this.nativeResult.some(fn);
  }

  async map<T>(fn: (value: any, index: number, self: ArrayCursor) => T) {
    return this.nativeResult.map<T>(fn);
  }

  async reduce<T>(fn: (accu: T, value: any, index: number, self: ArrayCursor) => T, accu?: T) {
    return this.nativeResult.reduce(fn, accu);
  }

  async kill() {
    await this.nativeResult.kill();
  }

}

export default NativeQueryResult;
