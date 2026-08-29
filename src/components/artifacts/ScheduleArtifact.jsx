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
        <h1 className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900 tracking-tight">
          What's on the calendar.
        </h1>
        <p className="mt-2 text-[13.5px] text-ink-500 max-w-xl leading-relaxed">
          {jobCompleted
            ? "Jason's visit is done and the job is closed out. Homewise will keep an eye out for any follow-ups."
            : 'Jason is booked. Homewise will check in once the visit is done, and re-engage your backup if anything changes.'}
        </p>
      </header>

      {/* Week strip */}
      <section className="rounded-3xl bg-white border border-ink-100/80 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100">
              <CalendarDays size={14} strokeWidth={1.8} />
            </span>
            <div className="leading-tight">
              <div className="text-[12.5px] font-semibold text-ink-900">Week of April 21</div>
              <div className="text-[11.5px] text-ink-500">{jobCompleted ? '1 completed visit · Friday' : '1 confirmed visit · Friday'}</div>
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
                d.today ? 'bg-ink-900 text-canvas-soft border-ink-900' : 'bg-white border-ink-100'
              }`}
            >
              <div
                className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${
                  d.today ? 'text-canvas-soft/60' : d.dim ? 'text-ink-300' : 'text-ink-500'
                }`}
              >
                {d.day}
              </div>
              <div
                className={`editorial text-[17px] mt-1 tabular-nums ${
                  d.today ? 'text-canvas-soft' : d.dim ? 'text-ink-300' : 'text-ink-900'
                }`}
              >
                {d.date}
              </div>
              {d.marked && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-sage-500 ring-2 ring-sage-100" />
              )}
              {d.today && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-[0.12em] text-canvas-soft/60 font-semibold">
                  Now
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Visit card */}
      <section className="rounded-3xl bg-white border border-ink-100/80 p-5">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3 min-w-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
              <Clock size={16} strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold text-ink-900 tracking-[-0.005em]">
                Kitchen sink leak &amp; drip repair
              </div>
              <div className="mt-1 text-[12.5px] text-ink-700">
                Friday · April 25 · {slot.replace(/^\S+\s/, '')} · 2-hour window
              </div>
              <div className="mt-1 flex items-center gap-3 text-[11.5px] text-ink-500">
                <span className="inline-flex items-center gap-1">
                  <span className="editorial text-[12px] text-ink-700">Jason Plumbing Co.</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin size={10} strokeWidth={2} />
                  124 Maple St · kitchen
                </span>
              </div>
            </div>
          </div>
          <Pill tone="sage" icon={CheckCircle2} live={!jobCompleted}>
            {jobCompleted ? 'Completed' : 'Confirmed · Booked'}
          </Pill>
        </div>
        <div className="mt-4 rounded-2xl bg-canvas-soft border border-ink-100 px-3.5 py-2.5 text-[12px] text-ink-700 leading-relaxed">
          {jobCompleted
            ? 'Visit complete. Jason closed out the job and your recommendation is logged.'
            : 'Jason will text you 30 min before arrival. Free to reschedule or cancel until Thursday 6 PM.'}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button className="h-9 px-3 rounded-xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12px] font-medium transition-all">
            <RefreshCw size={12} strokeWidth={1.8} />
            Reschedule
          </button>
          <button className="h-9 px-3 rounded-xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12px] font-medium transition-all">
            <Phone size={12} strokeWidth={1.8} />
            Message Jason
          </button>
          <button className="h-9 px-3 rounded-xl bg-white text-ink-500 ring-1 ring-ink-100 hover:ring-ink-200 inline-flex items-center gap-1.5 text-[12px] font-medium transition-all">
            <X size={12} strokeWidth={1.8} />
            Cancel visit
          </button>
        </div>
      </section>
    </div>
  );
}
