import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Bell,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Pill from '../components/ui/Pill';

const week = [
  { day: 'Mon', date: 21, dim: true },
  { day: 'Tue', date: 22, dim: true },
  { day: 'Wed', date: 23, today: true },
  { day: 'Thu', date: 24 },
  { day: 'Fri', date: 25, marked: true },
  { day: 'Sat', date: 26 },
  { day: 'Sun', date: 27 },
];

export default function SchedulePage({ onNavigate, hasStartedFirstTask, decisionHandled }) {
  if (!hasStartedFirstTask) {
    return <EmptySchedule onNavigate={onNavigate} />;
  }
  return <PopulatedSchedule onNavigate={onNavigate} decisionHandled={decisionHandled} />;
}

// ──────────────────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────────────────
function EmptySchedule({ onNavigate }) {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Schedule · nothing booked"
        title="No visits on the calendar."
        description="Once you approve a contractor, Homewise schedules the visit and the calendar fills in. Reminders, reschedules, and follow-ups all live here."
      />
      <div className="rounded-3xl border border-dashed border-ink-200 bg-canvas-soft/40 p-10 max-w-3xl flex flex-col md:flex-row md:items-center gap-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-sage-600 ring-1 ring-sage-100 shrink-0">
          <CalendarDays size={18} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-semibold text-ink-900 tracking-[-0.005em]">
            Start a task to see your first visit.
          </div>
          <div className="text-[12.5px] text-ink-500 mt-1 leading-relaxed">
            The AI handles the back-and-forth with the contractor, then proposes time slots and confirms with both sides.
          </div>
        </div>
        <button
          onClick={() => onNavigate?.('intake')}
          className="group h-11 px-4 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-2 text-[12.5px] font-semibold transition-all shrink-0"
        >
          Start your first task
          <ArrowRight
            size={13}
            className="opacity-60 group-hover:translate-x-0.5 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Populated state — depends on whether the user has approved
// ──────────────────────────────────────────────────────────
function PopulatedSchedule({ onNavigate, decisionHandled }) {
  const visit = decisionHandled
    ? {
        when: 'Friday · April 25 · 2:00 PM',
        durationLabel: '2-hour window',
        title: 'Kitchen sink leak & drip repair',
        contractor: 'Jason Plumbing Co.',
        location: '124 Maple St · main bathroom',
        statusPill: { tone: 'sage', label: 'Confirmed', icon: CheckCircle2 },
        note: "Jason will text you 30 min before arrival. Reminder set.",
      }
    : {
        when: 'Friday · April 25 · 2:00 PM (proposed)',
        durationLabel: '2-hour window',
        title: 'Kitchen sink leak & drip repair',
        contractor: 'Jason Plumbing Co.',
        location: '124 Maple St · main bathroom',
        statusPill: { tone: 'ember', label: 'Pending your approval', icon: AlertCircle },
        note: 'Approve on the quote comparison to lock in this slot.',
      };

  const eyebrow = decisionHandled
    ? 'Schedule · 1 confirmed'
    : 'Schedule · 1 pending';

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow={eyebrow}
        title="What's on the calendar."
        trailing={
          <Pill tone={decisionHandled ? 'sage' : 'ember'} live={decisionHandled}>
            {decisionHandled ? 'Booked' : 'Awaiting'}
          </Pill>
        }
      />

      {/* Week strip */}
      <section className="rounded-3xl bg-white border border-ink-100/80 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100">
              <CalendarDays size={14} strokeWidth={1.8} />
            </span>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold text-ink-900">
                Week of April 21
              </div>
              <div className="text-[11.5px] text-ink-500">
                {decisionHandled ? '1 confirmed visit · Friday' : '1 visit awaiting approval · Friday'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all">
              <ChevronLeft size={13} />
            </button>
            <button className="h-8 px-3 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 text-[11.5px] font-medium text-ink-700 transition-all">
              Today
            </button>
            <button className="h-8 w-8 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all">
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {week.map((d) => (
            <div
              key={d.day}
              className={`relative rounded-2xl py-3 px-2 text-center border transition-all ${
                d.today
                  ? 'bg-ink-900 text-canvas-soft border-ink-900'
                  : 'bg-white border-ink-100'
              }`}
            >
              <div
                className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${
                  d.today
                    ? 'text-canvas-soft/60'
                    : d.dim
                      ? 'text-ink-300'
                      : 'text-ink-500'
                }`}
              >
                {d.day}
              </div>
              <div
                className={`mt-0.5 editorial text-[20px] leading-none tabular-nums ${
                  d.today
                    ? 'text-canvas-soft'
                    : d.dim
                      ? 'text-ink-300'
                      : 'text-ink-900'
                }`}
              >
                {d.date}
              </div>
              {d.marked && (
                <div className="mt-1.5 flex items-center justify-center">
                  <span
                    className={`h-1 w-1 rounded-full ${
                      decisionHandled ? 'bg-sage-500' : 'bg-ember-300'
                    }`}
                  />
                </div>
              )}
              {d.today && (
                <div className="mt-1.5 flex items-center justify-center">
                  <span className="text-[8.5px] uppercase tracking-[0.14em] text-canvas-soft/60 font-bold">
                    Today
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming visits */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="h-px w-6 bg-ink-300" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-medium">
            Upcoming
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white border border-ink-100/80 p-5 md:p-6"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
              <Wrench size={17} strokeWidth={1.8} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  {visit.when}
                </span>
                <Pill tone={visit.statusPill.tone} icon={visit.statusPill.icon}>
                  {visit.statusPill.label}
                </Pill>
              </div>
              <h3 className="text-[16px] font-medium text-ink-900 tracking-[-0.020em]">
                {visit.title}
              </h3>
              <div className="mt-1.5 flex items-center gap-3 flex-wrap text-[12.5px] text-ink-500">
                <span className="inline-flex items-center gap-1.5">
                  <Wrench size={11} strokeWidth={1.8} />
                  {visit.contractor}
                </span>
                <span className="text-ink-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={11} strokeWidth={1.8} />
                  {visit.durationLabel}
                </span>
                <span className="text-ink-300">·</span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={11} strokeWidth={1.8} />
                  {visit.location}
                </span>
              </div>

              {/* Status note */}
              <div className="mt-4 rounded-2xl bg-canvas-soft border border-ink-100 px-3.5 py-2.5 flex items-start gap-2">
                {decisionHandled ? (
                  <Bell size={12} className="text-sage-600 mt-0.5 shrink-0" strokeWidth={1.8} />
                ) : (
                  <AlertCircle size={12} className="text-ember-500 mt-0.5 shrink-0" strokeWidth={2} />
                )}
                <span className="text-[12px] text-ink-700 leading-snug">
                  {visit.note}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                {decisionHandled ? (
                  <>
                    <button className="h-9 px-3.5 rounded-xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12px] font-medium transition-all">
                      Reschedule
                    </button>
                    <button className="h-9 px-3.5 rounded-xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12px] font-medium transition-all">
                      Message Jason
                    </button>
                    <button className="h-9 px-3.5 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-canvas-soft inline-flex items-center gap-1.5 text-[12px] font-medium transition-all">
                      Cancel visit
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onNavigate?.('quote-compare')}
                    className="group h-10 pl-4 pr-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-2 text-[12.5px] font-semibold transition-all"
                  >
                    Approve on quote page
                    <ArrowRight
                      size={13}
                      className="opacity-60 group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quiet placeholder for future visits */}
        <div className="rounded-3xl border border-dashed border-ink-200 bg-canvas-soft/30 px-5 py-6 text-center">
          <div className="text-[12.5px] text-ink-500">
            Nothing else on the calendar.{' '}
            <button
              onClick={() => onNavigate?.('intake')}
              className="text-ink-900 font-semibold hover:underline"
            >
              Start another task
            </button>{' '}
            and Homewise will book it for you.
          </div>
        </div>
      </section>
    </div>
  );
}
