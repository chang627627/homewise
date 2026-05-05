import React from 'react';
import { ArrowLeft } from 'lucide-react';

export default function BackBar({ onBack, label = 'Back', context }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-6">
      <button
        onClick={onBack}
        className="group inline-flex items-center gap-2 h-9 pl-2 pr-3.5 rounded-xl bg-white border border-ink-100 hover:border-ink-200 text-[12.5px] text-ink-700 hover:text-ink-900 transition-all"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-canvas-soft group-hover:bg-ink-100/60 transition-colors">
          <ArrowLeft size={13} strokeWidth={2} />
        </span>
        {label}
      </button>
      {context && (
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-medium">
          {context}
        </span>
      )}
    </div>
  );
}
