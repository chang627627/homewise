import React from 'react';
import { motion } from 'framer-motion';

export default function Confidence({ value = 0, label = 'Confidence', size = 'md' }) {
  const pct = Math.max(0, Math.min(100, value));
  const tone =
    pct >= 85 ? 'text-sage-600' : pct >= 65 ? 'text-ember-400' : 'text-ink-500';
  const bar =
    pct >= 85 ? 'bg-sage-400' : pct >= 65 ? 'bg-ember-300' : 'bg-ink-300';
  const isLarge = size === 'lg';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-ink-500">
          {label}
        </span>
        <span className={`text-[12px] font-semibold tabular-nums ${tone}`}>
          {pct}%
        </span>
      </div>
      <div
        className={`relative w-full ${isLarge ? 'h-2' : 'h-1.5'} rounded-full bg-ink-100/80 overflow-hidden`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className={`h-full rounded-full ${bar} relative`}
        >
          <span className="absolute inset-0 shimmer-bg animate-shimmer rounded-full opacity-60" />
        </motion.div>
      </div>
    </div>
  );
}
