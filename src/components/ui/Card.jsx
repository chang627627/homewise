import React from 'react';

export default function Card({
  as: Tag = 'div',
  className = '',
  variant = 'default',
  children,
  ...rest
}) {
  const base =
    'relative rounded-3xl border border-ink-100/70 bg-white/80 backdrop-blur-[2px]';
  const variants = {
    default: '',
    quiet: 'bg-canvas-soft/70 border-ink-100/60',
    glass: 'glass hairline',
    raised: '',
    flat: 'bg-white border-ink-100/80',
  };
  return (
    <Tag className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
