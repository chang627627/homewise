import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BadgeCheck,
  Star,
  Clock,
  FileBadge,
  ThumbsUp,
  ChevronRight,
  X,
  Send,
  Image as ImageIcon,
  FileText,
  MapPin,
} from 'lucide-react';
import Button from '../ui/Button';
import Pill from '../ui/Pill';
import PhotoFill from '../ui/PhotoFill';

// Contractor comparison artifact. All three Round 1 trust signals carry over:
// global heads-up note, mirrored header pills, ember-tinted flagged cell, and
// Jason's continuous sage column tint.
const contractors = [
  {
    id: 'jason',
    name: 'Jason Plumbing Co.',
    initials: 'J',
    accent: 'sage',
    aiPick: true,
    rating: { score: 4.8, reviews: 168 },
    yearsLicensed: 14,
    license: { ok: true, label: 'CA Lic #984221' },
    insurance: { ok: true, label: 'GL + WC current' },
    relevantWork: { value: 6, label: 'similar jobs · 12 mo' },
    permitHistory: { value: 11, label: 'permits pulled · 12 mo' },
    earliest: { value: 'Friday', label: '2 days' },
    recommendCount: 12,
    showcase: [
      { category: 'Sink leak repair', scope: 'P-trap + faucet cartridge replacement', date: 'Mar 2026', photoTone: 'sage', photo: 'jason-sink-repair', photoLabel: 'Under sink · after' },
      { category: 'Water heater swap', scope: '50-gal gas heater replacement + permit', date: 'Feb 2026', photoTone: 'sky', photo: 'jason-water-heater', photoLabel: 'New heater · installed' },
      { category: 'Toilet replacement', scope: 'Two-piece toilet swap + supply line', date: 'Jan 2026', photoTone: 'ember', photo: 'jason-toilet', photoLabel: 'Toilet · finished' },
    ],
  },
  {
    id: 'bayline',
    name: 'Bayline Plumbing',
    initials: 'B',
    accent: 'sky',
    rating: { score: 4.6, reviews: 92 },
    yearsLicensed: 9,
    license: { ok: true, label: 'CA Lic #771088' },
    insurance: { ok: true, label: 'GL + WC current' },
    relevantWork: { value: 4, label: 'similar jobs · 12 mo' },
    permitHistory: { value: 7, label: 'permits pulled · 12 mo' },
    earliest: { value: 'Saturday', label: '3 days' },
    recommendCount: 7,
    showcase: [
      { category: 'Pipe repair', scope: 'Burst supply line · drywall left for owner', date: 'Mar 2026', photoTone: 'sky', photo: 'bayline-pipe-repair', photoLabel: 'Pipe · repaired' },
      { category: 'Sink installation', scope: 'Undermount sink + new faucet', date: 'Jan 2026', photoTone: 'sage', photo: 'bayline-sink-install', photoLabel: 'Sink · installed' },
    ],
  },
  {
    id: 'quickfix',
    name: 'Quickfix Pros',
    initials: 'Q',
    accent: 'ember',
    rating: { score: 4.5, reviews: 41 },
    yearsLicensed: 3,
    license: { ok: true, label: 'CA Lic #886512' },
    insurance: { ok: false, label: 'Renewal pending' },
    relevantWork: { value: 2, label: 'similar jobs · 12 mo' },
    permitHistory: { value: 3, label: 'permits pulled · 12 mo' },
    earliest: { value: 'Today', label: 'Same-day' },
    recommendCount: 1,
    showcase: [],
  },
];

const sharedRationale = [
  { label: 'All three', text: 'are licensed plumbers in good standing within 5 miles of your home.' },
  { label: 'Jason', text: 'has the strongest balance: highest rating, most similar jobs in the last 12 months, and a Friday slot.' },
  { label: 'Bayline', text: 'has the most years licensed and offers a longer workmanship warranty, but soonest slot is Saturday.' },
  { label: 'Quickfix', text: 'is the only same-day option, but has the thinnest review history and an insurance renewal pending.' },
];

export default function ContractorsArtifact({ gates, onClearGate, jobCompleted, recommended }) {
  const approved = !!gates['approve-outreach'];
  const [showcaseOpen, setShowcaseOpen] = useState(null);
  // After close-out with a yes, Jason's count bumps by one with a "+1 you" badge
  const liveContractors = contractors.map((c) =>
    c.id === 'jason' && jobCompleted && recommended === 'yes'
      ? { ...c, recommendCount: c.recommendCount + 1, justRecommended: true }
      : c
  );
  const aiPickIndex = liveContractors.findIndex((c) => c.aiPick);
  const open = liveContractors.find((c) => c.id === showcaseOpen);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="editorial editorial-m text-[24px] md:text-[30px] leading-[1.1] text-ink-900">
          Three contractors, side by side.
        </h1>
        <p className="mt-2 text-[14px] leading-[1.55] text-ink-500 max-w-xl">
          Same criteria for everyone. Approve all three to send your scope and get quotes back.
        </p>
      </header>

      {/* Global insurance heads-up */}
      <div className="rounded-2xl bg-ember-50/60 border border-ember-100 px-4 py-3 flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-ember-500 ring-1 ring-ember-200 shrink-0">
          <AlertCircle size={12} strokeWidth={2} />
        </span>
        <div className="text-[12.5px] leading-[1.5] text-ink-700">
          <strong className="font-medium text-ink-900">Heads up.</strong> 1 of 3 contractors has flagged insurance. See Quickfix's row before booking.
        </div>
      </div>

      {/* Comparison matrix */}
      <div className="overflow-x-auto">
        <section className="min-w-[600px] rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
          <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4 border-b border-ink-100/80 bg-canvas-soft/40">
            <div>
              <div className="text-[12px] font-medium text-ink-500">Criterion</div>
            </div>
            {liveContractors.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className={`rounded-2xl p-3 ${
                  c.aiPick ? 'bg-sage-50/50 border border-sage-200' : 'bg-white border border-ink-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative h-10 w-10 rounded-2xl bg-canvas-deep hairline-inset text-ink-700 flex items-center justify-center shrink-0">
                    <span className="editorial editorial-xs text-[15px]">{c.initials}</span>
                    {c.license.ok && (
                      <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-white ring-1 ring-sage-200 flex items-center justify-center">
                        <BadgeCheck size={12} className="text-sage-600" strokeWidth={2} />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 text-[13.5px] font-medium text-ink-900 leading-snug">{c.name}</div>
                </div>
                {(c.aiPick || !c.insurance.ok) && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {c.aiPick && <Pill tone="sage" icon={Sparkles}>AI top match</Pill>}
                    {!c.insurance.ok && <Pill tone="ember" icon={AlertCircle}>Insurance flagged</Pill>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="divide-y divide-ink-100">
            <CompareRow label="Rating" sub="With number of reviews" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => <CellRating key={c.id} c={c.rating} />)}
            </CompareRow>
            <CompareRow label="Years licensed" sub="Verified with state board" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => <CellSimple key={c.id} value={`${c.yearsLicensed} yrs`} />)}
            </CompareRow>
            <CompareRow label="License" sub="Verified or flagged" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => <CellCheck key={c.id} ok={c.license.ok} text={c.license.label} />)}
            </CompareRow>
            <CompareRow label="Insurance" sub="GL + workers comp current" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => <CellCheck key={c.id} ok={c.insurance.ok} text={c.insurance.label} />)}
            </CompareRow>
            <CompareRow label="Relevant past work" sub="Same job type · 12 mo · pulled from permit records" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => <CellRelevant key={c.id} v={c.relevantWork} />)}
            </CompareRow>
            <CompareRow label="Permit history" sub="Total permits pulled · 12 mo" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => <CellPermits key={c.id} v={c.permitHistory} />)}
            </CompareRow>
            <CompareRow label="Earliest availability" sub="Stated availability for this scope" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => <CellAvailability key={c.id} v={c.earliest} />)}
            </CompareRow>
            <CompareRow label="Recommended by Homewisers" sub="Real homeowners on completed Homewise jobs · tap to see work" aiPickIndex={aiPickIndex}>
              {liveContractors.map((c) => (
                <CellRecommend key={c.id} c={c} onOpen={() => c.showcase.length > 0 && setShowcaseOpen(c.id)} />
              ))}
            </CompareRow>
          </div>
        </section>
      </div>

      {/* Shared rationale */}
      <section className="rounded-3xl bg-white border border-sage-100 p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
            <Sparkles size={14} strokeWidth={1.8} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="h-px w-6 bg-ink-300 shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">Why we picked these three</span>
              <Pill tone="sage" icon={CheckCircle2}>Reviewed</Pill>
            </div>
            <h3 className="editorial editorial-xs text-[20px] leading-[1.25] text-ink-900 mb-3.5">The trade-offs, in plain language.</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {sharedRationale.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-px inline-flex h-5 w-5 items-center justify-center rounded-lg bg-canvas-soft text-ink-500 text-[12px] font-medium tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-[14px] leading-[1.55] text-ink-700">
                    <strong className="font-medium text-ink-900">{r.label}</strong> {r.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What each contractor receives: the gate shows exactly what leaves the house */}
      <section className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ink-100/80 bg-canvas-soft/40 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Send size={14} className="text-ink-500" strokeWidth={1.8} />
            <span className="text-[13.5px] font-medium text-ink-900">
              What each contractor receives
            </span>
          </div>
          {approved ? (
            <Pill tone="sage" icon={CheckCircle2}>Sent · 10:42 AM</Pill>
          ) : (
            <Pill tone="neutral">Nothing sent yet</Pill>
          )}
        </div>
        <div className="divide-y divide-ink-100">
          <ShareRow
            icon={FileText}
            title="Scope of work · SOW-2026-0423-001"
            sub="The same brief for all three, so bids come back apples-to-apples."
          />
          <ShareRow
            icon={ImageIcon}
            title="3 tagged photos"
            sub="Under sink, faucet base, behind panel. No faces, no address markers."
          />
          <ShareRow
            icon={MapPin}
            title="Maple St + 94609 only"
            sub="Enough to bid accurately. Your exact address and access details go only to the pro you book."
          />
          <ShareRow
            icon={BadgeCheck}
            title="Sent on your behalf"
            sub={'Each message is signed "prepared by Mara\u2019s Homewise agent" so pros know who they are talking to.'}
          />
        </div>
      </section>

      {/* Decision row */}
      <section className="pt-2">
        {approved ? (
          <div className="flex items-center gap-2.5 rounded-2xl bg-sage-50/60 border border-sage-100 px-4 py-3">
            <CheckCircle2 size={16} strokeWidth={1.8} className="text-sage-600 shrink-0" />
            <div className="text-[12.5px] text-ink-700">
              <strong className="font-medium text-ink-900">Outreach sent to all 3.</strong>{' '}
              Quotes land in the conversation as they come in.
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="md" icon={X}>
              Reject all 3
            </Button>
            <Button variant="hero" onClick={() => onClearGate('approve-outreach')} icon={Send} iconRight={ChevronRight}>
              Approve all 3 &amp; send scope
            </Button>
          </div>
        )}
      </section>

      <AnimatePresence>
        {open && <ShowcaseDrawer contractor={open} onClose={() => setShowcaseOpen(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ShareRow({ icon: Icon, title, sub }) {
  return (
    <div className="px-5 py-3 flex items-start gap-2.5">
      <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0">
        <Icon size={12} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium text-ink-900">{title}</div>
        <div className="text-[12px] text-ink-500 leading-snug mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

function CompareRow({ label, sub, children, aiPickIndex }) {
  return (
    <div className="grid grid-cols-[minmax(116px,0.72fr)_repeat(3,minmax(0,1fr))] gap-3 px-5 py-4">
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium text-ink-900">{label}</div>
        {sub && <div className="text-[12px] text-ink-500 mt-0.5">{sub}</div>}
      </div>
      {React.Children.map(children, (child, i) => (
        <div key={i} className={`${i === aiPickIndex ? 'bg-sage-50/40 -my-4 py-4 -mx-1.5 px-1.5' : ''}`}>
          {child}
        </div>
      ))}
    </div>
  );
}

function CellRating({ c }) {
  return (
    <div className="flex items-center gap-1.5">
      <Star size={12} className="text-ember-300 fill-ember-300" strokeWidth={2} />
      <span className="figure text-[15px] text-ink-900">{c.score}</span>
      <span className="text-[12px] text-ink-500">({c.reviews})</span>
    </div>
  );
}

function CellSimple({ value }) {
  return <div className="text-[13.5px] font-medium text-ink-900">{value}</div>;
}

function CellCheck({ ok, text }) {
  if (!ok) {
    return (
      <div className="inline-flex items-start gap-1.5 rounded-xl bg-ember-50 ring-1 ring-ember-200 px-2 py-1.5">
        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg bg-white text-ember-500 shrink-0">
          <AlertCircle size={12} strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <div className="text-[10.5px] uppercase tracking-[0.18em] font-semibold text-ember-500 leading-5">Flagged</div>
          <div className="text-[12px] text-ink-700 leading-tight mt-0.5">{text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-1.5">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg shrink-0 bg-sage-50 text-sage-600">
        <CheckCircle2 size={12} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-[12.5px] font-medium text-sage-700">Verified</div>
        <div className="text-[12px] text-ink-500 leading-tight mt-0.5">{text}</div>
      </div>
    </div>
  );
}

function CellRelevant({ v }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="editorial editorial-xs text-[20px] leading-none text-ink-900 tabular-nums">{v.value}</span>
      <span className="text-[12px] text-ink-500">{v.label}</span>
    </div>
  );
}

function CellPermits({ v }) {
  return (
    <div className="flex items-center gap-1.5">
      <FileBadge size={12} className="text-ink-300" strokeWidth={2} />
      <span className="text-[13.5px] font-medium text-ink-900 tabular-nums">{v.value}</span>
      <span className="text-[12px] text-ink-500">{v.label}</span>
    </div>
  );
}

function CellAvailability({ v }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft px-2.5 py-1">
      <Clock size={12} className="text-ink-500" strokeWidth={2} />
      <span className="text-[12px] font-medium text-ink-900">{v.value}</span>
      <span className="text-[12px] text-ink-500">· {v.label}</span>
    </div>
  );
}

function CellRecommend({ c, onOpen }) {
  if (c.recommendCount < 3) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[12px] text-ink-500">
        <Sparkles size={12} className="text-ink-300" strokeWidth={2} />
        <span>New to Homewise</span>
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <button
        onClick={onOpen}
        className={`group inline-flex items-center gap-2 rounded-full border px-2.5 py-1 transition-all ${
          c.justRecommended ? 'bg-sage-50 border-sage-200 hover:border-sage-300' : 'bg-white border-ink-200 hover:border-ink-300'
        }`}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sage-50 text-sage-600">
          <ThumbsUp size={12} strokeWidth={2} />
        </span>
        <span className="text-[12px] font-medium text-ink-900 tabular-nums">{c.recommendCount}</span>
        <span className="text-[12px] text-ink-500">Homewisers</span>
        <ChevronRight size={12} className="text-ink-300 group-hover:text-ink-700 group-hover:translate-x-0.5 transition-all" strokeWidth={2} />
      </button>
      {c.justRecommended && <Pill tone="sage">+1 you</Pill>}
    </div>
  );
}

function ShowcaseDrawer({ contractor, onClose }) {
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
        className="fixed top-0 right-0 z-50 h-screen w-full max-w-[480px] bg-white border-l border-ink-100 overflow-y-auto"
      >
        <div className="sticky top-0 z-10 px-6 py-5 border-b border-ink-100 bg-white/95 backdrop-blur flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative h-9 w-9 rounded-xl bg-canvas-deep hairline-inset text-ink-700 flex items-center justify-center shrink-0">
              <span className="editorial editorial-xs text-[15px]">{contractor.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[13.5px] font-medium text-ink-900 truncate">{contractor.name}</div>
              <div className="flex items-center gap-1 mt-0.5 text-[12px] font-medium text-sage-600">
                <ThumbsUp size={12} strokeWidth={2} />
                <span>Recommended by {contractor.recommendCount} Homewisers</span>
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
        <div className="px-6 py-5">
          <div className="flex items-start gap-2 mb-3">
            <span className="mt-2 h-px w-6 bg-ink-300 shrink-0" />
            <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">
              Recent recommended jobs · sorted by relevance to your scope
            </span>
          </div>
          <div className="space-y-2.5">
            {contractor.showcase.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="rounded-2xl bg-white border border-ink-100/80 overflow-hidden"
              >
                <div className="relative aspect-[5/2]">
                  <PhotoFill photo={job.photo} tone={job.photoTone} />
                  <div className="absolute top-2 left-2 right-2">
                    <span className="inline-flex max-w-full items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[12px] font-medium text-ink-700">
                      <ImageIcon size={12} strokeWidth={2} className="shrink-0" />
                      <span className="truncate">{job.photoLabel}</span>
                    </span>
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Pill tone="sage" icon={ThumbsUp}>Recommended</Pill>
                    <span className="text-[12px] tabular-nums text-ink-500">{job.date}</span>
                  </div>
                  <div className="text-[13.5px] font-medium text-ink-900 mt-1">{job.category}</div>
                  <p className="mt-0.5 text-[12px] text-ink-500 leading-snug">{job.scope}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-5 text-[12px] text-ink-500 leading-relaxed">
            Showcase only includes jobs scoped and completed through Homewise. Other Homewisers chose to share their photos. No names or addresses appear.
          </p>
        </div>
      </motion.aside>
    </>,
    document.body
  );
}
