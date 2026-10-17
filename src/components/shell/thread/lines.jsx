import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ChevronDown } from 'lucide-react';
import Photo from '../../v2/Photo';
import { StatusGlyph } from '../../v2/Status';
import Tooltip from '../../v2/Tooltip';
import { useEvidence } from '../../v2/Evidence';
import { collapse, dur, ease } from '../../v2/motion';
import { PLAN } from '../../../data/demo';

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25';
// Receipts sit on an activity rail: a 1px line at x=3.5 with a 7px dot per
// line. Rows reach 8px past the column so their hover fill has room, which
// puts the dot at left 8px and the text at 24px.
const LINE = 'relative -mx-2 flex h-6 w-[calc(100%+16px)] items-center gap-2 rounded-md pl-6 pr-2 text-left text-meta';
const LINE_ACTIVE = `group ${LINE} transition-colors duration-150 hover:bg-shade-1 ${FOCUS} focus-visible:ring-inset`;
const NESTED = 'pl-9';

// Mara's own decisions read darker than the agent's actions.
const isYou = (head) => typeof head === 'string' && /^You /.test(head);

function Dot({ you }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-2 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full ${you ? 'bg-ink-900' : 'border border-ink-300 bg-canvas-v2'}`}
    />
  );
}

export function ActivityRail({ className = '', children }) {
  return (
    <div className={`relative ${className}`}>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-[3px] top-3 w-px bg-line" />
      {children}
    </div>
  );
}

// One phase of the job. Finished phases fold to this line; the summary only
// shows while folded, since the open body already says it.
export function PhaseHeader({ id, bodyId, title, summary, time, state, progress, open, onToggle, children }) {
  return (
    <>
      <button
        type="button"
        id={id}
        aria-expanded={open}
        aria-controls={open ? bodyId : undefined}
        onClick={onToggle}
        className={`group -mx-2 flex h-8 w-[calc(100%+16px)] items-center gap-2.5 rounded-md px-2 text-left transition-colors duration-150 hover:bg-shade-1 ${FOCUS} focus-visible:ring-inset`}
      >
        <StatusGlyph state={state} progress={progress} />
        <span className="shrink-0 text-ui font-medium text-ink-900">{title}</span>
        <span className="min-w-0 flex-1 truncate text-meta text-ink-500">{open ? '' : summary}</span>
        {time && <span className="shrink-0 text-meta tabular-nums text-ink-500">{time}</span>}
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          aria-hidden="true"
          className={`shrink-0 text-ink-300 transition-[color,transform] duration-200 group-hover:text-ink-500 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="body" id={bodyId} {...collapse} className="-mx-2 overflow-hidden px-2">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const focusVisible = (node) => {
  try {
    return node.matches(':focus-visible');
  } catch {
    return true;
  }
};

// A Thread line that points at its evidence. Hover and keyboard focus preview
// it; click stages it. A target without an id (stage only) restages the tab
// directly, since there is no element to scroll to or hold.
export function useLineHandlers(target, onRestage) {
  const { hover, point } = useEvidence();
  const artifact = target?.artifact ?? null;
  const id = target?.id ?? null;
  return useMemo(() => {
    if (!artifact) return null;
    const t = { artifact, id };
    return {
      onPointerEnter: (e) => {
        if (e.pointerType !== 'touch') hover(t);
      },
      onPointerLeave: () => hover(null),
      onFocus: (e) => {
        if (focusVisible(e.currentTarget)) hover(t);
      },
      onBlur: () => hover(null),
      onClick: () => {
        if (id) {
          point(t);
        } else {
          hover(null);
          onRestage?.(artifact);
        }
      },
    };
  }, [artifact, id, hover, point, onRestage]);
}

export function DayMarker({ text }) {
  return <div className="py-2 text-center text-meta tabular-nums text-ink-500">{text}</div>;
}

export function FinishLine({ text }) {
  return <div className="py-2 text-center text-meta tabular-nums text-ink-500">{text}</div>;
}

export function AgentProse({ text }) {
  return <p className="max-w-none text-ui leading-[22px] text-pretty text-ink-900">{text}</p>;
}

export function UserMessage({ text, photos, photosRead }) {
  return (
    <>
      <div className="ml-auto w-fit max-w-[80%] rounded-xl bg-shade-2 px-3.5 py-2 text-ui leading-[22px] text-ink-900">{text}</div>
      {photos && (
        <div className="mt-2 flex justify-end gap-2">
          {photos.map((p) => (
            <Photo key={p.photo} photo={p.photo} label={p.label} pin pinVisible={photosRead} className="w-[160px]" />
          ))}
        </div>
      )}
    </>
  );
}

function LineText({ head, result }) {
  const you = isYou(head);
  return (
    <span data-receipt className="min-w-0 flex-1 truncate">
      <span className={you ? 'font-medium text-ink-900' : 'text-ink-700 group-hover:text-ink-900'}>{head}</span>
      {result && <span className="text-ink-500"> · {result}</span>}
    </span>
  );
}

export function Receipt({ head, result, time, target, onRestage, nested = false }) {
  const handlers = useLineHandlers(target, onRestage);
  const body = (
    <>
      {!nested && <Dot you={isYou(head)} />}
      <LineText head={head} result={result} />
      {time && <span className="shrink-0 tabular-nums text-ink-500">{time}</span>}
    </>
  );
  const cls = nested ? `${NESTED}` : '';
  if (!handlers) return <div className={`${LINE} ${cls}`}>{body}</div>;
  return (
    <button type="button" {...handlers} className={`${LINE_ACTIVE} ${cls}`}>
      {body}
    </button>
  );
}

function FlagLine({ text, target, onRestage }) {
  const handlers = useLineHandlers(target, onRestage);
  return (
    <button
      type="button"
      {...handlers}
      className={`-mx-2 flex h-6 items-center gap-1.5 rounded-md pl-6 pr-2 text-meta font-medium text-ember-500 underline-offset-4 hover:underline ${FOCUS}`}
    >
      <AlertTriangle size={14} strokeWidth={1.5} aria-hidden="true" />
      {text}
    </button>
  );
}

// One line for consecutive receipts. Flags render after the members, so a
// folded group keeps them directly under its line. A group with its own
// evidence splits in two: the words point at it, the chevron toggles.
export function ReceiptGroup({ id, head, meta, target, open, onToggle, flags, onRestage, children }) {
  const membersId = `${id}-members`;
  const handlers = useLineHandlers(target, onRestage);
  const toggle = { 'aria-expanded': open, 'aria-controls': open ? membersId : undefined, onClick: onToggle };
  const chevron = (
    <ChevronDown
      size={14}
      strokeWidth={1.5}
      aria-hidden="true"
      className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-0' : '-rotate-90'}`}
    />
  );
  const toggleLabel = open ? 'Hide details' : 'Show details';
  return (
    <div>
      {handlers ? (
        <div className="-mx-2 flex w-[calc(100%+16px)] items-center pr-0.5">
          <button
            type="button"
            {...handlers}
            className={`group relative flex h-6 min-w-0 flex-1 items-center gap-2 rounded-md pl-6 pr-1 text-left text-meta transition-colors duration-150 hover:bg-shade-1 ${FOCUS} focus-visible:ring-inset`}
          >
            <Dot />
            <LineText head={head} />
            <span className="shrink-0 tabular-nums text-ink-500">{meta}</span>
          </button>
          <Tooltip label={toggleLabel} side="top">
            <button
              type="button"
              aria-label={toggleLabel}
              {...toggle}
              className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink-500 transition-colors duration-150 hover:bg-shade-1 hover:text-ink-900 ${FOCUS}`}
            >
              {chevron}
            </button>
          </Tooltip>
        </div>
      ) : (
        <button type="button" {...toggle} className={LINE_ACTIVE}>
          <Dot />
          <LineText head={head} />
          <span className="flex shrink-0 items-center gap-2 tabular-nums text-ink-500">
            {meta}
            {chevron}
          </span>
        </button>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="members" id={membersId} {...collapse} className="-mx-2 overflow-hidden px-2">
            <div className="space-y-0.5 pt-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
      {flags.map((f) => (
        <FlagLine key={f.text} text={f.text} target={f.target} onRestage={onRestage} />
      ))}
    </div>
  );
}

// The proposed plan, shown under its prose until it is approved.
export function PlanList({ show }) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.ol
          key="plan"
          className="mt-3 space-y-px overflow-hidden"
          exit={{ height: 0, opacity: 0, marginTop: 0 }}
          transition={{ duration: dur.base, ease }}
        >
          {PLAN.map((s) => (
            <li key={s.id} className="flex min-h-7 items-start gap-2.5 py-1">
              <span className="flex h-5 shrink-0 items-center">
                <StatusGlyph state="idle" />
              </span>
              <span className="min-w-0 flex-1 text-ui text-pretty text-ink-900">{s.label}</span>
              {s.gate && <span className="shrink-0 text-meta leading-5 text-ink-500">You approve</span>}
            </li>
          ))}
        </motion.ol>
      )}
    </AnimatePresence>
  );
}
