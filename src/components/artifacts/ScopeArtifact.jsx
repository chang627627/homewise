import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Box,
  Lightbulb,
  GitBranch,
  Send,
  ChevronRight,
  Pencil,
  Download,
} from 'lucide-react';
import Button from '../ui/Button';
import Pill from '../ui/Pill';
import { ScopePhotoStrip } from '../../pages/ScopePage';

// The scope-of-work artifact. Research Finding 2: this is the most important
// deliverable in the product; it stays a first-class document on the stage.
const tasks = [
  { n: 1, title: 'Diagnose faucet & under-sink supply', detail: 'Confirm leak source. Test cartridge and supply valves.', hours: 0.25 },
  { n: 2, title: 'Replace P-trap assembly', detail: 'Remove existing trap, install new 1-1/2" PVC trap and tailpiece. Test for seal.', hours: 0.75 },
  { n: 3, title: 'Replace single-handle faucet cartridge', detail: 'Manufacturer-matched cartridge. Reseat and test for drip-free operation.', hours: 0.5 },
  { n: 4, title: 'Test, clean up, and document', detail: 'Run full hot/cold cycle. Photograph completed work. Wipe down workspace.', hours: 0.25 },
];

const materials = [
  { item: 'P-trap assembly', spec: 'PVC, 1-1/2"', qty: 1, est: 14 },
  { item: 'Faucet cartridge', spec: 'Mfr-matched, single-handle', qty: 1, est: 38 },
  { item: "Plumber's tape & misc.", spec: 'Sealant, washers', qty: 1, est: 8 },
];

const unitPriced = [
  { if: 'Each additional supply valve found corroded', add: '+0.5 hr labor + $18 valve', cost: '+$58', likelihood: 'Low (5%)' },
  { if: 'Per sq ft of water-damaged cabinet base requiring replacement', add: 'Out of scope: separate ticket', cost: 'TBD', likelihood: 'Very low' },
];

const acceptance = [
  'No visible drip from faucet base after 5 min run cycle (hot + cold)',
  'No water beading at P-trap joints after 2 min full-flow test',
  'Cabinet floor dry to touch 30 min post-repair',
  'Photo evidence of completed work uploaded to job thread',
];

const totalHours = tasks.reduce((s, t) => s + t.hours, 0);
const totalMaterials = materials.reduce((s, m) => s + m.est, 0);
const labor = 95;
const laborTotal = Math.round(totalHours * labor);

export default function ScopeArtifact({ gates, onClearGate }) {
  const approved = !!gates['approve-scope'];

  return (
    <div className="space-y-5">
      {/* AI disclaimer */}
      <div className="rounded-2xl bg-ember-50/60 border border-ember-100 px-4 py-3 flex items-start gap-2.5">
        <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-white text-ember-500 ring-1 ring-ember-100 shrink-0">
          <AlertCircle size={12} strokeWidth={2} />
        </span>
        <div className="text-[12.5px] text-ink-700 leading-relaxed">
          <strong className="text-ink-900 font-semibold">AI-generated, please review.</strong>{' '}
          Homewise drafted this scope from your conversation and photo. Edit any section or ask questions in the thread before contractors see it.
        </div>
      </div>

      {/* Document */}
      <article className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
        <div className="px-6 md:px-8 pt-7 pb-5 border-b border-ink-100/80 bg-gradient-to-b from-canvas-soft/40 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-ink-500" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-semibold">
                Scope of work · SOW-2026-0423-001
              </span>
            </div>
            <Pill tone="sage" icon={CheckCircle2}>
              {approved ? 'Approved · sent' : 'Ready to send'}
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

        <div className="px-6 md:px-8 py-6 space-y-8">
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
                  Standing water under the trap and the slow drip at the spout base are unrelated. The photo rules out a higher-pressure supply leak.
                </p>
                <ScopePhotoStrip />
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
                  O-ring or full faucet body wear (~10% likelihood given faucet age of 3 years). Contractor can confirm during the diagnostic step. If found, see unit pricing in section 04.
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock label="02 · Itemized labor" eyebrow={`${totalHours} hrs total · @ $${labor}/hr`}>
            <ol className="divide-y divide-ink-100 rounded-2xl border border-ink-100 overflow-hidden">
              {tasks.map((t) => (
                <li key={t.n} className="grid grid-cols-12 gap-3 px-4 py-3.5 hover:bg-canvas-soft/50 transition-colors">
                  <div className="figure col-span-1 text-[12px] text-ink-400">{String(t.n).padStart(2, '0')}</div>
                  <div className="col-span-9 min-w-0">
                    <div className="text-[13.5px] font-semibold text-ink-900 tracking-[-0.005em]">{t.title}</div>
                    <div className="text-[12px] text-ink-500 mt-0.5">{t.detail}</div>
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

          <SectionBlock label="03 · Materials" eyebrow="Estimated · contractor may substitute equivalents">
            <div className="rounded-2xl border border-ink-100 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2.5 bg-canvas-soft border-b border-ink-100 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                <div className="col-span-5">Item</div>
                <div className="col-span-4">Spec</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-right">Est. cost</div>
              </div>
              <div className="divide-y divide-ink-100">
                {materials.map((m, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-canvas-soft/50 transition-colors items-center">
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0">
                        <Box size={12} strokeWidth={1.8} />
                      </span>
                      <span className="text-[13px] font-semibold text-ink-900">{m.item}</span>
                    </div>
                    <div className="col-span-4 text-[12px] text-ink-500">{m.spec}</div>
                    <div className="figure col-span-1 text-center text-[12.5px] text-ink-700">{m.qty}</div>
                    <div className="figure col-span-2 text-right text-[13px] text-ink-900">${m.est}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionBlock>

          <SectionBlock label="04 · Unit-priced add-ons" eyebrow="Pre-agreed pricing if scope expands during the job">
            <div className="rounded-2xl border border-ember-100 bg-ember-50/30 overflow-hidden">
              {unitPriced.map((c, i) => (
                <div key={i} className={`grid grid-cols-12 gap-3 px-4 py-3.5 ${i > 0 ? 'border-t border-ember-100' : ''}`}>
                  <div className="col-span-1">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white text-ember-500 ring-1 ring-ember-100">
                      <AlertCircle size={12} strokeWidth={2} />
                    </span>
                  </div>
                  <div className="col-span-7 min-w-0">
                    <div className="text-[13px] font-semibold text-ink-900">{c.if}</div>
                    <div className="text-[12px] text-ink-500 mt-0.5">{c.add}</div>
                    <div className="text-[10.5px] text-ink-500 mt-1 uppercase tracking-[0.14em] font-semibold">
                      Likelihood: {c.likelihood}
                    </div>
                  </div>
                  <div className="col-span-4 text-right text-[14px] font-semibold tabular-nums text-ember-500">{c.cost}</div>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock label="05 · Acceptance criteria" eyebrow="What 'done' looks like">
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

        <div className="px-6 md:px-8 py-5 border-t border-ink-100/80 bg-canvas-deep/50 hairline-inset">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Total label="Labor" value={`$${laborTotal}`} sub={`${totalHours} hrs`} />
            <Total label="Materials" value={`$${totalMaterials}`} sub={`${materials.length} items`} />
            <Total label="Estimated total" value={`$${laborTotal + totalMaterials}`} sub="excl. add-ons" highlight />
            <Total label="Local benchmark" value="$180–$320" sub="Inside range" tone="sage" />
          </div>
        </div>
      </article>

      {/* Decision row */}
      <section className="pt-2">
        {approved ? (
          <div className="flex items-center gap-2.5 rounded-2xl bg-sage-50/60 border border-sage-100 px-4 py-3">
            <CheckCircle2 size={15} strokeWidth={2.2} className="text-sage-600 shrink-0" />
            <div className="text-[12.5px] text-ink-700">
              <strong className="text-ink-900 font-semibold">Scope approved.</strong>{' '}
              Homewise is verifying contractors, follow along in the conversation.
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all">
              <Download size={13} strokeWidth={1.8} />
              Export PDF
            </button>
            <button className="h-10 px-3.5 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center gap-1.5 text-[12.5px] font-medium transition-all">
              <Pencil size={13} strokeWidth={1.8} />
              Edit scope
            </button>
            <Button variant="hero" onClick={() => onClearGate('approve-scope')} icon={Send} iconRight={ChevronRight}>
              Approve &amp; find contractors
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function MetaCell({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-500 font-semibold">{label}</div>
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
          <h3 className="editorial text-[17px] leading-tight text-ink-900">{label}</h3>
        </div>
        {eyebrow && <span className="text-[11px] text-ink-500">{eyebrow}</span>}
      </div>
      {children}
    </section>
  );
}

function Total({ label, value, sub, highlight = false, tone }) {
  const colorCls = tone === 'sage' ? 'text-sage-600' : 'text-ink-900';
  return (
    <div
      className={`rounded-2xl px-3.5 py-3 ${
        highlight ? 'bg-ink-900 text-canvas-soft' : 'bg-white border border-ink-100'
      }`}
    >
      <div className={`text-[10px] uppercase tracking-[0.16em] font-semibold ${highlight ? 'text-canvas-soft/70' : 'text-ink-500'}`}>
        {label}
      </div>
      <div className={`editorial ${highlight ? 'text-[24px]' : 'text-[18px]'} leading-none mt-1 tabular-nums ${highlight ? 'text-canvas-soft' : colorCls}`}>
        {value}
      </div>
      <div className={`text-[11px] mt-1 ${highlight ? 'text-canvas-soft/65' : 'text-ink-500'}`}>{sub}</div>
    </div>
  );
}
