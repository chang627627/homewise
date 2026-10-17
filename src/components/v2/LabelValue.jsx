import React from 'react';

// Property grid. `strong` is only for "Why these three".
export default function LabelValue({ items, strong = false, className = '' }) {
  return (
    <dl className={`grid grid-cols-[112px_minmax(0,1fr)] gap-x-6 gap-y-3 ${className}`}>
      {items.map((i) => (
        <React.Fragment key={i.key ?? i.label}>
          <dt className={`text-ui ${strong ? 'font-medium text-ink-900' : 'text-ink-500'}`}>{i.label}</dt>
          <dd className="text-ui leading-[22px] text-ink-900 text-pretty">{i.value}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
