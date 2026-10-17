import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplet, Wrench, Bell, ArrowLeft } from 'lucide-react';
import Pill from '../ui/Pill';

// The board's default state. Absorbs v1's Overview: state-aware hero line,
// at-a-glance strip for the active job, and the home's standing watchlist.
// Watchlist icon tiles are neutral: accent color is reserved for meaning
// (sage = AI pick / positive, ember = warning), not item decoration.
const watchlist = [
  {
    id: 'hvac',
    icon: Wind,
    title: 'HVAC service',
    cadence: 'Every spring · before peak season',
    detail: 'Filter swap + coil clean. Catches small issues before they become emergency call-outs.',
    source: 'From Central HVAC',
  },
  {
    id: 'water-heater',
    icon: Droplet,
    title: 'Water heater check',
    cadence: 'Every 6 months',
    detail: 'Anode rod inspection + sediment flush. Adds years to the unit.',
    source: 'From Water heater',
  },
  {
    id: 'gutters',
    icon: Wrench,
    title: 'Gutter cleaning',
    cadence: 'Every fall · before leaves drop',
    detail: 'Prevents ice dams, foundation seepage, and cascading roof damage.',
    source: 'From Yard + Mature trees',
  },
  {
    id: 'smoke',
    icon: Bell,
    title: 'Smoke + CO detector test',
    cadence: 'Every 6 months',
    detail: 'Press to test, swap batteries, replace units after 10 years.',
    source: 'Standard for every home',
  },
];

export default function HomeArtifact({ gates, scheduledSlot, taskStarted, unlocked, jobCompleted, recommended }) {
  const booked = !!gates['approve-jason'];
  const quotesIn = !!gates['approve-outreach'];
  const contractorsIn = !!gates['approve-scope'];
  const decisionPending = !booked && !!unlocked?.has('scope');

  const hero = jobCompleted
    ? {
        primary: 'Job closed out.',
        secondary: recommended === 'yes' ? 'You recommended Jason. Homewise is keeping a quiet eye.' : 'Homewise is keeping a quiet eye.',
      }
    : booked
    ? { primary: `${scheduledSlot || 'Fri 2 PM'} with Jason.`, secondary: 'Homewise is watching for changes.' }
    : taskStarted
      ? { primary: 'One job in motion.', secondary: 'The conversation carries it. Decisions land here.' }
      : { primary: 'Your AI is ready.', secondary: 'Tell it what happened.' };

  return (
    <div className="space-y-10">
      <section className="relative pt-4">
        <div className="pointer-events-none absolute -inset-x-8 -top-6 -bottom-4 -z-10">
          <div className="absolute inset-0 dot-grid opacity-40" />
        </div>
        <h1 className="editorial text-[36px] lg:text-[44px] leading-[1.04] text-ink-900 max-w-xl">
          {hero.primary}
          <span className="block text-ink-500">{hero.secondary}</span>
        </h1>
        {!taskStarted && (
          <div className="mt-5 inline-flex items-center gap-1.5 text-[12.5px] leading-[1.5] text-ink-500">
            <ArrowLeft size={12} strokeWidth={2} />
            Start in the conversation. Artifacts land on this board as the AI works.
          </div>
        )}
      </section>

      {taskStarted && !jobCompleted && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-ink-300" />
            <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">
              At a glance · for your active job
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            <GlanceCard label="Task in motion" value="1" />
            <GlanceCard
              label={decisionPending ? 'Decision today' : 'Decisions waiting'}
              value={decisionPending ? '1' : '0'}
              tone={decisionPending ? 'ember' : 'sage'}
            />
            <GlanceCard label="Quotes received" value={quotesIn ? '3' : '0'} />
            <GlanceCard label="Contractors verified" value={contractorsIn ? '3' : '0'} />
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-px w-6 bg-ink-300" />
          <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">
            Your home's watchlist
          </span>
        </div>
        <p className="text-[12.5px] text-ink-500 leading-[1.5] mb-5">
          Homewise tracks these, pings you before seasonal windows, and lines up vetted pros when you're ready.
        </p>
        <div className="space-y-2">
          {watchlist.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
                className="rounded-3xl bg-white border border-ink-100/80 p-4 flex items-start gap-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0">
                  <Icon size={14} strokeWidth={1.8} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="text-[13.5px] font-medium text-ink-900">{item.title}</div>
                      <div className="text-[12px] text-ink-500 mt-0.5">{item.cadence}</div>
                    </div>
                    <Pill tone="neutral" className="shrink-0 whitespace-nowrap">
                      {item.source}
                    </Pill>
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-ink-700 leading-[1.5]">{item.detail}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function GlanceCard({ label, value, tone }) {
  return (
    <div className="rounded-3xl bg-white border border-ink-100/80 px-4 py-3.5">
      <div className="text-[12px] font-medium text-ink-500">{label}</div>
      <div
        className={`editorial editorial-s text-[28px] leading-none mt-2 tabular-nums ${
          tone === 'ember' ? 'text-ember-500' : tone === 'sage' ? 'text-sage-600' : 'text-ink-900'
        }`}
      >
        {value}
      </div>
    </div>
  );
}
