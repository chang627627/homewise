import React from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Wind,
  ShieldCheck,
  ChevronRight,
  Flame,
  Clock,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
} from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Pill from './ui/Pill';
import Confidence from './ui/Confidence';

const tasks = [
  {
    id: 1,
    convId: 'sink',
    title: 'Kitchen sink leak',
    icon: Droplets,
    accent: 'sage',
    urgency: { tone: 'ember', label: 'Urgent · this week' },
    confidence: 92,
    currentAction: 'Reviewing 3 quotes against local benchmark',
    nextUserAction: 'Approve recommended plumber',
    flow: [
      { label: 'Issue understood', state: 'done' },
      { label: 'Contractors found', state: 'done' },
      { label: 'Quotes received', state: 'done' },
      { label: 'Awaiting approval', state: 'active' },
      { label: 'Scheduled', state: 'pending' },
    ],
  },
];

const accentMap = {
  sage: 'bg-sage-50 text-sage-600 ring-sage-100',
  sky: 'bg-sky2026-50 text-sky2026-700 ring-sky2026-100',
  ember: 'bg-ember-50 text-ember-500 ring-ember-100',
};

function FlowDots({ flow }) {
  const activeIndex = flow.findIndex((s) => s.state === 'active');
  const total = flow.length;
  const activeStep = flow[activeIndex] ?? flow[flow.length - 1];

  return (
    <div>
      <div className="flex items-center gap-1">
        {flow.map((s, i) => {
          const isActive = s.state === 'active';
          const isDone = s.state === 'done';
          const dotCls = isDone
            ? 'bg-sage-500'
            : isActive
              ? 'bg-ember-300 ring-2 ring-ember-100'
              : 'bg-ink-200';
          const lineCls =
            i < activeIndex
              ? 'bg-sage-300'
              : i === activeIndex
                ? 'bg-gradient-to-r from-sage-300 to-ink-100'
                : 'bg-ink-100';
          return (
            <React.Fragment key={s.label}>
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotCls} ${isActive ? 'animate-pulseDot' : ''}`}
              />
              {i < total - 1 && <span className={`h-px flex-1 ${lineCls}`} />}
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10.5px]">
        <span className="text-ink-500 tabular-nums">
          Step {Math.max(activeIndex + 1, 1)} of {total}
        </span>
        <span className="text-ink-900 font-medium truncate ml-2">
          {activeStep.label}
        </span>
      </div>
    </div>
  );
}

export default function ActiveTasks({
  onNavigate,
  decisionHandled = false,
  scheduledSlot,
  jobCompleted = false,
  recommended,
}) {
  // After Jason is approved, the kitchen sink task moves into "Scheduled" state.
  // Once the homeowner confirms the visit, it moves into "Completed".
  const slotLabel = scheduledSlot || 'Friday 2 PM';
  const visibleTasks = tasks.map((t) => {
    if (t.convId !== 'sink') return t;
    if (jobCompleted) {
      return {
        ...t,
        urgency: { tone: 'sage', label: 'Completed' },
        confidence: 100,
        currentAction:
          recommended === 'yes'
            ? "You recommended Jason · He's now Recommended by 13 Homewisers"
            : 'Job closed out · Logged in your file',
        nextUserAction: 'Nothing to do. Homewise is watching for follow-ups.',
        flow: [
          { label: 'Issue understood', state: 'done' },
          { label: 'Contractors found', state: 'done' },
          { label: 'Quotes received', state: 'done' },
          { label: 'Awaiting approval', state: 'done' },
          { label: 'Completed', state: 'done' },
        ],
        completedState: true,
        recommended,
      };
    }
    if (decisionHandled) {
      return {
        ...t,
        urgency: { tone: 'sage', label: `Scheduled · ${slotLabel}` },
        confidence: 96,
        currentAction: 'Scheduled with Jason · monitoring for changes',
        nextUserAction: `Visit confirmed · ${slotLabel}`,
        flow: [
          { label: 'Issue understood', state: 'done' },
          { label: 'Contractors found', state: 'done' },
          { label: 'Quotes received', state: 'done' },
          { label: 'Awaiting approval', state: 'done' },
          { label: 'Scheduled', state: 'active' },
        ],
        scheduledState: true,
      };
    }
    return t;
  });
  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow={jobCompleted ? 'Recent AI tasks' : 'Active AI tasks'}
        title={jobCompleted ? 'What Homewise wrapped up.' : 'What Homewise is working on right now.'}
        description={
          jobCompleted
            ? 'One job, closed out. Click for the receipt, photos, and the recommendation you sent.'
            : decisionHandled
              ? `One job in motion. Jason booked for ${slotLabel}. Homewise is monitoring.`
              : "One job in motion. Click to see the conversation, what the AI's done, and what's next."
        }
        trailing={
          jobCompleted ? (
            <Pill tone="sage">Closed out</Pill>
          ) : (
            <Pill tone="sage" live>
              Live
            </Pill>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {visibleTasks.map((t, i) => (
          <motion.article
            key={t.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onNavigate?.({ page: 'conversation', conversationId: t.convId })}
            className="group relative rounded-3xl bg-white border border-ink-100/80 p-5 hover: hover:border-ink-200 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-2xl ring-1 ${accentMap[t.accent]}`}
              >
                <t.icon size={15} strokeWidth={1.8} />
              </span>
              <span className="shrink-0 h-8 w-8 rounded-xl ring-1 ring-ink-100 flex items-center justify-center text-ink-500 group-hover:text-ink-900 group-hover:ring-ink-200 group-hover:bg-canvas-soft transition-all">
                <ChevronRight size={13} />
              </span>
            </div>
            <h3 className="text-[15px] font-medium text-ink-900 tracking-[-0.015em] leading-snug">
              {t.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Pill tone={t.urgency.tone} icon={t.urgency.tone === 'ember' ? Flame : Clock}>
                {t.urgency.label}
              </Pill>
            </div>

            {/* Flow */}
            <div className="mt-5">
              <FlowDots flow={t.flow} />
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-canvas-soft border border-ink-100 p-3">
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-1 font-semibold">
                  <Sparkles size={10} className="text-sage-500" />
                  AI is doing
                </div>
                <div className="text-[12.5px] text-ink-900 leading-snug">
                  {t.currentAction}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.1em] text-ink-500 mb-1 font-semibold">
                  Next from you
                </div>
                <div className="text-[12.5px] text-ink-700 leading-snug">
                  {t.nextUserAction}
                </div>
              </div>
              <Confidence value={t.confidence} label="Task confidence" />
              {t.scheduledState && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate?.('completion');
                  }}
                  className="group/btn w-full h-10 mt-1 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-all"
                >
                  <CheckCircle2 size={13} strokeWidth={2.2} />
                  Confirm visit complete
                </button>
              )}
              {t.completedState && t.recommended === 'yes' && (
                <div className="rounded-2xl bg-sage-50/60 border border-sage-100 px-3 py-2.5 inline-flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-sage-600 ring-1 ring-sage-100">
                    <ThumbsUp size={12} strokeWidth={2.2} />
                  </span>
                  <span className="text-[11.5px] text-ink-700 leading-snug">
                    Recommendation sent. Jason's count is now <strong className="text-ink-900">13 Homewisers</strong>.
                  </span>
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
