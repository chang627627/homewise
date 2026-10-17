import React from 'react';

const base = 'inline-flex items-center justify-center rounded-lg text-ui font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-40 disabled:pointer-events-none';
const sizes = { md: 'h-9 px-3.5', sm: 'h-8 px-3' };
const variants = {
  primary: 'bg-ink-900 text-white hover:bg-ink-700',
  secondary: 'bg-shade-2 text-ink-900 hover:bg-shade-3',
  ghost: 'text-ink-700 hover:bg-shade-1 hover:text-ink-900',
};

// Text only: no icon props. At most one primary is visible per screen.
export default function Button({ variant = 'primary', size = 'md', full = false, as = 'button', disabled = false, className = '', children, ...rest }) {
  const cls = `${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${full ? 'w-full' : ''} ${className}`;
  if (as === 'a') {
    const { href, ...anchor } = rest;
    return (
      <a
        {...anchor}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        className={`${cls} ${disabled ? 'pointer-events-none opacity-40' : ''}`}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" disabled={disabled} {...rest} className={cls}>
      {children}
    </button>
  );
}
