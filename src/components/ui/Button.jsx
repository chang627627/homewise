import React from 'react';

const variants = {
  primary:
    'bg-ink-900 text-canvas-soft hover:bg-ink-700 ring-1 ring-ink-900/5',
  secondary:
    'bg-white text-ink-900 ring-1 ring-ink-200/70 hover:ring-ink-300 hover:bg-canvas-soft',
  ghost: 'text-ink-700 hover:bg-ink-100/60',
  sage: 'bg-sage-500 text-white hover:bg-sage-600 ring-1 ring-sage-500/10',
  soft: 'bg-ink-100/60 text-ink-900 hover:bg-ink-100 ring-1 ring-ink-100',
  outline:
    'bg-transparent text-ink-900 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-white',
};

const sizes = {
  sm: 'h-8 px-3 text-[12.5px] rounded-xl',
  md: 'h-10 px-4 text-[13.5px] rounded-2xl',
  lg: 'h-12 px-5 text-[14px] rounded-2xl',
};

export default function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  className = '',
  ...rest
}) {
  // Hero CTA (variant="hero") — the large dark "advance the flow" button used on
  // the empty Overview and at the foot of focused-flow pages (Scope, Contractor
  // Compare, Quote Tracking, Onboarding). The trailing icon rides in a rounded
  // inset chip and the surface carries the dark-craft texture. Sizing is
  // self-contained so it never collides with the size scale above; pass no
  // `size`. Optional leading `icon` and a disabled state are both supported.
  if (variant === 'hero') {
    return (
      <button
        className={`group inline-flex items-center justify-center gap-2.5 h-12 pl-5 pr-3 rounded-2xl text-[13.5px] font-semibold tracking-[-0.005em] bg-ink-900 text-canvas-soft hover:bg-ink-700 hairline-on-dark grain-dark transition-all duration-200 active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none ${className}`}
        {...rest}
      >
        {Icon && <Icon size={14} strokeWidth={2} />}
        {children}
        {IconRight && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft/15 group-hover:bg-canvas-soft/25 transition-colors">
            <IconRight size={14} strokeWidth={2.2} />
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-medium tracking-[-0.005em] transition-all duration-200 active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {Icon && <Icon size={16} strokeWidth={1.8} />}
      {children}
      {IconRight && <IconRight size={16} strokeWidth={1.8} />}
    </button>
  );
}
