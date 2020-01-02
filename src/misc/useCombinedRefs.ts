import { useCallback } from 'react';

// https://github.com/facebook/react/issues/13029
export default function useCombinedRefs<T extends any>(...refs: React.Ref<T>[]): React.Ref<T> {
  return useCallback((element: T) => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as any).current = element;
      }
    });
  }, refs);
}
