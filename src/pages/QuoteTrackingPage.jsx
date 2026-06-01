import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Hourglass,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import BackBar from '../components/ui/BackBar';
import FlowProgress from '../components/ui/FlowProgress';

const accentBg = {
  sage: 'from-sage-200 to-sage-400 ring-sage-300/40 text-sage-700',
  sky: 'from-sky2026-100 to-sky2026-300 ring-sky2026-300/40 text-sky2026-700',
  ember: 'from-ember-100 to-ember-300 ring-ember-300/40 text-ember-500',
};

// Quote arrival sequence. Each contractor starts "awaiting" and the quotes
// stream in on their own — the "AI is working for you, just watch" beat.
// Mirrors the data on QuoteComparePage so numbers stay consistent.
const quoteFeed = [
  {
    id: 'jason',
    name: 'Jason Plumbing Co.',
    initials: 'J',
    accent: 'sage',
    total: 220,
    earliest: 'Fri Apr 25',
    received: '11:08 AM',
    aiPick: true,
    final: 'received',
  },
  {
    id: 'bayline',
    name: 'Bayline Plumbing',
    initials: 'B',
    accent: 'sky',
    total: 390,
    earliest: 'Sat Apr 26',
    received: '2:42 PM',
    final: 'received',
  },
  {
    id: 'quickfix',
    name: 'Quickfix Pros',
    initials: 'Q',
    accent: 'ember',
    total: 175,
    earliest: 'Today',
    received: '4:15 PM',
    final: 'received',
  },
];

export default function QuoteTrackingPage({ onNavigate }) {
  // arrived = how many contractors have resolved so far (0..3)
  const [arrived, setArrived] = useState(0);

  // Quotes stream in automatically. First lands a touch quicker so the page
  // never reads as static; the rest pace out for a smooth "watch them roll
  // in" beat (~4s total).
  useEffect(() => {
    if (arrived >= quoteFeed.length) return;
    const t = setTimeout(() => setArrived((n) => n + 1), arrived === 0 ? 1200 : 1400);
    return () => clearTimeout(t);
  }, [arrived]);

  const allIn = arrived >= quoteFeed.length;
  const receivedCount = quoteFeed.slice(0, arrived).filter((c) => c.final === 'received').length;

  return (
    <div className="space-y-8">
      <BackBar
        onBack={() => onNavigate?.('contractor-compare')}
        label="Back to contractors"
        context="Quotes · tracking"
      />

      <FlowProgress current="quote-compare" onNavigate={onNavigate} />

      {/* Header */}
      <header>
        <h1 className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900 tracking-tight">
          {allIn ? 'Quotes are in.' : 'Your scope is out to 3 contractors.'}
        </h1>
        <p className="mt-3 text-[14px] text-ink-500 max-w-xl leading-relaxed">
          {allIn
            ? 'Each bid on the same scope. Compare them side by side when you’re ready.'
            : 'Same brief to all three. Homewise is watching for responses and will line them up to compare once they land.'}
        </p>
      </header>

      {/* Agent status line — live while waiting, settled when all in */}
      <motion.div
        layout
        className={`rounded-2xl border px-5 py-4 flex items-center gap-3 ${
          allIn ? 'bg-sage-50/50 border-sage-100' : 'bg-white border-ink-100'
        }`}
      >
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
            allIn
              ? 'bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft'
              : 'bg-sage-50 text-sage-500 ring-1 ring-sage-100'
          }`}
        >
          <Sparkles size={14} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {!allIn && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
              </span>
            )}
            <span className="text-[13px] font-semibold text-ink-900">
              {allIn
                ? `${receivedCount} of 3 quotes in`
                : `Waiting on quotes · ${receivedCount} of 3 in`}
            </span>
          </div>
          <p className="text-[12px] text-ink-500 mt-0.5">
            {allIn
              ? 'Standard 5-day window. All three bid on the same scope.'
              : 'Typically back within 5 days. We’ll notify you as each one arrives.'}
          </p>
        </div>
      </motion.div>

      {/* Per-contractor status cards */}
      <div className="space-y-2.5">
        {quoteFeed.map((c, i) => {
          const resolved = i < arrived;
          const status = !resolved ? 'awaiting' : c.final;
          return (
            <motion.div
              key={c.id}
              layout
              initial={false}
              className={`rounded-2xl border px-4 py-3.5 flex items-center gap-3 transition-colors ${
                status === 'awaiting'
                  ? 'bg-canvas-soft/40 border-ink-100'
                  : 'bg-white border-ink-100'
              }`}
            >
              {/* Avatar */}
              <div
                className={`relative h-10 w-10 rounded-2xl bg-gradient-to-br ${accentBg[c.accent]} ring-1 flex items-center justify-center shrink-0 ${
                  status === 'awaiting' ? 'opacity-50' : ''
                }`}
              >
                <span className="editorial text-[15px]">{c.initials}</span>
              </div>

              {/* Name + meta */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-semibold text-ink-900 truncate">
                    {c.name}
                  </span>
                </div>
                {status === 'received' && (
                  <div className="text-[12px] text-ink-500 mt-0.5 tabular-nums">
                    Earliest start {c.earliest} <span className="text-ink-300">·</span> received {c.received}
                  </div>
                )}
                {status === 'conversation' && (
                  <div className="text-[12px] text-ink-500 mt-0.5">
                    Homewise is clarifying missing details with them
                  </div>
                )}
                {status === 'awaiting' && (
                  <div className="text-[12px] text-ink-400 mt-0.5">Scope delivered</div>
                )}
              </div>

              {/* Total (received only) */}
              {status === 'received' && (
                <div className="text-right shrink-0">
                  <div className="editorial text-[18px] leading-none text-ink-900 tabular-nums">
                    ${c.total}
                  </div>
                </div>
              )}

              {/* Status pill */}
              <StatusPill status={status} />
            </motion.div>
          );
        })}
      </div>

      {/* Unlock / compare CTA */}
      <section className="pt-2">
        <AnimatePresence mode="wait">
          {allIn ? (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <button
                onClick={() => onNavigate?.('quote-compare')}
                className="group h-12 pl-5 pr-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center justify-center gap-2.5 text-[13.5px] font-semibold transition-all"
              >
                Compare all 3
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft/15 group-hover:bg-canvas-soft/25 transition-colors">
                  <ArrowRight size={14} strokeWidth={2.2} />
                </span>
              </button>
              <span className="text-[12px] text-ink-500">
                Side-by-side breakdown with deviations and outliers flagged.
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-2 h-12 px-5 rounded-2xl bg-ink-100/60 text-ink-400 text-[13.5px] font-semibold cursor-default"
            >
              <Hourglass size={14} strokeWidth={2} />
              Compare unlocks when quotes are in
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    awaiting: {
      cls: 'bg-canvas-soft text-ink-400 ring-ink-100',
      icon: Hourglass,
      label: 'Awaiting response',
    },
    received: {
      cls: 'bg-sage-50 text-sage-700 ring-sage-100',
      icon: CheckCircle2,
      label: 'Quote received',
    },
    conversation: {
      cls: 'bg-sky2026-50 text-sky2026-700 ring-sky2026-100',
      icon: MessageCircle,
      label: 'In conversation',
    },
  };
  const m = map[status];
  const Icon = m.icon;
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${m.cls}`}
    >
      <Icon size={11} strokeWidth={2} />
      {m.label}
    </span>
  );
}
