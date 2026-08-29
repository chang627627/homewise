import React, { useState } from 'react';
import Rail from './components/shell/Rail';
import Thread from './components/shell/Thread';
import Stage from './components/shell/Stage';
import DesignSystemPage from './pages/DesignSystemPage';
import BidFormPage from './pages/BidFormPage';

// ── v2 exploration (branch: explore/new-version) ─────────────────────────────
// Conversation-as-spine, three-pane shell: Rail (task switcher) · Thread (the
// conversation, where the AI narrates) · Stage (the artifact board, where
// decisions happen). The v1 dashboard shell lives on main.
//
// Two rules carried over from v1 research:
// 1. Every artifact lives in exactly one place, the stage. The thread links to
//    it but never mirrors it (kills the "third dashboard" failure mode).
// 2. Decisions happen on artifacts, narration happens in the thread. Deep
//    artifacts stay documents and tables, not chat.
//
// Pane widths are user-controlled only: the rail and thread fold or expand
// exclusively via their toggles, never as a side effect of staging or
// approving. Wide artifacts (the comparison matrices) scroll horizontally
// inside the stage when the thread is open.
//
// Onboarding is bypassed in this exploration: the demo lands straight in the
// shell with the demo home's watchlist preloaded.

export default function App() {
  const [staged, setStaged] = useState('home');
  const [unlocked, setUnlocked] = useState(() => new Set(['home']));
  const [gates, setGates] = useState({});
  const [taskStarted, setTaskStarted] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState(null);
  const [recommended, setRecommended] = useState(null);
  const [photosShared, setPhotosShared] = useState(false);
  const [guttersPlanned, setGuttersPlanned] = useState(false);
  const [threadOpen, setThreadOpen] = useState(true);
  const [railOpen, setRailOpen] = useState(true);
  // Multi-thread: 'sink' is the scripted primary; "New AI task" appends fresh
  // threads (ChatGPT new-chat semantics). Inactive threads stay mounted so
  // their scripts keep running in the background.
  const [threads, setThreads] = useState([{ id: 'sink', variant: 'sink' }]);
  const [activeThread, setActiveThread] = useState('sink');
  const [startedThreads, setStartedThreads] = useState(() => new Set());
  const [extraTasks, setExtraTasks] = useState([]);

  // URL-based escape hatches that bypass the app shell (same as v1).
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/designsystem') return <DesignSystemPage />;
    if (path === '/bidform' || path.startsWith('/bid/')) return <BidFormPage />;
  }

  // Thread script side effects: the thread narrates, then swaps the stage.
  const handleEffect = (threadId) => (e) => {
    if (e.type === 'task-started') {
      setStartedThreads((prev) => new Set(prev).add(threadId));
      if (threadId === 'sink') setTaskStarted(true);
      else setExtraTasks((prev) => prev.some((t) => t.id === threadId) ? prev : [...prev, { id: threadId, title: e.title || 'New task' }]);
    }
    if (threadId !== 'sink') return;
    if (e.type === 'gutters-planned') setGuttersPlanned(true);
    if (e.type === 'stage') {
      setStaged(e.artifact);
      setUnlocked((prev) => new Set(prev).add(e.artifact));
    }
  };

  // New AI task: reuse an untouched fresh thread if one exists (clicking "new
  // chat" on an empty chat stays put), otherwise append one.
  const newTask = () => {
    setThreadOpen(true);
    if (!startedThreads.has(activeThread)) return;
    const idle = threads.find((t) => !startedThreads.has(t.id));
    if (idle) {
      setActiveThread(idle.id);
      return;
    }
    const id = `task-${threads.length}`;
    setThreads((prev) => [...prev, { id, variant: 'fresh' }]);
    setActiveThread(id);
  };

  const selectTask = (id) => {
    setActiveThread(id);
    setThreadOpen(true);
  };

  // Stage CTAs clear gates; the thread resumes and plays the follow-through.
  const clearGate = (id, extra = {}) => {
    if (extra.slot) setScheduledSlot(extra.slot);
    if (extra.recommended) setRecommended(extra.recommended);
    if (extra.photosShared !== undefined) setPhotosShared(extra.photosShared);
    setGates((g) => ({ ...g, [id]: true }));
  };

  // Manual restage via stage pills or rail items. Pane widths untouched.
  const restage = (artifact) => {
    if (!unlocked.has(artifact)) return;
    setStaged(artifact);
  };

  const booked = !!gates['approve-jason'];
  const jobCompleted = !!gates['close-out'];
  const taskStatus = jobCompleted
    ? 'Completed'
    : unlocked.has('completion')
      ? 'Visit done · close it out'
      : booked
        ? `Booked · ${scheduledSlot || 'Fri 2 PM'}`
        : gates['approve-outreach']
          ? 'Quotes in · your call'
          : gates['approve-scope']
            ? 'Contractors matched'
            : unlocked.has('scope')
              ? 'Scope ready · review it'
              : 'Scoping the job';

  return (
    <div className="h-screen overflow-hidden bg-canvas text-ink-900 selection:bg-sage-200/40 flex">
      <Rail
        open={railOpen}
        onToggle={setRailOpen}
        guttersPlanned={guttersPlanned}
        taskStarted={taskStarted}
        taskStatus={taskStatus}
        booked={booked}
        staged={staged}
        unlocked={unlocked}
        extraTasks={extraTasks}
        activeThread={activeThread}
        onRestage={restage}
        onNewTask={newTask}
        onSelectTask={selectTask}
      />
      {threads.map((t) => (
        <Thread
          key={t.id}
          variant={t.variant}
          active={t.id === activeThread}
          open={threadOpen}
          onToggle={setThreadOpen}
          gates={gates}
          scheduledSlot={scheduledSlot}
          recommended={recommended}
          onEffect={handleEffect(t.id)}
          onRestage={restage}
        />
      ))}
      <Stage
        staged={staged}
        unlocked={unlocked}
        gates={gates}
        scheduledSlot={scheduledSlot}
        taskStarted={taskStarted}
        jobCompleted={jobCompleted}
        recommended={recommended}
        photosShared={photosShared}
        onRestage={restage}
        onClearGate={clearGate}
      />
    </div>
  );
}
