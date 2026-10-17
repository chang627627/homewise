import React from 'react';
import { usePrefersReducedMotion } from './useMediaQuery';

const common = { width: 14, height: 14, viewBox: '0 0 14 14', 'aria-hidden': true };

// Linear-style in-progress pie, r = 3.5, clockwise from 12 o'clock. Never
// below 1/8, so a task that just started still reads as started.
function sector(progress) {
  const f = Math.min(Math.max(progress || 0, 0.125), 1);
  if (f >= 1) return null;
  const a = f * 2 * Math.PI;
  const x = 7 + 3.5 * Math.sin(a);
  const y = 7 - 3.5 * Math.cos(a);
  return `M7 7 L7 3.5 A3.5 3.5 0 ${a > Math.PI ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`;
}

// The app's one loop. With reduced motion it renders the static pie, so a
// working state never shows as a frozen arc.
export function StatusGlyph({ state, live = false, progress = 0 }) {
  const reduced = usePrefersReducedMotion();
  if (state === 'working' && live && !reduced) {
    return (
      <svg {...common} className="shrink-0 text-sage-500 animate-spin [animation-duration:1.2s] motion-reduce:animate-none">
        <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        <path d="M7 1.75a5.25 5.25 0 0 1 5.25 5.25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (state === 'working') {
    const d = sector(progress);
    return (
      <svg {...common} className="shrink-0 text-sage-500">
        <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />
        {d ? <path d={d} fill="currentColor" /> : <circle cx="7" cy="7" r="3.5" fill="currentColor" />}
      </svg>
    );
  }
  if (state === 'needs-you') {
    return (
      <svg {...common} className="shrink-0 text-ember-400">
        <circle cx="7" cy="7" r="3.5" fill="currentColor" />
      </svg>
    );
  }
  if (state === 'waiting') {
    return (
      <svg {...common} className="shrink-0 text-sky2026-500">
        {/* pathLength 32 splits the ring into exactly 8 dashes, so no dash doubles up at the seam */}
        <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" pathLength="32" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (state === 'done') {
    return (
      <svg {...common} className="shrink-0 text-sage-500">
        <circle cx="7" cy="7" r="6" fill="currentColor" />
        <path d="M4.5 7.1 6.2 8.8 9.5 5.4" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common} className="shrink-0 text-ink-300">
      <circle cx="7" cy="7" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const tone = {
  working: 'text-sage-600',
  'needs-you': 'text-ember-500',
  waiting: 'text-sky2026-700',
  done: 'text-sage-600',
  idle: 'text-ink-500',
};

// The words, not the glyph, carry the baseline: an svg's synthesized baseline
// is its bottom edge, which would sit the label 2px off the sentence beside it
// in an items-baseline status line.
export function StatusText({ state, progress, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-ui font-medium ${tone[state] || tone.idle}`}>
      <StatusGlyph state={state} progress={progress} />
      <span className="self-baseline">{children}</span>
    </span>
  );
}

export function Dot() {
  return <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ember-400" />;
}
