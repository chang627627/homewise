import { useCallback, useState } from 'react';

// [scrolled, onScroll]: pass onScroll to the scroll container; scrolled is
// true once its scrollTop is above 0 (drives the scroll-aware header border).
export default function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  const onScroll = useCallback((e) => setScrolled(e.currentTarget.scrollTop > 0), []);
  return [scrolled, onScroll];
}
