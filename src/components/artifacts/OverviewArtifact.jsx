import React from 'react';
import { StatusGlyph, StatusText } from '../v2/Status';
import LabelValue from '../v2/LabelValue';
import Photo from '../v2/Photo';
import {
  AC_TASK,
  AI_PICK_ID,
  AT,
  CONTRACTORS,
  GATES,
  GUTTERS_PLAN,
  INTAKE,
  JOB,
  STATUS,
  URGENCY,
  describeBooking,
  deriveSinkStatus,
  fmtDateTime,
  fmtTime,
  fmtUsd,
  getContractor,
  getSystem,
  getWatch,
  isCompleteQuote,
  quoteDue,
} from '../../data/demo';

// The task Overview: the job's name, where it stands, and the facts so far.
// Sink, AC (the New task script) and gutters (the planned stub) share it.
export default function OverviewArtifact({ variant = 'sink', ...props }) {
  if (variant === 'gutters') return <GuttersOverview />;
  if (variant === 'fresh') return <AcOverview {...props} />;
  return <SinkOverview {...props} />;
}

function Doc({ children }) {
  return <div className="mx-auto w-full max-w-[720px] pb-16">{children}</div>;
}

function Header({ title, state, label, sentence, progress }) {
  return (
    <header>
      <h1 className="text-title text-balance text-ink-900">{title}</h1>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <StatusText state={state} progress={progress}>{label}</StatusText>
        {sentence && <span className="text-ui text-ink-500">{sentence}</span>}
      </div>
    </header>
  );
}

const N = CONTRACTORS.length;
const totals = CONTRACTORS.map((c) => c.quote.total);
const QUOTE_RANGE = `${fmtUsd(Math.min(...totals))}–${fmtUsd(Math.max(...totals))}`;
const PICK = getContractor(AI_PICK_ID);
// An incomplete quote is labor only (Schedule says the same), never a bare total.
const quotePrice = (c) => `${fmtUsd(c.quote.total)}${isCompleteQuote(c.quote) ? '' : ' labor only'}`;

// A value with a quieter second line (who, when, what it means).
function Stacked({ main, sub }) {
  return (
    <>
      <span className="block tabular-nums">{main}</span>
      {sub && <span className="block tabular-nums text-ink-500">{sub}</span>}
    </>
  );
}

// The evidence the agent read, as the photos themselves: pinned where it
// looked, captioned with what the pin marks. One photo keeps half the width.
// Same 16px under its facts as Scope's Diagnosis pair.
function EvidencePhotos({ items }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {items.map((p) => (
        <Photo key={p.photo} photo={p.photo} label={p.label} note={p.tag} pin />
      ))}
    </div>
  );
}

// The label is the shared STATUS vocabulary (the Rail says the same words);
// the sentence adds the fact that state turns on.
function sinkLine({ status, inCount, booking, urgency, recommended }) {
  const b = describeBooking(booking);
  const sentence = {
    scoping: 'From your photos and answers',
    'scope-ready': 'Contractors see it only after you approve',
    verifying: 'License, insurance, past work',
    matched: `${N} contractors to compare`,
    'awaiting-quotes': inCount ? `${inCount} of ${N} in` : quoteDue(urgency).label,
    'quotes-in': `${N} quotes in`,
    booked: b ? (b.changeDeadline ? `Free to change until ${b.changeDeadline}` : `Call ${b.who} to change it`) : null,
    'visit-done': b ? `${b.who} marked the visit done` : null,
    done: recommended === 'yes' && b ? `You recommended ${b.who}` : 'Saved to your home file',
  }[status.stage];
  return { state: status.state, label: status.label, sentence };
}

const IDLE = { state: 'idle', value: null };

// One cell per tab. A cell is a door to its tab once that tab exists; the
// value can show before that (Scope "Drafting").
function milestones({ gates, unlocked, inCount, booking }) {
  const has = (tab) => unlocked.has(tab);
  const b = describeBooking(booking);
  const booked = !!gates[GATES.book];
  const visited = has('completion');
  const closed = !!gates[GATES.closeOut];
  return [
    {
      label: 'Scope',
      tab: 'scope',
      ...(!has('scope') ? { state: 'working', value: 'Drafting' }
        : !gates[GATES.approveScope] ? { state: 'needs-you', value: 'In review' }
          : { state: 'done', value: `Approved ${AT.scopeApproved}` }),
    },
    {
      label: 'Pros',
      tab: 'contractors',
      ...(!gates[GATES.approveScope] ? IDLE
        : !has('contractors') ? { state: 'working', value: 'Verifying' }
          : { state: gates[GATES.approveOutreach] ? 'done' : 'needs-you', value: `${N} verified` }),
    },
    {
      label: 'Quotes',
      tab: 'quotes',
      ...(!gates[GATES.approveOutreach] ? IDLE
        : inCount < N ? { state: 'waiting', value: `${inCount} of ${N} in` }
          : { state: booked ? 'done' : 'needs-you', value: `${N} in, ${QUOTE_RANGE}` }),
    },
    {
      label: 'Visit',
      tab: 'schedule',
      ...(!booked ? IDLE : { state: visited || closed ? 'done' : 'waiting', value: b ? b.label : null }),
    },
    {
      label: 'Close-out',
      tab: 'completion',
      ...(!visited ? IDLE : { state: closed ? 'done' : 'needs-you', value: closed ? 'Done' : 'Ready' }),
    },
  ].map((c) => ({ ...c, open: has(c.tab) }));
}

function MilestoneStrip({ cells, progress, onRestage }) {
  return (
    <div className="no-scrollbar -mx-3 mt-8 overflow-x-auto">
      {/* Weighted so the longest values (Scope, Quotes) fit at the 720px Doc. */}
      <div
        role="group"
        aria-label="Job steps"
        className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,0.85fr)_minmax(0,1.3fr)_minmax(0,0.85fr)_minmax(0,0.7fr)] border-y border-line max-sm:min-w-[600px]"
      >
        {cells.map((c) => {
          const Tag = c.open ? 'button' : 'div';
          const action = c.open ? { type: 'button', onClick: () => onRestage?.(c.tab) } : {};
          return (
            <Tag
              key={c.label}
              {...action}
              className="flex h-16 min-w-0 flex-col justify-center px-3 text-left transition-colors duration-150 enabled:hover:bg-shade-1
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink-900/25"
            >
              <span className="text-meta font-medium text-ink-500">{c.label}</span>
              <span className="mt-1 flex min-w-0 items-center gap-1.5 text-ui font-medium tabular-nums text-ink-900">
                <StatusGlyph state={c.state} progress={progress} />
                <span className={`truncate ${c.value ? '' : 'text-ink-300'}`}>{c.value ?? '–'}</span>
              </span>
            </Tag>
          );
        })}
      </div>
    </div>
  );
}

function SinkOverview({
  gates = {},
  unlocked = new Set(),
  quotesIn = new Set(),
  booking = null,
  urgency,
  urgencyChosen = false,
  recommended = null,
  progress = 0,
  photosRead = false,
  kickoff = null,
  onRestage,
}) {
  const inCount = quotesIn.size;
  const status = deriveSinkStatus({ unlocked, gates, booking, quotesIn });
  const line = sinkLine({ status, inCount, booking, urgency, recommended });
  // Rows join as each fact becomes true, in the order they happened. The
  // intake facts sit above the photos that back them; progress follows.
  const b = gates[GATES.book] ? describeBooking(booking) : null;
  // Homewise's pick until Mara books; then whoever she booked.
  const chosen = b ? b.contractor : PICK;
  const visited = unlocked.has('completion') || !!gates[GATES.closeOut];
  const intake = [
    kickoff?.label && { label: 'Reported', value: kickoff.label },
    photosRead && { label: 'From your photos', value: INTAKE.summary },
    urgencyChosen && URGENCY[urgency] && { label: 'Urgency', value: URGENCY[urgency].label },
  ].filter(Boolean);
  const progressFacts = [
    (b || inCount >= N) && { label: 'Pick', value: <Stacked main={`${chosen.name}, ${quotePrice(chosen)}`} /> },
    b && {
      label: 'Visit',
      value: <Stacked main={b.long} sub={visited ? `Finished ${fmtTime(b.completedAt)}` : `Arrives ${b.arrival}`} />,
    },
    b && gates[GATES.closeOut] && { label: 'Closed out', value: <Stacked main={fmtDateTime(b.closedOutAt)} /> },
  ].filter(Boolean);
  const before = intake.length > 0 || photosRead;

  return (
    <Doc>
      <Header title={JOB.name} {...line} progress={progress} />
      <MilestoneStrip cells={milestones({ gates, unlocked, inCount, booking })} progress={progress} onRestage={onRestage} />
      {intake.length > 0 && <LabelValue className="mt-10" items={intake} />}
      {photosRead && <EvidencePhotos items={INTAKE.photos} />}
      {progressFacts.length > 0 && <LabelValue className={before ? 'mt-6' : 'mt-10'} items={progressFacts} />}
    </Doc>
  );
}

// Working throughout, like the sink's intake: a dock waiting on Mara does not
// turn the task ember (the Rail row follows the same rule).
function AcOverview({ kickoff = null, photosRead = false }) {
  const label = photosRead ? AC_TASK.drafting : STATUS.scoping.label;
  // The unit in the photo is the one in the home profile.
  const unit = getSystem(AC_TASK.system);
  const facts = [
    kickoff?.railTitle && { label: 'Reported', value: kickoff.railTitle },
    photosRead && { label: 'From your photo', value: AC_TASK.read },
    unit && { label: 'System', value: <Stacked main={unit.detail} sub={unit.meta} /> },
    { label: 'Next', value: `Scope draft, then ${N} vetted HVAC pros` },
  ].filter(Boolean);

  return (
    <Doc>
      <Header title={kickoff?.railTitle || 'New task'} state="working" label={label} />
      <LabelValue className="mt-8" items={facts} />
      {photosRead && <EvidencePhotos items={[AC_TASK]} />}
    </Doc>
  );
}

// The planned stub: why it is on the list, how often, the part of the house it
// protects, and what Homewise does next (the Thread's own promise).
function GuttersOverview() {
  const w = getWatch('gutters');
  const sys = getSystem(GUTTERS_PLAN.system);
  const facts = [
    { label: 'Why', value: w.why },
    { label: 'Repeats', value: w.detail },
    sys && { label: 'System', value: <Stacked main={sys.detail} sub={sys.meta} /> },
    { label: 'Next', value: `Gutter pros lined up in ${GUTTERS_PLAN.long}, checked with you first` },
  ].filter(Boolean);

  return (
    <Doc>
      <Header title={GUTTERS_PLAN.title} state="waiting" label={`Planned for ${GUTTERS_PLAN.long}`} />
      <LabelValue className="mt-8" items={facts} />
    </Doc>
  );
}
