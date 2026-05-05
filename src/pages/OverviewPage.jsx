import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  MessagesSquare,
  FileText,
  Users,
  TrendingUp,
} from 'lucide-react';
import OverviewCards from '../components/OverviewCards';
import ActiveTasks from '../components/ActiveTasks';

const steps = [
  {
    n: '01',
    icon: MessagesSquare,
    title: 'Describe what happened',
    detail: 'Talk to Homewise like a friend. Drop a photo. The AI asks the same clarifying questions a senior contractor would.',
  },
  {
    n: '02',
    icon: FileText,
    title: 'Get a contractor-ready scope',
    detail: 'AI generates an itemized scope of work: labor, materials, exclusions, unit pricing for anything uncertain.',
  },
  {
    n: '03',
    icon: Users,
    title: 'Compare 3 verified contractors',
    detail: 'Side-by-side: rating, license, insurance, recent similar work. Why each was picked, in plain English.',
  },
  {
    n: '04',
    icon: TrendingUp,
    title: 'See quotes apples-to-apples',
    detail: 'Same scope, every contractor. AI flags scope deviations and outlier pricing so you decide with confidence.',
  },
];

export default function OverviewPage({ onNavigate, decisionHandled, scheduledSlot, hasStartedFirstTask }) {
  if (!hasStartedFirstTask) {
    return <EmptyOverview onNavigate={onNavigate} />;
  }
  return <PopulatedOverview onNavigate={onNavigate} decisionHandled={decisionHandled} scheduledSlot={scheduledSlot} />;
}

function EmptyOverview({ onNavigate }) {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero / empty state */}
      <section className="relative">
        {/* ambient gradient */}
        <div className="pointer-events-none absolute -inset-x-10 -top-20 -bottom-12 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(154,174,140,0.18),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_85%_20%,rgba(217,164,97,0.10),transparent_70%)]" />
        </div>

        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
              <Sparkles size={13} strokeWidth={2.2} />
            </span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-sage-600 font-semibold">
              Welcome to Homewise · ready when you are
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="editorial text-[36px] md:text-[44px] lg:text-[52px] leading-[1.05] text-ink-900 tracking-tight"
          >
            Your AI is ready.
            <span className="block text-ink-500">Tell it what happened.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 text-[14px] md:text-[15px] text-ink-500 max-w-xl leading-relaxed"
          >
            Homewise vets contractors, drafts the scope, gathers quotes, and explains the trade-offs. You stop searching, comparing, and chasing, and only step in when a real decision needs you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <button
              onClick={() => onNavigate?.('intake')}
              className="group h-12 pl-5 pr-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft inline-flex items-center gap-2.5 text-[13.5px] font-semibold transition-all"
            >
              Start your first task
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft/15 group-hover:bg-canvas-soft/25 transition-colors">
                <ArrowRight size={14} strokeWidth={2.2} />
              </span>
            </button>
            <span className="text-[12px] text-ink-500">
              Takes about 2 minutes. No contractor sees anything until you approve.
            </span>
          </motion.div>

        </div>
      </section>

      {/* How it works. 4 steps */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <span className="h-px w-6 bg-ink-300" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-medium">
            How it works
          </span>
        </div>
        <h2 className="editorial text-[22px] md:text-[26px] leading-[1.15] text-ink-900 tracking-tight max-w-2xl mb-8">
          Four steps from problem to a contractor you trust.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((s, i) => (
            <motion.button
              key={s.n}
              onClick={() => onNavigate?.('intake')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
              className="group text-left rounded-3xl bg-white border border-ink-100/80 p-6 hover: hover:border-ink-200 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100 group-hover:bg-sage-50 group-hover:text-sage-600 group-hover:ring-sage-100 transition-all">
                  <s.icon size={15} strokeWidth={1.9} />
                </span>
                <span className="editorial text-[15px] text-ink-300 leading-none tabular-nums">
                  {s.n}
                </span>
              </div>
              <div className="text-[14px] font-semibold text-ink-900 tracking-[-0.005em] leading-snug">
                {s.title}
              </div>
              <p className="mt-1.5 text-[12px] text-ink-500 leading-relaxed">
                {s.detail}
              </p>
            </motion.button>
          ))}
        </div>
      </section>
    </div>
  );
}

function PopulatedOverview({ onNavigate, decisionHandled, scheduledSlot }) {
  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Hero */}
      <section>
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-ink-300" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-medium">
              Good morning, Mara · April 23
            </span>
          </div>
          <div className="hidden md:flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 border border-ink-100 px-2.5 py-1 text-[11px] text-ink-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-500" />
              </span>
              Homewise active
            </span>
          </div>
        </div>
        <h1 className="editorial text-[28px] md:text-[34px] leading-[1.1] text-ink-900 tracking-tight max-w-2xl">
          Your AI is on it.
          <span className="block text-ink-500">
            You decide what matters.
          </span>
        </h1>
        <p className="mt-3 text-[13.5px] text-ink-500 max-w-xl leading-relaxed">
          {decisionHandled
            ? 'No decisions waiting. The kitchen sink job is moving. Open Conversations to follow it.'
            : 'One job in motion. Homewise will surface only what needs your call. Open Conversations to see the thread.'}
        </p>
      </section>

      <OverviewCards onNavigate={onNavigate} decisionHandled={decisionHandled} />
      <ActiveTasks onNavigate={onNavigate} decisionHandled={decisionHandled} scheduledSlot={scheduledSlot} />
    </div>
  );
}
