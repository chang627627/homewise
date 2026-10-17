import { MotionGlobalConfig } from 'framer-motion';

export const ease = [0.22, 1, 0.36, 1];
export const dur = { fast: 0.15, base: 0.2, slow: 0.3 };

export const enter = { initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 }, transition: { duration: dur.base, ease } };
export const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: dur.base, ease } };
// A fold: content that leaves or arrives in the Thread while it is pinned to the bottom. The pinned log
// moves with it, so it eases in and out over dur.slow; an ease-out front-loads the move into a jolt.
export const easeInOut = [0.65, 0, 0.35, 1];
export const fold = { duration: dur.slow, ease: easeInOut };
// A line that opens its height on the fold curve instead of landing at full height in one frame.
export const grow = {
  initial: { height: 0, opacity: 0, overflow: 'hidden' },
  animate: { height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } },
  transition: fold,
};
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
