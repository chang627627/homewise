import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LayoutGroup, motion } from 'framer-motion';
import { Download, Maximize2, Minimize2, PanelLeftOpen } from 'lucide-react';
import Tabs from '../v2/Tabs';
import IconButton from '../v2/IconButton';
import Tooltip from '../v2/Tooltip';
import { StatusGlyph } from '../v2/Status';
import { EvidenceScope } from '../v2/Evidence';
import { dur, ease } from '../v2/motion';
import HomeView from '../artifacts/HomeView';
import OverviewArtifact from '../artifacts/OverviewArtifact';
import ScopeArtifact from '../artifacts/ScopeArtifact';
import ContractorsArtifact from '../artifacts/ContractorsArtifact';
import QuotesArtifact from '../artifacts/QuotesArtifact';
import ScheduleArtifact from '../artifacts/ScheduleArtifact';
import CompletionArtifact from '../artifacts/CompletionArtifact';
import { AT, CONTRACTORS, GATES, SCOPE, describeBooking, fmtDateTime } from '../../data/demo';

const SINK_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'scope', label: 'Scope' },
  { id: 'contractors', label: 'Contractors' },
  { id: 'quotes', label: 'Quotes' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'completion', label: 'Close-out' },
];

const ARTIFACTS = {
  scope: ScopeArtifact,
  contractors: ContractorsArtifact,
  quotes: QuotesArtifact,
  schedule: ScheduleArtifact,
  completion: CompletionArtifact,
};

const CONVERSATION = { id: 'conversation', label: 'Conversation' };

function needsYou(tab, { gates, quotesIn }) {
  switch (tab) {
    case 'scope':
      return !gates[GATES.approveScope];
    case 'contractors':
      return !gates[GATES.approveOutreach];
    case 'quotes':
      return quotesIn.size >= CONTRACTORS.length && !gates[GATES.book];
    case 'completion':
      return !gates[GATES.closeOut];
    default:
      return false;
  }
}

function boardTabs(view, { unlocked, gates, quotesIn }) {
  if (view.kind === 'home') return [{ id: 'home', label: 'Home' }];
  if (view.kind !== 'sink') return [{ id: 'overview', label: 'Overview' }];
  return SINK_TABS.filter((t) => t.id === 'overview' || unlocked.has(t.id)).map((t) => ({
    ...t,
    needsYou: needsYou(t.id, { gates, quotesIn }),
  }));
}

function provenanceFor(view, { quotesIn, booking }) {
  if (view.kind !== 'sink') return null;
  switch (view.tab) {
    case 'scope':
      return `Drafted ${AT.scopeDrafted} · ${SCOPE.ref}`;
    case 'contractors':
      return `Matched by Homewise · ${AT.prosMatched}`;
    case 'quotes':
      return quotesIn.size < CONTRACTORS.length
        ? `Collecting since ${AT.outreachSent}`
        : `Compared by Homewise · ${AT.quotesCompared}`;
    case 'schedule':
      return `Booked by Homewise · ${AT.booked}`;
    case 'completion': {
      const b = describeBooking(booking);
      return b ? `Reported by ${b.who} · ${fmtDateTime(b.completedAt)}` : null;
    }
    default:
      return null;
  }
}

// A receipt is shown whole or not at all: a clipped "Reported by J…" reads
// as broken. It stays in the layout while hidden, so it can be re-measured as
// the header widens.
function Provenance({ text }) {
  const ref = useRef(null);
  const [fits, setFits] = useState(true);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    // 1px of slack: clientWidth rounds the item's fractional width down.
    const measure = () => setFits(el.scrollWidth <= el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);
  return (
    <span
      ref={ref}
      className={`mr-2 hidden min-w-0 overflow-hidden whitespace-nowrap text-meta tabular-nums text-ink-500 lg:block ${fits ? '' : 'invisible'}`}
    >
      {text}
    </span>
  );
}

// view: { kind: 'home' | 'sink' | 'fresh' | 'gutters', task, tab }.
// artifactProps: the common props every sink artifact receives.
// overview: the Overview's per-task extras (kickoff, photosRead, strip...).
// home: the Home view's extras ({ tasks, onSelectTask }, see homeJobs).
export default function Stage({
  view,
  artifactProps,
  overview = {},
  home = {},
  guttersPlanned = false,
  compact = false,
  showConversation = false,
  conversation = null,
  focusMode = false,
  strip = null,
  stripProgress = 0,
  stagedBy = 'user',
  evidencePreview = null,
  scrollMemory,
  onSelectTab,
  onFocus,
  onExitFocus,
  onOpenRail,
  onShowConversation,
}) {
  const scrollRef = useRef(null);
  const seenTabs = useRef(new Set());
  const fadingTabs = useRef(new Set());
  const { gates, quotesIn, booking } = artifactProps;

  const group = view.task || 'home';
  const board = boardTabs(view, artifactProps);
  const allTabs = compact ? [CONVERSATION, ...board] : board;
  // A tab fades in only the first time it appears for its task. It keeps the
  // flag while mounted, because dropping framer's animate props mid-fade
  // would freeze it part way; a remount (task switch) never replays it.
  const keyOf = (t) => `${group}:${t.id}`;
  const tabs = allTabs.map((t) => ({
    ...t,
    fresh: t.id !== CONVERSATION.id
      && (fadingTabs.current.has(keyOf(t)) || (seenTabs.current.size > 0 && !seenTabs.current.has(keyOf(t)))),
  }));
  useEffect(() => {
    const mounted = new Set(tabs.map(keyOf));
    fadingTabs.current.forEach((k) => {
      if (!mounted.has(k)) fadingTabs.current.delete(k);
    });
    tabs.forEach((t) => {
      if (t.fresh) fadingTabs.current.add(keyOf(t));
      seenTabs.current.add(keyOf(t));
    });
  });

  const onConversation = compact && showConversation;
  const activeTab = onConversation ? CONVERSATION.id : view.tab;
  const preview = evidencePreview && evidencePreview !== activeTab && allTabs.some((t) => t.id === evidencePreview)
    ? evidencePreview
    : null;

  // Scroll is remembered per task and tab; the board's own scroller is hidden
  // (not unmounted) while the compact Conversation tab is up.
  const viewKey = `${group}:${view.tab}`;
  const boardVisible = !onConversation;
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || !boardVisible) return;
    el.scrollTop = scrollMemory?.current.get(viewKey) ?? 0;
  }, [viewKey, boardVisible, scrollMemory]);
  const onScroll = (e) => {
    if (boardVisible) scrollMemory?.current.set(viewKey, e.currentTarget.scrollTop);
  };

  let artifact;
  if (view.kind === 'home') {
    artifact = <HomeView guttersPlanned={guttersPlanned} {...artifactProps} {...home} />;
  } else if (view.kind === 'sink' && ARTIFACTS[view.tab]) {
    const Artifact = ARTIFACTS[view.tab];
    artifact = <Artifact {...artifactProps} />;
  } else {
    artifact = <OverviewArtifact variant={view.kind} {...artifactProps} {...overview} />;
  }

  const provenance = provenanceFor(view, { quotesIn, booking });
  const canExport = view.kind === 'sink' && view.tab === 'scope' && !onConversation;
  const liveHere = focusMode || (compact && !onConversation);

  return (
    <section
      aria-label="Stage"
      className={`flex min-w-0 flex-1 flex-col overflow-hidden bg-white transition-[margin] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        print:m-0 print:overflow-visible print:ring-0
        ${compact ? 'm-0 rounded-none ring-0' : focusMode ? 'm-2 rounded-xl ring-1 ring-line' : 'my-2 mr-2 rounded-xl ring-1 ring-line'}`}
    >
      <header className={`flex shrink-0 items-stretch justify-between gap-6 border-b border-line print:hidden ${compact ? 'h-12 px-4' : 'h-10 px-6'}`}>
        <div className="flex min-w-0 items-stretch gap-2">
          {compact && (
            <div className="-ml-2 flex shrink-0 items-center">
              <IconButton icon={PanelLeftOpen} label="Open sidebar" onClick={onOpenRail} />
            </div>
          )}
          <LayoutGroup key={group} id={`stage-${group}`}>
            <Tabs tabs={tabs} active={activeTab} preview={preview} onSelect={onSelectTab} label="Views" />
          </LayoutGroup>
        </div>

        <div className="-mr-2 flex min-w-0 shrink-[100] items-center justify-end gap-1">
          {liveHere ? (
            strip && (compact ? (
              <Tooltip label={strip.text} side="bottom">
                <button
                  type="button"
                  aria-label="Open conversation"
                  onClick={onShowConversation}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors duration-150 hover:bg-shade-1
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
                >
                  <StatusGlyph state={strip.state} live progress={stripProgress} />
                </button>
              </Tooltip>
            ) : (
              <span className="mr-2 flex min-w-0 items-center gap-2">
                <StatusGlyph state={strip.state} live progress={stripProgress} />
                <span className="max-w-[280px] truncate text-meta font-medium text-ink-700">{strip.text}</span>
              </span>
            ))
          ) : (
            provenance && <Provenance text={provenance} />
          )}
          {canExport && <IconButton icon={Download} label="Export PDF" onClick={() => window.print()} />}
          {!compact && (focusMode
            ? <IconButton icon={Minimize2} label="Exit focus" onClick={onExitFocus} />
            : <IconButton icon={Maximize2} label="Focus" onClick={onFocus} />)}
        </div>
      </header>

      {compact && <div className={onConversation ? 'flex min-h-0 flex-1' : 'hidden'}>{conversation}</div>}

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={`${onConversation ? 'hidden' : 'flex-1'} overflow-y-auto print:overflow-visible`}
      >
        {/* A user click swaps at once; only an agent stage fades the new view in. */}
        <motion.div
          key={viewKey}
          initial={stagedBy === 'agent' ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: dur.base, ease }}
          className="flex min-h-full flex-col px-4 pt-8 lg:px-6 xl:px-8"
        >
          <EvidenceScope artifact={view.kind === 'home' ? 'home' : view.tab}>{artifact}</EvidenceScope>
        </motion.div>
      </div>
    </section>
  );
}
