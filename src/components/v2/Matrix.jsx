import React, { useLayoutEffect, useRef, useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import Tooltip from './Tooltip';
import Evidence from './Evidence';

// One table, no container: it sits directly on the white panel. Rules are
// drawn per cell, so they break at the column gutters and never cross the
// pick panel.
export const COLS = { gridTemplateColumns: 'var(--label-col, 168px) repeat(3, minmax(0, 1fr))' };
export const GRID = 'grid gap-x-[var(--col-gap,16px)]';
const CELL_PX = 'px-[var(--cell-px,12px)]';

// Density follows the matrix's own width, not the viewport: with the Rail and
// Thread both open on a 1300px window the panel is only ~700px wide. The
// roomy label column fits the longest label ("Replace faucet cartridge",
// 159px) on one line; the narrower ones let labels wrap to two.
function densityFor(width) {
  if (!width || width >= 860) return { '--label-col': '168px', '--col-gap': '16px', '--cell-px': '12px' };
  if (width >= 680) return { '--label-col': '136px', '--col-gap': '8px', '--cell-px': '10px' };
  return { '--label-col': '120px', '--col-gap': '8px', '--cell-px': '10px' };
}

function useWidth(ref) {
  const [width, setWidth] = useState(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

// Below 1024 the label column stays put while the values scroll sideways. A
// scroll container's padding does not offset sticky elements, so the cell
// reaches back over the 16px gutter and pads its text back in.
const PINNED = 'max-lg:sticky max-lg:left-0 max-lg:z-[1] max-lg:-ml-4 max-lg:bg-white max-lg:pl-4';

// The rule under an Evidence cell is a pseudo-element: a bottom border would
// curve with the outline's radius.
const RULE_AFTER = 'relative after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-line';

export function PickPanel({ index }) {
  if (index == null || index < 0) return null;
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-x-0 -inset-y-3 ${GRID}`} style={COLS}>
      <div className="rounded-xl bg-sage-wash" style={{ gridColumn: index + 2 }} />
    </div>
  );
}

// The caller's className sits on its own wrapper: the scroller's negative
// margins below 1024 would otherwise override a caller's mt-*.
export default function Matrix({ pickIndex, label, footer, className = '', children }) {
  const ref = useRef(null);
  const width = useWidth(ref);
  return (
    <div ref={ref} className={className} style={densityFor(width)}>
      <div className="max-lg:-mx-4 max-lg:-my-3 max-lg:overflow-x-auto max-lg:px-4 max-lg:py-3">
        <div className="relative max-lg:min-w-[540px]">
          <PickPanel index={pickIndex} />
          <div role="table" aria-label={label} className={`relative ${GRID}`} style={COLS}>
            {children}
          </div>
        </div>
        {footer}
      </div>
    </div>
  );
}

export function MatrixRow({ evidence, className = '', children }) {
  if (evidence) {
    return (
      <Evidence id={evidence} role="row" className={`col-span-4 grid grid-cols-subgrid ${className}`}>
        {children}
      </Evidence>
    );
  }
  return (
    <div role="row" className={`contents ${className}`}>
      {children}
    </div>
  );
}

export function MatrixCorner({ children }) {
  return (
    <div role="columnheader" className={`flex flex-col justify-end border-b border-line pb-3 ${PINNED}`}>
      {children}
    </div>
  );
}

export function MatrixHeader({ id, name, pick = false, meta, className = '', children }) {
  return (
    <Evidence id={`col:${id}`} data-col={id} role="columnheader" className={`flex min-w-0 flex-col justify-end ${CELL_PX} pb-3 ${RULE_AFTER} ${className}`}>
      <span className="h-4 text-meta font-medium text-sage-600">{pick ? 'Homewise pick' : ''}</span>
      <span className="mt-1 line-clamp-2 text-ui font-semibold text-ink-900">{name}</span>
      {meta && <span className="mt-0.5 text-meta tabular-nums text-ink-500">{meta}</span>}
      {children}
    </Evidence>
  );
}

export function RowLabel({ label, definition, className = '', children }) {
  const text = (
    <span
      tabIndex={definition ? 0 : undefined}
      className={`min-w-0 max-w-full line-clamp-2 rounded-md text-ui leading-[18px] text-ink-500 ${definition
        ? 'underline decoration-dotted decoration-ink-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25'
        : ''}`}
    >
      {label}
    </span>
  );
  return (
    <div
      role="rowheader"
      className={`${children ? 'flex flex-col items-start gap-2 py-3' : 'flex h-11 items-center'} min-w-0 border-b border-line ${PINNED} ${className}`}
    >
      {definition ? <Tooltip label={definition} side="top">{text}</Tooltip> : text}
      {children}
    </div>
  );
}

export function ValueCell({ evidence, tall = false, className = '', children }) {
  const layout = tall ? 'flex flex-col items-start py-3' : 'flex h-11 items-center gap-1.5';
  const type = `min-w-0 ${CELL_PX} text-ui tabular-nums text-ink-900`;
  if (evidence) {
    return (
      <Evidence id={evidence} role="cell" className={`${layout} ${type} ${RULE_AFTER} ${className}`}>
        {children}
      </Evidence>
    );
  }
  return (
    <div role="cell" className={`${layout} ${type} border-b border-line ${className}`}>
      {children}
    </div>
  );
}

export function GroupLabel({ children }) {
  return (
    <div role="row" className="contents">
      <div role="rowheader" aria-colspan={4} className="col-span-4 pb-2 pt-6 text-meta font-medium text-ink-500">
        <span className="inline-block max-lg:sticky max-lg:left-4">{children}</span>
      </div>
    </div>
  );
}

export function Included({ label = 'Included', children }) {
  return (
    <>
      <Check size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0 text-ink-500" />
      {children ? <span className="min-w-0 truncate text-ink-700">{children}</span> : <span className="sr-only">{label}</span>}
    </>
  );
}

export function Absent({ label = 'None', children }) {
  if (children) return <span className="min-w-0 truncate text-ink-500">{children}</span>;
  return (
    <>
      <span aria-hidden="true" className="text-ink-300">–</span>
      <span className="sr-only">{label}</span>
    </>
  );
}

// The single evidence cell for an ember fact.
export function Exception({ evidence, children }) {
  const cls = '-mx-1.5 inline-flex h-7 min-w-0 items-center gap-1.5 rounded-md bg-ember-wash px-1.5 font-medium text-ember-500';
  const body = (
    <>
      <AlertTriangle size={14} strokeWidth={1.5} aria-hidden="true" className="shrink-0" />
      <span className="truncate">{children}</span>
    </>
  );
  if (evidence) return <Evidence as="span" id={evidence} className={cls}>{body}</Evidence>;
  return <span className={cls}>{body}</span>;
}

export function Outlier({ children }) {
  return <span className="font-medium text-ember-500">{children}</span>;
}

// Quotes Book row. A direct child of the Matrix wrapper (pass it as `footer`),
// so it can stick to the bottom of the Stage while the matrix is in view.
export function MatrixFooter({ label, children }) {
  return (
    <div className={`sticky bottom-0 z-10 mt-6 h-16 items-center border-t border-line bg-white max-lg:static max-lg:min-w-[540px] ${GRID}`} style={COLS}>
      <span className={`flex h-full items-center text-meta text-ink-500 ${PINNED}`}>{label}</span>
      {children}
    </div>
  );
}
