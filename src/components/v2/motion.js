import { MotionGlobalConfig } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];
export const dur = { fast: 0.15, base: 0.2, slow: 0.3 };

export const enter = { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: dur.base, ease } };
export const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: dur.base, ease } };
export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: { duration: dur.base, ease },
};

export const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia(REDUCED_MOTION).matches;
}

// Reduced motion means every framer duration is 0, not just transforms
// (MotionConfig reducedMotion="user" would still fade). CSS transitions inside
// .v2 are zeroed in index.css.
if (typeof window !== 'undefined' && window.matchMedia) {
  const mq = window.matchMedia(REDUCED_MOTION);
  const apply = () => {
    MotionGlobalConfig.skipAnimations = mq.matches;
  };
  apply();
  mq.addEventListener?.('change', apply);
}
