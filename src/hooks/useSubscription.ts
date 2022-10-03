import { useEffect } from "react";
import { Observable } from "rxjs";

export const useSubscription = <T extends unknown>(
  source$: Observable<T>,
  nextHandler: (value: T) => void,
  errorHandler?: (err: unknown) => void
) => {
  useEffect(() => {
    if (source$) {
      const subs = source$.subscribe({
        next: nextHandler,
        error: errorHandler,
      });

      return () => {
        subs.unsubscribe();
      };
    }
  }, [source$]);
};
