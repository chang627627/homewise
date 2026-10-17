import React from 'react';
import Evidence from '../../v2/Evidence';
import { StatusText } from '../../v2/Status';

export function DocTitle({ children }) {
  return <h1 className="text-title text-balance text-ink-900">{children}</h1>;
}

// status: { state, label }. With `evidence` the whole line is that target.
export function StatusLine({ status, sentence, evidence }) {
  const cls = 'mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1';
  const body = (
    <>
      <StatusText state={status.state}>{status.label}</StatusText>
      {sentence && <span className="text-ui tabular-nums text-pretty text-ink-500">{sentence}</span>}
    </>
  );
  return evidence ? (
    <Evidence id={evidence} className={cls}>
      {body}
    </Evidence>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export function FactsLine({ children }) {
  return <p className="mt-1 text-meta tabular-nums text-ink-500">{children}</p>;
}

export const TextButton = React.forwardRef(function TextButton({ size = 'ui', muted = false, className = '', children, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      className={`rounded-md ${size === 'meta' ? 'text-meta' : 'text-ui'} font-medium ${muted ? 'text-ink-500' : 'text-ink-700'}
        underline-offset-4 transition-colors duration-150 hover:text-ink-900 hover:underline
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 ${className}`}
    >
      {children}
    </button>
  );
});

// Shown only if a booking-driven tab renders without a valid booking.
export function NotBooked({ title }) {
  return (
    <div className="mx-auto w-full max-w-[720px] pb-16">
      <DocTitle>{title}</DocTitle>
      <StatusLine status={{ state: 'idle', label: 'Nothing booked' }} />
    </div>
  );
}

export const includes = (collection, id) =>
  collection instanceof Set ? collection.has(id) : Array.isArray(collection) ? collection.includes(id) : false;
