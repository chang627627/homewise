import React from 'react';

// Name it with `label` (aria-label) or `labelledBy` (the id of the visible
// question). On is ink-900, never sage.
export default function Toggle({ on = false, onChange, label, labelledBy, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      disabled={disabled}
      onClick={() => onChange?.(!on)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white
        disabled:opacity-40 disabled:pointer-events-none ${on ? 'bg-ink-900' : 'bg-ink-200'}`}
    >
      <span className={`h-4 w-4 rounded-full bg-white transition-transform duration-150 ${on ? 'translate-x-[18px]' : 'translate-x-0.5'}`} />
    </button>
  );
}
