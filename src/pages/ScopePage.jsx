import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  Send,
  Download,
  Pencil,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Clock,
  ShieldCheck,
  ChevronRight,
  Box,
  HelpCircle,
  GitBranch,
  Info,
  Lightbulb,
  Shield,
  CalendarDays,
} from 'lucide-react';
import BackBar from '../components/ui/BackBar';
import FlowProgress from '../components/ui/FlowProgress';
import Pill from '../components/ui/Pill';

const tasks = [
  {
    n: 1,
    title: 'Diagnose faucet & under-sink supply',
    detail: 'Confirm leak source. Test cartridge and supply valves.',
    hours: 0.25,
  },
  {
    n: 2,
    title: 'Replace P-trap assembly',
    detail: 'Remove existing trap, install new 1-1/2" PVC trap and tailpiece. Test for seal.',
    hours: 0.75,
  },
  {
    n: 3,
    title: 'Replace single-handle faucet cartridge',
    detail: 'Manufacturer-matched cartridge. Reseat and test for drip-free operation.',
    hours: 0.5,
  },
  {
    n: 4,
    title: 'Test, clean up, and document',
    detail: 'Run full hot/cold cycle. Photograph completed work. Wipe down workspace.',
    hours: 0.25,
  },
];

const materials = [
  { item: 'P-trap assembly', spec: 'PVC, 1-1/2"', qty: 1, est: 14 },
  { item: 'Faucet cartridge', spec: 'Mfr-matched, single-handle', qty: 1, est: 38 },
  { item: 'Plumber\'s tape & misc.', spec: 'Sealant, washers', qty: 1, est: 8 },
];

const exclusions = [
  'Drywall repair (none anticipated)',
  'Faucet body replacement (only cartridge)',
  'Cabinet refinishing or interior repair',
  'Mold remediation (no mold visible in photos)',
];

const acceptance = [
  'No visible drip from faucet base after 5 min run cycle (hot + cold)',
  'No water beading at P-trap joints after 2 min full-flow test',
  'Cabinet floor dry to touch 30 min post-repair',
  'Photo evidence of completed work uploaded to job thread',
];

const unitPriced = [
  {
    if: 'Each additional supply valve found corroded',
    add: '+0.5 hr labor + $18 valve',
    cost: '+$58',
    likelihood: 'Low (5%)',
  },
  {
    if: 'Per sq ft of water-damaged cabinet base requiring replacement',
    add: 'Out of scope: separate ticket',
    cost: 'TBD',
    likelihood: 'Very low',
  },
];

const totalHours = tasks.reduce((s, t) => s + t.hours, 0);
const totalMaterials = materials.reduce((s, m) => s + m.est, 0);
const labor = 95;
const laborTotal = Math.round(totalHours * labor);

export default function ScopePage({ onNavigate }) {
  return (
    <div className="space-y-8">
      <BackBar
        onBack={() => onNavigate?.('intake')}
        label="Back to intake"
        context="Scope of work · v1 · auto-generated"
      />

      <FlowProgress current="scope" onNavigate={onNavigate} />

      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
            <Sparkles size={13} strokeWidth={2.2} />
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-sage-600 font-semibold">
            AI-generated scope · review before sending
          </span>
        </div>
        <h1 className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900 tracking-tight">
          Kitchen sink leak &amp; drip repair.
        </h1>
        <p className="mt-3 text-[14px] text-ink-500 max-w-xl leading-relaxed">
          Apples-to-apples scope so every contractor bids on the same job. You can edit, ask questions, or have Homewise revise. Nothing is sent until you approve.
        </p>
      </header>

      {/* AI disclaimer banner */}
      <div className="rounded-2xl bg-ember-50/60 border border-ember-100 px-4 py-3 flex items-start gap-2.5">
        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-white text-ember-500 ring-1 ring-ember-100 shrink-0">
          <AlertCircle size={12} strokeWidth={2} />
        </span>
        <div className="text-[12.5px] text-ink-700 leading-relaxed">
          <strong className="text-ink-900 font-semibold">AI-generated, please review.</strong>{' '}
          Homewise drafted this scope from your intake conversation and photos. You can edit any section, ask questions in plain language, or request a revision before contractors see it.
        </div>
      </div>

      <div>
        {/* Document */}
        <article className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
          {/* Document header */}
          <div className="px-7 md:px-9 pt-8 pb-6 border-b border-ink-100/80 bg-gradient-to-b from-canvas-soft/40 to-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-ink-500" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-semibold">
                  Scope of work · SOW-2026-0423-001
                </span>
              </div>
              <Pill tone="sage" icon={CheckCircle2}>
                Ready to send
              </Pill>
            </div>
            <h2 className="editorial text-[22px] leading-tight text-ink-900 mt-3">
              Kitchen sink: P-trap leak and faucet cartridge replacement
            </h2>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-[12px]">
              <MetaCell label="Property" value="124 Maple St, Oakland" />
              <MetaCell label="Trade" value="Plumbing" />
              <MetaCell label="Issued" value="Apr 23, 2026" />
              <MetaCell label="Urgency" value="This week" />
            </div>
          </div>

          {/* Document body */}
          <div className="px-7 md:px-9 py-7 space-y-9">
            {/* 01 Diagnosis */}
            <SectionBlock label="01 · Diagnosis" eyebrow="Most likely root cause + alternatives">
              <div className="rounded-2xl border border-ink-100 overflow-hidden">
                <div className="p-4 bg-canvas-soft/50 border-b border-ink-100">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-sage-50 text-sage-600 ring-1 ring-sage-100">
                      <Lightbulb size={11} strokeWidth={2.2} />
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[0.16em] text-sage-600 font-semibold">
                      Most likely cause
                    </span>
                  </div>
                  <div className="text-[14px] font-semibold text-ink-900 leading-snug">
                    Worn P-trap seal + worn faucet cartridge (independent issues)
                  </div>
                  <p className="mt-1.5 text-[12.5px] text-ink-500 leading-relaxed">
                    Standing water under the trap and the slow drip at the spout base are unrelated. Photo of the supply line behind the cabinet rules out a higher-pressure leak.
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-ink-100 text-ink-500">
                      <GitBranch size={11} strokeWidth={2.2} />
                    </span>
                    <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                      Alternative if cartridge swap doesn't resolve drip
                    </span>
                  </div>
                  <div className="text-[12.5px] text-ink-700 leading-relaxed">
                    O-ring or full faucet body wear (~10% likelihood given faucet age of 3 years). Contractor can confirm during diagnostic step. If found, see unit pricing in section 06.
                  </div>
                </div>
              </div>
            </SectionBlock>

            {/* 02 Summary */}
            <SectionBlock label="02 · Job summary" eyebrow="Plain language">
              <p className="text-[14px] leading-relaxed text-ink-700">
                Standing water and a slow drip at the single-handle kitchen faucet. Photo analysis confirms the supply line behind the cabinet is dry, isolating the issue to the <strong className="text-ink-900 font-semibold">P-trap assembly</strong> and the <strong className="text-ink-900 font-semibold">faucet cartridge</strong>. No drywall, cabinet, or supply work is anticipated.
              </p>
            </SectionBlock>

            {/* 03 Tasks */}
            <SectionBlock
              label="03 · Itemized labor"
              eyebrow={`${totalHours} hrs total · @ $${labor}/hr`}
            >
              <ol className="divide-y divide-ink-100 rounded-2xl border border-ink-100 overflow-hidden">
                {tasks.map((t) => (
                  <li
                    key={t.n}
                    className="grid grid-cols-12 gap-3 px-4 py-3.5 hover:bg-canvas-soft/50 transition-colors"
                  >
                    <div className="figure col-span-1 text-[12px] text-ink-400">
                      {String(t.n).padStart(2, '0')}
                    </div>
                    <div className="col-span-9 min-w-0">
                      <div className="text-[13.5px] font-semibold text-ink-900 tracking-[-0.005em]">
                        {t.title}
                      </div>
                      <div className="text-[12px] text-ink-500 mt-0.5">
                        {t.detail}
                      </div>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="figure inline-flex items-center gap-1 text-[12px] text-ink-700">
                        <Clock size={11} className="text-ink-400" strokeWidth={1.8} />
                        {t.hours} hr
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </SectionBlock>

            {/* 04 Materials */}
            <SectionBlock label="04 · Materials" eyebrow="Estimated · contractor may substitute equivalents">
              <div className="rounded-2xl border border-ink-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2.5 bg-canvas-soft border-b border-ink-100 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  <div className="col-span-5">Item</div>
                  <div className="col-span-4">Spec</div>
                  <div className="col-span-1 text-center">Qty</div>
                  <div className="col-span-2 text-right">Est. cost</div>
                </div>
                <div className="divide-y divide-ink-100">
                  {materials.map((m, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-canvas-soft/50 transition-colors items-center"
                    >
                      <div className="col-span-5 flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0">
                          <Box size={12} strokeWidth={1.8} />
                        </span>
                        <span className="text-[13px] font-semibold text-ink-900">
                          {m.item}
                        </span>
                      </div>
                      <div className="col-span-4 text-[12px] text-ink-500">{m.spec}</div>
                      <div className="figure col-span-1 text-center text-[12.5px] text-ink-700">
                        {m.qty}
                      </div>
                      <div className="figure col-span-2 text-right text-[13px] text-ink-900">
                        ${m.est}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionBlock>

            {/* 05 Exclusions */}
            <SectionBlock label="05 · Exclusions" eyebrow="What this scope does NOT include">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {exclusions.map((e) => (
                  <li
                    key={e}
                    className="flex items-start gap-2 rounded-xl bg-canvas-soft border border-ink-100 px-3 py-2"
                  >
                    <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-md bg-white text-ink-400 ring-1 ring-ink-100">
                      ✕
                    </span>
                    <span className="text-[12.5px] text-ink-700 leading-snug">
                      {e}
                    </span>
                  </li>
                ))}
              </ul>
            </SectionBlock>

            {/* 06 Unit-priced add-ons */}
            <SectionBlock
              label="06 · Unit-priced add-ons"
              eyebrow="Pre-agreed pricing if scope expands during the job"
            >
              <p className="text-[12.5px] text-ink-500 leading-relaxed mb-3 max-w-xl">
                If the contractor finds something only visible after starting (rare here, but documented), these prices are agreed upfront so there's no surprise change order.
              </p>
              <div className="rounded-2xl border border-ember-100 bg-ember-50/30 overflow-hidden">
                {unitPriced.map((c, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-12 gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-ember-100' : ''}`}
                  >
                    <div className="col-span-1">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white text-ember-500 ring-1 ring-ember-100">
                        <AlertCircle size={12} strokeWidth={2} />
                      </span>
                    </div>
                    <div className="col-span-7 min-w-0">
                      <div className="text-[13px] font-semibold text-ink-900">
                        {c.if}
                      </div>
                      <div className="text-[12px] text-ink-500 mt-0.5">{c.add}</div>
                      <div className="text-[10.5px] text-ink-500 mt-1 uppercase tracking-[0.14em] font-semibold">
                        Likelihood: {c.likelihood}
                      </div>
                    </div>
                    <div className="col-span-4 text-right text-[14px] font-semibold tabular-nums text-ember-500">
                      {c.cost}
                    </div>
                  </div>
                ))}
              </div>
            </SectionBlock>

            {/* 07 Acceptance criteria */}
            <SectionBlock label="07 · Acceptance criteria" eyebrow="What 'done' looks like">
              <ol className="rounded-2xl border border-sage-100 bg-sage-50/40 divide-y divide-sage-100 overflow-hidden">
                {acceptance.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sage-500 text-white text-[10px] font-bold tabular-nums shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-[12.5px] text-ink-800 leading-snug">{a}</span>
                  </li>
                ))}
              </ol>
            </SectionBlock>
          </div>

          {/* Document footer / totals */}
          <div className="px-7 md:px-9 py-6 border-t border-ink-100/80 bg-canvas-deep/50 hairline-inset">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Total label="Labor" value={`$${laborTotal}`} sub={`${totalHours} hrs`} />
              <Total label="Materials" value={`$${totalMaterials}`} sub={`${materials.length} items`} />
              <Total label="Estimated total" value={`$${laborTotal + totalMaterials}`} sub="excl. unit add-ons" highlight />
              <Total label="Local benchmark" value="$180–$320" sub="Inside range" tone="sage" />
            </div>
          </div>
        </article>

        {/* What's next · all actions live here after the document so the user
            never has to scroll back up to the header to act */}
        <section className="mt-10 pt-8 border-t border-ink-100">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-px w-6 bg-ink-300" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-medium">
              Ready to send
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-xl space-y-1.5">
              <h3 className="editorial text-[20px] md:text-[24px] leading-tight text-ink-900">
                Approve the scope and we'll reach out to 3 vetted contractors.
              </h3>
              <p className="text-[13px] text-ink-500 leading-relaxed">
                Each gets the exact same brief. You'll see apples-to-apples bids within 5 days · nothing is final until you pick.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all">
                <Download size={13} strokeWidth={1.8} />
                Export PDF
              </button>
              <button className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all">
                <Pencil size={13} strokeWidth={1.8} />
                Edit scope
              </button>
              <button
                onClick={() => onNavigate?.('contractor-compare')}
                className="group h-12 pl-5 pr-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark inline-flex items-center gap-2.5 text-[13.5px] font-semibold transition-all"
              >
                <Send size={14} strokeWidth={2} />
                Approve &amp; find contractors
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-canvas-soft/15 group-hover:bg-canvas-soft/25 transition-colors">
                  <ChevronRight size={14} strokeWidth={2.2} />
                </span>
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function MetaCell({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
        {label}
      </div>
      <div className="text-ink-900 mt-0.5">{value}</div>
    </div>
  );
}

function SectionBlock({ label, eyebrow, children }) {
  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-px w-4 bg-ink-200" />
          <h3 className="editorial text-[17px] leading-tight text-ink-900">
            {label}
          </h3>
        </div>
        {eyebrow && (
          <span className="text-[11px] text-ink-500">{eyebrow}</span>
        )}
      </div>
      {children}
    </section>
  );
}

function Total({ label, value, sub, highlight = false, tone }) {
  const valueCls = highlight
    ? 'editorial text-[24px]'
    : 'editorial text-[18px]';
  const colorCls = tone === 'sage' ? 'text-sage-600' : 'text-ink-900';
  return (
    <div
      className={`rounded-2xl px-3.5 py-3 ${
        highlight ? 'bg-ink-900 text-canvas-soft' : 'bg-white border border-ink-100'
      }`}
    >
      <div
        className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${
          highlight ? 'text-canvas-soft/70' : 'text-ink-500'
        }`}
      >
        {label}
      </div>
      <div
        className={`${valueCls} leading-none mt-1 tabular-nums ${
          highlight ? 'text-canvas-soft' : colorCls
        }`}
      >
        {value}
      </div>
      <div
        className={`text-[11px] mt-1 ${
          highlight ? 'text-canvas-soft/65' : 'text-ink-500'
        }`}
      >
        {sub}
      </div>
    </div>
  );
}
