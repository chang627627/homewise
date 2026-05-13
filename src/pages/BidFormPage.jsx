import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Clock,
  CheckCircle2,
  ArrowRight,
  Home,
  Lock,
  Calendar,
  Send,
  AlertCircle,
} from 'lucide-react';
import Pill from '../components/ui/Pill';

// ──────────────────────────────────────────────────────────────────────────
// /bidform · contractor-facing magic-link form.
//
// The flip side of Homewise's homeowner experience: when the homeowner
// approves a scope, this is the form each contractor receives via email.
// Pre-filled with the homeowner's scope, no login required, structured
// fields so the AI can compare bids apples-to-apples.
//
// In production this would be /bid/<contractor-token>. For the prototype
// it's just /bidform with Jason hardcoded as the contractor.
// ──────────────────────────────────────────────────────────────────────────

const homeowner = {
  name: 'Mara Halligan',
  address: '124 Maple St, Oakland, CA',
};

const contractor = {
  name: 'Jason Plumbing Co.',
  contact: 'Jason Reyes',
  license: 'CA Lic #984221',
};

const scope = {
  id: 'SOW-2026-0423-001',
  title: 'Kitchen sink: P-trap leak and faucet cartridge replacement',
  trade: 'Plumbing',
  urgency: 'This week',
  diagnosis:
    'Worn P-trap seal + worn faucet cartridge (independent issues). Standing water under the trap and slow drip at the spout base are unrelated. Photo of the supply line behind the cabinet rules out a higher-pressure leak.',
  tasks: [
    { n: 1, title: 'Diagnose faucet & under-sink supply', detail: 'Confirm leak source. Test cartridge and supply valves.', hours: 0.25 },
    { n: 2, title: 'Replace P-trap assembly', detail: 'Remove existing trap, install new 1-1/2" PVC trap and tailpiece. Test for seal.', hours: 0.75 },
    { n: 3, title: 'Replace single-handle faucet cartridge', detail: 'Manufacturer-matched cartridge. Reseat and test for drip-free operation.', hours: 0.5 },
    { n: 4, title: 'Test, clean up, and document', detail: 'Run full hot/cold cycle. Photograph completed work. Wipe down workspace.', hours: 0.25 },
  ],
  materials: [
    { item: 'P-trap assembly', spec: 'PVC, 1-1/2"', qty: 1 },
    { item: 'Faucet cartridge', spec: 'Mfr-matched, single-handle', qty: 1 },
    { item: "Plumber's tape & misc.", spec: 'Sealant, washers', qty: 1 },
  ],
  unitPriced: [
    { id: 0, label: 'Each additional supply valve found corroded', detail: '+0.5 hr labor + $18 valve' },
    { id: 1, label: 'Per sq ft of water-damaged cabinet base requiring replacement', detail: 'Out of scope: separate ticket' },
  ],
  acceptance: [
    'No visible drip from faucet base after 5 min run cycle (hot + cold)',
    'No water beading at P-trap joints after 2 min full-flow test',
    'Cabinet floor dry to touch 30 min post-repair',
    'Photo evidence of completed work uploaded to job thread',
  ],
};

const TOTAL_LABOR_HOURS = scope.tasks.reduce((s, t) => s + t.hours, 0);

// Format a number as a price string. Drops trailing ".00" so "$220" stays
// clean and "$220.50" still reads correctly.
function formatMoney(n) {
  const fixed = (Math.round(n * 100) / 100).toFixed(2);
  return fixed.endsWith('.00') ? fixed.slice(0, -3) : fixed;
}

export default function BidFormPage() {
  const [scopeOpen, setScopeOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    totalPrice: '',
    lineItems: { 1: '', 2: '', 3: '', 4: '' },
    addOns: { 0: '', 1: '' },
    earliestStart: '',
    estimatedCompletion: '',
    notes: '',
  });

  // Running sum of line items vs the total bid. Mismatch blocks submission
  // so what reaches Mara always reconciles · she shouldn't have to do the
  // math, and the AI's apples-to-apples comparison depends on the per-line
  // breakdown being a true breakdown of the total.
  const lineItemsSum = Object.values(form.lineItems)
    .map((v) => parseFloat(v) || 0)
    .reduce((s, v) => s + v, 0);
  const totalNum = parseFloat(form.totalPrice) || 0;
  const allLineItemsFilled = Object.values(form.lineItems).every(Boolean);
  const showMismatch =
    totalNum > 0 &&
    allLineItemsFilled &&
    Math.abs(lineItemsSum - totalNum) > 0.01;

  const allRequiredFilled =
    form.totalPrice &&
    allLineItemsFilled &&
    form.earliestStart &&
    form.estimatedCompletion;

  const canSubmit = allRequiredFilled && !showMismatch;

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!canSubmit) return;
    setSubmitted(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (submitted) {
    return <ConfirmationView form={form} />;
  }

  return (
    <div className="min-h-screen bg-canvas text-ink-900">
      {/* Top bar · branded but stripped of homeowner-app chrome */}
      <header className="border-b border-ink-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
              <Home size={13} strokeWidth={2.2} />
            </span>
            <span className="editorial text-[17px] leading-none text-ink-900">
              Homewise
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Pill tone="neutral" icon={Lock}>Secure bid form</Pill>
            <span className="hidden md:inline figure text-[11px] text-ink-500">
              Bid #BID-2026-0423-JPC-001
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        {/* Welcome header */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-ink-300" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-medium">
              Bid request · expires Apr 28, 2026
            </span>
          </div>
          <h1 className="editorial text-[28px] md:text-[36px] leading-[1.05] text-ink-900">
            Hi {contractor.contact.split(' ')[0]}, {homeowner.name.split(' ')[0]} would like a bid on this job.
          </h1>
          <p className="text-[14px] text-ink-500 max-w-xl leading-relaxed">
            Homewise scoped the work below and is sending this form to a small number of vetted contractors. Fill in your pricing and earliest dates · no account needed. We'll compare bids apples-to-apples for {homeowner.name.split(' ')[0]}.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <Pill tone="sage" icon={ShieldCheck}>License verified · {contractor.license}</Pill>
            <Pill tone="neutral" icon={Clock}>5-day window</Pill>
          </div>
        </section>

        {/* Scope summary · collapsible */}
        <ScopeSummary open={scopeOpen} onToggle={() => setScopeOpen((v) => !v)} />

        {/* The form */}
        <form onSubmit={handleSubmit} className="space-y-12">
          {/* 01 · Pricing */}
          <FormSection num="01" title="Pricing">
            <div className="space-y-5">
              <Field label="Your total bid" required hint="All labor + materials, sales tax included.">
                <PriceInput
                  value={form.totalPrice}
                  onChange={(v) => setForm((p) => ({ ...p, totalPrice: v }))}
                  placeholder="220"
                />
              </Field>

              <div className="space-y-2">
                <div className="text-[12.5px] font-medium text-ink-900">
                  Line-item pricing
                </div>
                <div className="text-[11.5px] text-ink-500">
                  Break the total down by scope task. Helps {homeowner.name.split(' ')[0]} compare bids fairly.
                </div>
                <div className="mt-3 rounded-2xl border border-ink-100 bg-white overflow-hidden divide-y divide-ink-100">
                  {scope.tasks.map((t) => (
                    <LineItemRow
                      key={t.n}
                      task={t}
                      value={form.lineItems[t.n]}
                      onChange={(v) =>
                        setForm((p) => ({
                          ...p,
                          lineItems: { ...p.lineItems, [t.n]: v },
                        }))
                      }
                    />
                  ))}
                </div>
                {showMismatch && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-ember-50/60 border border-ember-100 px-4 py-3">
                    <AlertCircle size={14} strokeWidth={1.8} className="text-ember-500 mt-0.5 shrink-0" />
                    <div className="text-[12.5px] text-ink-700 leading-relaxed">
                      Line items add up to{' '}
                      <span className="figure text-ink-900">${formatMoney(lineItemsSum)}</span>, but your total bid is{' '}
                      <span className="figure text-ink-900">${formatMoney(totalNum)}</span>. Adjust either side so they match · we can't submit a bid that doesn't reconcile.
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="text-[12.5px] font-medium text-ink-900">
                  Unit-priced add-ons
                </div>
                <div className="text-[11.5px] text-ink-500 max-w-lg">
                  Pre-agreed pricing in case scope expands during the job. Optional · leave blank if not applicable.
                </div>
                <div className="mt-3 rounded-2xl border border-ember-100 bg-ember-50/30 overflow-hidden divide-y divide-ember-100">
                  {scope.unitPriced.map((u) => (
                    <AddOnRow
                      key={u.id}
                      item={u}
                      value={form.addOns[u.id]}
                      onChange={(v) =>
                        setForm((p) => ({
                          ...p,
                          addOns: { ...p.addOns, [u.id]: v },
                        }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </FormSection>

          {/* 02 · Schedule */}
          <FormSection num="02" title="Schedule">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Earliest start date" required>
                <input
                  type="date"
                  value={form.earliestStart}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, earliestStart: e.target.value }))
                  }
                  className="figure w-full h-10 px-3.5 rounded-2xl bg-canvas-soft border border-ink-100 text-[13px] focus:outline-none focus:border-ink-300"
                />
              </Field>
              <Field label="Estimated completion" required>
                <input
                  type="date"
                  value={form.estimatedCompletion}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, estimatedCompletion: e.target.value }))
                  }
                  className="figure w-full h-10 px-3.5 rounded-2xl bg-canvas-soft border border-ink-100 text-[13px] focus:outline-none focus:border-ink-300"
                />
              </Field>
            </div>
            <div className="mt-3 flex items-start gap-2 text-[11.5px] text-ink-500 leading-relaxed">
              <Calendar size={12} strokeWidth={1.8} className="mt-0.5 shrink-0 text-ink-400" />
              <span>
                {homeowner.name.split(' ')[0]} will be asked for her availability. We'll match overlapping slots before booking · no need to commit to a specific time here.
              </span>
            </div>
          </FormSection>

          {/* 03 · Notes */}
          <FormSection num="03" title="Notes" optional>
            <Field
              label="Scope clarifications or assumptions"
              hint={`Anything Mara should know about your pricing, scope reading, materials, or constraints. Keep it short · she'll see this right under your quote total on her dashboard.`}
            >
              <NotesField
                value={form.notes}
                onChange={(v) => setForm((p) => ({ ...p, notes: v }))}
              />
            </Field>
          </FormSection>

          {/* Submit */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t border-ink-100 pt-7">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`group h-12 pl-5 pr-3 rounded-2xl inline-flex items-center gap-2.5 text-[13.5px] font-semibold transition-all ${
                canSubmit
                  ? 'bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark'
                  : 'bg-ink-100 text-ink-400 cursor-not-allowed'
              }`}
            >
              Submit bid to {homeowner.name.split(' ')[0]}
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
                  canSubmit
                    ? 'bg-canvas-soft/15 group-hover:bg-canvas-soft/25'
                    : 'bg-white/30'
                }`}
              >
                <Send size={13} strokeWidth={2} />
              </span>
            </button>
            <p className="text-[11.5px] text-ink-500 max-w-md leading-relaxed">
              {canSubmit
                ? 'You can edit your bid until Mara reviews it. We\'ll email you when she does.'
                : showMismatch
                ? 'Line items need to add up to your total bid before this submits.'
                : 'Fill in your total, all 4 line items, and both dates to submit.'}
            </p>
          </div>
        </form>

        {/* Footer */}
        <footer className="pt-10 border-t border-ink-100/80 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="h-px w-6 bg-ink-300" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-ink-500 font-medium">
              Sent by Homewise on behalf of {homeowner.name}
            </span>
          </div>
          <p className="text-[12px] text-ink-500 max-w-xl leading-relaxed">
            This is a secure bid form. Your bid goes only to {homeowner.name.split(' ')[0]} and Homewise · we don't share your pricing with other contractors. Prefer to reply by email? Just reply to the original message and we'll parse your response into this form automatically.
          </p>
        </footer>
      </main>
    </div>
  );
}

// ─── Confirmation state ────────────────────────────────────────────────────

function ConfirmationView({ form }) {
  return (
    <div className="min-h-screen bg-canvas text-ink-900">
      <header className="border-b border-ink-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
              <Home size={13} strokeWidth={2.2} />
            </span>
            <span className="editorial text-[17px] leading-none text-ink-900">
              Homewise
            </span>
          </div>
          <Pill tone="sage" icon={CheckCircle2}>Bid submitted</Pill>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-2">
            <span className="h-px w-6 bg-sage-300" />
            <span className="text-[11px] uppercase tracking-[0.22em] text-sage-600 font-semibold">
              Bid submitted · Apr 23, 2026 · 11:08 AM
            </span>
          </div>

          <h1 className="editorial text-[32px] md:text-[40px] leading-[1.05] text-ink-900">
            Thanks, {contractor.contact.split(' ')[0]}.
            <span className="block text-ink-500">{homeowner.name.split(' ')[0]} will review your bid.</span>
          </h1>

          <p className="text-[15px] text-ink-500 max-w-xl leading-relaxed">
            We've sent your bid to {homeowner.name.split(' ')[0]}. She'll compare it side-by-side with the other contractors we contacted. Expect a response within 5 business days · we'll email you either way.
          </p>

          {/* Summary card */}
          <div className="rounded-3xl bg-canvas-deep/40 hairline-inset px-6 lg:px-8 py-6 space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-px w-4 bg-ink-200" />
              <span className="text-[11px] uppercase tracking-[0.18em] text-ink-500 font-semibold">
                Your bid · summary
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  Total
                </div>
                <div className="figure text-[20px] text-ink-900 mt-1">
                  ${form.totalPrice || '–'}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  Earliest start
                </div>
                <div className="figure text-[14px] text-ink-900 mt-1">
                  {form.earliestStart || '–'}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  Estimated completion
                </div>
                <div className="figure text-[14px] text-ink-900 mt-1">
                  {form.estimatedCompletion || '–'}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  Bid reference
                </div>
                <div className="figure text-[14px] text-ink-700 mt-1">
                  BID-2026-0423-JPC-001
                </div>
              </div>
            </div>
          </div>

          <p className="text-[12.5px] text-ink-500 leading-relaxed">
            Need to update your bid? Reply to the email we sent · we'll re-open the form for you. Questions for {homeowner.name.split(' ')[0]}? Same · routine ones go through our AI, anything substantive gets routed straight to her.
          </p>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────────────────

function ScopeSummary({ open, onToggle }) {
  return (
    <section className="rounded-3xl border border-ink-100/80 bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 hover:bg-canvas-soft/40 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-canvas-soft text-ink-700 ring-1 ring-ink-100 shrink-0">
            <FileText size={14} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <div className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
              Scope · {scope.id}
            </div>
            <div className="text-[14px] font-medium text-ink-900 truncate mt-0.5">
              {scope.title}
            </div>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2 text-[12px] text-ink-500">
          <span className="hidden md:inline">
            {open ? 'Hide' : 'View'} full scope
          </span>
          {open ? (
            <ChevronUp size={14} strokeWidth={1.8} />
          ) : (
            <ChevronDown size={14} strokeWidth={1.8} />
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-6 space-y-6 border-t border-ink-100">
              {/* Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 text-[12px]">
                <ScopeMeta label="Property" value={homeowner.address} />
                <ScopeMeta label="Trade" value={scope.trade} />
                <ScopeMeta label="Urgency" value={scope.urgency} />
                <ScopeMeta label="Labor estimate" value={`${TOTAL_LABOR_HOURS} hr`} />
              </div>

              {/* Diagnosis */}
              <div className="rounded-2xl bg-canvas-soft/60 border border-ink-100 p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="h-px w-4 bg-sage-300" />
                  <span className="text-[10.5px] uppercase tracking-[0.16em] text-sage-600 font-semibold">
                    Most likely cause
                  </span>
                </div>
                <p className="text-[12.5px] text-ink-700 leading-relaxed">
                  {scope.diagnosis}
                </p>
              </div>

              {/* Tasks */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-px w-4 bg-ink-200" />
                  <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                    Itemized scope · {scope.tasks.length} tasks
                  </span>
                </div>
                <ol className="space-y-2">
                  {scope.tasks.map((t) => (
                    <li
                      key={t.n}
                      className="grid grid-cols-12 gap-3 px-3 py-2 rounded-xl bg-canvas-soft/40 border border-ink-100"
                    >
                      <div className="figure col-span-1 text-[11.5px] text-ink-400">
                        {String(t.n).padStart(2, '0')}
                      </div>
                      <div className="col-span-9 min-w-0">
                        <div className="text-[12.5px] font-medium text-ink-900">
                          {t.title}
                        </div>
                        <div className="text-[11.5px] text-ink-500 mt-0.5">
                          {t.detail}
                        </div>
                      </div>
                      <div className="figure col-span-2 text-right text-[12px] text-ink-700">
                        {t.hours} hr
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Acceptance criteria */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-px w-4 bg-sage-300" />
                  <span className="text-[10.5px] uppercase tracking-[0.16em] text-sage-600 font-semibold">
                    What "done" looks like
                  </span>
                </div>
                <ol className="rounded-2xl border border-sage-100 bg-sage-50/30 divide-y divide-sage-100 overflow-hidden">
                  {scope.acceptance.map((a, i) => (
                    <li key={i} className="flex items-start gap-3 px-4 py-2.5">
                      <span className="figure mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sage-500 text-white text-[10px] shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-[12.5px] text-ink-800 leading-snug">{a}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ScopeMeta({ label, value }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
        {label}
      </div>
      <div className="text-[13px] text-ink-900 mt-0.5">{value}</div>
    </div>
  );
}

function FormSection({ num, title, optional = false, children }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <span className="figure text-[11px] text-ink-400">{num}</span>
        <span className="h-px w-4 bg-ink-200" />
        <h2 className="editorial text-[20px] leading-tight text-ink-900">{title}</h2>
        {optional && (
          <span className="text-[11px] text-ink-500">Optional</span>
        )}
      </div>
      <div className="ml-7">{children}</div>
    </section>
  );
}

function Field({ label, hint, required = false, children }) {
  return (
    <label className="block space-y-1.5">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[12.5px] font-medium text-ink-900">{label}</span>
        {required && (
          <span className="text-[10.5px] text-ember-500 font-medium">
            Required
          </span>
        )}
      </div>
      {hint && (
        <div className="text-[11.5px] text-ink-500 leading-relaxed max-w-lg">
          {hint}
        </div>
      )}
      <div className="pt-0.5">{children}</div>
    </label>
  );
}

// 200 chars fits comfortably under each quote card on Quote Compare
// without breaking the layout · Mara reads this on her dashboard right
// under the bid total, so we keep contractor notes short by design.
const NOTES_MAX = 200;

function NotesField({ value, onChange }) {
  const len = value.length;
  const remaining = NOTES_MAX - len;
  const atLimit = remaining <= 0;
  const nearLimit = remaining <= 20 && !atLimit;
  const counterCls = atLimit
    ? 'text-ember-500'
    : nearLimit
    ? 'text-ember-400'
    : 'text-ink-400';

  return (
    <div className="space-y-1.5">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, NOTES_MAX))}
        rows={4}
        maxLength={NOTES_MAX}
        placeholder="e.g. price assumes faucet cartridge is a Moen 1225. If it turns out to be a Delta, please confirm before scheduling."
        className="w-full px-3.5 py-3 rounded-2xl bg-canvas-soft border border-ink-100 text-[13px] leading-relaxed placeholder:text-ink-400 focus:outline-none focus:border-ink-300 resize-none"
      />
      <div className={`figure text-[11px] text-right ${counterCls}`}>
        {len} / {NOTES_MAX}
      </div>
    </div>
  );
}

function PriceInput({ value, onChange, placeholder }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 figure text-[14px] text-ink-400 pointer-events-none">
        $
      </span>
      <input
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder={placeholder}
        className="figure w-full h-10 pl-7 pr-3.5 rounded-2xl bg-canvas-soft border border-ink-100 placeholder:text-ink-400 text-[14px] focus:outline-none focus:border-ink-300"
      />
    </div>
  );
}

function LineItemRow({ task, value, onChange }) {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-3 items-center hover:bg-canvas-soft/40 transition-colors">
      <div className="figure col-span-1 text-[11.5px] text-ink-400">
        {String(task.n).padStart(2, '0')}
      </div>
      <div className="col-span-7 min-w-0">
        <div className="text-[13px] font-medium text-ink-900">{task.title}</div>
        <div className="figure text-[11.5px] text-ink-500 mt-0.5">
          {task.hours} hr suggested
        </div>
      </div>
      <div className="col-span-4">
        <PriceInput
          value={value}
          onChange={onChange}
          placeholder="–"
        />
      </div>
    </div>
  );
}

function AddOnRow({ item, value, onChange }) {
  return (
    <div className="grid grid-cols-12 gap-3 px-4 py-3 items-start">
      <div className="col-span-8 min-w-0">
        <div className="text-[12.5px] font-medium text-ink-900 leading-snug">
          {item.label}
        </div>
        <div className="text-[11.5px] text-ink-500 mt-0.5">{item.detail}</div>
      </div>
      <div className="col-span-4">
        <PriceInput value={value} onChange={onChange} placeholder="–" />
      </div>
    </div>
  );
}
