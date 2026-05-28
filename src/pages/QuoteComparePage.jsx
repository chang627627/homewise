import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Info,
  CheckCircle2,
  MessageCircle,
  Clock,
  Hourglass,
  Send,
  Phone,
  Star,
  Calendar,
} from 'lucide-react';
import BackBar from '../components/ui/BackBar';
import FlowProgress from '../components/ui/FlowProgress';
import Pill from '../components/ui/Pill';

// User-selectable availability windows
const WINDOWS = [
  { id: 'weekday-am', label: 'Weekday AM' },
  { id: 'weekday-pm', label: 'Weekday PM' },
  { id: 'evening', label: 'Evenings' },
  { id: 'weekend', label: 'Weekend' },
];

// 3 contractors as columns. `slots` are what the contractor offered; AI filters to user's windows.
const cols = [
  {
    id: 'jason',
    name: 'Jason Plumbing Co.',
    initials: 'J',
    accent: 'sage',
    total: 220,
    aiPick: true,
    verdict: { tone: 'sage', label: 'Fair price' },
    status: 'received',
    received: '11:08 AM today',
    bio: 'Family-run since 2012. 14 years licensed. Specializes in residential plumbing repairs and faucet replacements.',
    rating: { score: 4.8, reviews: 168 },
    responseTime: 'Usually replies within 2 hours',
    phone: '(510) 555-0142',
    slots: [
      { id: 'fri-2', time: 'Fri 2 PM', window: 'weekday-pm' },
      { id: 'fri-4', time: 'Fri 4 PM', window: 'weekday-pm' },
      { id: 'sat-10', time: 'Sat 10 AM', window: 'weekend' },
    ],
    schedule: {
      earliestStart: 'Fri Apr 25',
      estimatedCompletion: 'Fri Apr 25',
      duration: 'Same day · ~2 hr',
    },
    note: "Price assumes a Moen 1225 cartridge. If it turns out to be Delta, I'll confirm before scheduling so I source the right part.",
  },
  {
    id: 'bayline',
    name: 'Bayline Plumbing',
    initials: 'B',
    accent: 'sky',
    total: 390,
    verdict: { tone: 'ember', label: 'Higher than market' },
    status: 'received',
    received: '2:42 PM today',
    bio: 'Bayline has 9 years licensed and offers a 1-year workmanship warranty. Higher-end residential work.',
    rating: { score: 4.6, reviews: 92 },
    responseTime: 'Usually replies within 4 hours',
    phone: '(510) 555-0291',
    slots: [
      { id: 'sat-10', time: 'Sat 10 AM', window: 'weekend' },
      { id: 'sat-1', time: 'Sat 1 PM', window: 'weekend' },
      { id: 'mon-9', time: 'Mon 9 AM', window: 'weekday-am' },
    ],
    schedule: {
      earliestStart: 'Sat Apr 26',
      estimatedCompletion: 'Mon Apr 28',
      duration: '2 days · warranty follow-up visit',
    },
    note: "Includes a 1-yr workmanship warranty on this job. The $75 service fee is my standard for residential calls, waived only on same-day emergencies.",
  },
  {
    id: 'quickfix',
    name: 'Quickfix Pros',
    initials: 'Q',
    accent: 'ember',
    total: 175,
    verdict: { tone: 'ember', label: 'Low, missing details' },
    status: 'conversation',
    received: '4:15 PM today · clarifying',
    bio: 'Same-day availability for small plumbing fixes. 3 years licensed. Currently has a pending insurance renewal.',
    rating: { score: 4.5, reviews: 41 },
    responseTime: 'Usually replies within 1 hour',
    phone: '(510) 555-0463',
    slots: [
      { id: 'today-5', time: 'Today 5 PM', window: 'weekday-pm' },
      { id: 'tomorrow-9', time: 'Tomorrow 9 AM', window: 'weekday-am' },
      { id: 'sat-10', time: 'Sat 10 AM', window: 'weekend' },
    ],
    schedule: {
      earliestStart: 'Today · Apr 23',
      estimatedCompletion: 'Today · Apr 23',
      duration: 'Same day · ~2 hr',
    },
    note: "Quote is labor only. Materials TBD pending site visit. I can confirm same-day if you book this week.",
  },
];

// Suggested pre-filled questions, shown as click-to-fill chips in the contact drawer
const suggestedQuestions = [
  'Can you confirm cost includes materials?',
  'Will the area need to be cleared before you arrive?',
  'How long do you expect the visit to take?',
  'What happens if more work is needed once you start?',
];

const statusMap = {
  received: {
    tone: 'sage',
    icon: CheckCircle2,
    label: 'Quote received',
  },
  conversation: {
    tone: 'sky',
    icon: MessageCircle,
    label: 'In conversation',
  },
  awaiting: {
    tone: 'neutral',
    icon: Clock,
    label: 'Awaiting response',
  },
};

// Each row is a scope item, with cell info per contractor
const rows = [
  {
    label: 'Diagnose & test',
    sub: '0.25 hr · standard',
    cells: [
      { state: 'included', text: 'Included', value: 'Standard' },
      { state: 'included', text: 'Included', value: 'Standard' },
      { state: 'included', text: 'Included', value: 'Standard' },
    ],
  },
  {
    label: 'Replace P-trap',
    sub: '0.75 hr · materials included',
    cells: [
      { state: 'included', text: 'Included', value: '0.75 hr · PVC trap' },
      { state: 'included', text: 'Included', value: '0.75 hr · PVC trap' },
      { state: 'flag', text: 'Materials TBD', value: 'Labor only stated' },
    ],
  },
  {
    label: 'Replace faucet cartridge',
    sub: '0.5 hr · single-handle',
    cells: [
      { state: 'included', text: 'Included', value: '0.5 hr · cartridge' },
      { state: 'included', text: 'Included', value: '0.5 hr · cartridge' },
      { state: 'flag', text: 'Not specified', value: 'Bundled or excluded?' },
    ],
  },
  {
    label: 'Workmanship warranty',
    sub: '',
    cells: [
      { state: 'included', text: '90 days', value: 'Standard for trade' },
      { state: 'better', text: '1 year', value: 'Above market', badge: 'Better' },
      { state: 'flag', text: 'Not stated', value: 'Implied none' },
    ],
  },
  {
    label: 'Service / call-out fee',
    sub: 'Charged regardless of work',
    cells: [
      { state: 'none', text: '$0', value: 'Waived if booked' },
      { state: 'higher', text: '$75 premium', value: 'Above market', badge: 'Outlier' },
      { state: 'none', text: '$0', value: 'No fee disclosed' },
    ],
  },
  {
    label: 'Cleanup & photos',
    sub: '',
    cells: [
      { state: 'included', text: 'Included', value: 'Standard' },
      { state: 'included', text: 'Included', value: 'Standard' },
      { state: 'flag', text: 'Not stated', value: 'Ask before booking' },
    ],
  },
];

const stateMap = {
  included: {
    icon: Check,
    bg: 'bg-sage-50',
    fg: 'text-sage-600',
    ring: 'ring-sage-100',
    cell: 'bg-white',
  },
  better: {
    icon: TrendingUp,
    bg: 'bg-sage-50',
    fg: 'text-sage-700',
    ring: 'ring-sage-100',
    cell: 'bg-sage-50/40 ring-1 ring-sage-100',
  },
  higher: {
    icon: TrendingUp,
    bg: 'bg-ember-50',
    fg: 'text-ember-500',
    ring: 'ring-ember-100',
    cell: 'bg-ember-50/40 ring-1 ring-ember-100',
  },
  flag: {
    icon: AlertTriangle,
    bg: 'bg-ember-50',
    fg: 'text-ember-500',
    ring: 'ring-ember-100',
    cell: 'bg-ember-50/40 ring-1 ring-ember-100',
  },
  none: {
    icon: X,
    bg: 'bg-ink-100',
    fg: 'text-ink-500',
    ring: 'ring-ink-100',
    cell: 'bg-white',
  },
};

const accentBg = {
  sage: 'from-sage-200 to-sage-400 ring-sage-300/40 text-sage-700',
  sky: 'from-sky2026-100 to-sky2026-300 ring-sky2026-300/40 text-sky2026-700',
  ember: 'from-ember-100 to-ember-300 ring-ember-300/40 text-ember-500',
};

export default function QuoteComparePage({ onNavigate }) {
  const [windows, setWindows] = useState(new Set(['weekday-pm', 'weekend']));
  const [picked, setPicked] = useState({ jason: 'fri-2', bayline: 'sat-10', quickfix: 'today-5' });
  const [contactOpen, setContactOpen] = useState(null); // contractor id or null
  const openContractor = cols.find((c) => c.id === contactOpen);

  const slotsFor = (c) => c.slots.filter((s) => windows.has(s.window));
  const pickedSlot = (c) => {
    const valid = slotsFor(c);
    return valid.find((s) => s.id === picked[c.id]) || valid[0] || null;
  };
  const toggleWindow = (id) => {
    setWindows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      <BackBar
        onBack={() => onNavigate?.('contractor-compare')}
        label="Back to contractors"
        context="Apples-to-apples · Kitchen sink leak"
      />

      <FlowProgress current="quote-compare" onNavigate={onNavigate} />

      {/* Header */}
      <header>
        <h1 className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900 tracking-tight">
          Three quotes, one normalized scope.
        </h1>
      </header>

      {/* AI plain-language summary */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="rounded-3xl bg-white border border-sage-100 px-6 py-5 md:px-7 flex items-start gap-3"
      >
        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-xl bg-sage-50 text-sage-500 ring-1 ring-sage-100 shrink-0">
          <Sparkles size={12} strokeWidth={2.2} />
        </span>
        <p className="editorial-italic text-[15px] leading-relaxed text-ink-900">
          "Jason is the cheapest <em className="not-italic font-medium text-ink-700">that's complete</em>, fair price, full scope, fastest. Bayline includes more (1-yr warranty) but charges a $75 fee + 21% labor premium. Quickfix is in conversation, their quote is missing materials and warranty language."
        </p>
      </motion.section>

      {/* Total bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cols.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className={`relative rounded-3xl border p-4 ${
              c.aiPick
                ? 'bg-white border-sage-200 ring-1 ring-sage-100'
                : 'bg-white border-ink-100/80'
            }`}
          >
            {c.aiPick && (
              <div className="absolute -top-2.5 left-4">
                <Pill tone="sage" icon={Sparkles}>
                  AI pick
                </Pill>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className={`relative h-10 w-10 rounded-2xl bg-gradient-to-br ${accentBg[c.accent]} ring-1 flex items-center justify-center shrink-0`}
              >
                <span className="editorial text-[15px]">{c.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-ink-900 tracking-[-0.005em] truncate">
                  {c.name}
                </div>
                <Pill tone={c.verdict.tone} className="mt-0.5">
                  {c.verdict.label}
                </Pill>
              </div>
              <div className="text-right shrink-0">
                <div className="editorial text-[24px] leading-none text-ink-900 tabular-nums">
                  ${c.total}
                </div>
                <div className="text-[10.5px] text-ink-500 mt-0.5">total</div>
              </div>
            </div>
            {c.schedule && (
              <div className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-ink-500">
                <Calendar size={11} strokeWidth={1.8} className="text-ink-400 shrink-0" />
                <span className="truncate">
                  Start <span className="figure text-ink-700">{c.schedule.earliestStart}</span>
                  <span className="text-ink-300 mx-1">·</span>
                  {c.schedule.duration}
                </span>
              </div>
            )}
            {c.note && (
              <div className="mt-3 pt-3 border-t border-ink-100/80">
                <p className="text-[12px] leading-relaxed text-ink-500 italic">
                  &ldquo;{c.note}&rdquo;
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* Comparison matrix */}
      <section className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
        {/* Sticky-style header (column avatars) */}
        <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-4 border-b border-ink-100/80 bg-canvas-soft/40">
          <div className="col-span-3">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
              Scope item
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.id} className="col-span-3 flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br ${accentBg[c.accent]} ring-1 text-[11px] editorial`}
              >
                {c.initials}
              </span>
              <span className="text-[12px] font-semibold text-ink-900 truncate">
                {c.name}
              </span>
              {c.aiPick && (
                <Sparkles size={11} className="text-sage-500 shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="divide-y divide-ink-100">
          {rows.map((row, rIdx) => (
            <motion.div
              key={row.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: rIdx * 0.04 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 items-stretch"
            >
              <div className="md:col-span-3 min-w-0">
                <div className="text-[13px] font-semibold text-ink-900 tracking-[-0.005em]">
                  {row.label}
                </div>
                {row.sub && <div className="text-[11.5px] text-ink-500 mt-0.5">{row.sub}</div>}
              </div>
              {row.cells.map((cell, i) => {
                const meta = stateMap[cell.state];
                const Icon = meta.icon;
                return (
                  <div
                    key={i}
                    className={`md:col-span-3 rounded-2xl px-3 py-2.5 ${meta.cell}`}
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md ${meta.bg} ${meta.fg} ring-1 ${meta.ring} shrink-0`}
                      >
                        <Icon size={11} strokeWidth={2.2} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[12.5px] font-semibold ${meta.fg}`}
                          >
                            {cell.text}
                          </span>
                          {cell.badge && (
                            <span className="inline-flex items-center rounded-full bg-white px-1.5 py-0.5 text-[9.5px] font-semibold ring-1 ring-current uppercase tracking-[0.1em]">
                              {cell.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-500 mt-0.5 leading-snug">
                          {cell.value}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Total row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-t border-ink-100 bg-canvas-deep/50 hairline-inset items-center">
          <div className="md:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
              Total
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.id} className="md:col-span-3 text-right md:text-left">
              <span className="editorial text-[20px] leading-none text-ink-900 tabular-nums">
                ${c.total}
              </span>
            </div>
          ))}
        </div>

        {/* Your availability — drives which contractor slots show below */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-t border-ink-100 bg-canvas-soft/40 items-center">
          <div className="md:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
              Your availability
            </div>
          </div>
          <div className="md:col-span-9 flex flex-wrap gap-1.5">
            {WINDOWS.map((w) => {
              const on = windows.has(w.id);
              return (
                <button
                  key={w.id}
                  onClick={() => toggleWindow(w.id)}
                  className={`h-8 px-3 rounded-full inline-flex items-center gap-1.5 text-[11.5px] font-medium transition-all ${
                    on
                      ? 'bg-ink-900 text-canvas-soft hairline-on-dark'
                      : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300'
                  }`}
                >
                  {on && <Check size={11} strokeWidth={2.4} />}
                  {w.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ask before booking — its own section, before the commit row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-t border-ink-100 bg-canvas-soft/40 items-center">
          <div className="md:col-span-3 flex flex-col justify-center">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
              Ask before booking
            </div>
            <div className="text-[11.5px] text-ink-500 mt-0.5">
              Optional. Talk first if you have questions.
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.id} className="md:col-span-3">
              <button
                onClick={() => setContactOpen(c.id)}
                className="w-full h-10 rounded-2xl bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-all"
              >
                <Phone size={12} strokeWidth={2} />
                Ask {c.name.split(' ')[0]}
              </button>
            </div>
          ))}
        </div>

        {/* Per-contractor approve actions, with slot chips that respect overlap */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-t border-ink-100 bg-white items-stretch">
          <div className="md:col-span-3 flex flex-col justify-center">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
              Pick a slot &amp; approve
            </div>
          </div>
          {cols.map((c) => {
            const valid = slotsFor(c);
            const sel = pickedSlot(c);
            const noOverlap = valid.length === 0;
            return (
              <div key={c.id} className="md:col-span-3 flex flex-col gap-2">
                {/* Slot chips */}
                {noOverlap ? (
                  <div className="rounded-xl bg-ember-50/50 border border-ember-100 px-3 py-2 text-[11.5px] text-ink-700 leading-snug">
                    No overlap with your availability. Add a window above or ask {c.name.split(' ')[0]} for more times.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {valid.map((s) => {
                      const on = sel?.id === s.id;
                      return (
                        <button
                          key={s.id}
                          onClick={() => setPicked((p) => ({ ...p, [c.id]: s.id }))}
                          className={`h-7 px-2.5 rounded-full inline-flex items-center gap-1 text-[11.5px] font-medium transition-all ${
                            on
                              ? 'bg-sage-500 text-white ring-1 ring-sage-500 hairline-on-dark'
                              : 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300'
                          }`}
                        >
                          <Clock size={10} strokeWidth={2} className={on ? 'opacity-90' : 'text-ink-400'} />
                          {s.time}
                        </button>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={() =>
                    onNavigate?.({
                      page: 'overview',
                      decisionHandled: true,
                      scheduledSlot: sel?.time,
                    })
                  }
                  disabled={noOverlap}
                  className={`w-full h-10 rounded-2xl inline-flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-all ${
                    noOverlap
                      ? 'bg-ink-100 text-ink-400 cursor-not-allowed'
                      : c.aiPick
                      ? 'bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark'
                      : 'bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft'
                  }`}
                >
                  {c.aiPick && !noOverlap && <Check size={13} strokeWidth={2.4} />}
                  Approve {c.name.split(' ')[0]}
                  {sel && ` · ${sel.time}`}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact drawer — message a contractor before committing */}
      <AnimatePresence>
        {openContractor && (
          <ContactDrawer
            contractor={openContractor}
            onClose={() => setContactOpen(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

function ContactDrawer({ contractor, onClose }) {
  // Lock body scroll while open
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-[2px]"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 z-50 h-screen w-full max-w-[480px] bg-white border-l border-ink-100 overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-5 border-b border-ink-100 bg-white/95 backdrop-blur flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`relative h-9 w-9 rounded-2xl bg-gradient-to-br ${accentBg[contractor.accent]} ring-1 flex items-center justify-center shrink-0`}
            >
              <span className="editorial text-[13px]">{contractor.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-ink-900 truncate">
                {contractor.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] text-ink-500">
                <Star size={10} className="text-ember-300 fill-ember-300" strokeWidth={0} />
                <span className="figure text-ink-700">{contractor.rating.score}</span>
                <span>({contractor.rating.reviews})</span>
                <span className="mx-1 text-ink-300">·</span>
                <span>{contractor.responseTime}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0"
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          {/* About */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-3 bg-ink-200" />
              <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                About
              </span>
            </div>
            <p className="text-[13px] text-ink-700 leading-relaxed">{contractor.bio}</p>
          </section>

          {/* Direct contact — primary action */}
          {contractor.phone && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-3 bg-ink-200" />
                <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  Direct contact
                </span>
              </div>
              <a
                href={`tel:${contractor.phone.replace(/\D/g, '')}`}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark px-4 py-3 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-canvas-soft/15 text-canvas-soft shrink-0">
                    <Phone size={14} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold tabular-nums">
                      {contractor.phone}
                    </div>
                    <div className="text-[11px] text-canvas-soft/70">
                      Call {contractor.name.split(' ')[0]} directly
                    </div>
                  </div>
                </div>
                <ArrowRight
                  size={13}
                  className="opacity-70 group-hover:translate-x-0.5 transition-all shrink-0"
                  strokeWidth={2}
                />
              </a>
            </section>
          )}

          {/* Suggested questions — static reference for the call */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-3 bg-ink-200" />
              <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                Things to ask when you call
              </span>
            </div>
            <ul className="space-y-1.5">
              {suggestedQuestions.map((q, i) => (
                <li
                  key={q}
                  className="flex items-start gap-2 text-[12.5px] text-ink-700 leading-snug"
                >
                  <span className="shrink-0 mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-md bg-canvas-soft text-ink-500 text-[10px] font-bold tabular-nums">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.aside>
    </>,
    document.body
  );
}

