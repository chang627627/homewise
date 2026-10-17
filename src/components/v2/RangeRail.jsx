import React, { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BENCHMARK, CONTRACTORS, benchmarkRange, fmtUsd } from '../../data/demo';
import Evidence from './Evidence';
import { fade } from './motion';

// Scale: every quote and the local band, padded out to whole $10 steps
// ($150 to $420 for the demo data).
const values = [BENCHMARK.low, BENCHMARK.high, ...CONTRACTORS.map((c) => c.quote.total)];
const MIN = Math.floor((Math.min(...values) - 25) / 10) * 10;
const MAX = Math.ceil((Math.max(...values) + 30) / 10) * 10;
const at = (v) => `${((v - MIN) / (MAX - MIN)) * 100}%`;
const span = (a, b) => `${((b - a) / (MAX - MIN)) * 100}%`;
const LABEL_GAP = 12;

const toHas = (c) => (c instanceof Set ? (x) => c.has(x) : Array.isArray(c) ? (x) => c.includes(x) : () => false);

// Spreads tick labels so none overlap or leave the rail: centered under the
// tick when there is room, nudged apart (then clamped) when there is not.
function layout(width, items) {
  const placed = items
    .map((it) => ({ ...it, left: (it.ratio * width) - it.w / 2 }))
    .sort((a, b) => a.left - b.left);
  for (let i = 0; i < placed.length; i += 1) {
    const min = i === 0 ? 0 : placed[i - 1].left + placed[i - 1].w + LABEL_GAP;
    placed[i].left = Math.max(placed[i].left, min);
  }
  for (let i = placed.length - 1; i >= 0; i -= 1) {
    const max = i === placed.length - 1 ? width - placed[i].w : placed[i + 1].left - LABEL_GAP - placed[i].w;
    placed[i].left = Math.max(0, Math.min(placed[i].left, max));
  }
  return Object.fromEntries(placed.map((p) => [p.id, p.left]));
}

// `arrived`: Set or array of contractor ids whose quote is in. Only those get
// a tick. The pick's tick is sage; there is no ember on the rail.
export default function RangeRail({ arrived, className = 'mt-6' }) {
  const has = toHas(arrived);
  const quotes = CONTRACTORS.filter((c) => has(c.id)).map((c) => ({
    id: c.id,
    isPick: c.aiPick,
    total: c.quote.total,
    text: `${c.short} ${fmtUsd(c.quote.total)}`,
  }));
  const root = useRef(null);
  const labels = useRef({});
  const [lefts, setLefts] = useState({});
  const key = quotes.map((q) => q.id).join();

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const run = () => {
      const width = el.clientWidth;
      const items = quotes
        .filter((q) => labels.current[q.id])
        .map((q) => ({ id: q.id, w: labels.current[q.id].offsetWidth, ratio: (q.total - MIN) / (MAX - MIN) }));
      setLefts(layout(width, items));
    };
    run();
    // Labels are observed too: a web-font swap changes their widths without
    // resizing the rail.
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(run) : null;
    ro?.observe(el);
    Object.values(labels.current).forEach((n) => n && ro?.observe(n));
    return () => ro?.disconnect();
    // Keyed on the arrived set: labels only need re-measuring when it changes.
  }, [key]);

  const summary = [`Local range ${benchmarkRange()}`, ...quotes.map((q) => q.text)].join('. ');

  return (
    <Evidence id="range" role="img" aria-label={summary} className={`relative h-14 ${className}`}>
      <div ref={root} aria-hidden="true" className="absolute inset-0">
        <span className="absolute top-0 whitespace-nowrap text-meta tabular-nums text-ink-500" style={{ left: at(BENCHMARK.low) }}>
          Local range {benchmarkRange()}
        </span>
        <div className="absolute inset-x-0 top-[27px] h-px bg-line" />
        <div className="absolute top-6 h-2 rounded-full bg-shade-2" style={{ left: at(BENCHMARK.low), width: span(BENCHMARK.low, BENCHMARK.high) }} />
        {/* initial={false}: ticks already in when the tab mounts render without
            a fade; only later arrivals fade in. */}
        <AnimatePresence initial={false}>
          {quotes.map((q) => (
            <motion.div key={q.id} {...fade}>
              <span
                className={`absolute top-5 h-4 w-0.5 -translate-x-1/2 rounded-full ${q.isPick ? 'bg-sage-500' : 'bg-ink-500'}`}
                style={{ left: at(q.total) }}
              />
              <span
                ref={(n) => {
                  labels.current[q.id] = n;
                }}
                className="absolute top-10 whitespace-nowrap text-meta tabular-nums text-ink-700"
                style={lefts[q.id] != null ? { left: lefts[q.id] } : { left: at(q.total), transform: 'translateX(-50%)' }}
              >
                {q.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Evidence>
  );
}
