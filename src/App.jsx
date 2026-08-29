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
// Breathing layout: when a wide artifact (a comparison matrix) is staged, the
// thread auto-collapses to a strip so the matrix keeps the width the Round 1
// layouts were tested at. Approving anything re-opens the thread so the user
// watches the AI work, then it breathes closed again on the next wide artifact.
//
// Onboarding is bypassed in this exploration: the demo lands straight in the
// shell with the demo home's watchlist preloaded.

const WIDE_ARTIFACTS = new Set(['contractors', 'quotes']);

export default function App() {
  const [staged, setStaged] = useState('home');
  const [unlocked, setUnlocked] = useState(() => new Set(['home']));
  const [gates, setGates] = useState({});
  const [taskStarted, setTaskStarted] = useState(false);
  const [scheduledSlot, setScheduledSlot] = useState(null);
  const [threadOpen, setThreadOpen] = useState(true);
  const [railOpen, setRailOpen] = useState(true);

  // URL-based escape hatches that bypass the app shell (same as v1).
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path === '/designsystem') return <DesignSystemPage />;
    if (path === '/bidform' || path.startsWith('/bid/')) return <BidFormPage />;
  }

  // Thread script side effects: the thread narrates, then swaps the stage.
  const handleEffect = (e) => {
    if (e.type === 'task-started') setTaskStarted(true);
    if (e.type === 'stage') {
      setStaged(e.artifact);
      setUnlocked((prev) => new Set(prev).add(e.artifact));
      setThreadOpen(!WIDE_ARTIFACTS.has(e.artifact));
    }
  };

  // Stage CTAs clear gates; the thread resumes and plays the follow-through.
  // Re-open the thread on every approval so the AI's work stays visible.
  const clearGate = (id, extra = {}) => {
    if (extra.slot) setScheduledSlot(extra.slot);
    setGates((g) => ({ ...g, [id]: true }));
    setThreadOpen(true);
  };

  // Manual restage via stage pills or rail items. Same breathing rule.
  const restage = (artifact) => {
    if (!unlocked.has(artifact)) return;
    setStaged(artifact);
    setThreadOpen(!WIDE_ARTIFACTS.has(artifact));
  };

  const booked = !!gates['approve-jason'];
  const taskStatus = booked
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
        taskStarted={taskStarted}
        taskStatus={taskStatus}
        booked={booked}
        staged={staged}
        unlocked={unlocked}
        onRestage={restage}
        onOpenThread={() => setThreadOpen(true)}
      />
      <Thread
        open={threadOpen}
        onToggle={setThreadOpen}
        gates={gates}
        scheduledSlot={scheduledSlot}
        onEffect={handleEffect}
      />
      <Stage
        staged={staged}
        unlocked={unlocked}
        gates={gates}
        scheduledSlot={scheduledSlot}
        taskStarted={taskStarted}
        onRestage={restage}
        onClearGate={clearGate}
      />
    </div>
  );
}
