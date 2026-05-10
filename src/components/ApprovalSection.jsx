import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  BadgeCheck,
  Gauge,
  CalendarClock,
  ArrowRight,
  Scale,
  MessageSquareText,
  Pencil,
  Send,
  Star,
  Sparkles,
} from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Pill from './ui/Pill';
import Confidence from './ui/Confidence';

const reasons = [
  { icon: ShieldCheck, label: 'License verified' },
  { icon: BadgeCheck, label: 'Insurance active' },
  { icon: Gauge, label: 'Quote within local benchmark' },
  { icon: CalendarClock, label: 'Available Friday afternoon' },
];

export default function ApprovalSection({ onNavigate, decisionHandled }) {
  if (decisionHandled) {
    return (
      <section className="space-y-6">
        <SectionHeader
          eyebrow="Needs your approval"
          title="All clear."
          description="No decisions waiting on you right now. Homewise will surface the next one when it's ready."
          trailing={
            <Pill tone="sage" icon={Sparkles}>
              0 pending
            </Pill>
          }
        />
        <div className="rounded-3xl border border-dashed border-ink-200 bg-canvas-soft/40 p-8 max-w-3xl flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
            <Sparkles size={16} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-ink-900 tracking-[-0.005em]">
              You handled the plumber decision.
            </div>
            <div className="text-[12.5px] text-ink-500 mt-0.5">
              Homewise is moving the kitchen sink job forward. Follow it from Active tasks.
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Needs your approval"
        title="One decision is waiting on you."
        description="Homewise has done the research. Approve, compare, or have the AI keep negotiating on your behalf."
        trailing={
          <Pill tone="ember" icon={Sparkles}>
            1 awaiting decision
          </Pill>
        }
      />

      <div>
        {/* Single decision card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onNavigate?.('contractor-compare')}
          className="group relative overflow-hidden rounded-3xl bg-white border border-ink-100/80 max-w-3xl cursor-pointer hover: hover:border-ink-200 transition-all"
        >
          {/* subtle accent strip */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sage-300 via-sage-400 to-ember-200" />

          <div className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Pill tone="sage" live>
                    AI recommendation ready
                  </Pill>
                  <Pill tone="neutral">Plumbing · Kitchen</Pill>
                </div>
                <h3 className="editorial text-[18px] md:text-[22px] leading-tight text-ink-900">
                  Choose plumber for kitchen sink repair
                </h3>
                <p className="text-[13.5px] text-ink-500 mt-1.5 leading-relaxed">
                  Reviewed 4 contractors, verified credentials, and benchmarked the quote.
                </p>
              </div>
            </div>

            {/* Recommended contractor card */}
            <div className="rounded-2xl bg-canvas-soft border border-ink-100 p-4 md:p-5">
              <div className="flex items-start gap-4">
                <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-sage-200 to-sage-400 ring-1 ring-sage-300/40 flex items-center justify-center shrink-0">
                  <span className="editorial text-[15px] text-sage-700">J</span>
                  <span className="absolute -right-1 -bottom-1 h-5 w-5 rounded-full bg-white ring-1 ring-sage-200 flex items-center justify-center">
                    <BadgeCheck size={11} className="text-sage-600" strokeWidth={2.4} />
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[15px] font-semibold text-ink-900 tracking-[-0.01em]">
                        Jason Plumbing Co.
                      </div>
                      <div className="flex items-center gap-2 text-[12px] text-ink-500 mt-0.5">
                        <span className="inline-flex items-center gap-1">
                          <Star size={11} className="text-ember-300 fill-ember-300" strokeWidth={1.5} />
                          <span className="font-medium text-ink-700">4.8</span>
                          <span className="text-ink-300">·</span>
                          <span>168 reviews</span>
                        </span>
                        <span className="text-ink-300">·</span>
                        <span>Available Friday</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500">
                        Quote
                      </div>
                      <div className="editorial text-[22px] leading-none text-ink-900 tabular-nums">
                        $220
                      </div>
                    </div>
                  </div>

                  {/* Why recommended */}
                  <div className="mt-4">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500 mb-2">
                      Why Homewise recommends
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {reasons.map((r) => (
                        <div
                          key={r.label}
                          className="flex items-center gap-2 rounded-xl bg-white border border-ink-100 px-2.5 py-2"
                        >
                          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sage-50 text-sage-600 ring-1 ring-sage-100">
                            <r.icon size={12} strokeWidth={2} />
                          </span>
                          <span className="text-[12.5px] text-ink-900">{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <Confidence value={92} label="AI confidence" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-[12.5px] text-ink-500 max-w-md">
                Approving will send Jason a confirmed booking for Friday at 2 PM and notify you when he arrives.
              </div>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => onNavigate?.('contractor-compare')}
                  className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft inline-flex items-center gap-1.5 text-[13px] font-medium transition-all"
                >
                  <Scale size={14} strokeWidth={1.8} />
                  Compare all
                </button>
                <button className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft inline-flex items-center gap-1.5 text-[13px] font-medium transition-all">
                  <MessageSquareText size={14} strokeWidth={1.8} />
                  Ask AI to negotiate
                </button>
                <button className="h-10 pl-4 pr-3 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white inline-flex items-center gap-2 text-[13px] font-semibold transition-all">
                  Approve contractor
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/15 transition-colors">
                    <ArrowRight size={13} strokeWidth={2.2} />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
