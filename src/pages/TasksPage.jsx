import React from 'react';
import { motion } from 'framer-motion';
import { MessagesSquare } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import ActiveTasks from '../components/ActiveTasks';
import Pill from '../components/ui/Pill';

export default function TasksPage({ onNavigate, hasStartedFirstTask, decisionHandled }) {
  if (!hasStartedFirstTask) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Conversations · 0 ongoing"
          title="Your conversations"
        />
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl bg-white border border-ink-100/80 p-6 flex flex-col items-start gap-4 max-w-xl"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-canvas-soft ring-1 ring-ink-100 text-ink-400">
            <MessagesSquare size={16} strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-[14px] font-semibold text-ink-900 tracking-[-0.005em]">
              No conversations yet.
            </p>
            <p className="mt-1 text-[13px] text-ink-500 leading-relaxed">
              Start a task and Homewise will handle the back-and-forth for you.
            </p>
          </div>
          <button
            onClick={() => onNavigate?.('intake')}
            className="h-9 px-4 rounded-xl bg-ink-900 hover:bg-ink-700 text-canvas-soft text-[12.5px] font-semibold transition-colors"
          >
            Start your first task
          </button>
        </motion.div>
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
