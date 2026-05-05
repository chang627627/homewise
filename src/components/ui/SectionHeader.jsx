import React from 'react';

export default function SectionHeader({
  eyebrow,
  title,
  description,
  trailing,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col gap-3 md:flex-row md:items-end md:justify-between ${className}`}
    >
      <div className="space-y-1.5 max-w-2xl">
        {eyebrow && (
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-ink-300" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink-500 font-medium">
              {eyebrow}
            </span>
          </div>
        )}
        <h2 className="editorial text-3xl md:text-[34px] leading-tight text-ink-900">
          {title}
        </h2>
        {description && (
          <p className="text-[14px] text-ink-500 leading-relaxed">{description}</p>
        )}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
