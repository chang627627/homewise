import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { prefersReducedMotion } from './motion';

const noop = () => {};
const HOLD_MS = 1200;

// App provides { evidence, hover, point }. The default is inert, so artifacts
// render outside the shell (the /kit page, previews) without a provider.
export const EvidenceContext = createContext({ evidence: null, hover: noop, point: noop });
export const useEvidence = () => useContext(EvidenceContext);

// Which artifact the Evidence elements below belong to. Stage wraps each
// staged artifact so `col:reyes` on Contractors never lights up for a Quotes
// target.
const ScopeContext = createContext(null);
export function EvidenceScope({ artifact, children }) {
  return <ScopeContext.Provider value={artifact}>{children}</ScopeContext.Provider>;
}

// Optional state for the provider value. `restage(artifact)` must stage that
// artifact as a user click (an instant swap). point() then scrolls the target
// to center on the next frame and holds the dark outline for 1200ms; hover is
// ignored while a hold runs.
export function useEvidenceController({ restage } = {}) {
  const [evidence, setEvidence] = useState(null);
  const hold = useRef(0);
  const restageRef = useRef(restage);
  restageRef.current = restage;

  const hover = useCallback((target) => {
    if (hold.current) return;
    setEvidence(target ? { artifact: target.artifact, id: target.id, mode: 'hover' } : null);
  }, []);

  const point = useCallback((target) => {
    if (!target) return;
    restageRef.current?.(target.artifact);
    clearTimeout(hold.current);
    setEvidence({ artifact: target.artifact, id: target.id, mode: 'hold' });
    requestAnimationFrame(() => {
      const node = document.querySelector(`[data-evidence-artifact="${target.artifact}"][data-evidence="${target.id}"]`)
        || document.querySelector(`[data-evidence="${target.id}"]`);
      node?.scrollIntoView({ block: 'center', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
    hold.current = setTimeout(() => {
      hold.current = 0;
      setEvidence(null);
    }, HOLD_MS);
  }, []);

  useEffect(() => () => clearTimeout(hold.current), []);
  return useMemo(() => ({ evidence, hover, point }), [evidence, hover, point]);
}

const isFocusVisible = (node) => {
  try {
    return node.matches(':focus-visible');
  } catch {
    return true;
  }
};

// Handlers for a Thread line that points at evidence. `target` is
// { artifact, id } or null (then nothing is returned).
export function useEvidenceHandlers(target) {
  const { hover, point } = useEvidence();
  return useMemo(() => {
    if (!target) return {};
    return {
      onPointerEnter: (e) => {
        if (e.pointerType !== 'touch') hover(target);
      },
      onPointerLeave: () => hover(null),
      onFocus: (e) => {
        if (isFocusVisible(e.currentTarget)) hover(target);
      },
      onBlur: () => hover(null),
      onClick: () => point(target),
    };
    // Keyed by value, so callers can pass a fresh object literal each render.
  }, [target?.artifact, target?.id, hover, point]);
}

export default function Evidence({ id, artifact, as: Tag = 'div', className = '', children, ...rest }) {
  const { evidence } = useEvidence();
  const scope = useContext(ScopeContext);
  const own = artifact ?? scope;
  const match = !!evidence && evidence.id === id && (own == null || evidence.artifact == null || evidence.artifact === own);
  const tone = !match ? 'outline-transparent duration-300'
    : evidence.mode === 'hold' ? 'outline-ink-900 duration-150' : 'outline-ink-900/40 duration-150';
  return (
    <Tag
      data-evidence={id}
      data-evidence-artifact={own ?? undefined}
      {...rest}
      className={`rounded-md outline outline-2 outline-offset-2 transition-[outline-color] ${tone} ${className}`}
    >
      {children}
    </Tag>
  );
}
