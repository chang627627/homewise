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
