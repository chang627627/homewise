import React from 'react';

export default function PageHeader({ eyebrow, title, description, trailing }) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-2">
          <span className="h-px w-6 bg-ink-300" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-medium">
            {eyebrow}
          </span>
        </div>
        {trailing && <div className="hidden md:flex items-center gap-2">{trailing}</div>}
      </div>
      <h1 className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900 tracking-tight max-w-2xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 text-[14px] text-ink-500 max-w-xl leading-relaxed">
          {description}
        </p>
      )}
    </section>
  );
}
