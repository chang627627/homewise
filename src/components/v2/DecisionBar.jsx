import React from 'react';

// The last child of an artifact root that is `flex flex-1 flex-col`, after a
// `flex-1` content div, so it pins to the bottom of the panel on short pages.
// Resolved state: note = <StatusText state="done">...</StatusText>, no actions.
export default function DecisionBar({ note, actions, children }) {
  const right = actions ?? children;
  return (
    <div className="sticky bottom-0 z-10 mt-12 flex h-16 shrink-0 items-center justify-between gap-4 border-t border-line bg-white">
      <div className="min-w-0 truncate text-meta text-ink-500">{note}</div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}
