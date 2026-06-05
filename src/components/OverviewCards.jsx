import React from 'react';
import { motion } from 'framer-motion';

// Stripped 4-up grid: just label + number per card. Sparklines, icon chips,
// delta sublines, and hover arrows removed — single-digit metrics didn't
// earn that much chrome, and the active task card below already shows the
// state in detail.
export default function OverviewCards({ onNavigate, decisionHandled }) {
  const items = [
    {
      label: 'Task in motion',
      value: '1',
      target: 'overview',
      tone: 'ink',
    },
    decisionHandled
      ? {
          label: 'Decisions waiting',
          value: '0',
          sub: 'All clear',
          target: 'overview',
          tone: 'sage',
        }
      : {
          label: 'Decision today',
          value: '1',
          sub: 'Choose plumber',
          target: 'quote-compare',
          tone: 'ember',
        },
    decisionHandled
      ? {
          label: 'Days until visit',
          value: '2',
          sub: 'Friday · 2 PM',
          target: 'schedule',
          tone: 'sage',
        }
      : {
          label: 'Quotes received',
          value: '3',
          target: 'quote-compare',
          tone: 'ink',
        },
    decisionHandled
      ? {
          label: 'Contractor booked',
          value: '1',
          sub: 'Jason Plumbing Co.',
          target: 'schedule',
          tone: 'ink',
        }
      : {
          label: 'Contractors verified',
          value: '3',
          target: 'contractor-compare',
          tone: 'ink',
        },
  ];

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <span className="h-px w-6 bg-ink-300" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-medium">
          At a glance · for your active job
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {items.map((it, idx) => (
        <motion.button
          key={it.label}
          onClick={() => onNavigate?.(it.target)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 * idx, ease: [0.22, 1, 0.36, 1] }}
          className="text-left rounded-2xl bg-white border border-ink-100/80 hover:border-ink-200 transition-all px-5 py-4"
        >
          <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
            {it.label}
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`editorial text-[34px] leading-none tabular-nums ${
                toneClasses[it.tone] || toneClasses.ink
              }`}
            >
              {it.value}
            </span>
            {it.sub && (
              <span className="text-[12px] text-ink-500">{it.sub}</span>
            )}
          </div>
        </motion.button>
      ))}
      </div>
    </section>
  );
}

const toneClasses = {
  ink: 'text-ink-900',
  sage: 'text-sage-600',
  ember: 'text-ember-500',
};
