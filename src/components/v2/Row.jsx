import React from 'react';
import Tooltip from './Tooltip';

export default function Row({ lead, title, meta, selected, muted, collapsed, tooltip, preview, onClick, ...rest }) {
  const row = (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      aria-label={collapsed && typeof title === 'string' ? title : undefined}
      {...rest}
      className={`group flex h-8 w-full items-center gap-2 rounded-md text-left text-ui font-medium text-ink-900
        transition-colors duration-150 hover:bg-shade-1 aria-[current=true]:bg-shade-2
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25
        ${preview && !selected ? 'bg-shade-1' : ''} ${collapsed ? 'justify-center px-0' : 'px-2'}`}
    >
      <span className="flex h-4 w-4 shrink-0 items-center justify-center text-ink-500 transition-colors duration-150 group-hover:text-ink-900 group-aria-[current=true]:text-ink-900">
        {lead}
      </span>
      {!collapsed && <span className={`min-w-0 flex-1 truncate ${muted ? 'text-ink-500' : ''}`}>{title}</span>}
      {!collapsed && meta && <span className="shrink-0 text-meta tabular-nums text-ink-500">{meta}</span>}
    </button>
  );
  return collapsed ? <Tooltip label={tooltip ?? title} side="right">{row}</Tooltip> : row;
}
