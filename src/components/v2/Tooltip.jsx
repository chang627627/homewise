import React, { Children, cloneElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { dur, ease, fade } from './motion';

const OPEN_AFTER_MS = 500;
const SKIP_WINDOW_MS = 300;
const GAP = 6;
const EDGE = 8;
const FLIP = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

let lastHide = 0; // module-level: moving between triggers within 300ms opens instantly

function anchor(r, w, h, side) {
  if (side === 'top') return { top: r.top - GAP - h, left: r.left + r.width / 2 - w / 2 };
  if (side === 'bottom') return { top: r.bottom + GAP, left: r.left + r.width / 2 - w / 2 };
  if (side === 'left') return { top: r.top + r.height / 2 - h / 2, left: r.left - GAP - w };
  return { top: r.top + r.height / 2 - h / 2, left: r.right + GAP };
}

function place(r, w, h, side) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const overflows = (s, p) => (s === 'top' ? p.top < EDGE
    : s === 'bottom' ? p.top + h > vh - EDGE
      : s === 'left' ? p.left < EDGE : p.left + w > vw - EDGE);
  let p = anchor(r, w, h, side);
  if (overflows(side, p)) {
    const q = anchor(r, w, h, FLIP[side]);
    if (!overflows(FLIP[side], q)) p = q;
  }
  return {
    top: Math.max(EDGE, Math.min(p.top, vh - EDGE - h)),
    left: Math.max(EDGE, Math.min(p.left, vw - EDGE - w)),
  };
}

function focusVisible(node) {
  try {
    return node.matches(':focus-visible');
  } catch {
    return true;
  }
}

const call = (fn, e) => {
  if (typeof fn === 'function') fn(e);
};

// Wraps exactly one child that forwards pointer and focus handlers to a DOM
// node (a DOM element, or a component that spreads its props).
export default function Tooltip({ label, side = 'top', children }) {
  const id = useId();
  const [open, setOpenState] = useState(false);
  const [pos, setPos] = useState(null);
  const openRef = useRef(false);
  const trigger = useRef(null);
  const bubble = useRef(null);
  const timer = useRef(0);
  const pressed = useRef(false);

  const setOpen = useCallback((v) => {
    openRef.current = v;
    setOpenState(v);
  }, []);

  const clearTimer = () => {
    clearTimeout(timer.current);
    timer.current = 0;
  };

  const reveal = useCallback(() => {
    setPos(null);
    setOpen(true);
  }, [setOpen]);

  const show = useCallback((node, immediate) => {
    trigger.current = node;
    clearTimer();
    if (openRef.current) return;
    if (immediate || Date.now() - lastHide < SKIP_WINDOW_MS) reveal();
    else timer.current = setTimeout(reveal, OPEN_AFTER_MS);
  }, [reveal]);

  const hide = useCallback(() => {
    clearTimer();
    if (!openRef.current) return;
    lastHide = Date.now();
    setOpen(false);
  }, [setOpen]);

  const measure = useCallback(() => {
    const node = trigger.current;
    const tip = bubble.current;
    if (!node || !tip) return;
    if (!node.isConnected) {
      hide();
      return;
    }
    setPos(place(node.getBoundingClientRect(), tip.offsetWidth, tip.offsetHeight, side));
  }, [hide, side]);

  useLayoutEffect(() => {
    if (open) measure();
  }, [open, label, measure]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') hide();
    };
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, measure, hide]);

  useEffect(() => () => {
    clearTimeout(timer.current);
    if (openRef.current) lastHide = Date.now();
  }, []);

  const child = Children.only(children);
  if (!label) return child;
  const p = child.props;
  // An IconButton's aria-label already is the label; describing it again
  // would make screen readers say it twice.
  const describe = open && p['aria-label'] !== label;

  return (
    <>
      {cloneElement(child, {
        onPointerEnter: (e) => {
          call(p.onPointerEnter, e);
          if (e.pointerType === 'touch' || pressed.current) return;
          show(e.currentTarget, false);
        },
        onPointerLeave: (e) => {
          call(p.onPointerLeave, e);
          pressed.current = false;
          hide();
        },
        onPointerDown: (e) => {
          call(p.onPointerDown, e);
          pressed.current = true;
          hide();
        },
        onFocus: (e) => {
          call(p.onFocus, e);
          if (focusVisible(e.currentTarget)) show(e.currentTarget, true);
        },
        onBlur: (e) => {
          call(p.onBlur, e);
          hide();
        },
        'aria-describedby': [p['aria-describedby'], describe ? id : null].filter(Boolean).join(' ') || undefined,
      })}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              key="tip"
              ref={bubble}
              role="tooltip"
              id={id}
              {...fade}
              transition={{ duration: dur.fast, ease }}
              className="pointer-events-none fixed z-[60] max-w-[240px] rounded-md bg-ink-900 px-2 py-1 text-meta text-white"
              style={pos ? { top: pos.top, left: pos.left } : { top: 0, left: 0, visibility: 'hidden' }}
            >
              {label}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
