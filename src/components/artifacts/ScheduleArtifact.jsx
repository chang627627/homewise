import React from 'react';
import Button from '../v2/Button';
import Evidence from '../v2/Evidence';
import LabelValue from '../v2/LabelValue';
import { DocTitle, NotBooked, StatusLine, TextButton, includes } from './doc/DocParts';
import {
  GATES,
  HOME,
  JOB,
  STATUS,
  artifactStatus,
  describeBooking,
  fmtDateTime,
  fmtUsd,
  isCompleteQuote,
  isToday,
  weekFor,
} from '../../data/demo';

// The booked pro is the only one who gets the house number.
const STREET_LINE = HOME.fullAddress.split(',')[0];

function dayClass(d, finished) {
  if (d.isBooked) return finished ? 'bg-sage-wash font-semibold text-sage-600' : 'bg-sky2026-wash font-semibold text-sky2026-700';
  if (d.isToday) return 'font-semibold text-ink-900 ring-1 ring-inset ring-line';
  if (d.isPast) return 'text-ink-300';
  return 'text-ink-700';
}

export default function ScheduleArtifact({ booking, gates = {}, unlocked, recommended }) {
  const b = describeBooking(booking);
  if (!b) return <NotBooked title="No visit booked yet" />;

  const c = b.contractor;
  const q = c.quote;
  const closed = !!gates[GATES.closeOut];
  // The visit is over once the pro reports it (Close-out unlocks), even
  // before the job is closed out.
  const finished = closed || includes(unlocked, 'completion');
  const week = weekFor(booking);

  const status = finished && !closed ? STATUS['visit-done'] : artifactStatus('schedule', { gates, booking });
  const sentence = closed
    ? `${c.name}, ${b.onSite} on site`
    : finished
      ? `${b.who} marked the visit done`
      : `${c.name}, ${b.window}`;

  const key = finished
    ? [
        { label: 'Finished', value: fmtDateTime(b.completedAt) },
        { label: 'Closed out', value: closed ? fmtDateTime(b.closedOutAt) : null },
      ]
    : [
        { label: 'Arrives', value: `${isToday(b.slot.iso) ? 'Today · ' : ''}${b.slot.day} ${b.arrival}` },
        b.changeDeadline
          ? { label: 'Free to change', value: `Until ${b.changeDeadline}` }
          : { label: 'Same-day visit', value: `Call ${b.who} to change it` },
      ];

  const details = [
    { label: 'What', value: JOB.name },
    { label: 'Who', value: `${c.owner.first} ${c.owner.last}, ${c.name}` },
    { label: 'Where', value: `${STREET_LINE}, kitchen` },
    { label: 'Price', value: isCompleteQuote(q) ? `${fmtUsd(q.total)} flat` : `${fmtUsd(q.total)} labor only, materials TBD` },
    ...(finished ? [] : [{ label: 'Reminder', value: `Text ${b.reminder} arrival` }]),
  ];

  const tel = `tel:${c.phone.replace(/\D/g, '')}`;

  return (
    <div className="mx-auto w-full max-w-[720px] pb-16">
      <DocTitle>{b.long}</DocTitle>
      <StatusLine status={status} sentence={sentence} />

      <ol aria-label={week.label} className="mt-8 grid max-w-[392px] grid-cols-7 gap-1">
        {week.days.map((d) => (
          <li key={d.iso} aria-current={d.isToday ? 'date' : undefined} className="flex flex-col items-center gap-1">
            <span className="text-meta text-ink-500">{d.day}</span>
            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-ui tabular-nums ${dayClass(d, finished)}`}>
              {d.dom}
            </span>
            {d.isBooked && <span className="sr-only">Visit day</span>}
          </li>
        ))}
      </ol>

      <Evidence id="when" as="dl" className="mt-6 grid grid-cols-2 rounded-xl bg-canvas-v2">
        {key.map((k, i) => (
          <div key={k.label} className={`min-w-0 px-5 py-4 ${i ? 'border-l border-line' : ''}`}>
            <dt className="text-meta font-medium text-ink-500">{k.label}</dt>
            <dd className="mt-1 text-ui font-medium tabular-nums text-ink-900">
              {k.value ?? (
                <>
                  <span aria-hidden="true" className="text-ink-300">–</span>
                  <span className="sr-only">Not yet</span>
                </>
              )}
            </dd>
          </div>
        ))}
      </Evidence>

      <LabelValue items={details} className="mt-8 [&_dd]:tabular-nums" />

      {closed ? (
        <p className="mt-8 text-meta text-ink-500">
          {recommended === 'yes' ? 'Recommendation logged. Saved to your home file.' : 'Saved to your home file.'}
        </p>
      ) : (
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button variant="secondary" size="sm" as="a" href={tel}>
            {`Call ${b.who}`}
          </Button>
          {!finished && b.changeDeadline && (
            <>
              <TextButton>Reschedule</TextButton>
              <TextButton muted>Cancel visit</TextButton>
            </>
          )}
        </div>
      )}
    </div>
  );
}
