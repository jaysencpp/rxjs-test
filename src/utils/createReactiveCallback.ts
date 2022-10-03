import { Subject } from "rxjs";

export const createReactiveCallback = <T extends unknown>() => {
  const subject = new Subject<T>();
  const callback = (value: T) => subject.next(value);
  const observable = subject.asObservable();

  return { callback, observable };
};
