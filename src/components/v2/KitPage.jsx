import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AI_PICK_ID,
  AT,
  CLOSEOUT_PHOTOS,
  CONTRACTORS,
  DEFAULT_AVAILABILITY,
  INTAKE,
  NEW_TO_HOMEWISE_BELOW,
  PLAN,
  QUOTE_ROWS,
  SCOPE,
  SCOPE_TOTALS,
  STATUS,
  WINDOWS,
  defaultPick,
  fmtUsd,
  getContractor,
  keepTogether,
  recommendCount,
  slotsFor,
} from '../../data/demo';
import Button from './Button';
import Chip from './Chip';
import DecisionBar from './DecisionBar';
import Drawer from './Drawer';
import Evidence, { EvidenceContext, EvidenceScope, useEvidenceController, useEvidenceHandlers } from './Evidence';
import Matrix, { Absent, Exception, GroupLabel, Included, MatrixCorner, MatrixFooter, MatrixHeader, MatrixRow, Outlier, RowLabel, ValueCell } from './Matrix';
import Photo from './Photo';
import { RadioGroup } from './Radio';
import RangeRail from './RangeRail';
import SectionHeading from './SectionHeading';
import { StatusGlyph, StatusText } from './Status';
import Tabs from './Tabs';
import Toggle from './Toggle';
import { collapse, enter, fade } from './motion';

// /kit: the V2 design system as one plain page. Four role boards (color, type,
// status, controls), each value with its job, then the real components on
// their own boards. No Rail or Thread: the system reads on its own.

const pick = getContractor(AI_PICK_ID);
// Sink progress steps: the plan marks up to and including the booking.
const PROGRESS_STEPS = PLAN.findIndex((p) => p.mark === 'booked') + 1;
const currentOf = (key) => {
  const n = CONTRACTORS.filter((c) => c[key].ok).length;
  return n === CONTRACTORS.length ? `all ${n} current` : `${n} of ${CONTRACTORS.length} current`;
};

function Label({ id, children }) {
  return <div id={id} className="mb-2 text-meta font-medium text-ink-500">{children}</div>;
}

function Board({ title, meta, children }) {
  return (
    <section className="rounded-xl bg-white px-5 py-6 ring-1 ring-line sm:px-8 sm:py-7">
      <div className="mb-5 border-b border-line pb-4">
        <h2 className="text-heading text-ink-900">{title}</h2>
        {meta && <p className="mt-1 text-meta text-ink-500">{meta}</p>}
      </div>
      <div>{children}</div>
    </section>
  );
}

function Group({ title, children }) {
  return (
    <div className="mt-6 border-t border-line pt-5 first:mt-0 first:border-t-0 first:pt-0">
      <div className="mb-4 text-ui text-ink-500">{title}</div>
      {children}
    </div>
  );
}

// One row of a role table: the token, a real example, its spec and job.
function RoleRow({ token, example, spec }) {
  return (
    <div className="grid gap-x-6 gap-y-2 border-t border-line py-4 first:border-t-0 first:pt-0 last:pb-0 lg:grid-cols-[132px_minmax(0,1fr)_260px] lg:items-center">
      <span className="text-meta tabular-nums text-ink-500">{token}</span>
      <div className="min-w-0">{example}</div>
      <span className="text-meta text-ink-500">{spec}</span>
    </div>
  );
}

// ── Color ────────────────────────────────────────────────────────────────────

const SURFACES = [
  ['canvas-v2', 'bg-canvas-v2 ring-1 ring-inset ring-line', '#F4F3EE', 'Rail, conversation, gutters'],
  ['white', 'bg-white ring-1 ring-inset ring-line', '#FFFFFF', 'The board, composer, drawers'],
  ['ink-900', 'bg-ink-900', '#1A1A17', 'Text, and the one primary fill per pane'],
  ['ink-700', 'bg-ink-700', '#3C3C38', 'Links, matrix values'],
  ['ink-500', 'bg-ink-500', '#6B6B65', 'Meta, row labels, status sentences'],
  ['ink-300', 'bg-ink-300', '#A8A8A1', 'The idle ring'],
  ['line', 'bg-line', 'ink at 9%', 'The only rule color: borders, dividers, rings'],
  ['shade-1, 2, 3', 'bg-shade-2', 'ink at 4, 7, 10%', 'Hover, selected and secondary, secondary hover'],
];

const MEANING = [
  ['sage-wash', 'bg-sage-wash', '#ECF0E7', 'The pick panel, a done day'],
  ['sage-500', 'bg-sage-500', '#4F6942', 'Working pie, done check'],
  ['sage-600', 'bg-sage-600', '#3D5333', 'Working and done words'],
  ['ember-wash', 'bg-ember-wash', '#FBF0E3', 'The exception cell'],
  ['ember-400', 'bg-ember-400', '#B98132', 'Needs-you dot, the tab dot'],
  ['ember-500', 'bg-ember-500', '#8E601E', 'Needs-you words, the exception, an outlier fee'],
  ['sky2026-wash', 'bg-sky2026-wash', '#ECF2F4', 'The booked day'],
  ['sky2026-500, 700', 'bg-sky2026-500', '#4E6F7A, #2E4850', 'Waiting ring and words'],
];

function Roles({ items }) {
  return (
    <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([name, cls, hex, job]) => (
        <div key={name} className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
          <div className={`h-10 w-10 rounded-lg ${cls}`} />
          <div className="min-w-0">
            <div className="text-ui font-medium text-ink-900">{name}</div>
            <div className="text-meta tabular-nums text-ink-500">{hex}</div>
            <div className="mt-1 text-meta text-ink-700">{job}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorBoard() {
  return (
    <Board title="Color roles" meta="The whole V2 allowlist · one rule color · color only where it means something">
      <Group title="Surfaces and ink"><Roles items={SURFACES} /></Group>
      <Group title="Meaning"><Roles items={MEANING} /></Group>
    </Board>
  );
}

// ── Type ─────────────────────────────────────────────────────────────────────

function TypeBoard() {
  const quotes = CONTRACTORS.map((c) => fmtUsd(c.quote.total)).join(' · ');
  return (
    <Board title="Type roles" meta="Geist 400, 500 and 600 only · five sizes · sentence case, upright">
      <RoleRow token="text-title" example={<span className="text-title text-balance">{`${pick.name} is the pick`}</span>} spec="26/32 · 600 · One per view, the answer, not a label" />
      <RoleRow token="text-figure" example={<span className="text-figure tabular-nums">{quotes}</span>} spec="20/24 · 600 · Prices and totals, tabular figures" />
      <RoleRow token="text-heading" example={<span className="text-heading">Why these three</span>} spec="16/24 · 600 · Sections on the board, drawer titles" />
      <RoleRow token="text-ui" example={<span className="text-ui text-pretty">{`${pick.short} is my pick: the highest rating and the most jobs like this one.`}</span>} spec="14/20 · 400 · Rows, prose, matrix cells, tabs, inputs" />
      <RoleRow token="text-ui 500" example={<span className="text-ui font-medium">{pick.name}</span>} spec="14/20 · 500 · Names, status words, buttons" />
      <RoleRow token="text-meta" example={<span className="text-meta text-ink-500">{`Matched by Homewise · ${AT.prosMatched}`}</span>} spec="12/16 · 400 · Timestamps, row meta, captions" />
    </Board>
  );
}

// ── Status ───────────────────────────────────────────────────────────────────

function StatusLine({ state, live, progress, word, sentence }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {live ? (
        <span className="inline-flex items-center gap-1.5 text-ui font-medium text-ink-900">
          <StatusGlyph state="working" live />
          <span className="self-baseline">{word}</span>
        </span>
      ) : (
        <StatusText state={state} progress={progress}>{word}</StatusText>
      )}
      {sentence && <span className="text-ui text-ink-500">{sentence}</span>}
    </div>
  );
}

function StatusBoard() {
  return (
    <Board title="Status" meta="Glyphs instead of pills · colored by who holds the ball · 14px">
      <RoleRow token="working" example={<StatusLine state="working" progress={0.5} word={STATUS.scoping.label} sentence="From your photos and answers" />} spec="Sage pie, filled by progress · the agent has the ball" />
      <RoleRow token="needs-you" example={<StatusLine state="needs-you" word={STATUS['scope-ready'].label} sentence="Edit anything before contractors see it" />} spec="Ember dot · you have the ball" />
      <RoleRow token="waiting" example={<StatusLine state="waiting" word={STATUS.booked.label} sentence={`${pick.name}, 2-hour window`} />} spec="Dashed sky ring · someone else has the ball" />
      <RoleRow token="done" example={<StatusLine state="done" word="Approved" sentence={AT.scopeApproved} />} spec="Sage disc with a check · a finished step folds to one line" />
      <RoleRow token="idle" example={<StatusLine state="idle" word="Not started" />} spec="Ink-300 ring · not unlocked yet" />
      <RoleRow token="live" example={<StatusLine live word="Drafting the scope" sentence={`Step 1 of ${PROGRESS_STEPS}`} />} spec="The spinning arc, the app's one loop, in one place" />
    </Board>
  );
}

// ── Controls ─────────────────────────────────────────────────────────────────

function ControlsBoard() {
  const [windows, setWindows] = useState(DEFAULT_AVAILABILITY);
  const [slot, setSlot] = useState(defaultPick(AI_PICK_ID)?.id ?? null);
  const [share, setShare] = useState(false);
  const [tab, setTab] = useState('scope');
  const slots = slotsFor(AI_PICK_ID, windows);
  const toggle = (id) => setWindows((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'scope', label: 'Scope' },
    { id: 'contractors', label: 'Contractors', needsYou: true },
    { id: 'quotes', label: 'Quotes' },
  ];
  return (
    <Board title="Controls" meta="Text only · at most one primary visible per screen · disabled is 40% opacity">
      <RoleRow token="Primary" example={<Button>Approve and find contractors</Button>} spec="36px · the decision, one per screen" />
      <RoleRow token="Secondary" example={<div className="flex flex-wrap gap-2"><Button variant="secondary">{`Book ${keepTogether(defaultPick(CONTRACTORS[1].id)?.label || '')}`}</Button><Button variant="secondary">{`Call ${pick.short}`}</Button></div>} spec="Shade-2 fill · every other action" />
      <RoleRow token="Ghost" example={<div className="flex flex-wrap gap-2"><Button variant="ghost">Edit scope</Button><Button variant="ghost">{`Reject all ${CONTRACTORS.length}`}</Button></div>} spec="Text only · the quiet option beside the primary" />
      <RoleRow token="Disabled" example={<Button disabled>Close out the job</Button>} spec="Until the last question is answered" />
      <RoleRow token="Tabs" example={<div className="flex h-10 items-stretch border-b border-line"><Tabs tabs={tabs} active={tab} onSelect={setTab} label="Board views" /></div>} spec="A tab unlocks as the job moves, a dot when it needs you" />
      <RoleRow token="Chips" example={<div className="flex flex-wrap gap-1">{WINDOWS.map((w) => <Chip key={w.id} on={windows.includes(w.id)} onClick={() => toggle(w.id)}>{w.label}</Chip>)}</div>} spec="Fill only · your times" />
      <RoleRow
        token="Radio"
        example={slots.length ? (
          <RadioGroup label={`${pick.short}'s slots`} value={slot} onChange={setSlot} options={slots.map((s) => ({ value: s.id, label: keepTogether(s.label) }))} />
        ) : <span className="text-meta text-ink-500">No overlap with your times</span>}
        spec="A slot per column · the Book button follows"
      />
      <RoleRow
        token="Toggle"
        example={(
          <div className="flex items-center justify-between gap-6 sm:max-w-[420px]">
            <span id="kit-share" className="text-ui text-ink-900">{`Share these photos in ${pick.short}'s showcase?`}</span>
            <Toggle on={share} onChange={setShare} labelledBy="kit-share" />
          </div>
        )}
        spec="Off by default, and never flipped for you"
      />
    </Board>
  );
}

// ── Components on the board ──────────────────────────────────────────────────

function MatrixSample() {
  const [windows, setWindows] = useState(DEFAULT_AVAILABILITY);
  const [picked, setPicked] = useState({});
  const pickIndex = CONTRACTORS.findIndex((c) => c.aiPick);
  const row = (id) => QUOTE_ROWS.find((r) => r.id === id);
  const toggle = (id) => setWindows((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const slotFor = (c) => {
    const options = slotsFor(c.id, windows);
    return options.find((s) => s.id === picked[c.id]) || options[0] || null;
  };
  const cell = (rowId, c) => {
    const q = row(rowId).cells[c.id];
    if (q.state === 'flag') return <Absent>{q.text}</Absent>;
    if (rowId === 'fee' && q.state === 'higher') return <Outlier>{fmtUsd(c.quote.fee.amount)}</Outlier>;
    return q.text;
  };

  const footer = (
    <MatrixFooter label="Book a visit">
      {CONTRACTORS.map((c) => {
        const s = slotFor(c);
        return (
          <div key={c.id}>
            <Button size="sm" full variant={c.aiPick ? 'primary' : 'secondary'} disabled={!s}>
              {s ? `Book ${keepTogether(s.label)}` : 'Book'}
            </Button>
          </div>
        );
      })}
    </MatrixFooter>
  );

  return (
    <Matrix pickIndex={pickIndex} label="Contractors and quotes compared" footer={footer}>
      <MatrixRow>
        <MatrixCorner />
        {CONTRACTORS.map((c) => (
          <MatrixHeader key={c.id} id={c.id} name={c.name} pick={c.aiPick} meta={`${c.rating.score} · ${c.rating.reviews} reviews`}>
            <span className="mt-2 text-figure tabular-nums text-ink-900">{fmtUsd(c.quote.total)}</span>
          </MatrixHeader>
        ))}
      </MatrixRow>
      <MatrixRow>
        <RowLabel label="Years licensed" definition="Verified with the state board" />
        {CONTRACTORS.map((c) => <ValueCell key={c.id}>{c.yearsLicensed}</ValueCell>)}
      </MatrixRow>
      <MatrixRow evidence="row:license">
        <RowLabel label="License" definition="Active, verified with the state board" />
        {CONTRACTORS.map((c) => <ValueCell key={c.id}><Included>{c.license.label.replace(/^CA Lic /, '')}</Included></ValueCell>)}
      </MatrixRow>
      <MatrixRow>
        <RowLabel label="Insurance" definition="General liability and workers' comp" />
        {CONTRACTORS.map((c) => (
          <ValueCell key={c.id}>
            {c.insurance.ok ? <Included>{c.insurance.label}</Included> : <Exception evidence={`insurance:${c.id}`}>{c.insurance.label}</Exception>}
          </ValueCell>
        ))}
      </MatrixRow>
      <MatrixRow>
        <RowLabel label="Recommendations" definition="Homeowners who recommended them after a Homewise job" />
        {CONTRACTORS.map((c) => {
          const n = recommendCount(c.id);
          return (
            <ValueCell key={c.id} evidence={`recs:${c.id}`}>
              {n < NEW_TO_HOMEWISE_BELOW ? <Absent>New to Homewise</Absent> : n}
            </ValueCell>
          );
        })}
      </MatrixRow>
      <GroupLabel>Terms</GroupLabel>
      {['warranty', 'fee'].map((id) => (
        <MatrixRow key={id}>
          <RowLabel label={row(id).label} definition={row(id).sub || 'Workmanship warranty on this job'} />
          {CONTRACTORS.map((c) => <ValueCell key={c.id}>{cell(id, c)}</ValueCell>)}
        </MatrixRow>
      ))}
      <MatrixRow>
        <RowLabel label="Not in yet" />
        {CONTRACTORS.map((c) => <ValueCell key={c.id}><Absent label="Waiting" /></ValueCell>)}
      </MatrixRow>
      <GroupLabel>Visit</GroupLabel>
      <MatrixRow>
        <RowLabel label="Your times" definition="Slots outside these times are hidden">
          <div className="flex flex-col items-start gap-1">
            {WINDOWS.map((w) => <Chip key={w.id} on={windows.includes(w.id)} onClick={() => toggle(w.id)}>{w.label}</Chip>)}
          </div>
        </RowLabel>
        {CONTRACTORS.map((c) => {
          const options = slotsFor(c.id, windows);
          const s = slotFor(c);
          return (
            <ValueCell key={c.id} tall>
              {options.length ? (
                <RadioGroup
                  label={`${c.short} slots`}
                  value={s?.id}
                  onChange={(v) => setPicked((p) => ({ ...p, [c.id]: v }))}
                  options={options.map((o) => ({ value: o.id, label: keepTogether(o.label) }))}
                />
              ) : (
                <span className="text-meta text-ink-500">No overlap with your times</span>
              )}
            </ValueCell>
          );
        })}
      </MatrixRow>
    </Matrix>
  );
}

function RailSample() {
  const [arrived, setArrived] = useState(() => new Set([AI_PICK_ID]));
  const flip = (id) => setArrived((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {CONTRACTORS.map((c) => <Chip key={c.id} on={arrived.has(c.id)} onClick={() => flip(c.id)}>{`${c.short} in`}</Chip>)}
      </div>
      <RangeRail arrived={arrived} />
    </div>
  );
}

function PhotoSamples() {
  const [pins, setPins] = useState(true);
  const before = INTAKE.photos;
  const after = CLOSEOUT_PHOTOS;
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-meta font-medium text-ink-500">Before, after, and the AC read. Same physical spot on each pair.</span>
        <Toggle on={pins} onChange={setPins} label="Show pins" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {before.map((p) => <Photo key={p.id} photo={p.photo} label={p.label} note={p.tag} pin pinVisible={pins} />)}
        {after.slice(0, 2).map((p) => <Photo key={p.photo} photo={p.photo} label={p.label} note={p.tag} pin pinVisible={pins} />)}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <Photo photo={after[2].photo} label={after[2].label} note={after[2].tag} />
        <Photo photo="ac-condenser" label="Outdoor condenser" note="Coil fins clogged" pin pinVisible={pins} />
        <Photo photo="missing-photo" label="Empty slot" align="right" />
      </div>
    </div>
  );
}

function EvidenceSamples() {
  const lines = [
    { head: 'Local pricing', result: `${fmtUsd(SCOPE_TOTALS.total)} estimate`, time: AT.benchmarkChecked, target: { artifact: 'kit', id: 'totals' } },
    { head: 'License records', result: currentOf('license'), time: AT.licensesChecked, target: { artifact: 'kit', id: 'row:license' } },
    { head: 'Insurance', result: currentOf('insurance'), time: AT.insuranceChecked, target: { artifact: 'kit', id: `insurance:${CONTRACTORS.find((c) => !c.insurance.ok)?.id}` } },
  ];
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div className="rounded-xl bg-canvas-v2 px-5 py-3">
        <Label>Thread lines: hover, focus, click</Label>
        <div className="space-y-1">
          {lines.map((l) => <ReceiptLine key={l.head} {...l} />)}
        </div>
      </div>
      <Evidence id="totals" className="ml-auto w-full max-w-[280px]">
        <div className="flex justify-between py-1 text-ui">
          <span>{`Labor, ${SCOPE_TOTALS.hours} hr`}</span>
          <span className="tabular-nums">{fmtUsd(SCOPE_TOTALS.labor)}</span>
        </div>
        <div className="flex justify-between py-1 text-ui">
          <span>{`Materials, ${SCOPE.materials.length} items`}</span>
          <span className="tabular-nums">{fmtUsd(SCOPE_TOTALS.materials)}</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between border-t border-line pt-3">
          <span className="text-ui font-semibold">Estimated total</span>
          <span className="text-figure tabular-nums">{fmtUsd(SCOPE_TOTALS.total)}</span>
        </div>
      </Evidence>
    </div>
  );
}

function ReceiptLine({ head, result, time, target }) {
  const handlers = useEvidenceHandlers(target);
  return (
    <button type="button" {...handlers} className="group -mx-2 flex h-6 w-[calc(100%+16px)] items-center gap-2 rounded-md px-2 text-left text-meta transition-colors duration-150 hover:bg-shade-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25">
      <span className="min-w-0 flex-1 truncate">
        <span className="font-medium text-ink-700 group-hover:text-ink-900">{head}</span>
        <span className="text-ink-500">{` · ${result}`}</span>
      </span>
      <span className="shrink-0 tabular-nums text-ink-500">{time}</span>
    </button>
  );
}

function DrawerSample() {
  const [open, setOpen] = useState(false);
  const c = pick;
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>{`Call ${c.short} first`}</Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title={c.name}
        meta={`${c.rating.score} · ${c.rating.reviews} reviews · ${c.responseTime.charAt(0).toLowerCase()}${c.responseTime.slice(1)}`}
      >
        <div className="space-y-8">
          <p className="text-ui leading-[22px] text-ink-700">{c.bio}</p>
          <div>
            <a href={`tel:${c.phone.replace(/\D/g, '')}`} className="text-figure tabular-nums text-ink-900 underline-offset-4 hover:underline">{c.phone}</a>
            <div className="mt-3">
              <Button variant="secondary" size="sm" as="a" href={`tel:${c.phone.replace(/\D/g, '')}`}>{`Call ${c.short}`}</Button>
            </div>
          </div>
          <div>
            <SectionHeading title="In their words" />
            <p className="text-ui leading-[22px] text-ink-700">{c.quote.note}</p>
          </div>
          <div className="space-y-6">
            {c.showcase.map((j) => (
              <div key={j.photo}>
                <Photo photo={j.photo} aspect="aspect-[16/9]" />
                <div className="mt-2 flex justify-between">
                  <span className="text-ui font-medium">{j.category}</span>
                  <span className="text-meta tabular-nums text-ink-500">{j.date}</span>
                </div>
                <div className="text-ui text-ink-700">{j.scope}</div>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </>
  );
}

function MotionSamples() {
  const [n, setN] = useState(0);
  const [open, setOpen] = useState(true);
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => setN((x) => x + 1)}>Replay enter and fade</Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen((v) => !v)}>{open ? 'Collapse' : 'Expand'}</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <motion.p key={`e${n}`} {...enter} className="text-ui text-ink-700">enter: opacity and 4px rise, 200ms</motion.p>
        <motion.p key={`f${n}`} {...fade} className="text-ui text-ink-700">fade: opacity only, 200ms</motion.p>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div key="c" {...collapse} className="overflow-hidden">
            <p className="text-ui text-ink-700">collapse: height and opacity, 200ms. Reduced motion makes every duration 0.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function KitPage() {
  const evidence = useEvidenceController();
  const [resolved, setResolved] = useState(false);
  return (
    <EvidenceContext.Provider value={evidence}>
      <div className="v2 min-h-screen bg-canvas-v2 text-ink-900 antialiased">
        <EvidenceScope artifact="kit">
          <main className="mx-auto w-full max-w-[1080px] px-4 py-12 sm:px-6 lg:py-16">
            <header>
              <div className="text-meta text-ink-500">Homewise · Version 2</div>
              <h1 className="mt-2 text-title text-balance text-ink-900">Design system</h1>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <StatusText state="done">One system</StatusText>
                <span className="text-ui text-ink-500">Geist at 400 to 600, five sizes, one rule color, and three washes that each mean one thing.</span>
              </div>
            </header>

            <h2 className="mt-12 mb-4 text-heading text-ink-900">Foundations</h2>
            <div className="space-y-6">
              <ColorBoard />
              <TypeBoard />
              <StatusBoard />
              <ControlsBoard />
            </div>

            <h2 className="mt-14 mb-4 text-heading text-ink-900">On the board</h2>
            <div className="space-y-6">
              <Board title="Matrix" meta="One table on the board · two glyphs in its body, Included and Exception · the pick gets one sage panel">
                <MatrixSample />
              </Board>
              <Board title="Range rail" meta="The local price range · ticks appear as quotes arrive (tap a chip)">
                <RailSample />
              </Board>
              <Board title="Receipts" meta="Each finished step is one line in the conversation · hover or click a line to point at its proof">
                <EvidenceSamples />
              </Board>
              <Board title="Photos" meta="Pins mark the spot the agent read">
                <PhotoSamples />
              </Board>
              <Board title="Decision bar" meta="Every gate ends here · a note on what happens next, and the pane's one dark button">
                <div className="-mt-12">
                  <DecisionBar
                    note={resolved ? <StatusText state="done">{`Approved ${AT.scopeApproved}`}</StatusText> : `Next: Homewise verifies ${CONTRACTORS.length} local plumbers.`}
                    actions={resolved ? null : (
                      <>
                        <Button variant="ghost">Edit scope</Button>
                        <Button onClick={() => setResolved(true)}>Approve and find contractors</Button>
                      </>
                    )}
                  />
                </div>
              </Board>
              <Board title="Drawer" meta="The one shadow in the app, for drawers only">
                <DrawerSample />
              </Board>
              <Board title="Motion" meta="One ease, three durations · reduced motion makes every duration 0">
                <MotionSamples />
              </Board>
            </div>
          </main>
        </EvidenceScope>
      </div>
    </EvidenceContext.Provider>
  );
}
