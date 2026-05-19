import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Camera,
  Pencil,
  Paperclip,
  Mic,
  ArrowRight,
  Image as ImageIcon,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  Flame,
  CalendarDays,
} from 'lucide-react';
import BackBar from '../components/ui/BackBar';

// Conversation script. staged
const script = [
  {
    type: 'user',
    text: 'My bathroom sink is leaking and I need someone this week.',
    time: '10:28 AM',
  },
  {
    type: 'agent-thinking',
    text: 'One sec, figuring out what I need to see…',
  },
  {
    type: 'agent',
    text: "Got it. Before I scope this for contractors, I need a couple of photos to rule things out. Specifically these shots:",
    requestShots: [
      'Under the sink: the P-trap area, with the cabinet doors open',
      'The faucet base from above (where the spout meets the counter)',
      "Inside the cabinet behind the back panel (only if you can reach safely)",
    ],
    time: '10:28 AM',
  },
  {
    type: 'user',
    text: 'Sending the first two. Panel photo coming in a sec.',
    time: '10:30 AM',
  },
  {
    type: 'photos',
    photos: [
      { label: 'Under the sink', tone: 'sage', tag: 'Standing water' },
      { label: 'Faucet base', tone: 'sky', tag: 'Slight drip' },
    ],
  },
  {
    type: 'agent-thinking',
    text: 'Looking at your photos…',
  },
  {
    type: 'agent',
    text: 'From your photos: standing water at the P-trap joint, slow drip at the faucet base. Two separate problems.',
    time: '10:30 AM',
  },
  {
    type: 'agent-urgency',
    text: 'Quick check, how active is this right now? It changes how fast I push for a contractor.',
    options: [
      { id: 'urgent', label: 'Active leak now', tone: 'ember', icon: Flame, sub: 'Get someone today' },
      { id: 'soon', label: 'Slow leak, this week', tone: 'sage', icon: Clock, sub: 'Standard window', selected: true },
      { id: 'flexible', label: 'Just an annoyance', tone: 'sky', icon: CalendarDays, sub: 'Whenever convenient' },
    ],
    time: '10:30 AM',
  },
  {
    type: 'user',
    text: 'Slow leak. Sometime this week is fine.',
    time: '10:30 AM',
  },
  {
    type: 'agent',
    text: "Standard 5-day quote window. Two quick things and I can scope this:",
    follow: [
      "Can you send the cabinet-panel photo now? I want to confirm the supply line is dry.",
      'Is the faucet a single-handle or two-handle?',
    ],
    time: '10:31 AM',
  },
  {
    type: 'user',
    text: 'Single-handle. Sending the panel photo now.',
    time: '10:31 AM',
  },
  {
    type: 'photos',
    photos: [
      { label: 'Behind panel', tone: 'ember', tag: 'Supply line dry' },
    ],
  },
  {
    type: 'agent',
    text: "Perfect, supply line is dry, so this is contained. I'll scope this as a P-trap replacement plus a single-handle faucet cartridge swap. Standard 1.5-2 hour visit, no wall work needed.",
    summary: {
      job: 'Kitchen sink leak + drip',
      scope: 'P-trap replacement, faucet cartridge replacement',
      duration: '1.5–2 hours',
      benchmark: '$180–$320',
    },
    time: '10:32 AM',
  },
];

const toneMap = {
  sage: 'from-sage-200 to-sage-300',
  sky: 'from-sky2026-100 to-sky2026-300',
  ember: 'from-ember-100 to-ember-200',
};

const urgencyReplies = {
  urgent: 'Active leak right now. Need someone today.',
  soon: 'Slow leak. Sometime this week is fine.',
  flexible: 'Just an annoyance. Whenever convenient.',
};

function getConversationState(step, photosUploaded, urgencyChosen, done) {
  if (done) return { label: 'Scoped', pulse: false };
  if (step === 0) return { label: null, pulse: false };
  if (step === 3 && !photosUploaded) return { label: 'Photos needed', pulse: false };
  if (step === 8 && !urgencyChosen) return { label: 'Your call', pulse: false };
  if (step >= 5 && step <= 6) return { label: 'Analyzing photos', pulse: true };
  if (step >= 12) return { label: 'Building scope', pulse: true };
  const last = script[step - 1];
  if (last?.type === 'agent-thinking' || last?.type === 'user' || last?.type === 'photos') {
    return { label: 'Working on it', pulse: true };
  }
  return { label: 'Working on it', pulse: false };
}

export default function IntakePage({ onNavigate }) {
  const [step, setStep] = useState(0);
  const [urgency, setUrgency] = useState('soon');
  const [urgencyChosen, setUrgencyChosen] = useState(false);
  const [photosUploaded, setPhotosUploaded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesRef = React.useRef(null);
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (step >= script.length) return;
    // Gate auto-advance on user actions
    if (step === 3 && !photosUploaded) return;
    if (step === 8 && !urgencyChosen) return;
    const m = script[step];
    const delay = m.type === 'agent-thinking' ? 900 : m.type === 'agent' ? 1100 : 700;
    const t = setTimeout(() => setStep((s) => s + 1), delay);
    return () => clearTimeout(t);
  }, [step, photosUploaded, urgencyChosen]);

  // Auto-scroll the messages container (not the page) when new messages arrive
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTo({
        top: messagesRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [step]);

  const visible = script.slice(0, step);
  const done = step >= script.length;
  const { label: stateLabel, pulse } = getConversationState(step, photosUploaded, urgencyChosen, done);

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] max-w-[820px] mx-auto">
      <BackBar
        onBack={() => onNavigate?.('overview')}
        label="Back to home"
      />

      {/* Conversation card. fills available height, input pinned at bottom */}
      <div className="flex-1 min-h-0 rounded-3xl bg-white border border-ink-100/80 overflow-hidden flex flex-col">
        {/* Card header */}
        <div className="shrink-0 px-6 py-4 border-b border-ink-100/80 flex items-center gap-2 bg-gradient-to-b from-white to-canvas-soft/20">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className={`absolute inset-0 rounded-full bg-sage-300 ${pulse ? 'animate-pulseDot' : ''}`} />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-500" />
          </span>
          {stateLabel && (
            <span className="text-[12px] font-medium text-ink-500">{stateLabel}</span>
          )}
          <button
            onClick={() => onNavigate?.('intake')}
            className="ml-auto flex items-center gap-1 text-[11px] text-ink-400 hover:text-ink-700 transition-colors"
          >
            <Plus size={11} strokeWidth={2} />
            New issue
          </button>
        </div>

        {/* Messages. scrolls internally */}
        <div
          ref={messagesRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-5 bg-gradient-to-b from-canvas-soft/30 to-white scroll-smooth"
        >
          {step === 0 && (
            <p className="text-center editorial text-[20px] text-ink-400 py-4">What's happening at home?</p>
          )}

          {visible.map((m, i) => {
            if (m.type === 'user') {
              const text = i === 7 ? urgencyReplies[urgency] : m.text;
              return <UserMessage key={i} m={{ ...m, text }} />;
            }
            if (m.type === 'photos') return (
              <PhotoStrip
                key={i}
                m={m}
                onCorrect={(label) => {
                  setInputValue(`Actually, the "${label.toLowerCase()}" photo shows `);
                  inputRef.current?.focus();
                }}
              />
            );
            if (m.type === 'agent-thinking') return <Thinking key={i} m={m} />;
            if (m.type === 'agent-urgency')
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
            if (m.type === 'agent')
              return (
                <AgentMessage
                  key={i}
                  m={m}
                  uploaded={photosUploaded}
                  onUploadPhotos={i === 2 ? () => setPhotosUploaded(true) : undefined}
                />
              );
            return null;
          })}

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="pt-1 flex flex-wrap items-center gap-2 justify-end"
            >
              <button
                onClick={() => inputRef.current?.focus()}
                className="h-9 px-3.5 rounded-full bg-white border border-ink-200 hover:border-ink-300 hover:bg-canvas-soft text-ink-700 hover:text-ink-900 text-[12.5px] font-medium transition-all"
              >
                Add or correct something
              </button>
              <button
                onClick={() => onNavigate?.('scope')}
                className="group h-9 pl-3 pr-3.5 rounded-full bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-all"
              >
                <Sparkles size={12} strokeWidth={2.2} />
                Generate scope of work
                <ArrowRight size={11} strokeWidth={2.2} className="opacity-70 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Pinned input dock — always present, ChatGPT-style */}
        <div className="shrink-0 border-t border-ink-100/80 px-4 py-3 flex items-center gap-2 bg-gradient-to-t from-canvas-soft/40 to-white">
          <button className="h-10 w-10 rounded-2xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0">
            <Paperclip size={14} strokeWidth={1.8} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Reply to Homewise…"
            className="flex-1 min-w-0 h-10 px-3.5 rounded-2xl bg-canvas-soft border border-ink-100 placeholder:text-ink-400 text-[13px] focus:outline-none focus:border-ink-300"
          />
          <button className="h-10 w-10 rounded-2xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0">
            <Mic size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ m }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex items-start gap-2.5 justify-end"
    >
      <div className="max-w-[78%] rounded-3xl rounded-tr-md bg-ink-900 text-canvas-soft px-4 py-3">
        <p className="text-[14px] leading-relaxed">{m.text}</p>
        <div className="mt-1 flex items-center justify-end">
          <span className="text-[10.5px] tabular-nums text-canvas-soft/60">
            {m.time}
          </span>
        </div>
      </div>
      <div className="shrink-0 mt-0.5 h-8 w-8 rounded-2xl ring-1 ring-ink-100 overflow-hidden bg-gradient-to-br from-sage-200 via-sage-100 to-ember-100 flex items-center justify-center">
        <span className="editorial text-[14px] text-sage-700">M</span>
      </div>
    </motion.div>
  );
}

function PhotoStrip({ m, onCorrect }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex gap-2 justify-end"
    >
      {m.photos.map((p, i) => (
        <div
          key={i}
          className="relative w-32 h-24 rounded-2xl overflow-hidden ring-1 ring-ink-100"
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${toneMap[p.tone]}`}
          />
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
          {onCorrect && (
            <button
              onClick={() => onCorrect(p.label)}
              className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-white/90 backdrop-blur ring-1 ring-ink-100 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-colors"
              title="Correct this"
            >
              <Pencil size={9} strokeWidth={2.2} />
            </button>
          )}
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
      className="flex items-center gap-2.5"
    >
      <span className="shrink-0 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
        <Sparkles size={13} strokeWidth={2.2} />
      </span>
      <div className="rounded-2xl rounded-tl-md bg-canvas-soft border border-ink-100 px-3.5 py-2.5">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-pulseDot" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-pulseDot" style={{ animationDelay: '0.2s' }} />
          <span className="h-1.5 w-1.5 rounded-full bg-ink-300 animate-pulseDot" style={{ animationDelay: '0.4s' }} />
          <span className="ml-2 text-[12px] text-ink-500 italic">{m.text}</span>
        </div>
      </div>
    </motion.div>
  );
}

function UrgencyPick({ m, selectedId, onSelect, locked }) {
  const toneMap = {
    ember: 'bg-ember-50 text-ember-500 ring-ember-100 hover:bg-ember-50/80',
    sage: 'bg-sage-50 text-sage-600 ring-sage-100 hover:bg-sage-50/80',
    sky: 'bg-sky2026-50 text-sky2026-700 ring-sky2026-100 hover:bg-sky2026-50/80',
  };
  const selectedTone = {
    ember: 'bg-ember-500 text-white ring-ember-500',
    sage: 'bg-sage-500 text-white ring-sage-500',
    sky: 'bg-sky2026-500 text-white ring-sky2026-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-2.5"
    >
      <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
        <Sparkles size={13} strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0 max-w-[88%] space-y-2.5">
        <div className="rounded-3xl rounded-tl-md bg-white border border-ink-100 px-4 py-3">
          <p className="text-[14px] leading-relaxed text-ink-900">{m.text}</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            {m.options.map((o) => {
              const Icon = o.icon;
              const isSelected = selectedId === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => !locked && onSelect?.(o.id)}
                  disabled={locked}
                  className={`group rounded-2xl p-2.5 text-left ring-1 transition-all ${
                    isSelected ? selectedTone[o.tone] : `${toneMap[o.tone]} bg-canvas-soft`
                  } ${locked && !isSelected ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Icon size={12} strokeWidth={2} />
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em]">
                      {o.label}
                    </span>
                  </div>
                  <div className={`text-[11px] ${isSelected ? 'text-white/80' : 'opacity-70'}`}>
                    {o.sub}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex items-center justify-end">
            <span className="text-[10.5px] tabular-nums text-ink-400">{m.time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AgentMessage({ m, onUploadPhotos, uploaded }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-2.5"
    >
      <span className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft ring-1 ring-sage-700/10">
        <Sparkles size={13} strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0 max-w-[88%] space-y-2.5">
        <div className="rounded-3xl rounded-tl-md bg-white border border-ink-100 px-4 py-3">
          <p className="text-[14px] leading-relaxed text-ink-900">{m.text}</p>
          {m.requestShots && (
            <div className="mt-3 rounded-2xl bg-canvas-soft border border-dashed border-ink-200 p-3">
              <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-2">
                <Camera size={11} className="text-sage-600" />
                Photos requested · 3 shots
              </div>
              <ul className="space-y-1.5">
                {m.requestShots.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-[13px] text-ink-700 leading-snug"
                  >
                    <span className="shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white text-sage-600 ring-1 ring-sage-100 text-[10px] font-bold tabular-nums">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={onUploadPhotos}
                disabled={uploaded || !onUploadPhotos}
                className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-xl transition-all text-[12.5px] font-semibold ${
                  uploaded
                    ? 'bg-sage-50 text-sage-700 ring-1 ring-sage-100'
                    : 'bg-ink-900 text-canvas-soft hover:bg-ink-700'
                }`}
              >
                {uploaded ? (
                  <>
                    <CheckCircle2 size={13} strokeWidth={2.2} />
                    Photos uploaded
                  </>
                ) : (
                  <>
                    <Camera size={13} strokeWidth={2} />
                    Upload photos
                  </>
                )}
              </button>
            </div>
          )}
          {m.follow && (
            <ol className="mt-3 space-y-2">
              {m.follow.map((f, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[13px] text-ink-700 leading-snug"
                >
                  <span className="shrink-0 mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-sage-100 text-sage-700 text-[10px] font-bold tabular-nums">
                    {i + 1}
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ol>
          )}
          <div className="mt-2 flex items-center justify-end">
            <span className="text-[10.5px] tabular-nums text-ink-400">{m.time}</span>
          </div>
        </div>
        {m.summary && (
          <div className="rounded-2xl bg-canvas-soft border border-ink-100 p-3.5">
            <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold mb-2">
              <CheckCircle2 size={11} className="text-sage-600" />
              Scoped as
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px]">
              <div className="text-ink-500">Job</div>
              <div className="text-ink-900 font-medium">{m.summary.job}</div>
              <div className="text-ink-500">Scope</div>
              <div className="text-ink-900 font-medium">{m.summary.scope}</div>
              <div className="text-ink-500">Duration</div>
              <div className="text-ink-900 font-medium">{m.summary.duration}</div>
              <div className="text-ink-500">Local benchmark</div>
              <div className="text-ink-900 font-medium tabular-nums">
                {m.summary.benchmark}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
