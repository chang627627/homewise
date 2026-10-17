import React from 'react';

// Selection is shown by fill only; no check, so the width never jumps.
export default function Chip({ on = false, label, children, onClick, disabled = false, ...rest }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      disabled={disabled}
      {...rest}
      className={`inline-flex h-7 items-center rounded-md px-2.5 text-meta font-medium transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 disabled:opacity-40 disabled:pointer-events-none
        ${on ? 'bg-shade-2 text-ink-900' : 'text-ink-700 ring-1 ring-inset ring-line hover:bg-shade-1'}`}
    >
      {children ?? label}
    </button>
  );
}
