import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../v2/Button';
import DecisionBar from '../v2/DecisionBar';
import Evidence from '../v2/Evidence';
import LabelValue from '../v2/LabelValue';
import Photo from '../v2/Photo';
import SectionHeading from '../v2/SectionHeading';
import { StatusText } from '../v2/Status';
import { enter, prefersReducedMotion } from '../v2/motion';
import { usePrefersReducedMotion } from '../v2/useMediaQuery';
import { DocTitle, FactsLine, StatusLine } from './doc/DocParts';
import {
  AT,
  BENCHMARK,
  CONTRACTORS,
  DEFAULT_URGENCY,
  GATES,
  INTAKE,
  SCOPE,
  SCOPE_TOTALS,
  URGENCY,
  artifactStatus,
  benchmarkRange,
  fmtUsd,
} from '../../data/demo';

const TITLE = 'Kitchen sink: P-trap leak and faucet cartridge';
const ADD_ONS = 'Add-ons';

// demo.js points the alternative diagnosis at a numbered section; V2 sections
// are unnumbered, so the pointer names the heading instead.
const ALTERNATIVE = SCOPE.diagnosis.alternative.replace(/in section \d+/, `under ${ADD_ONS}`);

const withPeriod = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

const LABOR_COLS = 'grid grid-cols-[minmax(0,1fr)_72px] gap-4';
// Below sm the spec moves under the item name, so four columns never squeeze.
const MATERIAL_COLS = 'grid grid-cols-[minmax(0,1fr)_48px_72px] gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_48px_72px]';
const ADD_ON_COLS = 'grid grid-cols-[minmax(0,1fr)_96px] gap-4';
const COL_HEAD = 'pb-2 text-meta font-medium text-ink-500';

// The column shows demo.js's gross price ("+$71 + faucet"); the cartridge
// credit stays in the detail line, so the column never wraps.
const addOnAmount = (a) => a.cost.split(', minus')[0];
// 'Low (5%)' reads 'low likelihood (5%)', 'Very low' reads 'very low likelihood'.
const likelihood = (s) => {
  const [, word, pct] = s.match(/^(.*?)\s*(\(.*\))?$/);
  return `${word.toLowerCase()} likelihood${pct ? ` ${pct}` : ''}`;
};
const addOnDetail = (a) => {
  const credit = a.credit ? `, minus the ${fmtUsd(a.credit.cost)} ${a.credit.name}` : '';
  return `${a.add}${credit}, ${likelihood(a.likelihood)}`;
};

// Stream reveal: blocks assemble in order (header, diagnosis, labor,
// materials, add-ons, done when, totals) once per session, and only when the
// agent stages the draft where it can be seen. User clicks, hidden mounts and
// reduced motion render it complete.
let streamedOnce = false;
const STEP_MS = 180;
const SKELETONS = [
  ['w-1/3', 'w-2/3', 'w-1/2'],
  ['w-2/3', 'w-5/6', 'w-1/2'],
  ['w-1/2', 'w-5/6', 'w-2/3'],
  ['w-2/3', 'w-1/2'],
  ['w-5/6', 'w-1/2'],
  ['w-2/3', 'w-5/6', 'w-1/2'],
  ['w-1/2', 'w-2/3'],
];

export default function ScopeArtifact({ gates = {}, urgency, stagedBy, onClearGate }) {
  const approved = !!gates[GATES.approveScope];
  const sent = !!gates[GATES.approveOutreach];

  const rootRef = useRef(null);
  const reduced = usePrefersReducedMotion();
  const [streaming, setStreaming] = useState(() => !streamedOnce && stagedBy === 'agent' && !prefersReducedMotion());
  const [shown, setShown] = useState(0);
  const done = reduced || !streaming || shown >= SKELETONS.length;

  // Decided once, before the first paint, so a hidden mount never flashes
  // skeletons and never spends the stream.
  useLayoutEffect(() => {
    if (!streaming) return;
    if (rootRef.current?.getClientRects().length) streamedOnce = true;
    else setStreaming(false);
  }, []);

  useEffect(() => {
    if (done) return undefined;
    const t = setTimeout(() => setShown((n) => n + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [shown, done]);

  const reveal = { shown: done ? SKELETONS.length : shown, streaming: streaming && !reduced };

  const base = artifactStatus('scope', { gates });
  const status = approved ? { ...base, label: `${base.label} ${AT.scopeApproved}` } : base;
  const sentence = !approved
    ? 'AI draft from your photos and answers. Edit anything before contractors see it.'
    : sent
      ? `Locked as v1, sent to ${CONTRACTORS.length} contractors`
      : 'Locked as v1';
  const timing = (URGENCY[urgency] || URGENCY[DEFAULT_URGENCY]).scope;

  return (
    <div ref={rootRef} className="mx-auto flex w-full max-w-[720px] flex-1 flex-col">
      <div className="flex-1" aria-busy={!done || undefined}>
        <Block i={0} {...reveal}>
          <DocTitle>{TITLE}</DocTitle>
          <StatusLine status={status} sentence={sentence} />
          <FactsLine>{`${SCOPE.issuedLabel} · ${SCOPE.property} · ${timing}`}</FactsLine>
        </Block>

        <Block i={1} className="mt-8" {...reveal}>
          <SectionHeading title="Diagnosis" />
          <LabelValue
            items={[
              {
                label: 'Most likely',
                value: (
                  <>
                    <span className="font-medium">{withPeriod(SCOPE.diagnosis.likely)}</span>
                    <span className="text-ink-700"> {SCOPE.diagnosis.likelyDetail}</span>
                  </>
                ),
              },
              { label: 'Alternative', value: <span className="text-ink-700">{ALTERNATIVE}</span> },
            ]}
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            {INTAKE.photos.map((p) => (
              <Photo key={p.id} photo={p.photo} label={p.label} note={p.tag} pin />
            ))}
          </div>
        </Block>

        <Block i={2} className="mt-10" {...reveal}>
          <SectionHeading title="Labor" meta={`${SCOPE_TOTALS.hours} hr at ${fmtUsd(SCOPE.laborRate)}/hr`} />
          <div role="table" aria-label="Labor">
            <div role="row" className={`${LABOR_COLS} ${COL_HEAD}`}>
              <span role="columnheader">Task</span>
              <span role="columnheader" className="text-right">Hours</span>
            </div>
            {SCOPE.tasks.map((t) => (
              <div role="row" key={t.id} className={`${LABOR_COLS} border-b border-line py-3`}>
                <div role="cell" className="min-w-0">
                  <div className="text-ui font-medium text-ink-900">{t.title}</div>
                  <div className="mt-0.5 text-meta text-ink-500">{t.detail}</div>
                </div>
                <div role="cell" className="text-right text-ui tabular-nums text-ink-700">{t.hours.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </Block>

        <Block i={3} className="mt-10" {...reveal}>
          <SectionHeading title="Materials" meta="Contractor may substitute equivalents" />
          <div role="table" aria-label="Materials">
            <div role="row" className={`${MATERIAL_COLS} ${COL_HEAD}`}>
              <span role="columnheader">Item</span>
              <span role="columnheader" className="hidden sm:block">Spec</span>
              <span role="columnheader" className="text-right">Qty</span>
              <span role="columnheader" className="text-right">Est.</span>
            </div>
            {SCOPE.materials.map((m) => (
              <div role="row" key={m.id} className={`${MATERIAL_COLS} min-h-11 items-center border-b border-line py-2.5 text-ui`}>
                <div role="cell" className="min-w-0">
                  <div className="font-medium text-ink-900">{m.item}</div>
                  <div className="text-meta text-ink-500 sm:hidden">{m.spec}</div>
                </div>
                <div role="cell" className="hidden min-w-0 text-ink-700 sm:block">{m.spec}</div>
                <div role="cell" className="text-right tabular-nums text-ink-700">{m.qty}</div>
                <div role="cell" className="text-right tabular-nums text-ink-900">{fmtUsd(m.est * m.qty)}</div>
              </div>
            ))}
          </div>
        </Block>

        <Block i={4} className="mt-10" {...reveal}>
          <SectionHeading title={ADD_ONS} meta="Pre-agreed if the scope grows" />
          <div role="table" aria-label={ADD_ONS}>
            <div role="row" className={`${ADD_ON_COLS} ${COL_HEAD}`}>
              <span role="columnheader">Item</span>
              <span role="columnheader" className="text-right">Amount</span>
            </div>
            {SCOPE.addOns.map((a) => (
              <div role="row" key={a.id} className={`${ADD_ON_COLS} border-b border-line py-3`}>
                <div role="cell" className="min-w-0">
                  <div className="text-ui font-medium text-ink-900">{a.if}</div>
                  <div className="mt-0.5 text-meta tabular-nums text-ink-500">{addOnDetail(a)}</div>
                </div>
                <div role="cell" className={`whitespace-nowrap text-right text-ui tabular-nums ${a.dollars == null ? 'text-ink-500' : 'text-ink-900'}`}>
                  {addOnAmount(a)}
                </div>
              </div>
            ))}
          </div>
        </Block>

        <Block i={5} className="mt-10" {...reveal}>
          <SectionHeading title="Done when" />
          <ol className="space-y-2 text-ui leading-[22px] tabular-nums text-ink-700">
            {SCOPE.acceptance.map((line, i) => (
              <li key={line} className="grid grid-cols-[20px_1fr]">
                <span className="text-meta leading-[22px] tabular-nums text-ink-500">{i + 1}.</span>
                <span className="text-pretty">{line}</span>
              </li>
            ))}
          </ol>
        </Block>

        <Block i={6} className="mt-8" {...reveal}>
          <Evidence id="totals" className="ml-auto w-[280px] max-w-full">
            <dl>
              <div className="flex justify-between gap-4 py-1 text-ui">
                <dt className="tabular-nums text-ink-700">{`Labor, ${SCOPE_TOTALS.hours} hr`}</dt>
                <dd className="tabular-nums text-ink-900">{fmtUsd(SCOPE_TOTALS.labor)}</dd>
              </div>
              <div className="flex justify-between gap-4 py-1 text-ui">
                <dt className="tabular-nums text-ink-700">{`Materials, ${SCOPE.materials.length} items`}</dt>
                <dd className="tabular-nums text-ink-900">{fmtUsd(SCOPE_TOTALS.materials)}</dd>
              </div>
              <div className="mt-2 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <dt className="text-ui font-semibold text-ink-900">Estimated total</dt>
                <dd className="text-figure tabular-nums text-ink-900">{fmtUsd(SCOPE_TOTALS.total)}</dd>
              </div>
            </dl>
            <p className="mt-1 text-right text-meta tabular-nums text-pretty text-ink-500">
              {`Local range ${benchmarkRange()}, ${BENCHMARK.jobs} jobs in the ${BENCHMARK.window}. Add-ons excluded.`}
            </p>
          </Evidence>
        </Block>
      </div>

      {/* Held back until the stream finishes, so nobody approves a half-drawn
          scope. `contents` keeps the bar a flex child (sticky) on screen and
          drops it from the exported PDF. */}
      {done && (
        <div className="contents print:hidden">
          <DecisionBar
            note={approved ? <StatusText state={status.state}>{status.label}</StatusText> : `Next: Homewise verifies ${CONTRACTORS.length} local plumbers.`}
            actions={
              approved ? null : (
                <>
                  <Button variant="ghost">Edit scope</Button>
                  <Button onClick={() => onClearGate?.(GATES.approveScope)}>Approve and find contractors</Button>
                </>
              )
            }
          />
        </div>
      )}
    </div>
  );
}

// One streamed block: static skeleton bars until its turn, then the content.
// The enter motion plays only during the stream.
function Block({ i, shown, streaming, className = '', children }) {
  let body = children;
  if (shown <= i) body = <Skeleton bars={SKELETONS[i]} />;
  else if (streaming) body = <motion.div {...enter}>{children}</motion.div>;
  return <div className={className}>{body}</div>;
}

function Skeleton({ bars }) {
  return (
    <div aria-hidden="true" className="space-y-2.5">
      {bars.map((w, i) => (
        <div key={i} className={`h-3 rounded-full bg-shade-2 ${w}`} />
      ))}
    </div>
  );
}
