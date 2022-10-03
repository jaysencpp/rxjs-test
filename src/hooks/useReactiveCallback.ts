import { useRef } from "react";
import { Observable, Subject } from "rxjs";

type ReactiveCallback<T> = {
  observable: Observable<T>;
  callback: (value: T) => void;
};
export const useReactiveCallback = <T extends unknown>() => {
  const reactiveRef = useRef<ReactiveCallback<T> | null>(null);

  if (!reactiveRef.current) {
    const subject = new Subject<T>();
    const callback = (value: T) => subject.next(value);
    const observable = subject.asObservable();
    reactiveRef.current = {
      observable,
      callback,
    };
  }
  return reactiveRef.current;
};
