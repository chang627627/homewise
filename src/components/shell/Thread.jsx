import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Camera,
  Paperclip,
  Mic,
  ArrowUp,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Flame,
  CalendarDays,
  Calendar,
  Loader2,
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  Send,
  FileText,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

// ── The conversation spine ───────────────────────────────────────────────────
// One continuous thread per task: intake gates, AI actions, booking tail.
// The script advances on timers; `gate` entries block until the matching
// condition clears. In-thread gates (kickoff, upload, urgency, generate) are
// local state; approval gates clear from the stage via props.gates, because
// decisions happen on artifacts, not in chat.
// `effect` entries fire side effects upward (stage swaps, rail updates).

const urgencyReplies = {
  urgent: 'Active leak right now. Need someone today.',
  soon: 'Slow leak. Sometime this week is fine.',
  flexible: 'Just an annoyance. Whenever convenient.',
};

const script = [
  { type: 'agent', text: "What's happening at home?", time: '10:28 AM' },
  { type: 'gate', id: 'kickoff' },
  { type: 'user', text: 'My kitchen sink is leaking and I need someone this week.', time: '10:28 AM' },
  { type: 'effect', effect: { type: 'task-started' } },
  { type: 'thinking', text: 'One sec, figuring out what I need to see…' },
  {
    type: 'agent',
    text: "Got it. Before I scope this for contractors, I need one photo to rule things out. Snap the spot below and I'll check it.",
    photoRequest: true,
    time: '10:28 AM',
  },
  { type: 'gate', id: 'upload' },
  { type: 'user', text: 'Here it is.', time: '10:30 AM' },
  { type: 'photos', photos: [{ label: 'Under the sink', tone: 'sage', tag: 'Standing water' }] },
  { type: 'thinking', text: 'Looking at it…' },
  {
    type: 'agent',
    text: "From the photo: standing water right at the P-trap joint, the slip nut is weeping. That's your leak.",
    time: '10:30 AM',
  },
  {
    type: 'urgency',
    text: 'Quick check, how active is this right now? It changes how fast I push for a contractor.',
    time: '10:30 AM',
  },
  { type: 'gate', id: 'urgency' },
  { type: 'user', text: (ctx) => urgencyReplies[ctx.urgency], time: '10:30 AM' },
  {
    type: 'agent',
    text: 'Standard 5-day quote window. One quick thing and I can scope this:',
    follow: ['Is the faucet a single-handle or two-handle?'],
    time: '10:31 AM',
  },
  { type: 'user', text: 'Single-handle.', time: '10:31 AM' },
  {
    type: 'agent',
    text: "Perfect, single-handle cartridge. I'll scope this as a P-trap replacement plus a faucet cartridge swap. Standard 1.5-2 hour visit, no wall work needed.",
    summary: {
      job: 'Kitchen sink leak + drip',
      scope: 'P-trap replacement, faucet cartridge replacement',
      duration: '1.5–2 hours',
      benchmark: '$180–$320',
    },
    time: '10:32 AM',
  },
  { type: 'chips' },
  { type: 'gate', id: 'generate' },
  { type: 'thinking', text: 'Drafting the scope…' },
  {
    type: 'action',
    icon: FileText,
    accent: 'sage',
    title: 'Scope of work drafted',
    detail: 'SOW-2026-0423-001 · 6 sections · benchmarked against 46 local jobs',
    time: '10:33 AM',
  },
  { type: 'effect', effect: { type: 'stage', artifact: 'scope' } },
  {
    type: 'agent',
    text: "The scope is on your board. Review it, and when you approve I'll send the same brief to 3 vetted contractors.",
    time: '10:33 AM',
  },
  { type: 'live', text: 'Waiting on your review · Scope of work', eta: 'On the board' },
  { type: 'gate', id: 'approve-scope' },
  { type: 'action', icon: CheckCircle2, accent: 'sage', title: 'You approved the scope', detail: 'Locked as SOW-2026-0423-001 · v1', time: '10:34 AM' },
  { type: 'action', icon: ShieldCheck, accent: 'sage', title: 'Checked license records', detail: '3 contractors · all current with state board', time: '10:35 AM' },
  { type: 'action', icon: BadgeCheck, accent: 'sage', title: 'Verified insurance status', detail: '2 of 3 GL + WC current · Quickfix renewal pending', time: '10:36 AM' },
  { type: 'action', icon: TrendingUp, accent: 'sky', title: 'Compared local pricing benchmark', detail: '46 nearby plumbing jobs · last 90 days', time: '10:38 AM' },
  { type: 'effect', effect: { type: 'stage', artifact: 'contractors' } },
  {
    type: 'agent',
    text: 'Three matches on your board, same criteria for everyone. Jason is my top pick: strongest recent record for exactly this job. One heads up, Quickfix has an insurance renewal pending, see their row before you decide.',
    time: '10:39 AM',
  },
  { type: 'live', text: 'Waiting on your call · Approve outreach to all 3', eta: 'On the board' },
  { type: 'gate', id: 'approve-outreach' },
  { type: 'action', icon: Send, accent: 'sky', title: 'Outreach sent to 3 contractors', detail: 'Same scope, same form. 5-day window.', time: '10:42 AM' },
  {
    type: 'agent',
    text: "Jason Plumbing's quote just came in. $220, fair price for the scope, available Friday afternoon.",
    time: '11:08 AM',
  },
  {
    type: 'agent',
    text: "All three are in. Quick side-by-side: Bayline came in at $390 (above market with a $75 service fee), Quickfix at $175 but their quote is missing materials and warranty language. I'd recommend Jason.",
    time: '11:10 AM',
  },
  { type: 'effect', effect: { type: 'stage', artifact: 'quotes' } },
  { type: 'live', text: 'Awaiting your approval · Pick a slot on the board', eta: 'No rush · slow leak' },
  { type: 'gate', id: 'approve-jason' },
  {
    type: 'action',
    icon: CheckCircle2,
    accent: 'sage',
    title: (ctx) => `You approved Jason · ${ctx.scheduledSlot || 'Fri 2 PM'}`,
    detail: 'Confirmed via quote comparison',
    time: '11:14 AM',
  },
  {
    type: 'action',
    icon: CheckCircle2,
    accent: 'sage',
    title: 'Booking confirmed with Jason Plumbing Co.',
    detail: (ctx) => `${ctx.scheduledSlot || 'Fri 2 PM'} · 2-hour window`,
    time: '11:14 AM',
  },
  { type: 'action', icon: Calendar, accent: 'sage', title: 'Added to your calendar', detail: 'Reminder set for 30 min before arrival', time: '11:14 AM' },
  { type: 'effect', effect: { type: 'stage', artifact: 'schedule' } },
  {
    type: 'agent',
    text: "Booked. Jason will text you 30 minutes before he arrives. I'll check in once it's done, and if anything changes, I'll re-engage Bayline as backup.",
    time: '11:15 AM',
  },
  { type: 'live', text: (ctx) => `Confirmed · ${ctx.scheduledSlot || 'Fri 2 PM'}`, eta: '2 days away' },
  { type: 'date', label: 'Friday · April 25' },
  { type: 'action', icon: CheckCircle2, accent: 'sage', title: 'Jason marked the visit complete', detail: 'Friday, April 25 · arrived on time', time: '2:48 PM' },
  { type: 'effect', effect: { type: 'stage', artifact: 'completion' } },
  {
    type: 'agent',
    text: "Jason says it's done and sent three after photos. When you've had a look, close out the job on your board.",
    time: '2:49 PM',
  },
  { type: 'live', text: 'Waiting on you · Close out the job', eta: 'On the board' },
  { type: 'gate', id: 'close-out' },
  { type: 'action', icon: CheckCircle2, accent: 'sage', title: 'You confirmed the work is done', detail: 'Leak resolved, no follow-up needed', time: '2:50 PM' },
  {
    type: 'action',
    icon: CheckCircle2,
    accent: 'sage',
    title: 'You recommended Jason',
    detail: "He's now Recommended by 13 Homewisers",
    time: '2:50 PM',
    when: (ctx) => ctx.recommended === 'yes',
  },
  { type: 'action', icon: CheckCircle2, accent: 'sage', title: 'Job closed out', detail: 'Logged in your home file', time: '2:50 PM' },
  {
    type: 'agent',
    text: "All wrapped up. The leak's fixed and the job's closed out. I'll keep a quiet eye out for any follow-ups.",
    time: '2:51 PM',
  },
  { type: 'live', done: true, text: 'Completed · Friday April 25', eta: 'Closed out' },
];

const delayFor = (m) =>
  m.type === 'date' ? 6500 : m.type === 'thinking' ? 1000 : m.type === 'agent' ? 1150 : m.type === 'action' ? 950 : m.type === 'photos' ? 500 : m.type === 'live' ? 450 : 650;

function stateLabelFor(step, local, gates, done) {
  if (done) return { label: 'Closed out', pulse: false };
  const m = script[step];
  if (!m) return { label: null, pulse: false };
  if (m.type === 'gate') {
    if (m.id === 'kickoff') return { label: null, pulse: false };
    if (m.id === 'upload') return { label: 'Photo needed', pulse: false };
    if (m.id === 'urgency') return { label: 'Your call', pulse: false };
    if (m.id === 'generate') return { label: 'Scoped', pulse: false };
    return { label: 'Waiting on you · see the board', pulse: false };
  }
  if (m.type === 'chips') return { label: 'Scoped', pulse: false };
  return { label: 'Working on it', pulse: true };
}

export default function Thread({ open, onToggle, gates, scheduledSlot, recommended, onEffect }) {
  const [step, setStep] = useState(1);
  const [kickoffClicked, setKickoffClicked] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urgency, setUrgency] = useState('soon');
  const [urgencyChosen, setUrgencyChosen] = useState(false);
  const [generateClicked, setGenerateClicked] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const firedEffects = useRef(new Set());
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  const ctx = { urgency, scheduledSlot, recommended };

  const localGateCleared = (id) => {
    if (id === 'kickoff') return kickoffClicked;
    if (id === 'upload') return photosUploaded;
    if (id === 'urgency') return urgencyChosen;
    if (id === 'generate') return generateClicked;
    return !!gates[id];
  };

  // Script engine: advance on timers, block on gates, fire effects once.
  useEffect(() => {
    if (step >= script.length) return;
    const m = script[step];
    if (m.type === 'gate') {
      if (!localGateCleared(m.id)) return;
      setStep((s) => s + 1);
      return;
    }
    if (m.when && !m.when(ctx)) {
      setStep((s) => s + 1);
      return;
    }
    if (m.type === 'effect') {
      if (!firedEffects.current.has(step)) {
        firedEffects.current.add(step);
        onEffect?.(m.effect);
      }
      setStep((s) => s + 1);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), delayFor(m));
    return () => clearTimeout(t);
  }, [step, kickoffClicked, photosUploaded, urgencyChosen, generateClicked, gates, onEffect]);

  // Auto-scroll on new messages (and when re-opening the pane)
  useEffect(() => {
    if (open && messagesRef.current) {
      messagesRef.current.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [step, open]);

  const visible = script.slice(0, step).filter((m) => !['gate', 'effect'].includes(m.type));
  const done = step >= script.length;
  const atKickoff = script[step]?.type === 'gate' && script[step]?.id === 'kickoff';
  const { label: stateLabel, pulse } = stateLabelFor(step, null, gates, done);
  const waitingOnBoard = script[step]?.type === 'gate' && ['approve-scope', 'approve-outreach', 'approve-jason', 'close-out'].includes(script[step]?.id);

  function handleUpload() {
    if (uploading || photosUploaded) return;
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setPhotosUploaded(true);
    }, 1200);
  }

  return (
    <div
      style={{ width: open ? 460 : 56, transition: 'width 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}
      className="shrink-0 h-full bg-white/60 backdrop-blur-md border-r border-ink-100/80 overflow-hidden"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {open ? (
          <motion.div
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="w-[460px] h-full flex flex-col"
          >
      {/* Thread header */}
      <div className="shrink-0 px-4 py-3 border-b border-ink-100/80 flex items-center gap-2 bg-gradient-to-b from-white to-canvas-soft/20">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className={`absolute inset-0 rounded-full bg-sage-300 ${pulse ? 'animate-pulseDot' : ''}`} />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
        </span>
        <span className="text-[12px] font-medium text-ink-500 truncate">
          {stateLabel || 'Homewise AI'}
        </span>
        <button
          onClick={() => onToggle(false)}
          title="Collapse the conversation"
          className="ml-auto h-7 w-7 rounded-lg ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0"
        >
          <ChevronsLeft size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4 bg-gradient-to-b from-canvas-soft/30 to-white scroll-smooth"
      >
        {visible.map((m, i) => {
          const isLast = i === visible.length - 1;
          if (m.when && !m.when(ctx)) return null;
          if (m.type === 'date') return <DateDivider key={i} m={m} />;
          if (m.type === 'user') return <UserMessage key={i} m={m} ctx={ctx} />;
          if (m.type === 'photos') return <PhotoStrip key={i} m={m} />;
          if (m.type === 'thinking') return <Thinking key={i} m={m} />;
          if (m.type === 'action') return <ActionItem key={i} m={m} ctx={ctx} />;
          if (m.type === 'live') return (m.done || isLast) ? <LiveIndicator key={i} m={m} ctx={ctx} /> : null;
          if (m.type === 'urgency')
            return (
              <UrgencyPick
                key={i}
                m={m}
                selectedId={urgency}
                locked={urgencyChosen}
                onSelect={(id) => {
                  setUrgency(id);
                  setUrgencyChosen(true);
                }}
              />
            );
          if (m.type === 'chips')
            return (
              <ChipsRow
                key={i}
                onFocusInput={() => inputRef.current?.focus()}
                onGenerate={() => setGenerateClicked(true)}
                locked={generateClicked}
              />
            );
          if (m.type === 'agent')
            return (
              <AgentMessage
                key={i}
                m={m}
                uploaded={photosUploaded}
                uploading={uploading}
                onUpload={m.photoRequest ? handleUpload : undefined}
              />
            );
          return null;
        })}

        {waitingOnBoard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center gap-1.5 justify-center text-[11px] text-ink-400 pt-1"
          >
            The decision lives on the board
            <ArrowRight size={11} strokeWidth={2} />
          </motion.div>
        )}
      </div>

      {/* Kickoff suggestion */}
      {atKickoff && (
        <div className="shrink-0 px-4 pb-2 flex flex-wrap gap-1.5">
          <button
            onClick={() => setKickoffClicked(true)}
            className="h-9 px-3.5 rounded-full bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-all"
          >
            <Sparkles size={12} strokeWidth={2.2} />
            My kitchen sink is leaking
          </button>
          <span className="h-9 inline-flex items-center px-2 text-[11.5px] text-ink-400">
            or describe it below
          </span>
        </div>
      )}

      {/* Input dock */}
      <div className="shrink-0 border-t border-ink-100/80 px-3 py-2.5 flex items-center gap-1.5 bg-gradient-to-t from-canvas-soft/40 to-white">
        <button className="h-9 w-9 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0">
          <Paperclip size={13} strokeWidth={1.8} />
        </button>
        <div className="relative flex-1 min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputValue.trim()) {
                setInputValue('');
                if (atKickoff) setKickoffClicked(true);
              }
            }}
            placeholder="Reply to Homewise…"
            className="w-full h-9 pl-3 pr-9 rounded-xl bg-canvas-soft border border-ink-100 placeholder:text-ink-400 text-[12.5px] focus:outline-none focus:border-ink-300"
          />
          <button
            onClick={() => {
              if (inputValue.trim()) {
                setInputValue('');
                if (atKickoff) setKickoffClicked(true);
              }
            }}
            disabled={!inputValue.trim()}
            className={`absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-lg flex items-center justify-center transition-all ${
              inputValue.trim() ? 'bg-ink-900 text-canvas-soft hover:bg-ink-700' : 'text-ink-300'
            }`}
          >
            <ArrowUp size={12} strokeWidth={2} />
          </button>
        </div>
        <button className="h-9 w-9 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0">
          <Mic size={13} strokeWidth={1.8} />
        </button>
      </div>
          </motion.div>
        ) : (
          <motion.div
            key="strip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="w-14 h-full flex flex-col items-center py-4 gap-3"
          >
            <button
              onClick={() => onToggle(true)}
              title="Open the conversation"
              className="h-9 w-9 rounded-xl bg-white ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft flex items-center justify-center text-ink-700 hover:text-ink-900 transition-colors shrink-0"
            >
              <ChevronsRight size={15} strokeWidth={2} />
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10 shrink-0">
              <Sparkles size={13} strokeWidth={2.2} />
            </span>
            {!done && (
              <span className="relative flex h-2 w-2 shrink-0">
                <span className={`absolute inset-0 rounded-full bg-sage-300 ${pulse ? 'animate-pulseDot' : ''}`} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
              </span>
            )}
            <button
              onClick={() => onToggle(true)}
              title="Open the conversation"
              className="flex-1 flex flex-col items-center justify-center gap-2 w-full rounded-xl text-ink-500 hover:text-ink-900 hover:bg-canvas-soft/70 transition-colors"
            >
              <span className="[writing-mode:vertical-rl] rotate-180 text-[11px] uppercase tracking-[0.2em] font-semibold">
                Conversation
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Message renderers ────────────────────────────────────────────────────────

const resolve = (v, ctx) => (typeof v === 'function' ? v(ctx) : v);

const photoToneMap = {
  sage: 'from-sage-200 to-sage-300',
  sky: 'from-sky2026-100 to-sky2026-300',
  ember: 'from-ember-100 to-ember-200',
};

const actionAccentMap = {
  sage: 'text-sage-600 ring-sage-100',
  sky: 'text-sky2026-700 ring-sky2026-100',
  ember: 'text-ember-500 ring-ember-100',
};

function AgentAvatar() {
  return (
    <span className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
      <Sparkles size={12} strokeWidth={2.2} />
    </span>
  );
}

function DateDivider({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 pt-2"
    >
      <span className="flex-1 h-px bg-ink-100" />
      <span className="text-[10px] uppercase tracking-[0.2em] text-ink-500 font-semibold whitespace-nowrap">
        {m.label}
      </span>
      <span className="flex-1 h-px bg-ink-100" />
    </motion.div>
  );
}

function UserMessage({ m, ctx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-start gap-2 justify-end"
    >
      <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-ink-900 text-canvas-soft px-3.5 py-2.5">
        <p className="text-[13px] leading-relaxed">{resolve(m.text, ctx)}</p>
        <div className="mt-0.5 flex items-center justify-end">
          <span className="text-[10px] tabular-nums text-canvas-soft/60">{m.time}</span>
        </div>
      </div>
      <div className="shrink-0 mt-0.5 h-7 w-7 rounded-2xl ring-1 ring-ink-100 overflow-hidden bg-gradient-to-br from-sage-200 via-sage-100 to-ember-100 flex items-center justify-center">
        <span className="editorial text-[12px] text-sage-700">M</span>
      </div>
    </motion.div>
  );
}

function PhotoStrip({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-2 justify-end"
    >
      {m.photos.map((p, i) => (
        <div key={i} className="relative w-32 h-24 rounded-2xl overflow-hidden ring-1 ring-ink-100">
          <div className={`absolute inset-0 bg-gradient-to-br ${photoToneMap[p.tone]}`} />
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute top-1.5 left-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-1.5 py-0.5 text-[9.5px] font-semibold text-ink-700 ring-1 ring-ink-100">
              <ImageIcon size={9} strokeWidth={2.2} />
              {p.label}
            </span>
          </div>
          <div className="absolute bottom-1.5 left-1.5 right-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-ink-900/80 backdrop-blur px-1.5 py-0.5 text-[9.5px] font-semibold text-canvas-soft">
              <Sparkles size={9} className="text-sage-200" strokeWidth={2.2} />
              AI: {p.tag}
            </span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

function Thinking({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <AgentAvatar />
      <div className="rounded-2xl rounded-tl-md bg-canvas-soft border border-ink-100 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-pulseDot" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-pulseDot" style={{ animationDelay: '0.2s' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-pulseDot" style={{ animationDelay: '0.4s' }} />
          <span className="ml-2 text-[11.5px] text-ink-500 italic">{m.text}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ActionItem({ m, ctx }) {
  const Icon = m.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2.5 pl-1"
    >
      <span className={`shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl ring-1 bg-white ${actionAccentMap[m.accent]}`}>
        <Icon size={12} strokeWidth={1.8} />
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[12px] font-medium text-ink-900">{resolve(m.title, ctx)}</span>
          <span className="text-[10px] tabular-nums text-ink-400 shrink-0">{m.time}</span>
        </div>
        <div className="text-[11px] text-ink-500 mt-0.5">{resolve(m.detail, ctx)}</div>
      </div>
    </motion.div>
  );
}

function LiveIndicator({ m, ctx }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-center gap-2.5 rounded-2xl bg-canvas-soft border border-dashed border-ink-200 px-3 py-2.5 mt-1"
    >
      {m.done ? (
        <CheckCircle2 size={13} strokeWidth={2.2} className="text-sage-600 shrink-0" />
      ) : (
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inset-0 rounded-full bg-sage-300 animate-pulseDot" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
        </span>
      )}
      <div className="flex-1 text-[12px] text-ink-700">{resolve(m.text, ctx)}</div>
      <span className="text-[10px] text-ink-500 shrink-0">{m.eta}</span>
    </motion.div>
  );
}

function UrgencyPick({ m, selectedId, onSelect, locked }) {
  const toneMap = {
    ember: 'bg-ember-50 text-ember-500 ring-ember-100',
    sage: 'bg-sage-50 text-sage-600 ring-sage-100',
    sky: 'bg-sky2026-50 text-sky2026-700 ring-sky2026-100',
  };
  const selectedTone = {
    ember: 'bg-ember-500 text-white ring-ember-500',
    sage: 'bg-sage-500 text-white ring-sage-500',
    sky: 'bg-sky2026-500 text-white ring-sky2026-500',
  };
  const options = [
    { id: 'urgent', label: 'Active leak now', tone: 'ember', icon: Flame, sub: 'Get someone today' },
    { id: 'soon', label: 'Slow leak, this week', tone: 'sage', icon: Clock, sub: 'Standard window' },
    { id: 'flexible', label: 'Just an annoyance', tone: 'sky', icon: CalendarDays, sub: 'Whenever convenient' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-2"
    >
      <AgentAvatar />
      <div className="flex-1 min-w-0 rounded-2xl rounded-tl-md bg-white border border-ink-100 px-3.5 py-3">
        <p className="text-[13px] leading-relaxed text-ink-900">{m.text}</p>
        <div className="mt-2.5 space-y-1.5">
          {options.map((o) => {
            const Icon = o.icon;
            const isSelected = selectedId === o.id && locked;
            return (
              <button
                key={o.id}
                onClick={() => !locked && onSelect?.(o.id)}
                disabled={locked}
                className={`w-full rounded-xl px-2.5 py-2 text-left ring-1 transition-all flex items-center gap-2 ${
                  isSelected ? selectedTone[o.tone] : toneMap[o.tone]
                } ${locked && !isSelected ? 'opacity-40' : ''}`}
              >
                <Icon size={12} strokeWidth={2} className="shrink-0" />
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] flex-1">{o.label}</span>
                <span className={`text-[10.5px] ${isSelected ? 'text-white/80' : 'opacity-70'}`}>{o.sub}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-1.5 flex items-center justify-end">
          <span className="text-[10px] tabular-nums text-ink-400">{m.time}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ChipsRow({ onFocusInput, onGenerate, locked }) {
  if (locked) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="pt-1 flex flex-wrap items-center gap-1.5 justify-end"
    >
      <button
        onClick={onFocusInput}
        className="h-8 px-3 rounded-full bg-white border border-ink-200 hover:border-ink-300 hover:bg-canvas-soft text-ink-700 hover:text-ink-900 text-[12px] font-medium transition-all"
      >
        Add or correct something
      </button>
      <button
        onClick={onGenerate}
        className="group h-8 pl-2.5 pr-3 rounded-full bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-1.5 text-[12px] font-semibold transition-all"
      >
        <Sparkles size={11} strokeWidth={2.2} />
        Generate scope of work
        <ArrowRight size={10} strokeWidth={2.2} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </motion.div>
  );
}

function AgentMessage({ m, uploaded, uploading, onUpload }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-2"
    >
      <AgentAvatar />
      <div className="flex-1 min-w-0 max-w-[88%] space-y-2">
        <div className="rounded-2xl rounded-tl-md bg-white border border-ink-100 px-3.5 py-2.5">
          <p className="text-[13px] leading-relaxed text-ink-900">{m.text}</p>

          {m.photoRequest && (
            <div className="mt-2.5 rounded-xl bg-canvas-soft border border-dashed border-ink-200 p-2.5">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-2">
                <Camera size={10} className="text-sage-600" />
                {uploaded ? 'Photo checked' : 'Photo requested'}
              </div>
              <div className={`flex items-start gap-2 rounded-lg px-2 py-1.5 ${uploaded ? '' : 'bg-white ring-1 ring-sage-100'}`}>
                <span
                  className={`shrink-0 mt-0.5 inline-flex h-[17px] w-[17px] items-center justify-center rounded-md ring-1 ${
                    uploaded ? 'bg-sage-500 text-white ring-sage-500' : 'bg-white text-sage-600 ring-sage-100'
                  }`}
                >
                  {uploaded ? <CheckCircle2 size={10} strokeWidth={2.5} /> : <Camera size={9} strokeWidth={2.2} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-ink-900 leading-snug">Under the sink</div>
                  <div className="text-[11px] text-ink-500 leading-snug">The P-trap area, with the cabinet doors open</div>
                  {uploaded && (
                    <div className="mt-1 inline-flex items-center gap-1 text-[10.5px] text-sage-700">
                      <Sparkles size={9} className="text-sage-500" strokeWidth={2.2} />
                      Standing water right at the P-trap joint. The slip nut is weeping.
                    </div>
                  )}
                </div>
              </div>
              {uploaded ? (
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-sage-700">
                  <CheckCircle2 size={12} strokeWidth={2.2} />
                  Photo received
                </div>
              ) : (
                <button
                  onClick={onUpload}
                  disabled={uploading}
                  className={`mt-2.5 w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-lg transition-all text-[12px] font-semibold ${
                    uploading ? 'bg-ink-900/70 text-canvas-soft/80 cursor-wait' : 'bg-ink-900 text-canvas-soft hover:bg-ink-700'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={12} strokeWidth={2.2} className="animate-spin" />
                      Checking photo…
                    </>
                  ) : (
                    <>
                      <Camera size={12} strokeWidth={2} />
                      Upload photo
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {m.follow && (
            <ol className="mt-2.5 space-y-1.5">
              {m.follow.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-[12.5px] text-ink-700 leading-snug">
                  <span className="shrink-0 mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sage-100 text-sage-700 text-[9.5px] font-bold tabular-nums">
                    {i + 1}
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-1.5 flex items-center justify-end">
            <span className="text-[10px] tabular-nums text-ink-400">{m.time}</span>
          </div>
        </div>

        {m.summary && (
          <div className="rounded-xl bg-canvas-soft border border-ink-100 p-3">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-1.5">
              <CheckCircle2 size={10} className="text-sage-600" />
              Scoped as
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11.5px]">
              <div className="text-ink-500">Job</div>
              <div className="text-ink-900 font-medium">{m.summary.job}</div>
              <div className="text-ink-500">Scope</div>
              <div className="text-ink-900 font-medium">{m.summary.scope}</div>
              <div className="text-ink-500">Duration</div>
              <div className="text-ink-900 font-medium">{m.summary.duration}</div>
              <div className="text-ink-500">Local benchmark</div>
              <div className="text-ink-900 font-medium tabular-nums">{m.summary.benchmark}</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
