import { useCallback, useSyncExternalStore } from 'react';
import { REDUCED_MOTION } from './motion';

export default function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      if (typeof window === 'undefined' || !window.matchMedia) return () => {};
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query],
  );
  const read = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);
  return useSyncExternalStore(subscribe, read, () => false);
}

export const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION);
