import React from 'react';

const widths = {
  xs: 'w-3',     // 12px — paired with micro-cap labels
  sm: 'w-6',     // 24px — paired with eyebrow text (matches existing PageHeader pattern)
  md: 'w-12',    // 48px — section dividers, standalone
  lg: 'w-24',    // 96px — page-level dividers
  full: 'w-full',
};

const tones = {
  default: 'bg-ink-200',
  strong: 'bg-ink-300',
  soft: 'bg-ink-100',
  trust: 'bg-sage-300',  // completed / sage-context dividers
};

export default function Rule({
  width = 'sm',
  tone = 'default',
  eyebrow,
  className = '',
}) {
  const line = (
    <span className={`block h-px ${widths[width]} ${tones[tone]} ${className}`} />
  );

  if (!eyebrow) return line;

  return (
    <div className="flex items-center gap-2">
      {line}
      <span className="text-[11px] uppercase tracking-[0.20em] text-ink-500 font-medium">
        {eyebrow}
      </span>
    </div>
  );
}
