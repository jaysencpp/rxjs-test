import { BehaviorSubject, Subject } from "rxjs";

export const createReactiveBehaviourCallback = <T extends unknown>(
  initialState: T
) => {
  const subject = new BehaviorSubject<T>(initialState);
  const callback = (value: T) => subject.next(value);
  const observable = subject.asObservable();

  return { callback, observable };
};
