import React, { useEffect, useId, useRef, useState } from 'react';
import Button from '../v2/Button';
import DecisionBar from '../v2/DecisionBar';
import Evidence from '../v2/Evidence';
import LabelValue from '../v2/LabelValue';
import Photo from '../v2/Photo';
import { RadioGroup } from '../v2/Radio';
import Toggle from '../v2/Toggle';
import { DocTitle, NotBooked, StatusLine, TextButton } from './doc/DocParts';
import { CLOSEOUT_PHOTOS, GATES, artifactStatus, describeBooking, fmtDateTime, recommendCount } from '../../data/demo';

const WORK = [
  { value: 'yes', label: "Yes, it's done" },
  { value: 'not-yet', label: 'Not yet' },
  { value: 'wrong', label: "Something's wrong" },
];

export default function CompletionArtifact({ gates = {}, booking, recommended, photosShared, onClearGate }) {
  const b = describeBooking(booking);
  if (!b) return <NotBooked title="No visit to close out yet" />;
  if (gates[GATES.closeOut]) {
    return <ClosedOut b={b} booking={booking} gates={gates} recommended={recommended} photosShared={photosShared} />;
  }
  return <Report b={b} gates={gates} onClearGate={onClearGate} />;
}

function AfterPhotos({ className }) {
  return (
    <Evidence id="photos" className={`grid grid-cols-3 gap-3 ${className}`}>
      {CLOSEOUT_PHOTOS.map((p) => (
        <Photo key={p.photo} photo={p.photo} label={p.label} note={p.tag} pin />
      ))}
    </Evidence>
  );
}

// Stage remounts the artifact on every tab switch, so answers live for the
// session, not the mount. Showcase sharing starts off. Never flip this default.
const draft = { work: 'yes', share: false, recommend: null };

function Report({ b, gates, onClearGate }) {
  const id = useId();
  const [work, setWork] = useState(draft.work);
  const [editing, setEditing] = useState(draft.work !== 'yes');
  const [share, setShareState] = useState(draft.share);
  const [recommend, setRecommendState] = useState(draft.recommend);
  const setShare = (v) => {
    draft.share = v;
    setShareState(v);
  };
  const setRecommend = (v) => {
    draft.recommend = v;
    setRecommendState(v);
  };

  const editRef = useRef(null);
  const workRef = useRef(null);
  const focusAfter = useRef(null);

  // Opening Edit moves focus into the radios; answering yes collapses the row
  // and hands focus back to Edit, so keyboard users never land on <body>.
  useEffect(() => {
    const target = focusAfter.current;
    focusAfter.current = null;
    if (target === 'edit') editRef.current?.focus();
    if (target === 'radios') workRef.current?.querySelector('[role="radio"][tabindex="0"]')?.focus();
  }, [editing]);

  const openEdit = () => {
    focusAfter.current = 'radios';
    setEditing(true);
  };
  const collapse = () => {
    focusAfter.current = 'edit';
    setEditing(false);
  };
  const answerWork = (v) => {
    draft.work = v;
    setWork(v);
    if (v === 'yes') collapse();
  };
  // RadioGroup reports changes only, so re-confirming the checked "Yes" after
  // Edit is caught here (Space and Enter on a radio fire click too).
  const reconfirmWork = (e) => {
    if (work === 'yes' && e.target.closest('[role="radio"][aria-checked="true"]')) collapse();
  };

  const workDone = work === 'yes';
  const canClose = workDone && recommend != null;
  const note = !workDone
    ? 'The job stays open until the work is done.'
    : recommend == null
      ? 'Answer the last question to finish.'
      : 'You can change this later.';

  return (
    <div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col">
      <div className="flex-1">
        <DocTitle>{`${b.who} reported the visit complete`}</DocTitle>
        <StatusLine
          evidence="report"
          status={artifactStatus('completion', { gates })}
          sentence={`Reported ${fmtDateTime(b.completedAt)} with ${CLOSEOUT_PHOTOS.length} after photos`}
        />

        <div className="mt-8 space-y-10">
          {editing ? (
            <section ref={workRef} aria-labelledby={`${id}-work`} onClickCapture={reconfirmWork}>
              <h2 id={`${id}-work`} className="text-heading text-ink-900">Is the work done?</h2>
              <RadioGroup className="mt-3" value={work} onChange={answerWork} options={WORK} labelledBy={`${id}-work`} />
            </section>
          ) : (
            <div className="flex h-11 items-center gap-4 border-y border-line">
              <span className="w-[112px] shrink-0 text-ui text-ink-500">Work</span>
              <span className="min-w-0 flex-1 truncate text-ui text-ink-900">{WORK.find((o) => o.value === work).label}</span>
              <TextButton ref={editRef} size="meta" aria-label="Edit work answer" onClick={openEdit}>
                Edit
              </TextButton>
            </div>
          )}

          <section>
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h2 id={`${id}-share`} className="text-heading text-ink-900">{`Share these photos in ${b.who}'s showcase?`}</h2>
                <p className="mt-1 text-meta text-ink-500">Off by default. No faces or addresses.</p>
              </div>
              <div className="pt-0.5">
                <Toggle on={share} onChange={setShare} labelledBy={`${id}-share`} />
              </div>
            </div>
            <AfterPhotos className="mt-4" />
          </section>

          <section>
            <h2 id={`${id}-rec`} className="text-heading text-ink-900">{`Recommend ${b.who} to other Homewisers?`}</h2>
            <RadioGroup
              className="mt-3"
              value={recommend}
              onChange={setRecommend}
              labelledBy={`${id}-rec`}
              options={[
                { value: 'yes', label: `Yes, recommend ${b.who}` },
                { value: 'no', label: 'No' },
              ]}
            />
          </section>
        </div>
      </div>

      <DecisionBar
        note={note}
        actions={
          <Button disabled={!canClose} onClick={() => canClose && onClearGate?.(GATES.closeOut, { recommended: recommend, photosShared: share })}>
            Close out the job
          </Button>
        }
      />
    </div>
  );
}

function ClosedOut({ b, booking, gates, recommended, photosShared }) {
  const count = recommendCount(b.contractor.id, { recommended, booking });
  return (
    <div className="mx-auto w-full max-w-[720px] pb-16">
      <DocTitle>Job closed out</DocTitle>
      <StatusLine evidence="report" status={artifactStatus('completion', { gates })} sentence="Saved to your home file" />
      <LabelValue
        className="mt-8 [&_dd]:tabular-nums"
        items={[
          { label: 'Closed out', value: fmtDateTime(b.closedOutAt) },
          { label: 'Work', value: 'Done. Leak fixed, no follow-up.' },
          {
            label: 'Recommendation',
            value: recommended === 'yes' ? `Yes. ${b.who} is now recommended by ${count} Homewisers.` : 'No. Nothing is posted.',
          },
          { label: 'Showcase', value: photosShared ? 'Shared, no personal info' : 'Kept private' },
        ]}
      />
      <AfterPhotos className="mt-8" />
    </div>
  );
}
