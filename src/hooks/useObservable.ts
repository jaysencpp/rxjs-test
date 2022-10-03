import { useState } from "react";
import { Observable } from "rxjs";
import { useSubscription } from "./useSubscription";

export const useObservable = <T extends unknown>(
  source$: Observable<T>,
  initialState?: T,
  errorHandler?: (err: unknown) => void
): T | undefined => {
  const [value, setValue] = useState<T>();

  useSubscription(source$, setValue, errorHandler);

  return value;
};
