import React from 'react';
import {
  CalendarDays,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Phone,
  RefreshCw,
  X,
} from 'lucide-react';
import Button from '../ui/Button';
import Pill from '../ui/Pill';

const week = [
  { day: 'Mon', date: 21, dim: true },
  { day: 'Tue', date: 22, dim: true },
  { day: 'Wed', date: 23, today: true },
  { day: 'Thu', date: 24 },
  { day: 'Fri', date: 25, marked: true },
  { day: 'Sat', date: 26 },
  { day: 'Sun', date: 27 },
];

export default function ScheduleArtifact({ scheduledSlot, jobCompleted }) {
  const slot = scheduledSlot || 'Fri 2 PM';
  return (
    <div className="space-y-6">
      <header>
        <h1 className="editorial editorial-m text-[24px] md:text-[30px] leading-[1.1] text-ink-900">
          What's on the calendar.
        </h1>
        <p className="mt-2 text-[14px] text-ink-500 max-w-xl leading-[1.55]">
          {jobCompleted
            ? "Jason's visit is done and the job is closed out. Homewise will keep an eye out for any follow-ups."
            : 'Jason is booked. Homewise will check in once the visit is done, and re-engage your backup if anything changes.'}
        </p>
      </header>

      {/* Week strip */}
      <section className="rounded-3xl bg-white border border-ink-100/80 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100">
              <CalendarDays size={14} strokeWidth={1.8} />
            </span>
            <div>
              <div className="text-[15px] font-medium leading-[1.3] text-ink-900">Week of April 21</div>
              <div className="text-[12px] text-ink-500">{jobCompleted ? '1 completed visit · Friday' : '1 confirmed visit · Friday'}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="h-8 w-8 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all">
              <ChevronLeft size={14} strokeWidth={1.8} />
            </button>
            <button className="h-8 px-3 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 text-[12px] font-medium text-ink-700 transition-all">
              Today
            </button>
            <button className="h-8 w-8 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all">
              <ChevronRight size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
        {/* Day tiles group by fill, not border (the card already owns the
            stroke). Today is a ring marker, not a dark fill: the stage's only
            ink-900 fill is the decision CTA. */}
        <div className="grid grid-cols-7 gap-2">
          {week.map((d) => (
            <div
              key={d.day}
              aria-current={d.today ? 'date' : undefined}
              className={`relative rounded-2xl py-3 px-2 text-center transition-all ${
                d.today ? 'bg-white ring-1 ring-ink-900 text-ink-900' : 'bg-canvas-soft'
              }`}
            >
              <div
                className={`text-[10.5px] uppercase tracking-[0.18em] font-semibold ${
                  d.today ? 'text-ink-900' : d.dim ? 'text-ink-300' : 'text-ink-500'
                }`}
              >
                {d.day}
              </div>
              <div
                className={`editorial editorial-xs text-[17px] leading-[1.25] mt-1 tabular-nums ${
                  d.dim ? 'text-ink-300' : 'text-ink-900'
                }`}
              >
                {d.date}
              </div>
              {d.marked && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-sage-500 ring-2 ring-sage-100" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Visit card */}
      <section className="rounded-3xl bg-white border border-ink-100/80 p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0">
              <Clock size={16} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <div className="text-[15px] font-medium leading-[1.3] text-ink-900">
                Kitchen sink leak &amp; drip repair
              </div>
              <div className="mt-1 text-[12.5px] leading-[1.5] text-ink-700">
                Friday · April 25 · {slot.replace(/^\S+\s/, '')} · 2-hour window
              </div>
              <div className="mt-1 flex items-center gap-3 text-[12px] text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <span className="font-medium text-ink-700">Jason Plumbing Co.</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={12} strokeWidth={2} />
                  124 Maple St · kitchen
                </span>
              </div>
            </div>
          </div>
          <Pill tone="sage" icon={CheckCircle2} live={!jobCompleted}>
            {jobCompleted ? 'Completed' : 'Confirmed · Booked'}
          </Pill>
        </div>
        <div className="mt-4 rounded-2xl bg-canvas-soft px-3.5 py-2.5 text-[12.5px] text-ink-700 leading-[1.5]">
          {jobCompleted
            ? 'Visit complete. Jason closed out the job and your recommendation is logged.'
            : 'Jason will text you 30 min before arrival. Free to reschedule or cancel until Thursday 6 PM.'}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCw}>
            Reschedule
          </Button>
          <Button variant="secondary" size="sm" icon={Phone}>
            Call Jason
          </Button>
          <Button variant="ghost" size="sm" icon={X}>
            Cancel visit
          </Button>
        </div>
      </section>
    </div>
  );
}
