import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 'scope', label: 'Scope of work' },
  { id: 'contractor-compare', label: 'Contractors' },
  { id: 'quote-compare', label: 'Quotes' },
];

export default function FlowProgress({ current, onNavigate }) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {STEPS.map((step, i) => {
        const isCurrent = i === currentIdx;
        const isComplete = i < currentIdx;
        const isFuture = i > currentIdx;
        const clickable = isComplete && !!onNavigate;

        const containerCls = [
          'inline-flex items-center gap-2 h-8 pl-1.5 pr-3 rounded-xl transition-all',
          isCurrent && 'bg-ink-900 text-canvas-soft',
          isComplete && 'bg-white border border-ink-100 text-ink-700',
          clickable && 'hover:border-ink-300 hover:text-ink-900 cursor-pointer',
          isFuture && 'text-ink-400',
        ]
          .filter(Boolean)
          .join(' ');

        const dotCls = [
          'flex h-5 w-5 items-center justify-center rounded-md text-[10.5px] font-bold tabular-nums shrink-0',
          isCurrent && 'bg-white/15 text-canvas-soft',
          isComplete && 'bg-sage-500 text-white',
          isFuture && 'bg-ink-100 text-ink-400',
        ]
          .filter(Boolean)
          .join(' ');

        const inner = (
          <>
            <span className={dotCls}>
              {isComplete ? <Check size={11} strokeWidth={2.5} /> : i + 1}
            </span>
            <span className="text-[12px] font-semibold tracking-tight whitespace-nowrap">
              {step.label}
            </span>
          </>
        );

        return (
          <React.Fragment key={step.id}>
            {clickable ? (
              <button
                type="button"
                onClick={() => onNavigate(step.id)}
                className={containerCls}
                aria-label={`Back to ${step.label}`}
              >
                {inner}
              </button>
            ) : (
              <div className={containerCls} aria-current={isCurrent ? 'step' : undefined}>
                {inner}
              </div>
            )}
            {i < STEPS.length - 1 && (
              <span
                className={`h-px w-4 mx-0.5 ${
                  i < currentIdx ? 'bg-sage-300' : 'bg-ink-200'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
      <span className="ml-1.5 inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-ink-400 font-semibold">
        <span className="h-px w-3 bg-ink-200" />
        Then book
      </span>
    </div>
  );
}
