import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, ThumbsUp } from 'lucide-react';
import Pill from './ui/Pill';

export default function ActiveTasks({
  onNavigate,
  decisionHandled = false,
  scheduledSlot,
  jobCompleted = false,
  recommended,
}) {
  const slotLabel = scheduledSlot || 'Friday 2 PM';

  const upcoming = jobCompleted
    ? []
    : decisionHandled
      ? [{
          id: 1,
          convId: 'sink',
          title: 'Kitchen sink leak',
          contractor: 'Jason Plumbing Co.',
          when: 'Friday · April 25 · 2:00 PM',
          pill: { tone: 'sage', label: `Scheduled · ${slotLabel}` },
          scheduledState: true,
        }]
      : [{
          id: 1,
          convId: 'sink',
          title: 'Kitchen sink leak',
          contractor: 'Getting quotes',
          when: 'Visit date TBD',
          pill: { tone: 'ember', label: 'Awaiting your decision' },
        }];

  const past = jobCompleted
    ? [{
        id: 1,
        convId: 'sink',
        title: 'Kitchen sink leak',
        contractor: 'Jason Plumbing Co.',
        when: 'Friday · April 25 · 2:00 PM',
        pill: { tone: 'sage', label: 'Completed' },
        completedState: true,
        recommended,
      }]
    : [];

  return (
    <section className="space-y-8">
      <VisitGroup
        label="Upcoming"
        visits={upcoming}
        onNavigate={onNavigate}
        emptyText="No upcoming visits."
      />
      <VisitGroup
        label="Past"
        visits={past}
        onNavigate={onNavigate}
        emptyText="No past visits yet."
      />
    </section>
  );
}

function VisitGroup({ label, visits, onNavigate, emptyText }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="h-px w-6 bg-ink-300" />
        <span className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-medium">
          {label}
        </span>
      </div>
      {visits.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 px-5 py-4 text-[12.5px] text-ink-400">
          {emptyText}
        </div>
      ) : (
        visits.map((v, i) => (
          <VisitCard key={v.id} visit={v} index={i} onNavigate={onNavigate} />
        ))
      )}
    </div>
  );
}

function VisitCard({ visit: v, index, onNavigate }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onNavigate?.({ page: 'conversation', conversationId: v.convId })}
      className="group rounded-3xl bg-white border border-ink-100/80 p-5 hover:border-ink-200 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-[15px] font-medium text-ink-900 tracking-[-0.015em]">
              {v.title}
            </h3>
            <Pill tone={v.pill.tone}>{v.pill.label}</Pill>
          </div>
          <div className="text-[12.5px] text-ink-500">
            {v.contractor} · {v.when}
          </div>
          {v.completedState && v.recommended === 'yes' && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-sage-50/60 border border-sage-100 px-3 py-2">
              <ThumbsUp size={11} strokeWidth={2.2} className="text-sage-600 shrink-0" />
              <span className="text-[11.5px] text-ink-700">
                Recommendation sent. Jason's count is now{' '}
                <strong className="text-ink-900">13 Homewisers</strong>.
              </span>
            </div>
          )}
        </div>
        <span className="shrink-0 h-8 w-8 rounded-xl ring-1 ring-ink-100 flex items-center justify-center text-ink-500 group-hover:text-ink-900 group-hover:ring-ink-200 group-hover:bg-canvas-soft transition-all mt-0.5">
          <ChevronRight size={13} />
        </span>
      </div>
      {v.scheduledState && (
        <div className="mt-4 pt-4 border-t border-ink-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate?.('completion');
            }}
            className="w-full h-10 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-all"
          >
            <CheckCircle2 size={13} strokeWidth={2.2} />
            Confirm visit complete
          </button>
        </div>
      )}
    </motion.article>
  );
}
