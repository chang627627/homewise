import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import ActiveTasks from '../components/ActiveTasks';

const accentMap = {
  sage:  'bg-sage-50 text-sage-700 ring-sage-100',
  sky:   'bg-sky2026-50 text-sky2026-700 ring-sky2026-100',
  ember: 'bg-ember-50 text-ember-500 ring-ember-100',
};

export default function OverviewPage({
  onNavigate,
  decisionHandled,
  scheduledSlot,
  jobCompleted,
  recommended,
  hasStartedFirstTask,
  maintenanceItems = [],
}) {
  if (!hasStartedFirstTask) {
    return <EmptyOverview onNavigate={onNavigate} maintenanceItems={maintenanceItems} />;
  }
  return (
    <PopulatedOverview
      onNavigate={onNavigate}
      decisionHandled={decisionHandled}
      scheduledSlot={scheduledSlot}
      jobCompleted={jobCompleted}
      recommended={recommended}
      maintenanceItems={maintenanceItems}
    />
  );
}

function EmptyOverview({ onNavigate, maintenanceItems = [] }) {
  return (
    <div className="space-y-16 lg:space-y-24">
      {/* Hero / empty state */}
      <section className="relative">
        {/* ambient gradient + dot-grid texture anchor */}
        <div className="pointer-events-none absolute -inset-x-10 -top-20 -bottom-12 -z-10">
          <div className="absolute inset-0 dot-grid opacity-50" />
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3"
          >
            <Button variant="hero" onClick={() => onNavigate?.('intake')} iconRight={ArrowRight}>
              Start your first task
            </Button>
          </motion.div>

        </div>
      </section>

      {maintenanceItems.length > 0 && <Watchlist items={maintenanceItems} />}
    </div>
  );
}

function PopulatedOverview({ onNavigate, decisionHandled, scheduledSlot, jobCompleted, recommended, maintenanceItems = [] }) {
  // Overview is the general, whole-home pulse: no contractor names, no per-job
  // detail. A live job shows as one general "in progress" row; the specifics
  // (and any finished job) live in Conversations. Once the job is closed out,
  // nothing is live, so the page settles into a caught-up state.
  const hero = jobCompleted
    ? { primary: "You're all caught up.", secondary: 'Homewise is keeping a quiet eye.' }
    : decisionHandled
      ? null // booked: the active task card carries the status, so no separate hero line
      : { primary: '1 decision is waiting.', secondary: 'Homewise has your options lined up.' };

  return (
    <div className="space-y-12 lg:space-y-16">
      {/* Hero — pending + caught-up states only; booked shows no hero line. */}
      {hero && (
        <section>
          <h1 className="editorial text-[28px] md:text-[34px] leading-[1.1] text-ink-900 tracking-tight max-w-2xl">
            {hero.primary}
            <span className="block text-ink-500">{hero.secondary}</span>
          </h1>
        </section>
      )}

      {/* While the job is live, the full task card lives here. Once it's closed out,
          it drops off the Overview and lives in Conversations instead. */}
      {!jobCompleted && (
        <ActiveTasks
          onNavigate={onNavigate}
          decisionHandled={decisionHandled}
          scheduledSlot={scheduledSlot}
          jobCompleted={jobCompleted}
          recommended={recommended}
        />
      )}

      {maintenanceItems.length > 0 && <Watchlist items={maintenanceItems} />}
    </div>
  );
}

// Shared watchlist: the home's standing maintenance plan. General and always
// relevant, so it appears on every Overview state (cold-start, live, caught-up).
function Watchlist({ items }) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-2">
        <span className="h-px w-6 bg-ink-300" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-medium">
          Your home's watchlist
        </span>
      </div>
      <p className="text-[13px] text-ink-500 leading-relaxed mb-5">
        Homewise tracks these, pings you before seasonal windows, and lines up vetted pros when you're ready.
      </p>
      <div className="space-y-2">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * i }}
              className="rounded-2xl bg-white border border-ink-100/80 p-4 flex items-start gap-3"
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-2xl ring-1 shrink-0 ${accentMap[item.accent] || 'bg-canvas-soft text-ink-700 ring-ink-100'}`}>
                <Icon size={14} strokeWidth={1.8} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13.5px] font-semibold text-ink-900 tracking-[-0.005em]">
                      {item.title}
                    </div>
                    <div className="text-[11.5px] text-ink-500 mt-0.5">{item.cadence}</div>
                  </div>
                  {item.source && (
                    <span className="shrink-0 inline-flex items-center rounded-full bg-canvas-soft border border-ink-100 px-2 py-0.5 text-[10.5px] font-semibold text-ink-500 whitespace-nowrap">
                      {item.source}
                    </span>
                  )}
                </div>
                <p className="mt-1.5 text-[12.5px] text-ink-700 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
