import React from 'react';
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

// The stage: the artifact board. One artifact at a time; the pills row is the
// board's memory, every artifact the flow has produced stays reachable.
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

  return (
    <section className="flex-1 min-w-0 h-full flex flex-col">
      {/* Stage header: artifact pills + context */}
      <header className="shrink-0 px-5 lg:px-7 pt-4 pb-3.5 border-b border-ink-100/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 flex-wrap min-w-0">
          {ARTIFACTS.filter((a) => unlocked.has(a.id)).map((a) => {
            const Icon = a.icon;
            const active = staged === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onRestage(a.id)}
                className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-[12px] font-semibold tracking-tight whitespace-nowrap transition-all ${
                  active
                    ? 'bg-ink-900 text-canvas-soft hairline-on-dark grain-dark'
                    : 'bg-white border border-ink-100 text-ink-700 hover:border-ink-300 hover:text-ink-900'
                }`}
              >
                <Icon size={12} strokeWidth={2} className={active ? '' : 'text-ink-500'} />
                {a.label}
              </button>
            );
          })}
        </div>
        <span className="hidden md:block text-[11px] uppercase tracking-[0.18em] text-ink-500 font-medium whitespace-nowrap shrink-0">
          {taskStarted ? 'On your board · Kitchen sink leak' : 'On your board · Maple Street'}
        </span>
      </header>

      {/* Artifact surface */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
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
