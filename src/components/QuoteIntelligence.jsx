import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Check,
  Info,
} from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Pill from './ui/Pill';

const quotes = [
  {
    name: 'Contractor A',
    company: 'Jason Plumbing Co.',
    price: 220,
    verdict: { label: 'Fair price', tone: 'sage', icon: Check },
    note: 'Within local benchmark · Materials and labor included',
    highlighted: true,
    items: ['Labor (2 hrs)', 'Replace P-trap', 'Materials', '90-day warranty'],
  },
  {
    name: 'Contractor B',
    company: 'Bayline Plumbing',
    price: 390,
    verdict: { label: 'Higher than market', tone: 'ember', icon: TrendingUp },
    note: '21% above local median for similar repairs',
    highlighted: false,
    items: ['Labor (2 hrs)', 'Replace P-trap', 'Materials', '1-year warranty', 'Premium service fee'],
  },
  {
    name: 'Contractor C',
    company: 'Quickfix Pros',
    price: 175,
    verdict: { label: 'Low, missing details', tone: 'ember', icon: AlertCircle },
    note: 'Quote does not specify whether materials are included',
    highlighted: false,
    items: ['Labor (1.5 hrs)', 'Replace P-trap', 'Materials TBD'],
  },
];

const verdictTone = {
  sage: 'bg-sage-50 text-sage-600 ring-sage-100',
  ember: 'bg-ember-50 text-ember-500 ring-ember-100',
};

export default function QuoteIntelligence({ onNavigate }) {
  const min = 150;
  const max = 420;

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Quote intelligence"
        title="Three quotes, one clear winner."
        description="Homewise normalizes scope, materials, and warranty so you compare apples to apples, not marketing copy."
        trailing={
          <Pill tone="sky" icon={TrendingUp}>
            Avg 12% under benchmark
          </Pill>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Comparison cards */}
        <div className="xl:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quotes.map((q, i) => {
            const pct = ((q.price - min) / (max - min)) * 100;
            const VIcon = q.verdict.icon;
            return (
              <motion.div
                key={q.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`relative rounded-3xl p-5 border transition-all ${
                  q.highlighted
                    ? 'bg-white border-sage-200 ring-1 ring-sage-100'
                    : 'bg-white border-ink-100/80'
                }`}
              >
                {q.highlighted && (
                  <div className="absolute -top-2.5 left-5">
                    <Pill tone="sage" icon={Sparkles}>
                      AI pick
                    </Pill>
                  </div>
                )}
                <div className="flex items-start justify-between mb-1">
                  <div className="text-[11px] uppercase tracking-[0.16em] text-ink-500">
                    {q.name}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ${verdictTone[q.verdict.tone]}`}
                  >
                    <VIcon size={10} strokeWidth={2.2} />
                    {q.verdict.label}
                  </span>
                </div>
                <div className="text-[14px] font-semibold text-ink-900 tracking-[-0.005em]">
                  {q.company}
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="editorial text-[26px] leading-none text-ink-900 tabular-nums">
                    ${q.price}
                  </span>
                  <span className="text-[11.5px] text-ink-500">total</span>
                </div>

                {/* mini benchmark */}
                <div className="mt-3 relative h-1.5 rounded-full bg-ink-100 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full ${
                      q.verdict.tone === 'sage' ? 'bg-sage-400' : 'bg-ember-300'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-ink-400 tabular-nums">
                  <span>${min}</span>
                  <span>${max}</span>
                </div>

                <div className="mt-4 text-[12px] text-ink-500 leading-relaxed">
                  {q.note}
                </div>

                <div className="mt-4 pt-4 border-t border-ink-100">
                  <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 mb-1.5">
                    Scope of work
                  </div>
                  <ul className="space-y-1">
                    {q.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-center gap-1.5 text-[12px] text-ink-700"
                      >
                        <span className="h-1 w-1 rounded-full bg-ink-300" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Right column: AI recommendation */}
        <div className="xl:col-span-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-gradient-to-br from-ink-900 to-sky2026-700 text-canvas-soft p-6 md:p-7 relative overflow-hidden"
          >
            {/* subtle grid bg */}
            <div className="absolute inset-0 opacity-[0.06] dot-grid" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-canvas-soft/15 text-canvas-soft ring-1 ring-canvas-soft/20">
                  <Sparkles size={13} strokeWidth={2.2} />
                </span>
                <span className="text-[11.5px] uppercase tracking-[0.18em] text-canvas-soft/70 font-medium">
                  AI recommendation
                </span>
              </div>
              <h3 className="editorial text-[20px] leading-tight">
                Choose Contractor A.
                <span className="block text-canvas-soft/70 italic">
                  Or ask C to clarify.
                </span>
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-canvas-soft/80">
                Contractor A is fairly priced and the scope is complete. Contractor C is cheaper, but their quote is missing whether materials and labor are bundled.
              </p>

              <div className="mt-5 space-y-2">
                <div className="flex items-start gap-2 text-[12px] text-canvas-soft/85">
                  <Check size={13} className="mt-0.5 text-sage-200 shrink-0" />
                  <span>Materials and warranty are clearly itemized.</span>
                </div>
                <div className="flex items-start gap-2 text-[12px] text-canvas-soft/85">
                  <Check size={13} className="mt-0.5 text-sage-200 shrink-0" />
                  <span>Quote sits inside local 25th–75th percentile.</span>
                </div>
                <div className="flex items-start gap-2 text-[12px] text-canvas-soft/85">
                  <Info size={13} className="mt-0.5 text-ember-200 shrink-0" />
                  <span>If C confirms materials, they could save you $45.</span>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  onClick={() => onNavigate?.('quote-compare')}
                  className="group h-11 rounded-2xl bg-canvas-soft text-ink-900 hover:bg-white transition-all inline-flex items-center justify-center gap-2 text-[13.5px] font-semibold"
                >
                  <Sparkles size={14} strokeWidth={2.2} />
                  Open line-by-line comparison
                  <ArrowRight
                    size={14}
                    className="opacity-60 group-hover:translate-x-0.5 transition-transform"
                  />
                </button>
                <button className="h-10 rounded-2xl text-canvas-soft/85 hover:text-canvas-soft hover:bg-canvas-soft/10 transition-all text-[12.5px] font-medium">
                  Let Homewise negotiate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
