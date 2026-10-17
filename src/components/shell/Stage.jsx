import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid,
  FileText,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  ClipboardCheck,
} from 'lucide-react';
import HomeArtifact from '../artifacts/HomeArtifact';
import ScopeArtifact from '../artifacts/ScopeArtifact';
import ContractorsArtifact from '../artifacts/ContractorsArtifact';
import QuotesArtifact from '../artifacts/QuotesArtifact';
import ScheduleArtifact from '../artifacts/ScheduleArtifact';
import CompletionArtifact from '../artifacts/CompletionArtifact';

// The stage: the artifact board. One artifact at a time; the tab row is the
// board's memory, every artifact the flow has produced stays reachable. It is
// also the only artifact navigation (the rail no longer carries board links).
const ARTIFACTS = [
  { id: 'home', label: 'Board', icon: LayoutGrid },
  { id: 'scope', label: 'Scope of work', icon: FileText },
  { id: 'contractors', label: 'Contractors', icon: ShieldCheck },
  { id: 'quotes', label: 'Quotes', icon: TrendingUp },
  { id: 'schedule', label: 'Schedule', icon: CalendarDays },
  { id: 'completion', label: 'Close-out', icon: ClipboardCheck },
];

const artifactMap = {
  home: HomeArtifact,
  scope: ScopeArtifact,
  contractors: ContractorsArtifact,
  quotes: QuotesArtifact,
  schedule: ScheduleArtifact,
  completion: CompletionArtifact,
};

export default function Stage({
  staged,
  unlocked,
  gates,
  scheduledSlot,
  taskStarted,
  jobCompleted,
  recommended,
  photosShared,
  onRestage,
  onClearGate,
}) {
  const Active = artifactMap[staged] || HomeArtifact;
  const scrollRef = useRef(null);

  return (
    <section className="flex-1 min-w-0 h-full flex flex-col bg-canvas">
      {/* Stage header: one segmented control for the artifact tabs + context.
          The context takes only the space the tabs leave and truncates. */}
      <header className="shrink-0 h-14 px-5 lg:px-7 border-b border-ink-100 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-0.5 p-1 rounded-2xl bg-ink-100/60 min-w-0 overflow-x-auto no-scrollbar">
          {ARTIFACTS.filter((a) => unlocked.has(a.id)).map((a) => {
            const Icon = a.icon;
            const active = staged === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onRestage(a.id)}
                className={`relative h-8 px-3 rounded-xl text-[12.5px] font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
                  active ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="stage-tab-thumb"
                    className="absolute inset-0 rounded-xl bg-white hairline-strong"
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative z-10 inline-flex items-center gap-1.5">
                  <Icon size={14} strokeWidth={1.8} />
                  {a.label}
                </span>
              </button>
            );
          })}
        </div>
        {/* Once four or more artifacts are open the tabs carry the context,
            and the line would only survive as a truncated stub. */}
        {unlocked.size <= 3 && (
          <span className="hidden md:block flex-1 min-w-0 truncate text-right text-[12px] text-ink-500">
            {taskStarted ? 'On your board · Kitchen sink leak' : 'On your board · Maple Street'}
          </span>
        )}
      </header>

      {/* Artifact surface: every newly staged artifact starts at the top.
          The reset fires between the old artifact's exit and the new one's
          entrance so neither view visibly jumps. */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <AnimatePresence
          mode="wait"
          onExitComplete={() => scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })}
        >
          <motion.div
            key={staged}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="px-5 lg:px-7 py-6 max-w-[1120px] mx-auto"
          >
            <Active
              gates={gates}
              unlocked={unlocked}
              jobCompleted={jobCompleted}
              recommended={recommended}
              photosShared={photosShared}
              scheduledSlot={scheduledSlot}
              taskStarted={taskStarted}
              onClearGate={onClearGate}
              onRestage={onRestage}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
