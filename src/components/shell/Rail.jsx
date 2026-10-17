import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react';
import Row from '../v2/Row';
import IconButton from '../v2/IconButton';
import HouseMark from '../v2/HouseMark';
import Avatar from '../v2/Avatar';
import { StatusGlyph } from '../v2/Status';
import { dur, ease, fade, prefersReducedMotion } from '../v2/motion';
import { HOME } from '../../data/demo';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
const OPEN_W = 224;
const COLLAPSED_W = 56;
const OWNER = `${HOME.owner.first} ${HOME.owner.last}`;

// tasks: [{ id, title, state, progress, meta, muted, selected, tooltip }],
// newest first. home: { selected, preview }.
export default function Rail({ variant = 'docked', ...props }) {
  return variant === 'overlay' ? <OverlayRail {...props} /> : <DockedRail {...props} />;
}

// One DOM tree for both widths. Every lead glyph sits on x=28 in both
// layouts, so the fold reads as the labels leaving, not the rows moving.
// Collapse: labels fade out (150ms) while the width animates (300ms), then
// the square layout swaps in. Open: the full layout swaps in at once with
// labels hidden, and they fade in after 150ms.
// `focus` closes the rail to width 0; `gone` then drops it from the layout.
function DockedRail({ open = true, focus = false, gone = false, onToggle, ...body }) {
  const [narrow, setNarrow] = useState(!open);
  const [labels, setLabels] = useState(open);

  useEffect(() => {
    if (open) {
      setNarrow(false);
      // Two frames, so the labels are painted at opacity 0 before they fade.
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setLabels(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }
    setLabels(false);
    const t = setTimeout(() => setNarrow(true), prefersReducedMotion() ? 0 : dur.slow * 1000);
    return () => clearTimeout(t);
  }, [open]);

  const width = focus ? 0 : open ? OPEN_W : COLLAPSED_W;
  return (
    <aside
      aria-label="Sidebar"
      inert={focus ? '' : undefined}
      style={{ width }}
      className={`h-full shrink-0 overflow-hidden border-line bg-canvas-v2 transition-[width,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] print:hidden
        ${focus ? 'invisible border-r-0' : 'visible border-r'} ${gone ? 'hidden' : ''}`}
    >
      {/* Focus mode clips a fixed-width body, so nothing reflows on the way out. */}
      <div className="flex h-full flex-col px-3" style={{ width: focus ? (narrow ? COLLAPSED_W : OPEN_W) : '100%' }}>
        {narrow ? (
          <NarrowBody onToggle={onToggle} {...body} />
        ) : (
          <WideBody labels={labels} onToggle={onToggle} closeLabel="Collapse sidebar" {...body} />
        )}
      </div>
    </aside>
  );
}

// Below 1024 the Rail leaves the layout and opens over the Stage.
function OverlayRail({ open = false, onToggle, ...body }) {
  return (
    <AnimatePresence>
      {open && <OverlayPanel key="rail" onClose={() => onToggle?.(false)} {...body} />}
    </AnimatePresence>
  );
}

function OverlayPanel({ onClose, ...body }) {
  const panel = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const opener = document.activeElement;
    panel.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      close.current?.();
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      if (opener && opener.isConnected && typeof opener.focus === 'function') opener.focus({ preventScroll: true });
    };
  }, []);

  // Same trap as the Drawer: Tab never walks out behind the scrim.
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
        aria-label="Sidebar"
        tabIndex={-1}
        onKeyDown={trapTab}
        initial={{ x: '-110%' }}
        animate={{ x: 0 }}
        exit={{ x: '-110%' }}
        transition={{ duration: dur.slow, ease }}
        className="fixed inset-y-2 left-2 z-50 flex w-[240px] flex-col overflow-hidden rounded-xl bg-canvas-v2 px-3 shadow-float focus:outline-none"
      >
        <WideBody labels onToggle={onClose} closeLabel="Close sidebar" {...body} />
      </motion.aside>
    </>
  );
}

// Labels fade on their own; the row geometry never depends on them.
function Label({ shown, className = '', children }) {
  return (
    <span className={`transition-opacity duration-150 ${shown ? 'opacity-100 delay-150' : 'opacity-0'} ${className}`}>
      {children}
    </span>
  );
}

function WideBody({ labels, onToggle, closeLabel, home = {}, tasks = [], onHome, onNewTask, onSelectTask }) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center gap-1">
        <div className="min-w-0 flex-1 overflow-hidden">
          <Row
            lead={<HouseMark />}
            title={<Label shown={labels}>{HOME.name}</Label>}
            selected={home.selected}
            preview={home.preview}
            onClick={onHome}
          />
        </div>
        <IconButton icon={PanelLeftClose} label={closeLabel} onClick={() => onToggle?.(false)} />
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        <div className="flex h-8 shrink-0 items-center justify-between pl-2">
          <Label shown={labels} className="truncate text-meta font-medium text-ink-500">Tasks</Label>
          <IconButton size="sm" icon={Plus} label="New task" onClick={onNewTask} />
        </div>
        <div className="min-h-0 flex-1 space-y-px overflow-y-auto overflow-x-hidden">
          {tasks.map((t) => (
            <Row
              key={t.id}
              lead={<StatusGlyph state={t.state} progress={t.progress} />}
              title={<Label shown={labels}>{t.title}</Label>}
              meta={t.meta ? <Label shown={labels}>{t.meta}</Label> : null}
              selected={t.selected}
              muted={t.muted}
              onClick={() => onSelectTask?.(t.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex h-14 shrink-0 items-center gap-2 px-2">
        <Avatar />
        <Label shown={labels} className="min-w-0 truncate text-ui font-medium text-ink-900">{OWNER}</Label>
      </div>
    </>
  );
}

function NarrowBody({ onToggle, home = {}, tasks = [], onHome, onNewTask, onSelectTask }) {
  return (
    <>
      <div className="flex h-14 shrink-0 items-center justify-center">
        <IconButton icon={PanelLeftOpen} label="Open sidebar" side="right" onClick={() => onToggle?.(true)} />
      </div>
      <Row collapsed lead={<HouseMark />} title={HOME.name} selected={home.selected} preview={home.preview} onClick={onHome} />
      <div className="flex h-8 shrink-0 items-center justify-center">
        <IconButton size="sm" icon={Plus} label="New task" side="right" onClick={onNewTask} />
      </div>
      <div className="min-h-0 flex-1 space-y-px overflow-y-auto overflow-x-hidden">
        {tasks.map((t) => (
          <Row
            key={t.id}
            collapsed
            lead={<StatusGlyph state={t.state} progress={t.progress} />}
            title={t.title}
            tooltip={t.tooltip}
            selected={t.selected}
            onClick={() => onSelectTask?.(t.id)}
          />
        ))}
      </div>
      <div className="flex h-14 shrink-0 items-center justify-center">
        <Avatar />
        <span className="sr-only">{OWNER}</span>
      </div>
    </>
  );
}
