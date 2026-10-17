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
  CheckCircle2,
  Clock,
  Phone,
  Star,
  Calendar,
} from 'lucide-react';
import Pill from '../ui/Pill';

// Quote comparison artifact: the apples-to-apples matrix plus the scheduling
// loop (availability windows -> slot chips -> per-contractor approve).
const WINDOWS = [
  { id: 'weekday-am', label: 'Weekday AM' },
  { id: 'weekday-pm', label: 'Weekday PM' },
  { id: 'evening', label: 'Evenings' },
  { id: 'weekend', label: 'Weekend' },
];

const cols = [
  {
    id: 'jason',
    name: 'Jason Plumbing Co.',
    initials: 'J',
    accent: 'sage',
    total: 220,
    aiPick: true,
    verdict: { tone: 'sage', label: 'Fair price' },
    bio: 'Family-run since 2012. 14 years licensed. Specializes in residential plumbing repairs and faucet replacements.',
    rating: { score: 4.8, reviews: 168 },
    responseTime: 'Usually replies within 2 hours',
    phone: '(510) 555-0142',
    slots: [
      { id: 'fri-2', time: 'Fri 2 PM', window: 'weekday-pm' },
      { id: 'fri-4', time: 'Fri 4 PM', window: 'weekday-pm' },
      { id: 'sat-10', time: 'Sat 10 AM', window: 'weekend' },
    ],
    schedule: { earliestStart: 'Fri Apr 25', duration: 'Same day · ~2 hr' },
    note: "Price assumes a Moen 1225 cartridge. If it turns out to be Delta, I'll confirm before scheduling so I source the right part.",
  },
  {
    id: 'bayline',
    name: 'Bayline Plumbing',
    initials: 'B',
    accent: 'sky',
    total: 390,
    verdict: { tone: 'ember', label: 'Higher than market' },
    bio: 'Bayline has 9 years licensed and offers a 1-year workmanship warranty. Higher-end residential work.',
    rating: { score: 4.6, reviews: 92 },
    responseTime: 'Usually replies within 4 hours',
    phone: '(510) 555-0291',
    slots: [
      { id: 'sat-10', time: 'Sat 10 AM', window: 'weekend' },
      { id: 'sat-1', time: 'Sat 1 PM', window: 'weekend' },
      { id: 'mon-9', time: 'Mon 9 AM', window: 'weekday-am' },
    ],
    schedule: { earliestStart: 'Sat Apr 26', duration: '2 days · warranty follow-up visit' },
    note: 'Includes a 1-yr workmanship warranty on this job. The $75 service fee is my standard for residential calls, waived only on same-day emergencies.',
  },
  {
    id: 'quickfix',
    name: 'Quickfix Pros',
    initials: 'Q',
    accent: 'ember',
    total: 175,
    verdict: { tone: 'ember', label: 'Low, missing details' },
    bio: 'Same-day availability for small plumbing fixes. 3 years licensed. Currently has a pending insurance renewal.',
    rating: { score: 4.5, reviews: 41 },
    responseTime: 'Usually replies within 1 hour',
    phone: '(510) 555-0463',
    slots: [
      { id: 'today-5', time: 'Today 5 PM', window: 'weekday-pm' },
      { id: 'tomorrow-9', time: 'Tomorrow 9 AM', window: 'weekday-am' },
      { id: 'sat-10', time: 'Sat 10 AM', window: 'weekend' },
    ],
    schedule: { earliestStart: 'Today · Apr 23', duration: 'Same day · ~2 hr' },
    note: 'Quote is labor only. Materials TBD pending site visit. I can confirm same-day if you book this week.',
  },
];

const suggestedQuestions = [
  'Can you confirm cost includes materials?',
  'Will the area need to be cleared before you arrive?',
  'How long do you expect the visit to take?',
  'What happens if more work is needed once you start?',
];

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

// Icon tiles inside cells carry fill only (no ring): the tinted cell is
// already the second stroke level inside the bordered matrix card.
const stateMap = {
  included: { icon: Check, bg: 'bg-sage-50', fg: 'text-sage-600', cell: 'bg-white' },
  better: { icon: TrendingUp, bg: 'bg-sage-50', fg: 'text-sage-700', cell: 'bg-sage-50/40 ring-1 ring-sage-100', badgeTone: 'sage' },
  higher: { icon: TrendingUp, bg: 'bg-ember-50', fg: 'text-ember-500', cell: 'bg-ember-50/40 ring-1 ring-ember-100', badgeTone: 'ember' },
  flag: { icon: AlertTriangle, bg: 'bg-ember-50', fg: 'text-ember-500', cell: 'bg-ember-50/40 ring-1 ring-ember-100' },
  none: { icon: X, bg: 'bg-ink-100', fg: 'text-ink-500', cell: 'bg-white' },
};

// A user's own selection: neutral fill + ink-300 ring + leading check.
// Never ink-900 (reserved for the decision CTA), never sage (the AI's pick).
const chipOn = 'bg-canvas-deep ring-1 ring-ink-300 text-ink-900';
const chipOff = 'bg-white ring-1 ring-ink-200 text-ink-700 hover:ring-ink-300';

export default function QuotesArtifact({ gates, scheduledSlot, onClearGate }) {
  const booked = !!gates['approve-jason'];
  const [windows, setWindows] = useState(() => new Set(['weekday-pm', 'weekend']));
  const [picked, setPicked] = useState({ jason: 'fri-2', bayline: 'sat-10', quickfix: 'today-5' });
  const [contactOpen, setContactOpen] = useState(null);
  const openContractor = cols.find((c) => c.id === contactOpen);
  const aiPickIndex = cols.findIndex((c) => c.aiPick);

  const slotsFor = (c) => c.slots.filter((s) => windows.has(s.window));
  const pickedSlot = (c) => {
    const valid = slotsFor(c);
    return valid.find((s) => s.id === picked[c.id]) || valid[0] || null;
  };
  const toggleWindow = (id) => {
    if (booked) return;
    setWindows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="editorial editorial-m text-[24px] md:text-[30px] leading-[1.1] text-ink-900">
          Three quotes, one normalized scope.
        </h1>
      </header>

      {/* AI plain-language summary */}
      <section className="rounded-3xl bg-white border border-sage-100 px-5 py-4 md:px-6 flex items-start gap-3">
        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-sage-50 text-sage-500 ring-1 ring-sage-100 shrink-0">
          <Sparkles size={12} strokeWidth={2} />
        </span>
        <p className="editorial-italic text-[14px] leading-[1.55] text-ink-900">
          "Jason is the cheapest <em className="not-italic font-medium text-ink-700">that's complete</em>, fair price, full scope, fastest. Bayline includes more (1-yr warranty) but charges a $75 fee + 21% labor premium. Quickfix is cheapest at $175 but their quote is missing materials and warranty language."
        </p>
      </section>

      {/* Matrix */}
      <div className="overflow-x-auto">
        <section className="min-w-[600px] rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
          {/* Quote cards as column headers */}
          <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 border-b border-ink-100/80 bg-canvas-soft/40 items-stretch">
            <div className="flex items-end">
              <div className="text-[12px] font-medium text-ink-500">Scope item</div>
            </div>
            {cols.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className={`rounded-2xl p-3.5 flex flex-col ${
                  c.aiPick ? 'bg-sage-50/50 border border-sage-200' : 'bg-white border border-ink-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="relative h-10 w-10 rounded-2xl bg-canvas-deep hairline-inset text-ink-700 flex items-center justify-center shrink-0">
                    <span className="editorial editorial-xs text-[15px]">{c.initials}</span>
                  </div>
                  <div className="min-w-0 flex-1 text-[13.5px] font-medium text-ink-900 leading-snug">{c.name}</div>
                </div>
                {c.aiPick && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    <Pill tone="sage" icon={Sparkles}>AI top match</Pill>
                  </div>
                )}
                <div className="mt-auto pt-3 flex flex-wrap items-end justify-between gap-x-2 gap-y-1.5">
                  <Pill tone={c.verdict.tone}>{c.verdict.label}</Pill>
                  <div className="text-right shrink-0">
                    <span className="editorial editorial-s text-[22px] leading-none text-ink-900 tabular-nums">${c.total}</span>
                    <div className="text-[12px] text-ink-500 mt-0.5">total</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="divide-y divide-ink-100">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 items-stretch">
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium text-ink-900">{row.label}</div>
                  {row.sub && <div className="text-[12px] text-ink-500 mt-0.5">{row.sub}</div>}
                </div>
                {row.cells.map((cell, i) => {
                  const meta = stateMap[cell.state];
                  const Icon = meta.icon;
                  const isPick = i === aiPickIndex;
                  return (
                    <div
                      key={i}
                      className={
                        isPick
                          ? 'rounded-none px-[18px] py-[26px] bg-sage-50/40 -my-4 -mx-1.5'
                          : `rounded-2xl px-3 py-2.5 ${meta.cell}`
                      }
                    >
                      <div className="flex items-start gap-2">
                        <span className={`mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg ${meta.bg} ${meta.fg} shrink-0`}>
                          <Icon size={12} strokeWidth={2} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className={`text-[12.5px] font-medium ${meta.fg}`}>{cell.text}</span>
                            {cell.badge && <Pill tone={meta.badgeTone}>{cell.badge}</Pill>}
                          </div>
                          <div className="text-[12px] text-ink-500 mt-0.5 leading-snug">{cell.value}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Earliest start */}
            <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 items-stretch">
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium text-ink-900">Earliest start</div>
                <div className="text-[12px] text-ink-500 mt-0.5">Stated availability for this job</div>
              </div>
              {cols.map((c, i) => (
                <div key={c.id} className={i === aiPickIndex ? 'px-[18px] py-[26px] bg-sage-50/40 -my-4 -mx-1.5' : 'px-3 py-2.5'}>
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} strokeWidth={2} className="text-ink-300 shrink-0" />
                    <span className="text-[12.5px] font-medium text-ink-900">{c.schedule.earliestStart}</span>
                  </div>
                  <div className="text-[12px] text-ink-500 mt-0.5">{c.schedule.duration}</div>
                </div>
              ))}
            </div>

            {/* Contractor note */}
            <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 items-stretch">
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium text-ink-900">Contractor note</div>
                <div className="text-[12px] text-ink-500 mt-0.5">In their own words</div>
              </div>
              {cols.map((c, i) => (
                <div key={c.id} className={i === aiPickIndex ? 'px-[18px] py-[26px] bg-sage-50/40 -my-4 -mx-1.5' : 'px-3 py-2.5'}>
                  <p className="text-[12px] leading-relaxed text-ink-500 italic">&ldquo;{c.note}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>

          {/* Your availability */}
          <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 border-t border-ink-100 bg-canvas-soft/40 items-center">
            <div>
              <div className="text-[12px] font-medium text-ink-500">Your availability</div>
            </div>
            <div className="col-span-3 flex flex-wrap gap-1.5">
              {WINDOWS.map((w) => {
                const on = windows.has(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => toggleWindow(w.id)}
                    className={`h-8 px-3 rounded-full inline-flex items-center gap-1.5 text-[12px] font-medium transition-all ${
                      on ? chipOn : chipOff
                    } ${booked ? 'opacity-60' : ''}`}
                  >
                    {on && <Check size={12} strokeWidth={2} />}
                    {w.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ask before booking */}
          <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 border-t border-ink-100 bg-canvas-soft/40 items-center">
            <div className="flex flex-col justify-center">
              <div className="text-[12px] font-medium text-ink-500">Ask before booking</div>
              <div className="text-[12px] text-ink-500 mt-0.5">Optional. Talk first if you have questions.</div>
            </div>
            {cols.map((c, i) => (
              <div key={c.id} className={`${i === aiPickIndex ? 'bg-sage-50/40 -my-4 py-4 -mx-1.5 px-1.5' : ''}`}>
                <button
                  onClick={() => setContactOpen(c.id)}
                  className="w-full h-10 rounded-2xl bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft inline-flex items-center justify-center gap-1.5 text-[12.5px] font-medium transition-all"
                >
                  <Phone size={12} strokeWidth={2} />
                  Ask {c.name.split(' ')[0]}
                </button>
              </div>
            ))}
          </div>

          {/* Pick a slot & approve */}
          <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 border-t border-ink-100 bg-white items-stretch">
            <div className="flex flex-col justify-center">
              <div className="text-[12px] font-medium text-ink-500">Pick a slot &amp; approve</div>
            </div>
            {cols.map((c, i) => {
              const valid = slotsFor(c);
              const sel = pickedSlot(c);
              const noOverlap = valid.length === 0;
              const isBookedCol = booked && c.aiPick;
              return (
                <div key={c.id} className={`flex flex-col gap-2 ${i === aiPickIndex ? 'bg-sage-50/40 -my-4 py-4 -mx-1.5 px-1.5' : ''}`}>
                  {noOverlap ? (
                    <div className="rounded-2xl bg-ember-50/50 border border-ember-100 px-3 py-2 text-[12px] text-ink-700 leading-snug">
                      No overlap with your availability. Add a window above or ask {c.name.split(' ')[0]} for more times.
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {valid.map((s) => {
                        const on = booked && c.aiPick ? s.time === scheduledSlot : sel?.id === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => !booked && setPicked((p) => ({ ...p, [c.id]: s.id }))}
                            className={`h-7 px-2.5 rounded-full inline-flex items-center gap-1 text-[12px] font-medium transition-all ${
                              on ? chipOn : chipOff
                            } ${booked && !on ? 'opacity-50' : ''}`}
                          >
                            {on ? (
                              <Check size={12} strokeWidth={2} />
                            ) : (
                              <Clock size={12} strokeWidth={2} className="text-ink-300" />
                            )}
                            {s.time}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {isBookedCol ? (
                    <div className="w-full min-h-[40px] px-2 py-2 rounded-2xl bg-sage-50 ring-1 ring-sage-200 inline-flex items-center justify-center gap-1.5 leading-snug text-center text-[12.5px] font-medium text-sage-700">
                      <CheckCircle2 size={14} strokeWidth={1.8} className="shrink-0" />
                      <span className="min-w-0">Booked · {scheduledSlot}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => !booked && onClearGate('approve-jason', { slot: sel?.time })}
                      disabled={noOverlap || booked}
                      className={`w-full min-h-[40px] px-2 py-2 rounded-2xl inline-flex items-center justify-center gap-1.5 leading-snug text-center text-[12.5px] font-medium transition-all ${
                        noOverlap || booked
                          ? 'bg-ink-100 text-ink-300 cursor-not-allowed'
                          : c.aiPick
                            ? 'bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark'
                            : 'bg-white text-ink-900 ring-1 ring-ink-200 hover:ring-ink-300 hover:bg-canvas-soft'
                      }`}
                    >
                      {c.aiPick && !noOverlap && !booked && <Check size={14} strokeWidth={1.8} className="shrink-0" />}
                      <span className="min-w-0">
                        Approve {c.name.split(' ')[0]}
                        {sel && !booked && ` · ${sel.time}`}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {booked && (
        <div className="flex items-center gap-2.5 rounded-2xl bg-sage-50/60 border border-sage-100 px-4 py-3">
          <CheckCircle2 size={16} strokeWidth={1.8} className="text-sage-600 shrink-0" />
          <div className="text-[12.5px] text-ink-700">
            <strong className="font-medium text-ink-900">Jason is booked for {scheduledSlot}.</strong>{' '}
            Free to reschedule or cancel until Thursday 6 PM. The visit is on your schedule.
          </div>
        </div>
      )}

      <AnimatePresence>
        {openContractor && <ContactDrawer contractor={openContractor} onClose={() => setContactOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ContactDrawer({ contractor, onClose }) {
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
        <div className="sticky top-0 z-10 px-6 py-5 border-b border-ink-100 bg-white/95 backdrop-blur flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-9 w-9 rounded-xl bg-canvas-deep hairline-inset text-ink-700 flex items-center justify-center shrink-0">
              <span className="editorial editorial-xs text-[15px]">{contractor.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-medium text-ink-900 truncate">{contractor.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[12px] text-ink-500">
                <Star size={12} className="text-ember-300 fill-ember-300" strokeWidth={2} />
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
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-ink-300 shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">About</span>
            </div>
            <p className="text-[14px] leading-[1.55] text-ink-700">{contractor.bio}</p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-ink-300 shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">Direct contact</span>
            </div>
            <a
              href={`tel:${contractor.phone.replace(/\D/g, '')}`}
              className="group flex items-center justify-between gap-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark px-4 py-3 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-canvas-soft/15 text-canvas-soft shrink-0">
                  <Phone size={14} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-medium tabular-nums">{contractor.phone}</div>
                  <div className="text-[12px] text-canvas-soft/70">Call {contractor.name.split(' ')[0]} directly</div>
                </div>
              </div>
              <ArrowRight size={14} className="opacity-70 group-hover:translate-x-0.5 transition-all shrink-0" strokeWidth={1.8} />
            </a>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-6 bg-ink-300 shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">Things to ask when you call</span>
            </div>
            <ul className="space-y-1.5">
              {suggestedQuestions.map((q, i) => (
                <li key={q} className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-ink-700">
                  <span className="shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-lg bg-canvas-soft text-ink-500 text-[12px] font-medium tabular-nums">
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
