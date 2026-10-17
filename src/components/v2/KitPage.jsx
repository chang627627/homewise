import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronsLeft, Download, Maximize2, Mic, PanelLeftClose, PanelLeftOpen, Paperclip, Plus } from 'lucide-react';
import {
  AI_PICK_ID,
  AT,
  CLOSEOUT_PHOTOS,
  CONTRACTORS,
  DEFAULT_AVAILABILITY,
  DEFAULT_BOOKING,
  GUTTERS_PLAN,
  HOME,
  INTAKE,
  JOB,
  NEW_TO_HOMEWISE_BELOW,
  PLAN,
  QUOTE_ROWS,
  SCOPE,
  SCOPE_TOTALS,
  STATUS,
  WINDOWS,
  contractorRationale,
  defaultPick,
  describeBooking,
  fmtUsd,
  getContractor,
  keepTogether,
  recommendCount,
  slotsFor,
} from '../../data/demo';
import Avatar from './Avatar';
import Button from './Button';
import Chip from './Chip';
import DecisionBar from './DecisionBar';
import Drawer from './Drawer';
import Evidence, { EvidenceContext, EvidenceScope, useEvidenceController, useEvidenceHandlers } from './Evidence';
import HouseMark from './HouseMark';
import IconButton from './IconButton';
import Kbd from './Kbd';
import LabelValue from './LabelValue';
import Matrix, { Absent, Exception, GroupLabel, Included, MatrixCorner, MatrixFooter, MatrixHeader, MatrixRow, Outlier, RowLabel, ValueCell } from './Matrix';
import Photo from './Photo';
import { RadioGroup } from './Radio';
import RangeRail from './RangeRail';
import Row from './Row';
import SectionHeading from './SectionHeading';
import { Dot, StatusGlyph, StatusText } from './Status';
import Tabs from './Tabs';
import Toggle from './Toggle';
import Tooltip from './Tooltip';
import useScrolled from './useScrolled';
import { collapse, enter, fade } from './motion';

// /kit: every V2 primitive in every state, on the real surfaces (canvas-v2
// chrome on the left, the white Stage panel on the right). Review page only.

const pick = getContractor(AI_PICK_ID);
const STATES = ['working', 'needs-you', 'waiting', 'done', 'idle'];
// Sink progress steps: the plan marks up to and including the booking.
const PROGRESS_STEPS = PLAN.findIndex((p) => p.mark === 'booked') + 1;
const currentOf = (key) => {
  const n = CONTRACTORS.filter((c) => c[key].ok).length;
  return n === CONTRACTORS.length ? `all ${n} current` : `${n} of ${CONTRACTORS.length} current`;
};
const link = 'text-ui font-medium text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline';

function Label({ id, children }) {
  return <div id={id} className="mb-2 text-meta font-medium text-ink-500">{children}</div>;
}

function Section({ title, meta, children }) {
  return (
    <section className="mt-10 first:mt-0">
      <SectionHeading title={title} meta={meta} />
      {children}
    </section>
  );
}

// ── Chrome (canvas-v2) ───────────────────────────────────────────────────────

function RailSamples() {
  const [selected, setSelected] = useState('draft');
  const sink = STATUS['quotes-in'];
  const booked = describeBooking(DEFAULT_BOOKING);
  return (
    <div className="flex flex-col px-3 lg:sticky lg:top-0 lg:h-screen">
      <div className="flex h-14 items-center gap-1">
        <Row lead={<HouseMark />} title={HOME.name} selected={selected === 'home'} onClick={() => setSelected('home')} />
        <IconButton icon={PanelLeftClose} label="Collapse sidebar" />
      </div>
      <div className="mt-4">
        <div className="flex h-8 items-center justify-between pl-2">
          <span className="text-meta font-medium text-ink-500">Tasks</span>
          <IconButton size="sm" icon={Plus} label="New task" />
        </div>
        <div className="space-y-px">
          <Row lead={<StatusGlyph state="idle" />} title="New task" selected={selected === 'draft'} onClick={() => setSelected('draft')} />
          <Row lead={<StatusGlyph state={STATUS.booked.state} />} title={JOB.name} meta={booked.slot.day} selected={selected === 'sink'} onClick={() => setSelected('sink')} />
          <Row lead={<StatusGlyph state={sink.state} />} title={sink.label} />
          <Row lead={<StatusGlyph state="working" progress={0.125} />} title="Working, 1/8 pie" onClick={() => setSelected('w')} selected={selected === 'w'} />
          <Row lead={<StatusGlyph state="waiting" />} title="Waiting, with meta" meta={GUTTERS_PLAN.short} />
          <Row lead={<StatusGlyph state="done" />} title="Done, muted" muted />
          <Row lead={<HouseMark />} title="Evidence preview" preview />
        </div>
      </div>

      <div className="mt-8">
        <Label>Collapsed, 56px</Label>
        <div className="w-14 space-y-px border-r border-line px-3">
          <IconButton icon={PanelLeftOpen} label="Open sidebar" side="right" />
          <Row collapsed lead={<HouseMark />} title={HOME.name} />
          <Row collapsed lead={<StatusGlyph state={sink.state} />} title={JOB.name} tooltip={`${JOB.name} · ${sink.label}`} selected />
          <Row collapsed lead={<StatusGlyph state="working" progress={0.25} />} title="AC task" tooltip={`AC task · ${STATUS.scoping.label}`} />
        </div>
      </div>

      <div className="mt-auto flex h-14 items-center gap-2 px-2">
        <Avatar />
        <span className="truncate text-ui font-medium">{`${HOME.owner.first} ${HOME.owner.last}`}</span>
      </div>
    </div>
  );
}

function ThreadSamples() {
  const [pins, setPins] = useState(true);
  const [scrolled, onScroll] = useScrolled();
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className={`flex h-14 shrink-0 items-center border-b px-5 transition-colors duration-150 ${scrolled ? 'border-line' : 'border-transparent'}`}>
        <span className="min-w-0 flex-1 truncate text-ui font-medium">{JOB.name}</span>
        <IconButton icon={ChevronsLeft} label="Collapse conversation" />
      </div>
      <div onScroll={onScroll} className="space-y-6 px-5 pb-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <div>
          <Label>Status glyphs (14px), live arc in the composer</Label>
          <div className="space-y-1">
            {STATES.map((s) => (
              <div key={s} className="flex h-6 items-center gap-2 text-meta text-ink-700">
                <StatusGlyph state={s} />
                {s}
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label>Working pie by progress</Label>
          <div className="flex items-center gap-3 text-meta tabular-nums text-ink-500">
            {[0, 0.25, 0.5, 0.75, 1].map((p) => (
              <span key={p} className="inline-flex items-center gap-1.5">
                <StatusGlyph state="working" progress={p} />
                {p * 4}/4
              </span>
            ))}
          </div>
        </div>
        <div>
          <Label>Keycaps</Label>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((n) => <Kbd key={n}>{n}</Kbd>)}
            <Kbd>Esc</Kbd>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-meta font-medium text-ink-500">User photos, 160px, pinned</span>
            <button type="button" onClick={() => setPins((v) => !v)} className="text-meta font-medium text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline">
              {pins ? 'Hide pins' : 'Show pins'}
            </button>
          </div>
          <div className="flex justify-end gap-2">
            {INTAKE.photos.map((p) => (
              <Photo key={p.id} photo={p.photo} label={p.label} pin pinVisible={pins} className="w-[160px]" />
            ))}
          </div>
        </div>
        <div>
          <Label>Tooltip sides</Label>
          <div className="flex items-center gap-1">
            <IconButton icon={Paperclip} label="Attach (top)" side="top" />
            <IconButton icon={Mic} label="Dictate (right)" side="right" />
            <IconButton icon={Download} label="Export PDF (bottom)" side="bottom" />
            <IconButton icon={Maximize2} label="Focus (left)" side="left" />
            <IconButton size="sm" icon={ChevronDown} label="Show plan (sm)" side="top" />
          </div>
          <p className="mt-2 text-meta text-ink-500">Hover one, then slide to the next: the second opens at once.</p>
        </div>
      </div>
      <div className="mx-3 mb-3 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-line">
        <div className="flex h-10 items-center gap-2 border-b border-line px-3">
          <StatusGlyph state="working" live />
          <span className="min-w-0 flex-1 truncate text-ui font-medium">Drafting the scope</span>
          <span className="text-meta tabular-nums text-ink-500">{`Step 1 of ${PROGRESS_STEPS}`}</span>
        </div>
        <div className="flex items-center gap-1 p-1.5">
          <IconButton size="sm" icon={Paperclip} label="Attach" side="top" />
          <span className="min-h-7 flex-1 px-1.5 py-1 text-ui text-ink-300">Reply to Homewise</span>
          <IconButton size="sm" icon={Mic} label="Dictate" side="top" />
        </div>
      </div>
    </div>
  );
}

// ── Stage (white panel) ──────────────────────────────────────────────────────

function StageHeader() {
  const [active, setActive] = useState('scope');
  const [preview, setPreview] = useState(null);
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'scope', label: 'Scope', needsYou: true },
    { id: 'contractors', label: 'Contractors', needsYou: true },
    { id: 'quotes', label: 'Quotes' },
  ];
  return (
    <div className="flex h-10 shrink-0 items-stretch justify-between gap-6 border-b border-line px-6">
      <Tabs tabs={tabs} active={active} preview={preview} onSelect={setActive} />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onPointerEnter={() => setPreview('quotes')}
          onPointerLeave={() => setPreview(null)}
          className="mr-2 hidden text-meta tabular-nums text-ink-500 hover:text-ink-900 lg:block"
        >
          {`Drafted ${AT.scopeDrafted} · ${SCOPE.ref}`}
        </button>
        <IconButton icon={Download} label="Export PDF" />
        <IconButton icon={Maximize2} label="Focus" />
      </div>
    </div>
  );
}

function TypeSamples() {
  const rows = [
    ['text-title', <span className="text-title text-balance">{`${pick.name} is the pick`}</span>],
    ['text-figure', <span className="text-figure tabular-nums">{fmtUsd(SCOPE_TOTALS.total)}</span>],
    ['text-heading', <span className="text-heading">Why these three</span>],
    ['text-ui', <span className="text-ui">Rows, prose, matrix cells, buttons, tabs, inputs.</span>],
    ['text-ui 500', <span className="text-ui font-medium">{pick.name}</span>],
    ['text-meta', <span className="text-meta text-ink-500">{`Matched by Homewise · ${AT.prosMatched}`}</span>],
  ];
  return (
    <div className="divide-y divide-line">
      {rows.map(([name, sample]) => (
        <div key={name} className="grid grid-cols-[120px_minmax(0,1fr)] items-baseline gap-4 py-3">
          <span className="text-meta tabular-nums text-ink-500">{name}</span>
          {sample}
        </div>
      ))}
    </div>
  );
}

const SWATCHES = [
  ['canvas-v2', 'bg-canvas-v2'],
  ['white', 'bg-white ring-1 ring-inset ring-line'],
  ['ink-900', 'bg-ink-900'],
  ['ink-700', 'bg-ink-700'],
  ['ink-500', 'bg-ink-500'],
  ['ink-300', 'bg-ink-300'],
  ['ink-200', 'bg-ink-200'],
  ['line', 'bg-line'],
  ['shade-1', 'bg-shade-1'],
  ['shade-2', 'bg-shade-2'],
  ['shade-3', 'bg-shade-3'],
  ['sage-wash', 'bg-sage-wash'],
  ['sage-500', 'bg-sage-500'],
  ['sage-600', 'bg-sage-600'],
  ['ember-wash', 'bg-ember-wash'],
  ['ember-400', 'bg-ember-400'],
  ['ember-500', 'bg-ember-500'],
  ['sky2026-wash', 'bg-sky2026-wash'],
  ['sky2026-500', 'bg-sky2026-500'],
  ['sky2026-700', 'bg-sky2026-700'],
];

function ColorSamples() {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3 sm:grid-cols-5">
      {SWATCHES.map(([name, cls]) => (
        <div key={name}>
          <div className={`h-10 rounded-md ${cls}`} />
          <div className="mt-1.5 text-meta text-ink-500">{name}</div>
        </div>
      ))}
    </div>
  );
}

function ButtonSamples() {
  return (
    <div className="space-y-5">
      {['md', 'sm'].map((size) => (
        <div key={size}>
          <Label>{size === 'md' ? 'md, 36px' : 'sm, 32px'}</Label>
          <div className="flex flex-wrap items-center gap-2">
            <Button size={size}>Primary</Button>
            <Button size={size} variant="secondary">Secondary</Button>
            <Button size={size} variant="ghost">Ghost</Button>
            <Button size={size} disabled>Disabled</Button>
            <Button size={size} variant="secondary" as="a" href={`tel:${pick.phone.replace(/\D/g, '')}`}>{`Call ${pick.short}`}</Button>
          </div>
        </div>
      ))}
      <div>
        <Label>Full width, links</Label>
        <div className="grid max-w-[480px] grid-cols-3 gap-3">
          {CONTRACTORS.map((c) => (
            <Button key={c.id} size="sm" full variant={c.aiPick ? 'primary' : 'secondary'}>
              {`Book ${keepTogether(defaultPick(c.id)?.label || '')}`}
            </Button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-5">
          <button type="button" className={link}>Reschedule</button>
          <button type="button" className="text-ui font-medium text-ink-500 underline-offset-4 hover:text-ink-900 hover:underline">Cancel visit</button>
          <button type="button" className="text-meta font-medium text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline">See work</button>
        </div>
      </div>
    </div>
  );
}

function StatusSamples() {
  return (
    <div className="space-y-3">
      {STATES.map((s) => (
        <div key={s} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <StatusText state={s} progress={0.5}>{Object.values(STATUS).find((x) => x.state === s)?.label || 'Not started'}</StatusText>
          <span className="text-ui text-ink-500">Status line sentence in ink-500</span>
        </div>
      ))}
      <div className="flex items-center gap-2 text-ui text-ink-500">
        <Dot />
        Dot, on a non-active tab only
      </div>
    </div>
  );
}

function ControlSamples() {
  const [windows, setWindows] = useState(DEFAULT_AVAILABILITY);
  const [slot, setSlot] = useState(defaultPick(AI_PICK_ID)?.id ?? null);
  const [recommend, setRecommend] = useState(null);
  const [share, setShare] = useState(false);
  const slots = slotsFor(AI_PICK_ID, windows);
  const toggle = (id) => setWindows((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      <div>
        <Label>Chips (fill only)</Label>
        <div className="flex flex-wrap gap-1">
          {WINDOWS.map((w) => <Chip key={w.id} on={windows.includes(w.id)} onClick={() => toggle(w.id)}>{w.label}</Chip>)}
          <Chip on disabled>Disabled</Chip>
        </div>
      </div>
      <div>
        <Label id="kit-slots">{`Radio group, ${pick.short}'s slots (arrows move and select)`}</Label>
        {slots.length ? (
          <RadioGroup labelledBy="kit-slots" value={slot} onChange={setSlot} options={slots.map((s) => ({ value: s.id, label: keepTogether(s.label) }))} />
        ) : (
          <span className="text-meta text-ink-500">No overlap with your times</span>
        )}
      </div>
      <div>
        <Label>Radio group, no default</Label>
        <RadioGroup label={`Recommend ${pick.short}`} value={recommend} onChange={setRecommend} options={[{ value: 'yes', label: `Yes, recommend ${pick.short}` }, { value: 'no', label: 'No' }]} />
        <RadioGroup label="Disabled" disabled value="on" className="mt-2" options={[{ value: 'on', label: 'Disabled, selected' }, { value: 'off', label: 'Disabled' }]} />
      </div>
      <div>
        <Label>Toggle (off by default)</Label>
        <div className="flex items-start justify-between gap-6">
          <span id="kit-share" className="text-ui text-ink-900">{`Share these photos in ${pick.short}'s showcase?`}</span>
          <Toggle on={share} onChange={setShare} labelledBy="kit-share" />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <Toggle on label="On" />
          <Toggle label="Off" />
          <Toggle on disabled label="Disabled" />
        </div>
      </div>
    </div>
  );
}

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

function ScrollSample() {
  const [scrolled, onScroll] = useScrolled();
  return (
    <div className="flex h-48 flex-col overflow-hidden rounded-xl bg-canvas-v2">
      <div className={`flex h-10 shrink-0 items-center border-b px-4 text-ui font-medium transition-colors duration-150 ${scrolled ? 'border-line' : 'border-transparent'}`}>
        Scroll-aware header
      </div>
      <div onScroll={onScroll} className="flex-1 space-y-2 overflow-y-auto px-4 py-2">
        {SCOPE.acceptance.concat(SCOPE.acceptance).map((a, i) => (
          <p key={`${i}-${a}`} className="text-ui text-ink-700">{a}</p>
        ))}
      </div>
    </div>
  );
}

export default function KitPage() {
  const evidence = useEvidenceController();
  const [resolved, setResolved] = useState(false);
  return (
    <EvidenceContext.Provider value={evidence}>
      <div className="v2 min-h-screen bg-canvas-v2 text-ink-900 antialiased lg:flex">
        <aside className="border-line lg:w-[224px] lg:shrink-0 lg:border-r">
          <RailSamples />
        </aside>
        <aside className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[360px] lg:shrink-0 xl:w-[400px]">
          <ThreadSamples />
        </aside>
        <main className="m-2 flex min-w-0 flex-1 flex-col rounded-xl bg-white ring-1 ring-line">
          <StageHeader />
          <EvidenceScope artifact="kit">
            <div className="flex flex-1 flex-col px-4 pt-8 lg:px-6 xl:px-8">
              <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
                <div className="flex-1">
                  <h1 className="text-title text-balance text-ink-900">V2 primitives</h1>
                  <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <StatusText state="needs-you">Review the craft</StatusText>
                    <span className="text-ui text-ink-500">Every primitive in every state, on the real surfaces.</span>
                  </div>
                  <div className="mt-1 text-meta tabular-nums text-ink-500">src/components/v2 · README.md has the props</div>

                  <div className="mt-8">
                    <Section title="Type" meta="Five sizes, weights 400 to 600">
                      <TypeSamples />
                    </Section>
                    <Section title="Color" meta="The whole V2 allowlist">
                      <ColorSamples />
                    </Section>
                    <Section title="Buttons" meta="Text only">
                      <ButtonSamples />
                    </Section>
                    <Section title="Status">
                      <StatusSamples />
                    </Section>
                    <Section title="Controls">
                      <ControlSamples />
                    </Section>
                    <Section title="Property grid">
                      <div className="space-y-8">
                        <LabelValue strong items={contractorRationale().map((r) => ({ key: r.label, label: r.label, value: r.text }))} />
                        <LabelValue
                          items={[
                            { label: 'Scope of work', value: `${SCOPE.ref}. The same brief for all three.` },
                            { label: 'Location', value: `${HOME.publicAddress}. Your full address goes only to the pro you book.` },
                          ]}
                        />
                      </div>
                    </Section>
                    <Section title="Matrix" meta="Hover a dotted label for its definition">
                      <MatrixSample />
                    </Section>
                    <Section title="Range rail" meta="Ticks appear as quotes arrive">
                      <RailSample />
                    </Section>
                    <Section title="Photos" meta="Pins mark the spot the agent read">
                      <PhotoSamples />
                    </Section>
                    <Section title="Evidence" meta="Click a line: restage, center, hold 1200ms">
                      <EvidenceSamples />
                    </Section>
                    <Section title="Drawer">
                      <DrawerSample />
                    </Section>
                    <Section title="Motion">
                      <MotionSamples />
                    </Section>
                    <Section title="Scroll">
                      <ScrollSample />
                    </Section>
                    <Section title="Tooltip on any element">
                      <Tooltip label={`${JOB.name} · ${STATUS.booked.label}`} side="top">
                        <span tabIndex={0} className="rounded-md text-ui text-ink-700 underline decoration-dotted decoration-ink-300 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25">
                          Hover or tab to this text
                        </span>
                      </Tooltip>
                    </Section>
                  </div>
                </div>
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
            </div>
          </EvidenceScope>
        </main>
      </div>
    </EvidenceContext.Provider>
  );
}
