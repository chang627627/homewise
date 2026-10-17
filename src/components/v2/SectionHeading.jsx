import React from 'react';

export default function SectionHeading({ title, meta, id, className = '' }) {
  return (
    <div className={`mb-4 flex items-baseline justify-between gap-4 border-b border-line pb-2 ${className}`}>
      <h2 id={id} className="text-heading text-ink-900">{title}</h2>
      {meta && <span className="text-meta tabular-nums text-ink-500">{meta}</span>}
    </div>
  );
}
