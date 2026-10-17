import React from 'react';
import Tooltip from './Tooltip';

export default function IconButton({ icon: Icon, label, size = 'md', side = 'bottom', onClick, className = '', ...rest }) {
  return (
    <Tooltip label={label} side={side}>
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        {...rest}
        className={`inline-flex ${size === 'sm' ? 'h-7 w-7' : 'h-8 w-8'} shrink-0 items-center justify-center rounded-md text-ink-500
          transition-colors duration-150 hover:bg-shade-1 hover:text-ink-900
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25
          disabled:opacity-40 disabled:pointer-events-none ${className}`}
      >
        <Icon size={16} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </Tooltip>
  );
}
