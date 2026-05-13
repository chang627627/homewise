import React from 'react';
import { Sparkles, ArrowRight, MessagesSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import ActiveTasks from '../components/ActiveTasks';
import Pill from '../components/ui/Pill';

export default function TasksPage({ onNavigate, hasStartedFirstTask, decisionHandled }) {
  if (!hasStartedFirstTask) {
    return (
      <div className="space-y-10">
        <PageHeader
          eyebrow="Conversations · 0 ongoing"
          title="No conversations yet."
          description="Every job you start with Homewise becomes a conversation thread, with the AI's actions, the scope it drafted, the contractors it found, and the quotes that came back. Start your first one to see it here."
        />
        <div className="rounded-3xl border border-dashed border-ink-200 bg-canvas-soft/40 p-10 max-w-3xl flex flex-col md:flex-row md:items-center gap-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sage-600 ring-1 ring-sage-100 shrink-0">
            <MessagesSquare size={18} strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-medium text-ink-900 tracking-[-0.020em]">
              Tell Homewise what's wrong.
            </div>
            <div className="text-[13px] text-ink-500 mt-1 leading-relaxed">
              The AI will ask clarifying questions, draft a contractor-ready scope, and gather quotes, all before any contractor sees a thing.
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('intake')}
            className="group h-12 px-5 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-2 text-[13.5px] font-semibold transition-all shrink-0"
          >
            <Sparkles size={14} strokeWidth={2.2} />
            Start your first task
            <ArrowRight
              size={14}
              className="opacity-60 group-hover:translate-x-0.5 transition-transform"
            />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 lg:space-y-14">
      <PageHeader
        eyebrow="Conversations · 1 ongoing"
        title="Every job is a conversation."
        description="Click in to see the thread, the AI's actions, and every artifact it generated for that job."
        trailing={
          <Pill tone="sage" live>
            Live
          </Pill>
        }
      />

      <ActiveTasks onNavigate={onNavigate} decisionHandled={decisionHandled} />
    </div>
  );
}
