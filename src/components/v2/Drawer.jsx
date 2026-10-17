import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import IconButton from './IconButton';
import useScrolled from './useScrolled';
import { dur, ease, fade } from './motion';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// 110% rather than 100%: the panel sits 8px in from the edge, so 100% would
// leave a sliver and its shadow on screen at both ends of the slide.
const slide = { initial: { x: '110%' }, animate: { x: 0 }, exit: { x: '110%' }, transition: { duration: dur.slow, ease } };

function Panel({ onClose, title, meta, children }) {
  const titleId = useId();
  const panel = useRef(null);
  const [scrolled, onScroll] = useScrolled();
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;

    const opener = document.activeElement;
    panel.current?.focus({ preventScroll: true });

    // Capture phase on window, so Esc closes the drawer without also reaching
    // the shell's own Esc handler (exit focus mode).
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      close.current?.();
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
      window.removeEventListener('keydown', onKey, true);
      if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, []);

  const trapTab = (e) => {
    if (e.key !== 'Tab' || !panel.current) return;
    const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter((n) => n.getClientRects().length > 0);
    if (!nodes.length) {
      e.preventDefault();
      return;
    }
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const current = document.activeElement;
    if (e.shiftKey && (current === first || current === panel.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && current === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <motion.div {...fade} aria-hidden="true" onClick={onClose} className="fixed inset-0 z-40 bg-ink-900/20" />
      <motion.aside
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={trapTab}
        {...slide}
        className="v2 fixed bottom-2 right-2 top-2 z-50 flex w-[440px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-xl bg-white shadow-float focus:outline-none"
      >
        <header className={`flex h-14 shrink-0 items-center gap-3 border-b px-6 transition-colors duration-150 ${scrolled ? 'border-line' : 'border-transparent'}`}>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="truncate text-heading text-ink-900">{title}</h2>
            {meta && <p className="truncate text-meta tabular-nums text-ink-500">{meta}</p>}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} className="-mr-2" />
        </header>
        <div onScroll={onScroll} className="flex-1 overflow-y-auto px-6 pb-8">
          {children}
        </div>
      </motion.aside>
    </>
  );
}

export default function Drawer({ open, onClose, title, meta, children }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <Panel key="drawer" onClose={onClose} title={title} meta={meta}>
          {children}
        </Panel>
      )}
    </AnimatePresence>,
    document.body,
  );
}
