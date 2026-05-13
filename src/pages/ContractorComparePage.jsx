import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  CalendarCheck2,
  Phone,
  MessageSquareText,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Send,
  ChevronRight,
  Clock,
  FileBadge,
  ThumbsUp,
  Image as ImageIcon,
} from 'lucide-react';
import BackBar from '../components/ui/BackBar';
import FlowProgress from '../components/ui/FlowProgress';
import Pill from '../components/ui/Pill';

// 3 contractors with the criteria spec'd in the PDF
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
      {
        category: 'Sink leak repair',
        scope: 'P-trap + faucet cartridge replacement',
        date: 'Mar 2026',
        photoTone: 'sage',
        photoLabel: 'Under sink · after',
      },
      {
        category: 'Water heater swap',
        scope: '50-gal gas heater replacement + permit',
        date: 'Feb 2026',
        photoTone: 'sky',
        photoLabel: 'New heater · installed',
      },
      {
        category: 'Toilet replacement',
        scope: 'Two-piece toilet swap + supply line',
        date: 'Jan 2026',
        photoTone: 'ember',
        photoLabel: 'Toilet · finished',
      },
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
      {
        category: 'Pipe repair',
        scope: 'Burst supply line · drywall left for owner',
        date: 'Mar 2026',
        photoTone: 'sky',
        photoLabel: 'Pipe · repaired',
      },
      {
        category: 'Sink installation',
        scope: 'Undermount sink + new faucet',
        date: 'Jan 2026',
        photoTone: 'sage',
        photoLabel: 'Sink · installed',
      },
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

const photoTone = {
  sage: 'from-sage-200 to-sage-300',
  sky: 'from-sky2026-100 to-sky2026-300',
  ember: 'from-ember-100 to-ember-200',
};

const accentBg = {
  sage: 'from-sage-200 to-sage-400 ring-sage-300/40 text-sage-700',
  sky: 'from-sky2026-100 to-sky2026-300 ring-sky2026-300/40 text-sky2026-700',
  ember: 'from-ember-100 to-ember-300 ring-ember-300/40 text-ember-500',
};

// One shared rationale framing tradeoffs (per PDF spec)
const sharedRationale = [
  {
    label: 'All three',
    text: 'are licensed plumbers in good standing within 5 miles of your home.',
  },
  {
    label: 'Jason',
    text: 'has the strongest balance: highest rating, most similar jobs in the last 12 months, and a Friday slot.',
  },
  {
    label: 'Bayline',
    text: 'has the most years licensed and offers a longer workmanship warranty, but soonest slot is Saturday.',
  },
  {
    label: 'Quickfix',
    text: 'is the only same-day option, but has the thinnest review history and an insurance renewal pending.',
  },
];

export default function ContractorComparePage({ onNavigate, jobCompleted, recommended }) {
  const [showcaseOpen, setShowcaseOpen] = useState(null); // contractor id or null
  const aiPickIndex = contractors.findIndex((c) => c.aiPick);
  // After homeowner recommends Jason, his count bumps by 1
  const liveContractors = contractors.map((c) =>
    c.id === 'jason' && jobCompleted && recommended === 'yes'
      ? { ...c, recommendCount: c.recommendCount + 1, justRecommended: true }
      : c
  );
  const open = liveContractors.find((c) => c.id === showcaseOpen);

  return (
    <div className="space-y-8">
      <BackBar
        onBack={() => onNavigate?.('scope')}
        label="Back to scope"
        context="Contractor matching · 3 selected · ready for outreach"
      />

      <FlowProgress current="contractor-compare" onNavigate={onNavigate} />

      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
            <Sparkles size={13} strokeWidth={2.2} />
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-sage-600 font-semibold">
            Top 3 matches · same scope of work
          </span>
        </div>
        <h1 className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900 tracking-tight">
          Three contractors, side by side.
        </h1>
        <p className="mt-3 text-[14px] text-ink-500 max-w-xl leading-relaxed">
          Same criteria for everyone. Approve all three to send your scope and get quotes back, or swap any one for the next-best match.
        </p>
      </header>

      {/* Global flag note above the matrix — surfaces any insurance issues at a glance */}
      {liveContractors.some((c) => !c.insurance.ok) && (
        <div className="rounded-2xl bg-ember-50/60 border border-ember-100 px-4 py-3 flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white text-ember-500 ring-1 ring-ember-200 shrink-0">
            <AlertCircle size={12} strokeWidth={2} />
          </span>
          <div className="text-[12.5px] text-ink-700 leading-relaxed">
            <strong className="text-ink-900 font-semibold">Heads up.</strong>{' '}
            {liveContractors.filter((c) => !c.insurance.ok).length} of {liveContractors.length} contractors{' '}
            {liveContractors.filter((c) => !c.insurance.ok).length === 1 ? 'has' : 'have'} flagged insurance.
            See{' '}
            {liveContractors
              .filter((c) => !c.insurance.ok)
              .map((c) => c.name.split(' ')[0])
              .join(', ')}
            's row before booking.
          </div>
        </div>
      )}

      {/* Comparison matrix */}
      <section className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-5 py-4 border-b border-ink-100/80 bg-canvas-soft/40">
          <div className="lg:col-span-3">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
              Criterion
            </div>
          </div>
          {liveContractors.map((c, idx) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className={`lg:col-span-3 rounded-2xl p-3 ${
                c.aiPick
                  ? 'bg-sage-50/50 border border-sage-200 ring-1 ring-sage-100'
                  : 'bg-white border border-ink-100'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`relative h-10 w-10 rounded-2xl bg-gradient-to-br ${accentBg[c.accent]} ring-1 flex items-center justify-center shrink-0`}
                  >
                    <span className="editorial text-[15px]">{c.initials}</span>
                    {c.license.ok && (
                      <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-white ring-1 ring-sage-200 flex items-center justify-center">
                        <BadgeCheck size={9} className="text-sage-600" strokeWidth={2.4} />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink-900 tracking-[-0.005em] truncate">
                      {c.name}
                    </div>
                    {c.aiPick && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <Sparkles size={10} className="text-sage-500" />
                        <span className="text-[10px] uppercase tracking-[0.14em] text-sage-600 font-bold">
                          AI top match
                        </span>
                      </div>
                    )}
                    {!c.insurance.ok && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <AlertCircle size={10} className="text-ember-500" strokeWidth={2.4} />
                        <span className="text-[10px] uppercase tracking-[0.14em] text-ember-500 font-bold">
                          Insurance flagged
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  title="Swap with next-best"
                  className="h-7 w-7 rounded-lg ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0"
                >
                  <RefreshCw size={11} strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison rows */}
        <div className="divide-y divide-ink-100">
          <CompareRow label="Rating" sub="With number of reviews" aiPickIndex={aiPickIndex}>
            {liveContractors.map((c) => (
              <CellRating key={c.id} c={c.rating} />
            ))}
          </CompareRow>

          <CompareRow label="Years licensed" sub="Verified with state board" aiPickIndex={aiPickIndex}>
            {liveContractors.map((c) => (
              <CellSimple
                key={c.id}
                value={`${c.yearsLicensed} yrs`}
              />
            ))}
          </CompareRow>

          <CompareRow label="License" sub="Verified ✓ or flagged" aiPickIndex={aiPickIndex}>
            {liveContractors.map((c) => (
              <CellCheck key={c.id} ok={c.license.ok} text={c.license.label} />
            ))}
          </CompareRow>

          <CompareRow label="Insurance" sub="GL + workers comp current" aiPickIndex={aiPickIndex}>
            {liveContractors.map((c) => (
              <CellCheck
                key={c.id}
                ok={c.insurance.ok}
                text={c.insurance.label}
              />
            ))}
          </CompareRow>

          <CompareRow
            label="Relevant past work"
            sub="Same job type · 12 mo · pulled from permit records"
            aiPickIndex={aiPickIndex}
          >
            {liveContractors.map((c) => (
              <CellRelevant key={c.id} v={c.relevantWork} />
            ))}
          </CompareRow>

          <CompareRow
            label="Permit history"
            sub="Total permits pulled · 12 mo"
            aiPickIndex={aiPickIndex}
          >
            {liveContractors.map((c) => (
              <CellPermits key={c.id} v={c.permitHistory} />
            ))}
          </CompareRow>

          <CompareRow label="Earliest availability" sub="Stated availability for this scope" aiPickIndex={aiPickIndex}>
            {liveContractors.map((c) => (
              <CellAvailability key={c.id} v={c.earliest} />
            ))}
          </CompareRow>

          <CompareRow
            label="Recommended by Homewisers"
            sub="Real homeowners on completed Homewise jobs · tap to see work"
            aiPickIndex={aiPickIndex}
          >
            {liveContractors.map((c) => (
              <CellRecommend
                key={c.id}
                c={c}
                onOpen={() => c.showcase.length > 0 && setShowcaseOpen(c.id)}
              />
            ))}
          </CompareRow>
        </div>
      </section>

      {/* Showcase drawer */}
      <AnimatePresence>
        {open && (
          <ShowcaseDrawer contractor={open} onClose={() => setShowcaseOpen(null)} />
        )}
      </AnimatePresence>

      {/* Shared rationale — light card matching Quote Compare's plain-language summary */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-3xl bg-white border border-sage-100 p-6 md:p-7 relative overflow-hidden"
      >
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-sage-300 via-sage-500 to-sage-300" />
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft shrink-0">
            <Sparkles size={15} strokeWidth={2.2} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] uppercase tracking-[0.18em] text-sage-600 font-semibold">
                Why we picked these three
              </span>
              <Pill tone="sage" icon={CheckCircle2}>
                Reviewed
              </Pill>
            </div>
            <h3 className="editorial text-[18px] md:text-[20px] leading-snug text-ink-900 mb-4">
              The trade-offs, in plain language.
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {sharedRationale.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sage-50 text-sage-700 text-[10px] font-bold tabular-nums ring-1 ring-sage-100 shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-[13px] leading-relaxed text-ink-700">
                    <strong className="text-ink-900 font-semibold">{r.label}</strong>{' '}
                    {r.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* What's next · primary decisions live here after the matrix + rationale */}
      <section className="mt-10 pt-8 border-t border-ink-100">
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-6 bg-ink-300" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-medium">
            Ready to proceed
          </span>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-xl space-y-1.5">
            <h3 className="editorial text-[20px] md:text-[24px] leading-tight text-ink-900">
              Approve all three to send the scope and gather bids.
            </h3>
            <p className="text-[13px] text-ink-500 leading-relaxed">
              Each contractor gets the same brief. Bids come back within 5 days · you'll compare them apples-to-apples before booking anyone.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all">
              <X size={13} strokeWidth={1.8} />
              Reject all 3
            </button>
            <button className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all">
              <RefreshCw size={13} strokeWidth={1.8} />
              Show 3 different
            </button>
            <button
              onClick={() => onNavigate?.('quote-compare')}
              className="group h-12 pl-5 pr-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-2.5 text-[13.5px] font-semibold transition-all"
            >
              <Send size={14} strokeWidth={2} />
              Approve all 3 &amp; send scope
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft/15 group-hover:bg-canvas-soft/25 transition-colors">
                <ChevronRight size={14} strokeWidth={2.2} />
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CompareRow({ label, sub, children, aiPickIndex }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 px-5 py-4">
      <div className="lg:col-span-3 min-w-0">
        <div className="text-[12.5px] font-semibold text-ink-900 tracking-[-0.005em]">
          {label}
        </div>
        {sub && <div className="text-[11px] text-ink-500 mt-0.5">{sub}</div>}
      </div>
      {React.Children.map(children, (child, i) => (
        <div
          key={i}
          className={`lg:col-span-3 ${
            i === aiPickIndex
              ? 'lg:bg-sage-50/40 lg:-my-4 lg:py-4 lg:-mx-1.5 lg:px-1.5 lg:rounded-none'
              : ''
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function CellRating({ c }) {
  return (
    <div className="flex items-center gap-1.5">
      <Star size={12} className="text-ember-300 fill-ember-300" strokeWidth={1.5} />
      <span className="figure text-[15px] text-ink-900">
        {c.score}
      </span>
      <span className="text-[11.5px] text-ink-500">({c.reviews})</span>
    </div>
  );
}

function CellSimple({ value }) {
  return <div className="text-[13.5px] font-semibold text-ink-900">{value}</div>;
}

function CellCheck({ ok, text }) {
  if (!ok) {
    return (
      <div className="inline-flex items-start gap-1.5 rounded-lg bg-ember-50 ring-1 ring-ember-200 px-2 py-1.5">
        <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-white text-ember-500 ring-1 ring-ember-200 shrink-0">
          <AlertCircle size={11} strokeWidth={2.4} />
        </span>
        <div className="min-w-0">
          <div className="text-[12.5px] font-bold text-ember-500 uppercase tracking-[0.04em]">
            Flagged
          </div>
          <div className="text-[11px] text-ink-700 leading-tight mt-0.5">{text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-1.5">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-md ring-1 shrink-0 bg-sage-50 text-sage-600 ring-sage-100">
        <CheckCircle2 size={11} strokeWidth={2.2} />
      </span>
      <div className="min-w-0">
        <div className="text-[12.5px] font-semibold text-sage-700">Verified</div>
        <div className="text-[11px] text-ink-500 leading-tight mt-0.5">{text}</div>
      </div>
    </div>
  );
}

function CellRelevant({ v }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="editorial text-[20px] leading-none text-ink-900 tabular-nums">
        {v.value}
      </span>
      <span className="text-[11px] text-ink-500">{v.label}</span>
    </div>
  );
}

function CellPermits({ v }) {
  return (
    <div className="flex items-center gap-1.5">
      <FileBadge size={12} className="text-ink-400" strokeWidth={1.8} />
      <span className="text-[13px] font-semibold text-ink-900 tabular-nums">
        {v.value}
      </span>
      <span className="text-[11px] text-ink-500">{v.label}</span>
    </div>
  );
}

function CellAvailability({ v }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-canvas-soft border border-ink-100 px-2.5 py-1">
      <Clock size={11} className="text-ink-500" strokeWidth={1.8} />
      <span className="text-[12px] font-semibold text-ink-900">{v.value}</span>
      <span className="text-[10.5px] text-ink-500">· {v.label}</span>
    </div>
  );
}

function CellRecommend({ c, onOpen }) {
  const isNew = c.recommendCount < 3;
  if (isNew) {
    return (
      <div className="inline-flex items-center gap-1.5 text-[12px] text-ink-500">
        <Sparkles size={11} className="text-ink-400" strokeWidth={2} />
        <span>New to Homewise</span>
      </div>
    );
  }
  return (
    <button
      onClick={onOpen}
      className={`group inline-flex items-center gap-2 rounded-full border px-2.5 py-1 transition-all ${
        c.justRecommended
          ? 'bg-sage-50 border-sage-200 hover:border-sage-300'
          : 'bg-white border-ink-200 hover:border-ink-300'
      }`}
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sage-50 text-sage-600 ring-1 ring-sage-100">
        <ThumbsUp size={10} strokeWidth={2.4} />
      </span>
      <span className="text-[12px] font-semibold text-ink-900 tabular-nums">
        {c.recommendCount}
      </span>
      <span className="text-[10.5px] text-ink-500">Homewisers</span>
      <ChevronRight
        size={11}
        className="text-ink-400 group-hover:text-ink-700 group-hover:translate-x-0.5 transition-all"
        strokeWidth={2}
      />
      {c.justRecommended && (
        <span className="ml-1 inline-flex items-center rounded-full bg-sage-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
          +1 you
        </span>
      )}
    </button>
  );
}

function ShowcaseDrawer({ contractor, onClose }) {
  // Lock body scroll while drawer is open so the page underneath doesn't scroll
  // and the drawer becomes the only scrollable surface. Compensate for the
  // disappearing scrollbar to avoid layout shift.
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }
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
            <div
              className={`relative h-9 w-9 rounded-2xl bg-gradient-to-br ${accentBg[contractor.accent]} ring-1 flex items-center justify-center shrink-0`}
            >
              <span className="editorial text-[13px]">{contractor.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-ink-900 truncate">
                {contractor.name}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <ThumbsUp size={10} className="text-sage-500" strokeWidth={2.4} />
                <span className="text-[10.5px] uppercase tracking-[0.14em] text-sage-600 font-bold">
                  Recommended by {contractor.recommendCount} Homewisers
                </span>
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
        <div className="px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="h-px w-3 bg-ink-200" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
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
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${photoTone[job.photoTone]}`}
                  />
                  <div className="absolute inset-0 dot-grid opacity-30" />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-1.5 py-0.5 text-[9.5px] font-semibold text-ink-700 ring-1 ring-ink-100">
                      <ImageIcon size={9} strokeWidth={2.2} />
                      {job.photoLabel}
                    </span>
                  </div>
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <Pill tone="sage" icon={ThumbsUp}>
                      Recommended
                    </Pill>
                    <span className="text-[10.5px] tabular-nums text-ink-500">
                      {job.date}
                    </span>
                  </div>
                  <div className="text-[13px] font-semibold text-ink-900 mt-1">
                    {job.category}
                  </div>
                  <p className="mt-0.5 text-[12px] text-ink-500 leading-snug">
                    {job.scope}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-5 text-[11px] text-ink-400 leading-relaxed">
            Showcase only includes jobs scoped and completed through Homewise.
            Other Homewisers chose to share their photos. No names or addresses appear.
          </p>
        </div>
      </motion.aside>
    </>,
    document.body
  );
}
