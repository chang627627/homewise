import React from 'react';
import {
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
        <div className="text-[12.5px] text-ink-700 leading-[1.5]">
          <strong className="font-medium text-ink-900">AI-generated, please review.</strong>{' '}
          Homewise drafted this scope from your conversation and photo. Edit any section or ask questions in the thread before contractors see it.
        </div>
      </div>

      {/* Document */}
      <article className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
        <div className="px-6 md:px-8 pt-7 pb-5 border-b border-ink-100/80">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-ink-300" />
              <span className="text-[11px] uppercase tracking-[0.20em] font-medium text-ink-500">
                Scope of work · SOW-2026-0423-001
              </span>
            </div>
            <Pill tone="sage" icon={CheckCircle2}>
              {approved ? 'Approved · sent' : 'Ready to send'}
            </Pill>
          </div>
          <h2 className="editorial editorial-s text-[22px] leading-[1.2] text-ink-900 mt-3">
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
            <div className="rounded-2xl bg-canvas-soft divide-y divide-ink-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sage-50 text-sage-600 ring-1 ring-sage-100">
                    <Lightbulb size={12} strokeWidth={2} />
                  </span>
                  <span className="text-[12px] font-medium text-ink-500">
                    Most likely cause
                  </span>
                </div>
                <div className="text-[15px] font-medium text-ink-900 leading-[1.3]">
                  Worn P-trap seal + worn faucet cartridge (independent issues)
                </div>
                <p className="mt-1.5 text-[12.5px] text-ink-500 leading-[1.5]">
                  Standing water under the trap and the slow drip at the spout base are unrelated. The photo rules out a higher-pressure supply leak.
                </p>
                <ScopePhotoStrip />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-white text-ink-700 ring-1 ring-ink-100">
                    <GitBranch size={12} strokeWidth={2} />
                  </span>
                  <span className="text-[12px] font-medium text-ink-500">
                    Alternative if cartridge swap doesn't resolve drip
                  </span>
                </div>
                <div className="text-[12.5px] text-ink-700 leading-[1.5]">
                  O-ring or full faucet body wear (~10% likelihood given faucet age of 3 years). Contractor can confirm during the diagnostic step. If found, see unit pricing in section 04.
                </div>
              </div>
            </div>
          </SectionBlock>

          <SectionBlock label="02 · Itemized labor" eyebrow={`${totalHours} hrs total · @ $${labor}/hr`}>
            <ol className="divide-y divide-ink-100 rounded-2xl bg-canvas-soft overflow-hidden">
              {tasks.map((t) => (
                <li key={t.n} className="grid grid-cols-12 gap-3 px-4 py-3.5">
                  <div className="figure col-span-1 text-[12px] text-ink-500">{String(t.n).padStart(2, '0')}</div>
                  <div className="col-span-9 min-w-0">
                    <div className="text-[13.5px] font-medium text-ink-900">{t.title}</div>
                    <div className="text-[12px] text-ink-500 mt-0.5">{t.detail}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="figure inline-flex items-center gap-1 text-[12px] text-ink-700">
                      <Clock size={12} className="text-ink-300" strokeWidth={2} />
                      {t.hours} hr
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </SectionBlock>

          <SectionBlock label="03 · Materials" eyebrow="Estimated · contractor may substitute equivalents">
            <div className="rounded-2xl bg-canvas-soft overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-3 px-4 py-2.5 border-b border-ink-100 text-[12px] font-medium text-ink-500">
                <div className="col-span-5">Item</div>
                <div className="col-span-4">Spec</div>
                <div className="col-span-1 text-center">Qty</div>
                <div className="col-span-2 text-right">Est. cost</div>
              </div>
              <div className="divide-y divide-ink-100">
                {materials.map((m, i) => (
                  <div key={i} className="grid grid-cols-12 gap-3 px-4 py-3 items-center">
                    <div className="col-span-5 flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white text-ink-700 ring-1 ring-ink-100 shrink-0">
                        <Box size={12} strokeWidth={2} />
                      </span>
                      <span className="text-[13.5px] font-medium text-ink-900">{m.item}</span>
                    </div>
                    <div className="col-span-4 text-[12px] text-ink-500">{m.spec}</div>
                    <div className="figure col-span-1 text-center text-[12.5px] text-ink-700">{m.qty}</div>
                    <div className="figure col-span-2 text-right text-[12.5px] text-ink-900">${m.est}</div>
                  </div>
                ))}
              </div>
            </div>
          </SectionBlock>

          <SectionBlock label="04 · Unit-priced add-ons" eyebrow="Pre-agreed pricing if scope expands during the job">
            <div className="rounded-2xl bg-ember-50/40 divide-y divide-ember-100 overflow-hidden">
              {unitPriced.map((c, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 px-4 py-3.5">
                  <div className="col-span-1">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white text-ember-500 ring-1 ring-ember-100">
                      <AlertCircle size={12} strokeWidth={2} />
                    </span>
                  </div>
                  <div className="col-span-7 min-w-0">
                    <div className="text-[13.5px] font-medium text-ink-900">{c.if}</div>
                    <div className="text-[12px] text-ink-500 mt-0.5">{c.add}</div>
                    <div className="text-[12px] font-medium text-ink-500 mt-1">
                      Likelihood: {c.likelihood}
                    </div>
                  </div>
                  <div className="col-span-4 text-right text-[14px] font-medium tabular-nums text-ember-500">{c.cost}</div>
                </div>
              ))}
            </div>
          </SectionBlock>

          <SectionBlock label="05 · Acceptance criteria" eyebrow="What 'done' looks like">
            <ol className="rounded-2xl bg-sage-50/40 divide-y divide-sage-100 overflow-hidden">
              {acceptance.map((a, i) => (
                <li key={i} className="flex items-start gap-3 px-4 py-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sage-500 text-white text-[12px] font-medium tabular-nums shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-[12.5px] text-ink-700 leading-[1.5]">{a}</span>
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
            <CheckCircle2 size={14} strokeWidth={1.8} className="text-sage-600 shrink-0" />
            <div className="text-[12.5px] leading-[1.5] text-ink-700">
              <strong className="font-medium text-ink-900">Scope approved.</strong>{' '}
              Homewise is verifying contractors, follow along in the conversation.
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="md" icon={Download}>
              Export PDF
            </Button>
            <Button variant="secondary" size="md" icon={Pencil}>
              Edit scope
            </Button>
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
      <div className="text-[12px] font-medium text-ink-500">{label}</div>
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
          <h3 className="editorial editorial-xs text-[17px] leading-[1.25] text-ink-900">{label}</h3>
        </div>
        {eyebrow && <span className="text-[12px] text-ink-500">{eyebrow}</span>}
      </div>
      {children}
    </section>
  );
}

// Totals strip. The estimated total is data, not a CTA, so it is marked with
// a canvas-deep inset instead of an ink-900 fill: the stage keeps one dark
// element, the Approve CTA. Siblings drop their border (third stroke level
// inside the document card) and group by white fill on the tinted footer.
function Total({ label, value, sub, highlight = false, tone }) {
  const colorCls = tone === 'sage' ? 'text-sage-600' : 'text-ink-900';
  return (
    <div
      className={`rounded-2xl px-3.5 py-3 ${
        highlight ? 'bg-canvas-deep hairline-inset text-ink-900' : 'bg-white'
      }`}
    >
      <div className="text-[12px] font-medium text-ink-500">
        {label}
      </div>
      <div
        className={`editorial leading-none mt-1 tabular-nums ${
          highlight ? 'editorial-s text-[22px] text-ink-900' : `editorial-xs text-[20px] ${colorCls}`
        }`}
      >
        {value}
      </div>
      <div className="text-[12px] mt-1 text-ink-500">{sub}</div>
    </div>
  );
}
