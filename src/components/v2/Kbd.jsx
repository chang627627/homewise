import React from 'react';

export default function Kbd({ children }) {
  return (
    <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-meta font-medium tabular-nums text-ink-500 ring-1 ring-inset ring-line">
      {children}
    </span>
  );
}
