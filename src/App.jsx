import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Rail from './components/shell/Rail';
import Thread from './components/shell/Thread';
import Stage from './components/shell/Stage';
import { EvidenceContext, useEvidenceController } from './components/v2/Evidence';
import useMediaQuery from './components/v2/useMediaQuery';
import { dur, prefersReducedMotion } from './components/v2/motion';
import DesignSystemPage from './pages/DesignSystemPage';
import BidFormPage from './pages/BidFormPage';
import {
  DEFAULT_URGENCY,
  GUTTERS_PLAN,
  JOB,
  URGENCY,
  describeBooking,
  deriveSinkStatus,
  isToday,
  planProgress,
} from './data/demo';

// Three panes: Rail (the home and its tasks), Thread (the conversation, where
// the agent narrates) and Stage (one white panel, where decisions happen).
// Every artifact lives only on the Stage; the Thread points at it, never
// mirrors it. Pane widths change only through the user's own toggles.

const RAIL_OPEN_AT = 1440;
const THREAD_W = { wide: 400, narrow: 360, collapsed: 56 };

export default function App() {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/designsystem') return <DesignSystemPage />;
    if (path === '/bidform' || path.startsWith('/bid/')) return <BidFormPage />;
  }
  return <Shell />;
}

// Every Thread renders through a portal into its own detached host node, and
// the host is moved between the pane slot (1024 and up) and the Stage's
// Conversation tab (below 1024). The Thread never remounts, so its script,
// timers and answers survive the move.
function ThreadSlot({ hosts, className }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const slot = ref.current;
    if (!slot) return;
    hosts.forEach((host) => {
      if (host.parentNode !== slot) slot.appendChild(host);
    });
  });
  return <div ref={ref} className={className} />;
}

function Shell() {
  const compact = useMediaQuery('(max-width: 1023px)');
  const narrowThread = useMediaQuery('(max-width: 1279px)');

  // Panes
  const [railOpen, setRailOpen] = useState(() => typeof window === 'undefined' || window.innerWidth >= RAIL_OPEN_AT);
  const [threadOpen, setThreadOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [panesGone, setPanesGone] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [compactView, setCompactView] = useState('conversation'); // below 1024: 'conversation' | 'board'

  // Tasks and what the Stage shows
  const [threads, setThreads] = useState([{ id: 'sink', variant: 'sink' }]);
  const [activeThread, setActiveThread] = useState('sink');
  const [kickoffs, setKickoffs] = useState({}); // { [threadId]: { label, railTitle } }
  const [strips, setStrips] = useState({}); // { [threadId]: { state, text, meta } }
  const [homeStaged, setHomeStaged] = useState(false);
  const [taskTabs, setTaskTabs] = useState({}); // { [threadId]: tabId }, default 'overview'
  const [stagedBy, setStagedBy] = useState('user');

  // The sink job
  const [unlocked, setUnlocked] = useState(() => new Set(['overview']));
  const [gates, setGates] = useState({});
  const [booking, setBooking] = useState(null);
  const [urgency, setUrgency] = useState(null);
  const [quotesIn, setQuotesIn] = useState(() => new Set());
  const [photosRead, setPhotosRead] = useState(() => new Set()); // thread ids
  const [recommended, setRecommended] = useState(null);
  const [photosShared, setPhotosShared] = useState(false);
  const [guttersPlanned, setGuttersPlanned] = useState(false);

  const scrollMemory = useRef(new Map()); // `${taskId}:${tab}` -> scrollTop
  const nextTaskId = useRef(1);

  const isStarted = (id) => id === 'gutters' || !!kickoffs[id];

  // What the Stage shows (spec 5.0): Home when staged by the user or before
  // the active task kicks off, otherwise that task's own board.
  const activeVariant = threads.find((t) => t.id === activeThread)?.variant;
  const showHome = homeStaged || !isStarted(activeThread);
  const view = showHome
    ? { kind: 'home', task: null, tab: 'home' }
    : activeVariant === 'sink'
      ? { kind: 'sink', task: 'sink', tab: unlocked.has(taskTabs.sink) ? taskTabs.sink : 'overview' }
      : { kind: activeVariant, task: activeThread, tab: 'overview' };

  // Callbacks handed to the Threads stay stable across renders (a new
  // function would restart their script timers), so they read state here.
  const latest = useRef({});
  latest.current = { activeThread, compact, compactView, homeStaged, railOpen, unlocked };

  const stageHome = useCallback(() => {
    setHomeStaged(true);
    setStagedBy('user');
    if (latest.current.compact) {
      setCompactView('board');
      setOverlayOpen(false);
    }
  }, []);

  // A user restage: instant swap, sink tabs only (and 'home' for Evidence).
  const restage = useCallback((tab) => {
    if (tab === 'home') {
      stageHome();
      return;
    }
    if (!latest.current.unlocked.has(tab)) return;
    setActiveThread('sink');
    setTaskTabs((t) => ({ ...t, sink: tab }));
    setHomeStaged(false);
    setStagedBy('user');
    if (latest.current.compact) setCompactView('board');
  }, [stageHome]);

  const evidence = useEvidenceController({ restage });

  const clearGate = useCallback((id, extra = {}) => {
    if (extra.booking) setBooking(extra.booking);
    if (extra.recommended !== undefined) setRecommended(extra.recommended);
    if (extra.photosShared !== undefined) setPhotosShared(extra.photosShared);
    setGates((g) => (g[id] ? g : { ...g, [id]: true }));
  }, []);

  const handleEffect = (threadId, e) => {
    if (!e?.type) return;
    const now = latest.current;
    switch (e.type) {
      case 'task-started':
        setKickoffs((k) => (k[threadId] ? k : { ...k, [threadId]: { label: e.label, railTitle: e.railTitle } }));
        if (threadId === now.activeThread) setStagedBy('agent');
        break;
      case 'stage': {
        if (threadId !== 'sink' || !e.artifact) break;
        const tab = e.artifact;
        setUnlocked((prev) => (prev.has(tab) ? prev : new Set(prev).add(tab)));
        scrollMemory.current.delete(`sink:${tab}`);
        // Below 1024 an agent stage never swaps the view under the user; the
        // tab's dot says it is there.
        if (now.compact) {
          const sinkBoardShown = now.activeThread === 'sink' && !now.homeStaged && now.compactView === 'board';
          if (!sinkBoardShown) setTaskTabs((t) => ({ ...t, sink: tab }));
          break;
        }
        setTaskTabs((t) => ({ ...t, sink: tab }));
        if (now.activeThread === 'sink') {
          setHomeStaged(false);
          setStagedBy('agent');
        }
        break;
      }
      case 'urgency':
        if (threadId === 'sink' && URGENCY[e.value]) setUrgency(e.value);
        break;
      case 'photos-read':
        setPhotosRead((prev) => (prev.has(threadId) ? prev : new Set(prev).add(threadId)));
        break;
      case 'quote-in':
        if (threadId === 'sink' && e.id) setQuotesIn((prev) => (prev.has(e.id) ? prev : new Set(prev).add(e.id)));
        break;
      case 'gutters-planned':
        setGuttersPlanned(true);
        setThreads((prev) => (prev.some((t) => t.id === 'gutters') ? prev : [...prev, { id: 'gutters', variant: 'gutters' }]));
        break;
      case 'strip':
        setStrips((s) => {
          const old = s[threadId];
          if (old && old.state === e.state && old.text === e.text && old.meta === e.meta) return s;
          return { ...s, [threadId]: { state: e.state, text: e.text, meta: e.meta } };
        });
        break;
      default:
        break;
    }
  };
  const effectRef = useRef(handleEffect);
  effectRef.current = handleEffect;
  const effectFns = useRef(new Map());
  const onEffectFor = (id) => {
    if (!effectFns.current.has(id)) effectFns.current.set(id, (e) => effectRef.current(id, e));
    return effectFns.current.get(id);
  };

  // Collapsing the second pane by hand is focus mode; leaving focus restores
  // the panes as they were, because focus never changes them.
  const toggleRail = (next) => {
    if (!next && !threadOpen) setFocusMode(true);
    else setRailOpen(next);
  };
  const toggleThread = useCallback((next) => {
    if (latest.current.compact) return; // the Conversation tab is the Thread's only home there
    if (!next && !latest.current.railOpen) setFocusMode(true);
    else setThreadOpen(next);
  }, []);

  // Once the panes have closed to 0 they leave the layout entirely (nothing
  // focusable, nothing animating). On exit they come back at width 0 for a
  // frame, so the width can animate out again.
  useEffect(() => {
    if (!focusMode) {
      setPanesGone(false);
      return undefined;
    }
    const t = setTimeout(() => setPanesGone(true), prefersReducedMotion() ? 0 : dur.slow * 1000);
    return () => clearTimeout(t);
  }, [focusMode]);
  const exitFocus = useCallback(() => {
    setPanesGone(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setFocusMode(false)));
  }, []);

  useEffect(() => {
    if (!focusMode) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') exitFocus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusMode, exitFocus]);

  useEffect(() => {
    if (compact) setFocusMode(false);
    else setOverlayOpen(false);
  }, [compact]);

  const selectTask = (id) => {
    setActiveThread(id);
    setHomeStaged(false);
    setStagedBy('user');
    if (compact) {
      setCompactView('conversation');
      setOverlayOpen(false);
    }
  };

  // A Jobs row on the Home view opens that task's board (below 1024 too:
  // the click came from the board, so it stays there).
  const openJob = (id) => {
    selectTask(id);
    if (compact) setCompactView('board');
  };

  // New task reuses an untouched draft before making another one. The
  // conversation opens with it: the kickoff is answered there.
  const newTask = () => {
    setHomeStaged(false);
    setStagedBy('user');
    if (compact) {
      setCompactView('conversation');
      setOverlayOpen(false);
    } else {
      setThreadOpen(true);
    }
    if (!isStarted(activeThread)) return;
    const idle = threads.find((t) => t.variant === 'fresh' && !isStarted(t.id));
    if (idle) {
      setActiveThread(idle.id);
      return;
    }
    const id = `task-${nextTaskId.current++}`;
    setThreads((prev) => [...prev, { id, variant: 'fresh' }]);
    setActiveThread(id);
  };

  const selectTab = (id) => {
    if (id === 'conversation') {
      setCompactView('conversation');
      return;
    }
    if (compact) setCompactView('board');
    setStagedBy('user');
    if (view.kind === 'sink') restage(id);
  };

  const progress = planProgress({ unlocked, gates });
  const sinkStatus = deriveSinkStatus({ unlocked, gates, booking, quotesIn });
  const sinkBooking = describeBooking(booking);
  const urgencyValue = urgency ?? DEFAULT_URGENCY;
  const hoverTarget = evidence.evidence?.mode === 'hover' ? evidence.evidence.artifact : null;

  // Rail rows, newest first. The draft (an active thread before kickoff) is
  // the one selection on the first frame.
  const taskRows = [];
  if (!isStarted(activeThread)) {
    taskRows.push({ id: activeThread, title: 'New task', state: 'idle', progress: 0, selected: !homeStaged, tooltip: 'New task' });
  }
  [...threads].reverse().forEach((t) => {
    if (!isStarted(t.id)) return;
    const selected = !homeStaged && t.id === activeThread;
    const strip = strips[t.id];
    if (t.variant === 'sink') {
      taskRows.push({
        id: t.id,
        title: JOB.name,
        state: sinkStatus.state,
        progress,
        meta: sinkStatus.stage === 'booked' && sinkBooking ? (isToday(sinkBooking.slot.iso) ? 'Today' : sinkBooking.slot.day) : null,
        muted: sinkStatus.state === 'done',
        selected,
        tooltip: `${JOB.name} · ${strip?.text ?? sinkStatus.label}`,
      });
    } else if (t.variant === 'gutters') {
      taskRows.push({
        id: t.id,
        title: GUTTERS_PLAN.title,
        state: 'waiting',
        progress: 0,
        meta: GUTTERS_PLAN.meta,
        selected,
        tooltip: `${GUTTERS_PLAN.title} · ${strip?.text ?? GUTTERS_PLAN.status}`,
      });
    } else {
      // Working until the task has its own ladder, as the sink row is during
      // intake; the strip's words live in the tooltip only.
      const title = kickoffs[t.id]?.railTitle || 'New task';
      taskRows.push({
        id: t.id,
        title,
        state: 'working',
        progress: 0,
        selected,
        tooltip: strip ? `${title} · ${strip.text}` : title,
      });
    }
  });

  const railBody = {
    home: { selected: homeStaged, preview: hoverTarget === 'home' && view.kind !== 'home' },
    tasks: taskRows,
    onHome: stageHome,
    onNewTask: newTask,
    onSelectTask: selectTask,
  };

  // The Thread's `staged`: the tab of its own board while that board is on screen.
  const stagedFor = (id) => {
    if (id !== activeThread || showHome) return null;
    if (compact && compactView !== 'board') return null;
    return view.tab;
  };

  const hosts = useRef(new Map());
  const hostFor = (id) => {
    let host = hosts.current.get(id);
    if (!host) {
      host = document.createElement('div');
      host.style.display = 'contents';
      hosts.current.set(id, host);
    }
    return host;
  };
  const threadHosts = threads.map((t) => hostFor(t.id));
  // Only the active conversation is on screen; the others keep running unseen.
  useLayoutEffect(() => {
    threads.forEach((t) => {
      hostFor(t.id).style.display = t.id === activeThread ? 'contents' : 'none';
    });
  });

  const artifactProps = {
    gates,
    booking,
    urgency: urgencyValue,
    recommended,
    photosShared,
    quotesIn,
    unlocked,
    progress,
    photosRead: photosRead.has('sink'),
    stagedBy,
    onClearGate: clearGate,
    onRestage: restage,
  };
  const overview = {
    kickoff: kickoffs[view.task] || null,
    photosRead: photosRead.has(view.task),
    urgencyChosen: urgency != null,
  };
  // The Home view's Jobs: started tasks in start order (homeJobs sorts them).
  const home = {
    tasks: threads
      .filter((t) => isStarted(t.id))
      .map((t) => ({
        id: t.id,
        kind: t.variant === 'fresh' ? 'ac' : t.variant,
        title: kickoffs[t.id]?.railTitle,
        photosRead: photosRead.has(t.id),
      })),
    onSelectTask: openJob,
  };

  const threadWidth = focusMode ? 0 : threadOpen ? (narrowThread ? THREAD_W.narrow : THREAD_W.wide) : THREAD_W.collapsed;

  return (
    <EvidenceContext.Provider value={evidence}>
      <div className="v2 flex h-screen overflow-hidden bg-canvas-v2 text-ink-900 antialiased print:block print:h-auto print:overflow-visible">
        {compact ? (
          <Rail variant="overlay" open={overlayOpen} onToggle={setOverlayOpen} {...railBody} />
        ) : (
          <Rail open={railOpen} focus={focusMode} gone={panesGone} onToggle={toggleRail} {...railBody} />
        )}

        {!compact && (
          <div
            inert={focusMode ? '' : undefined}
            style={{ width: threadWidth }}
            className={`h-full shrink-0 overflow-hidden transition-[width,visibility] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] print:hidden
              ${focusMode ? 'invisible' : 'visible'} ${panesGone ? 'hidden' : ''}`}
          >
            <ThreadSlot hosts={threadHosts} className="flex h-full" />
          </div>
        )}

        <Stage
          view={view}
          artifactProps={artifactProps}
          overview={overview}
          home={home}
          guttersPlanned={guttersPlanned}
          compact={compact}
          showConversation={compactView === 'conversation'}
          conversation={compact ? <ThreadSlot hosts={threadHosts} className="flex min-h-0 min-w-0 flex-1" /> : null}
          focusMode={focusMode}
          strip={strips[activeThread] || null}
          stripProgress={activeThread === 'sink' ? progress : 0}
          stagedBy={stagedBy}
          evidencePreview={hoverTarget}
          scrollMemory={scrollMemory}
          onSelectTab={selectTab}
          onFocus={() => setFocusMode(true)}
          onExitFocus={exitFocus}
          onOpenRail={() => setOverlayOpen(true)}
          onShowConversation={() => setCompactView('conversation')}
        />

        {threads.map((t) => createPortal(
          <Thread
            id={t.id}
            variant={t.variant}
            active={t.id === activeThread}
            open={compact || threadOpen}
            onToggle={toggleThread}
            compact={compact}
            focus={focusMode}
            gates={gates}
            booking={booking}
            urgency={urgencyValue}
            recommended={recommended}
            quotesIn={quotesIn}
            progress={t.variant === 'sink' ? progress : 0}
            staged={stagedFor(t.id)}
            onEffect={onEffectFor(t.id)}
            onRestage={restage}
          />,
          hostFor(t.id),
          t.id,
        ))}
      </div>
    </EvidenceContext.Provider>
  );
}
