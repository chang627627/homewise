import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Evidence from '../v2/Evidence';
import SectionHeading from '../v2/SectionHeading';
import { StatusGlyph } from '../v2/Status';
import { GUTTERS_PLAN, HOME, WATCHLIST, homeJobs, homeSystems } from '../../data/demo';

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25';
// Below sm the detail moves under the system name, so three columns never squeeze.
const SYSTEM_COLS = 'grid grid-cols-[minmax(0,1fr)_auto] gap-4 sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1.5fr)_136px]';

// The first frame of the demo: the jobs on the house, what it needs next and
// what it is built from. Everything here is the home file; nothing is a
// banner, and deliberately no photo of the house. Watchlist rows are sorted
// by next due (demo.js), the repeat interval lives in the detail.
export default function HomeView({
  guttersPlanned = false,
  tasks = [],
  unlocked,
  gates = {},
  booking = null,
  quotesIn,
  onSelectTask,
}) {
  const jobs = homeJobs({ tasks, unlocked, gates, booking, quotesIn });
  const systems = homeSystems({ gates, booking });

  return (
    <div className="mx-auto w-full max-w-[720px] pb-16">
      <h1 className="text-title text-balance text-ink-900">{HOME.name}</h1>
      <p className="mt-1 text-meta tabular-nums text-ink-500">{HOME.factsLine}</p>

      {jobs.length > 0 && (
        <section className="mt-8" aria-labelledby="jobs-title">
          <SectionHeading id="jobs-title" title="Jobs" />
          <ul>
            {jobs.map((j) => (
              <li key={j.id}>
                {/* Ruled like the Watchlist and Systems rows. Below sm the meta
                    takes its own line under the title, so neither is cut. */}
                <button
                  type="button"
                  onClick={() => onSelectTask?.(j.id)}
                  className={`group grid min-h-11 w-full grid-cols-[14px_minmax(0,1fr)] items-center gap-x-2.5 gap-y-0.5 border-b border-line py-2.5 text-left
                    transition-colors duration-150 hover:bg-shade-1 ${FOCUS} focus-visible:ring-inset
                    sm:h-11 sm:grid-cols-[14px_minmax(0,1fr)_auto] sm:py-0`}
                >
                  <StatusGlyph state={j.state} progress={j.progress} />
                  <span className={`truncate text-ui font-medium ${j.muted ? 'text-ink-500' : 'text-ink-900'}`}>{j.title}</span>
                  <span className="col-start-2 truncate text-meta tabular-nums text-ink-500 transition-colors duration-150 group-hover:text-ink-700 sm:col-start-3 sm:max-w-[420px] sm:text-right sm:text-ui">
                    {j.meta}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Watchlist guttersPlanned={guttersPlanned} className={jobs.length > 0 ? 'mt-10' : 'mt-8'} />

      <section className="mt-10" aria-labelledby="systems-title">
        <SectionHeading id="systems-title" title="Systems" meta="From your home profile" />
        <div role="table" aria-label="Systems">
          <div role="row" className="sr-only">
            <span role="columnheader">System</span>
            <span role="columnheader">Details</span>
            <span role="columnheader">Latest work</span>
          </div>
          {systems.map((s) => (
            <div role="row" key={s.id} className={`${SYSTEM_COLS} min-h-11 items-baseline border-b border-line py-3 text-ui`}>
              <div role="cell" className="min-w-0">
                <div className="font-medium text-ink-900">{s.name}</div>
                <div className="mt-0.5 text-meta tabular-nums text-ink-500 sm:hidden">{s.detail}</div>
              </div>
              <div role="cell" className="hidden min-w-0 text-pretty tabular-nums text-ink-700 sm:block">{s.detail}</div>
              <div role="cell" className="whitespace-nowrap text-right tabular-nums text-ink-500">{s.meta}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Watchlist({ guttersPlanned, className }) {
  const [open, setOpen] = useState(() => new Set());
  const toggle = (id) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className={className} aria-labelledby="watchlist-title">
      <SectionHeading id="watchlist-title" title="Watchlist" meta="From your home profile" />
      <div>
        {WATCHLIST.map((w) => {
          const isOpen = open.has(w.id);
          const planned = guttersPlanned && w.id === 'gutters';
          return (
            <Evidence key={w.id} id={`watch:${w.id}`} as="div">
              {/* An open row drops its rule, so the detail reads as part of it. */}
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`watch-${w.id}`}
                onClick={() => toggle(w.id)}
                className={`group grid h-11 w-full grid-cols-[minmax(0,1fr)_auto_14px] items-center gap-4 text-left
                  ${FOCUS} focus-visible:ring-inset
                  sm:grid-cols-[minmax(0,1fr)_176px_150px_14px] ${isOpen ? '' : 'border-b border-line'}`}
              >
                <span className="truncate text-ui font-medium text-ink-900">{w.title}</span>
                <span className={`text-ui ${planned ? 'font-medium text-sky2026-700' : 'text-ink-700'}`}>
                  {planned ? GUTTERS_PLAN.watch : w.when}
                </span>
                <span className="hidden truncate text-right text-meta text-ink-500 sm:block">{w.from}</span>
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={`text-ink-300 transition-[color,transform] duration-200 group-hover:text-ink-500 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <p id={`watch-${w.id}`} className="max-w-[64ch] border-b border-line pb-3 pt-1 text-ui leading-[22px] text-pretty text-ink-700">
                  {w.detail}
                </p>
              )}
            </Evidence>
          );
        })}
      </div>
    </section>
  );
}
