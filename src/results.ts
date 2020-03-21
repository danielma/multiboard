export declare interface Either<T, U> {
  isSuccess: () => boolean;
  isFailure: () => boolean;

  valueOr: (or: T) => T;
  failure: () => U | null;
  bind: <V>(binder: (value: T) => V) => V | Failure<U>;
  flatMap: <V>(map: (value: T) => V) => Success<V> | Failure<U>;
}

export class Success<T> implements Either<T, any> {
  private value: T;

  static from(value: any) {
    return new Success(value);
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

  failure() {
    return null;
  }

  bind<V>(binder: (value: T) => V): V {
    return binder(this.value);
  }

  flatMap<V>(map: (value: T) => V) {
    return Success.from(map(this.value));
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

  valueOr(or: any) {
    return or;
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
