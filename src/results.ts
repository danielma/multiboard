export declare interface Either<T, U> {
  isSuccess: () => boolean;
  isFailure: () => boolean;

  valueOr: (or: T | (() => T)) => T;
  forcedValue: () => T;
  failure: () => U | null;

  bind: <V>(map: (value: T) => V) => V | Failure<U>;
  flatMap: <V>(map: (value: T) => V) => Success<V> | Failure<U>;
}

export class Success<T> implements Either<T, any> {
  private value: T;

  static from<V>(value: V) {
    return new Success<V>(value);
  }

  constructor(value: T) {
    this.value = value;
  }

  isSuccess() {
    return true;
  }

  isFailure() {
    return false;
  }

  valueOr() {
    return this.value;
  }

  forcedValue() {
    return this.value;
  }

  failure() {
    return null;
  }

  bind<V>(map: (value: T) => V) {
    return map(this.value);
  }

  flatMap<V>(map: (value: T) => V) {
    return Success.from(this.bind(map));
  }
}

export class Failure<T> implements Either<any, T> {
  private value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSuccess() {
    return false;
  }
  isFailure() {
    return true;
  }

  valueOr(or: any | (() => any)) {
    if (typeof or === 'function') {
      return or();
    } else {
      return or;
    }
  }

  forcedValue(): never {
    throw new Error(`called .forcedValue() on a failure! ${this.value}`);
  }

  failure() {
    return this.value;
  }

  bind() {
    return this;
  }

  flatMap() {
    return this;
  }
}

// export function flatMapPromise<T, U>()

// export function flatMap<T, U>(
//   map: (value: U) => T
// ): (either: Either<U, any>) => Either<T, any> {
//   return (either: Either<U, any>) => either.flatMap(map);
// }

// export function bind<T, U>(
//   map: (value: U) => T
// ): (either: Either<U, any>) => T | Failure<any> {
//   return (either: Either<U, any>) => either.bind(map);
// }
