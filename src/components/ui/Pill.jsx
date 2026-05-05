import React from 'react';

const tones = {
  neutral: 'bg-ink-100/80 text-ink-700 ring-ink-200',
  sage: 'bg-sage-50 text-sage-600 ring-sage-100',
  ember: 'bg-ember-50 text-ember-500 ring-ember-100',
  sky: 'bg-sky2026-50 text-sky2026-700 ring-sky2026-100',
  live: 'bg-sage-50 text-sage-600 ring-sage-100',
  soft: 'bg-white/70 text-ink-700 ring-ink-100',
};

export default function Pill({
  children,
  tone = 'neutral',
  icon: Icon,
  live = false,
  className = '',
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide ring-1 ${tones[tone]} ${className}`}
    >
      {live && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-sage-400 animate-pulseDot" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-500" />
        </span>
      )}
      {Icon && <Icon size={12} strokeWidth={2} />}
      <span>{children}</span>
    </span>
  );
}
