import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Matrix, {
  Absent,
  Exception,
  GroupLabel,
  Included,
  MatrixCorner,
  MatrixFooter,
  MatrixHeader,
  MatrixRow,
  Outlier,
  RowLabel,
  ValueCell,
} from '../v2/Matrix';
import RangeRail from '../v2/RangeRail';
import { StatusText } from '../v2/Status';
import Button from '../v2/Button';
import Chip from '../v2/Chip';
import { RadioGroup } from '../v2/Radio';
import Tooltip from '../v2/Tooltip';
import Evidence from '../v2/Evidence';
import { dur, ease } from '../v2/motion';
import ArtifactHeader from './matrix/ArtifactHeader';
import ContactDrawer from './matrix/ContactDrawer';
import {
  AI_PICK_ID,
  CONTRACTORS,
  CONTRACTOR_IDS,
  DEFAULT_AVAILABILITY,
  DEFAULT_URGENCY,
  GATES,
  INTAKE,
  LEADERS,
  QUOTE_ROWS,
  SCOPE,
  STATUS,
  URGENCY,
  WINDOWS,
  artifactStatus,
  benchmarkDelta,
  bookingFor,
  describeBooking,
  findSlot,
  fmtDateTime,
  fmtDay,
  fmtTime,
  fmtUsd,
  getContractor,
  isCompleteQuote,
  keepTogether,
  quoteDue,
  slotsFor,
} from '../../data/demo';

const toHas = (c) => (c instanceof Set ? (x) => c.has(x) : Array.isArray(c) ? (x) => c.includes(x) : () => false);
const ROW = Object.fromEntries(QUOTE_ROWS.map((r) => [r.id, r]));
const hoursOf = (id) => SCOPE.tasks.find((t) => t.id === id)?.hours;

// Row copy: labels shortened from QUOTE_ROWS, definitions live in the label
// tooltip so no cell carries a sublabel.
const ROW_COPY = {
  diagnose: { definition: `${hoursOf('diagnose')} hr in your scope` },
  'p-trap': { definition: `${hoursOf('p-trap')} hr, materials included in your scope` },
  cartridge: { definition: `${hoursOf('cartridge')} hr, ${INTAKE.faucetType}` },
  cleanup: { definition: 'Photos of the finished work' },
  warranty: { label: 'Warranty', definition: 'Workmanship warranty on this job' },
  fee: { label: 'Service fee' },
};
const GROUPS = [
  { label: 'Scope', rows: ['diagnose', 'p-trap', 'cartridge', 'cleanup'] },
  { label: 'Terms', rows: ['warranty', 'fee'] },
];
const rowLabel = (row) => ROW_COPY[row.id]?.label ?? row.label.replace(' & ', ' and ');
const rowDefinition = (row) => ROW_COPY[row.id]?.definition ?? (row.sub || undefined);

// Sentence form of quoteDue: 'by 6 PM' for the same-day window, 'Mon' otherwise.
function dueWhen(urgency) {
  const { iso } = quoteDue(urgency);
  return URGENCY[urgency].quoteWindowDays === 1 ? `by ${fmtTime(iso)}` : fmtDay(iso);
}

const joinNames = (names) => (names.length < 3 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`);

// Why the other two lose, from their own quote facts. Ember facts in it stay ink.
function decisionSentence(urgency) {
  const fast = LEADERS.sameDay.length === 1 ? getContractor(LEADERS.sameDay[0]) : null;
  if (urgency === 'urgent' && fast && fast.id !== AI_PICK_ID && !fast.quote.materialsIncluded) {
    return `Only ${fast.short} can come today, and ${fast.pronoun.possessive} materials aren't included.`;
  }
  return CONTRACTORS.filter((c) => c.id !== AI_PICK_ID)
    .map((c) => {
      const q = c.quote;
      if (q.fee.amount > 0) return `${c.short} adds a ${fmtUsd(q.fee.amount)} service fee.`;
      if (!q.materialsIncluded) return `${c.short} leaves out materials.`;
      if (q.warrantyDays == null) return `${c.short} states no warranty.`;
      return null;
    })
    .filter(Boolean)
    .join(' ');
}

function pickTitle(pick) {
  const q = pick.quote;
  const inRange = benchmarkDelta(q.total).position === 'inside';
  if (isCompleteQuote(q) && inRange) return `${pick.short}'s ${fmtUsd(q.total)} is complete and in range`;
  return `${pick.short}'s quote is ${fmtUsd(q.total)}`;
}

// Cells that were in when the tab mounted render at once; later arrivals fade.
function Arrive({ fadeIn, className = '', children }) {
  return (
    <motion.span
      initial={fadeIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: dur.base, ease }}
      className={className}
    >
      {children}
    </motion.span>
  );
}

function QuoteCell({ row, contractor }) {
  const q = contractor.quote;
  const cell = row.cells[contractor.id];
  if (row.id === 'fee') {
    if (q.fee.amount == null) return <Absent>{cell.text}</Absent>;
    return cell.state === 'higher' ? <Outlier>{fmtUsd(q.fee.amount)}</Outlier> : fmtUsd(q.fee.amount);
  }
  if (cell.state === 'flag') {
    // Missing materials is the one ember fact in the scope group.
    if (row.id === 'p-trap' && !q.materialsIncluded) return <Exception>{cell.text}</Exception>;
    return <Absent>{cell.text}</Absent>;
  }
  if (row.id === 'warranty') return cell.text;
  return <Included />;
}

export default function QuotesArtifact({
  gates = {},
  booking = null,
  urgency,
  quotesIn,
  unlocked,
  onClearGate = () => {},
}) {
  const u = URGENCY[urgency] ? urgency : DEFAULT_URGENCY;
  const b = gates[GATES.book] ? describeBooking(booking) : null;
  const booked = !!b;
  const bookedId = b?.contractor.id ?? null;
  const has = booked || quotesIn == null ? () => true : toHas(quotesIn);
  const arrivedIds = CONTRACTOR_IDS.filter(has);
  const allIn = arrivedIds.length === CONTRACTOR_IDS.length;
  const pick = getContractor(AI_PICK_ID);

  const [initialIn] = useState(() => new Set(arrivedIds));
  const fadeIn = (id) => has(id) && !initialIn.has(id);

  const [windows, setWindows] = useState(() => {
    const s = booking ? findSlot(booking.slotId) : null;
    return s && !DEFAULT_AVAILABILITY.includes(s.window) ? [...DEFAULT_AVAILABILITY, s.window] : DEFAULT_AVAILABILITY;
  });
  const [picked, setPicked] = useState(() => (booking ? { [booking.contractorId]: booking.slotId } : {}));
  const [contact, setContact] = useState({ id: null, open: false });

  const toggleWindow = (id) => setWindows((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
  const optionsFor = (c) => {
    const options = slotsFor(c.id, windows);
    if (c.id === bookedId && !options.some((s) => s.id === b.slot.id)) return [...options, b.slot];
    return options;
  };
  const selectedFor = (c) => {
    const options = optionsFor(c);
    return options.find((s) => s.id === picked[c.id]) || options[0] || null;
  };

  let title;
  let state;
  let label;
  let sentence;
  if (booked) {
    const s = artifactStatus('quotes', { unlocked, gates, booking });
    title = `${b.who} is booked for ${keepTogether(b.label)}`;
    state = s.state;
    label = s.label;
    if (gates[GATES.closeOut]) sentence = `Closed out ${fmtDateTime(b.closedOutAt)}`;
    else if (toHas(unlocked)('completion')) sentence = `${b.who} finished ${fmtDateTime(b.completedAt)}`;
    else sentence = b.changeLine;
  } else if (!allIn) {
    const waiting = CONTRACTORS.filter((c) => !has(c.id));
    title = has(pick.id) ? pickTitle(pick) : `${arrivedIds.length} of ${CONTRACTORS.length} quotes in`;
    state = STATUS['awaiting-quotes'].state;
    label = `${arrivedIds.length} of ${CONTRACTORS.length} in`;
    sentence = arrivedIds.length >= 2
      ? `${joinNames(waiting.map((c) => c.short))} ${waiting.length === 1 ? 'is' : 'are'} due ${dueWhen(u)}`
      : 'Quotes usually land within a day';
  } else {
    const s = artifactStatus('quotes', { unlocked, gates, booking });
    title = pickTitle(pick);
    state = s.state;
    label = s.label;
    sentence = decisionSentence(u);
  }

  const callLabel = (c) => {
    if (!has(c.id)) return null;
    if (booked) return c.id === bookedId ? `Call ${c.short}` : null;
    return `Call ${c.short} first`;
  };

  const visitCell = (c) => {
    if (!has(c.id)) {
      return (
        <span className="flex h-8 items-center">
          <Absent label="Waiting" />
        </span>
      );
    }
    const options = optionsFor(c);
    if (!options.length) {
      return <span className="flex h-8 items-center text-meta text-ink-500">No overlap with your times</span>;
    }
    const radio = (o, disabled = false) => ({ value: o.id, label: keepTogether(o.label), disabled });
    if (booked) {
      const mine = c.id === bookedId;
      return (
        <RadioGroup
          label={`${c.short} slots`}
          value={mine ? b.slot.id : null}
          disabled={!mine}
          options={options.map((o) => radio(o, mine && o.id !== b.slot.id))}
        />
      );
    }
    return (
      <RadioGroup
        label={`${c.short} slots`}
        value={selectedFor(c)?.id ?? null}
        onChange={(v) => setPicked((p) => ({ ...p, [c.id]: v }))}
        options={options.map((o) => radio(o))}
      />
    );
  };

  const footer = allIn ? (
    <MatrixFooter label="Book a visit">
      {CONTRACTORS.map((c) => {
        const s = selectedFor(c);
        if (booked) {
          return (
            <Evidence key={c.id} id={`book:${c.id}`} className="min-w-0 justify-self-start">
              {c.id === bookedId && <StatusText state={state}>{b.status}</StatusText>}
            </Evidence>
          );
        }
        return (
          <Evidence key={c.id} id={`book:${c.id}`} className="min-w-0">
            <Button
              size="sm"
              full
              variant={c.aiPick ? 'primary' : 'secondary'}
              disabled={!s}
              onClick={() => s && onClearGate(GATES.book, { booking: bookingFor(s.id) })}
            >
              {s ? `Book ${keepTogether(s.label)}` : 'Book'}
            </Button>
          </Evidence>
        );
      })}
    </MatrixFooter>
  ) : null;

  return (
    <div className={`mx-auto flex w-full max-w-[960px] flex-1 flex-col ${allIn ? '' : 'pb-16'}`}>
      <ArtifactHeader title={title} state={state} label={label} sentence={sentence} />

      <RangeRail arrived={arrivedIds} />

      <Matrix pickIndex={CONTRACTORS.findIndex((c) => c.aiPick)} label="Quotes compared" className="mt-8" footer={footer}>
        <MatrixRow>
          <MatrixCorner />
          {CONTRACTORS.map((c) => {
            const call = callLabel(c);
            return (
              <MatrixHeader key={c.id} id={c.id} name={c.name} pick={c.aiPick}>
                <Arrive key={has(c.id) ? 'in' : 'wait'} fadeIn={fadeIn(c.id)} className="flex flex-col">
                  <span className="mt-2 flex h-6 items-center">
                    {has(c.id)
                      ? <span className="text-figure tabular-nums text-ink-900">{fmtUsd(c.quote.total)}</span>
                      : <StatusText state={STATUS['awaiting-quotes'].state}>{quoteDue(u).label}</StatusText>}
                  </span>
                  {call ? (
                    <button
                      type="button"
                      onClick={() => setContact({ id: c.id, open: true })}
                      className="mt-2 h-4 self-start rounded-md text-meta font-medium text-ink-700 underline-offset-4 transition-colors duration-150 hover:text-ink-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
                    >
                      {call}
                    </button>
                  ) : (
                    // Holds the link's height so names and prices share one edge.
                    <span aria-hidden="true" className="mt-2 h-4" />
                  )}
                </Arrive>
              </MatrixHeader>
            );
          })}
        </MatrixRow>

        {GROUPS.map((g) => (
          <React.Fragment key={g.label}>
            <GroupLabel>{g.label}</GroupLabel>
            {g.rows.map((id) => {
              const row = ROW[id];
              return (
                <MatrixRow key={id}>
                  <RowLabel label={rowLabel(row)} definition={rowDefinition(row)} />
                  {CONTRACTORS.map((c) => (
                    <ValueCell key={c.id}>
                      <Arrive key={has(c.id) ? 'in' : 'wait'} fadeIn={fadeIn(c.id)} className="flex min-w-0 items-center gap-1.5">
                        {has(c.id) ? <QuoteCell row={row} contractor={c} /> : <Absent label="Waiting" />}
                      </Arrive>
                    </ValueCell>
                  ))}
                </MatrixRow>
              );
            })}
          </React.Fragment>
        ))}

        <GroupLabel>Visit</GroupLabel>
        <MatrixRow>
          <RowLabel label="Your times" definition="Slots outside these times are hidden">
            <div className="flex flex-col items-start gap-1">
              {WINDOWS.map((w) => (
                <Tooltip key={w.id} label={w.hint} side="top">
                  <Chip on={windows.includes(w.id)} disabled={booked} onClick={() => toggleWindow(w.id)}>
                    {w.label}
                  </Chip>
                </Tooltip>
              ))}
            </div>
          </RowLabel>
          {CONTRACTORS.map((c) => (
            <ValueCell key={c.id} tall>
              {/* -mt-1.5 centers the first 32px radio row on the "Your times" label line. */}
              <Arrive key={has(c.id) ? 'in' : 'wait'} fadeIn={fadeIn(c.id)} className="-mt-1.5 flex flex-col items-start">
                {visitCell(c)}
              </Arrive>
            </ValueCell>
          ))}
        </MatrixRow>
      </Matrix>

      <ContactDrawer
        contractorId={contact.id}
        open={contact.open}
        onClose={() => setContact((s) => ({ ...s, open: false }))}
      />
    </div>
  );
}
