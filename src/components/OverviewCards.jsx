import React from 'react';
import { motion } from 'framer-motion';
import { Bot, CircleCheck, FileBarChart2, FolderArchive, ArrowUpRight } from 'lucide-react';

const items = [
  {
    label: 'AI is handling',
    value: '1',
    unit: 'task',
    delta: 'Kitchen sink leak · in motion',
    accent: 'sage',
    icon: Bot,
    spark: [2, 3, 4, 5, 6, 7, 8, 9, 10],
    target: 'tasks',
  },
  {
    label: 'Needs approval',
    value: '1',
    unit: 'decision',
    delta: 'Choose plumber · today',
    accent: 'ember',
    icon: CircleCheck,
    spark: [0, 0, 0, 1, 1, 1, 1, 1, 1],
    target: 'quote-compare',
  },
  {
    label: 'Quotes received',
    value: '3',
    unit: 'quotes',
    delta: 'Avg 12% under benchmark',
    accent: 'sky',
    icon: FileBarChart2,
    spark: [0, 0, 1, 1, 2, 2, 2, 3, 3],
    target: 'quote-compare',
  },
  {
    label: 'Contractors vetted',
    value: '3',
    unit: 'verified',
    delta: 'Licenses + insurance current',
    accent: 'neutral',
    icon: FolderArchive,
    spark: [0, 1, 1, 2, 2, 2, 3, 3, 3],
    target: 'contractor-compare',
  },
];

const accents = {
  sage: 'bg-sage-50 text-sage-600 ring-sage-100',
  ember: 'bg-ember-50 text-ember-500 ring-ember-100',
  sky: 'bg-sky2026-50 text-sky2026-700 ring-sky2026-100',
  neutral: 'bg-ink-100/70 text-ink-700 ring-ink-200',
};

const sparkStroke = {
  sage: '#738A63',
  ember: '#D9A461',
  sky: '#4E6F7A',
  neutral: '#6B6B65',
};

function Sparkline({ data, color }) {
  const w = 84;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`g-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <polygon
        fill={`url(#g-${color})`}
        points={`0,${h} ${points} ${w},${h}`}
      />
    </svg>
  );
}

export default function OverviewCards({ onNavigate, decisionHandled }) {
  const data = items.map((it) =>
    it.label === 'Needs approval' && decisionHandled
      ? { ...it, value: '0', delta: 'All clear · nothing waiting on you' }
      : it
  );
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {data.map((it, idx) => (
        <motion.button
          key={it.label}
          onClick={() => onNavigate?.(it.target)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 * idx, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-3xl bg-white border border-ink-100/80 p-5 hover: hover:border-ink-200 transition-all text-left"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${accents[it.accent]}`}
              >
                <it.icon size={15} strokeWidth={1.9} />
              </span>
              <span className="text-[11.5px] uppercase tracking-[0.16em] text-ink-500 font-medium">
                {it.label}
              </span>
            </div>
            <span className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 rounded-xl ring-1 ring-ink-100 flex items-center justify-center text-ink-500 group-hover:text-ink-900">
              <ArrowUpRight size={13} />
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="editorial text-[28px] leading-none text-ink-900 tabular-nums">
                  {it.value}
                </span>
                <span className="text-[12.5px] text-ink-500">{it.unit}</span>
              </div>
              <div className="mt-2 text-[12px] text-ink-500">{it.delta}</div>
            </div>
            <Sparkline data={it.spark} color={sparkStroke[it.accent]} />
          </div>
        </motion.button>
      ))}
    </section>
  );
}
