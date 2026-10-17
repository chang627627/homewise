import React, { useState } from 'react';
import Matrix, { Absent, Exception, Included, MatrixCorner, MatrixHeader, MatrixRow, RowLabel, ValueCell } from '../v2/Matrix';
import { StatusText } from '../v2/Status';
import SectionHeading from '../v2/SectionHeading';
import LabelValue from '../v2/LabelValue';
import DecisionBar from '../v2/DecisionBar';
import Button from '../v2/Button';
import Evidence from '../v2/Evidence';
import ArtifactHeader from './matrix/ArtifactHeader';
import ShowcaseDrawer from './matrix/ShowcaseDrawer';
import {
  AI_PICK_ID,
  AT,
  CONTRACTORS,
  GATES,
  HOME,
  INTAKE,
  LEADERS,
  NEW_TO_HOMEWISE_BELOW,
  SCOPE,
  artifactStatus,
  contractorRationale,
  earliestSlot,
  fmtShort,
  getContractor,
  recommendCount,
} from '../../data/demo';

const capitalize = (s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`;

// The rationale is written to follow its label as one sentence ("Jason has
// ..."); in a label/value grid the value reads as a phrase on its own.
const asPhrase = (text) => capitalize(text.replace(/^(are|has|is) /, '').replace(/, but has /, ', with '));

// Why the pick, in the same viewport as the sage panel, so the column never
// reads as paid placement. Every claim is a LEADERS fact.
function pickSentence() {
  const pick = getContractor(AI_PICK_ID);
  const leads = [
    LEADERS.mostSimilarJobs === pick.id && 'most similar jobs',
    LEADERS.highestRated === pick.id && 'highest rating',
  ].filter(Boolean);
  const parts = leads.length ? [`${capitalize(leads.join(', '))}.`] : [];
  LEADERS.insuranceFlagged.forEach((id) => parts.push(`${getContractor(id).short}'s insurance renewal is pending.`));
  return parts.join(' ');
}

function listPhrase(labels) {
  return labels.map((l, i) => (i ? `${l.charAt(0).toLowerCase()}${l.slice(1)}` : l)).join(', ');
}

export default function ContractorsArtifact({ gates = {}, booking = null, recommended = null, unlocked, onClearGate = () => {} }) {
  const [showcase, setShowcase] = useState({ id: null, open: false });
  const approved = !!gates[GATES.approveOutreach];
  const status = artifactStatus('contractors', { unlocked, gates, booking });
  const pick = getContractor(AI_PICK_ID);
  const n = CONTRACTORS.length;

  const receives = [
    {
      label: 'Scope of work',
      value: <span className="tabular-nums">{`${SCOPE.ref}. The same brief for all three.`}</span>,
    },
    { label: 'Photos', value: `${listPhrase(INTAKE.photos.map((p) => p.label))}. No faces or address markers.` },
    { label: 'Location', value: `${HOME.street} and ${HOME.zip} only. Your full address goes only to the pro you book.` },
    { label: 'Signed as', value: `Prepared by ${HOME.owner.first}'s Homewise agent` },
  ];

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-1 flex-col">
      <div className="flex-1">
        <ArtifactHeader
          title={`${pick.name} is the pick`}
          state={status.state}
          label={status.label}
          sentence={approved ? AT.outreachSent : pickSentence()}
        />

        <Matrix pickIndex={CONTRACTORS.findIndex((c) => c.aiPick)} label="Contractors compared" className="mt-8">
          <MatrixRow>
            <MatrixCorner />
            {CONTRACTORS.map((c) => (
              <MatrixHeader key={c.id} id={c.id} name={c.name} pick={c.aiPick} meta={`${c.rating.score} · ${c.rating.reviews} reviews`} />
            ))}
          </MatrixRow>

          <MatrixRow>
            <RowLabel label="Years licensed" definition="Verified with the state board" />
            {CONTRACTORS.map((c) => <ValueCell key={c.id}>{c.yearsLicensed}</ValueCell>)}
          </MatrixRow>

          <MatrixRow evidence="row:license">
            <RowLabel label="License" definition="Active, verified with the state board" />
            {CONTRACTORS.map((c) => (
              <ValueCell key={c.id}>
                {c.license.ok ? <Included>{c.license.label.replace(/^CA Lic /, '')}</Included> : <Exception>{c.license.label}</Exception>}
              </ValueCell>
            ))}
          </MatrixRow>

          <MatrixRow>
            <RowLabel label="Insurance" definition="General liability and workers' comp" />
            {CONTRACTORS.map((c) => (
              <ValueCell key={c.id}>
                {c.insurance.ok
                  ? <Included>{c.insurance.label.replace(/ current$/, '')}</Included>
                  : <Exception evidence={`insurance:${c.id}`}>{c.insurance.label}</Exception>}
              </ValueCell>
            ))}
          </MatrixRow>

          <MatrixRow>
            <RowLabel label="Similar jobs, 12 mo" definition="Same job type in the last 12 months, from permit records" />
            {CONTRACTORS.map((c) => <ValueCell key={c.id}>{c.similarJobs}</ValueCell>)}
          </MatrixRow>

          <MatrixRow>
            <RowLabel label="Permits, 12 mo" definition="All permits pulled in the last 12 months" />
            {CONTRACTORS.map((c) => <ValueCell key={c.id}>{c.permits}</ValueCell>)}
          </MatrixRow>

          <MatrixRow>
            <RowLabel label="Earliest visit" definition="First slot they offered for this scope" />
            {CONTRACTORS.map((c) => {
              const s = earliestSlot(c.id);
              return (
                <ValueCell key={c.id}>
                  {s ? <span className="min-w-0 truncate">{fmtShort(s.iso, { relative: true })}</span> : <Absent label="None offered" />}
                </ValueCell>
              );
            })}
          </MatrixRow>

          <MatrixRow>
            <RowLabel label="Homewiser recs" definition="Homeowners who recommended them after a Homewise job" />
            {CONTRACTORS.map((c) => {
              const count = recommendCount(c.id, { recommended, booking });
              const mine = count > c.recommendBase;
              const cold = count < NEW_TO_HOMEWISE_BELOW;
              return (
                <ValueCell key={c.id} evidence={`recs:${c.id}`}>
                  <span className="flex min-w-0 items-baseline gap-2">
                    {cold ? <span className="truncate text-ink-500">New to Homewise</span> : <span>{count}</span>}
                    {mine && <span className="shrink-0 text-meta font-medium text-sage-600">+1 you</span>}
                    {!cold && c.showcase.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowcase({ id: c.id, open: true })}
                        className="shrink-0 rounded-md text-meta font-medium text-ink-700 underline-offset-4 transition-colors duration-150 hover:text-ink-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
                      >
                        See work
                      </button>
                    )}
                  </span>
                </ValueCell>
              );
            })}
          </MatrixRow>
        </Matrix>

        <section className="mt-10">
          <SectionHeading title="Why these three" />
          <LabelValue
            strong
            items={contractorRationale().map((r) => ({ key: r.id ?? 'all', label: r.label, value: asPhrase(r.text) }))}
          />
        </section>

        <Evidence id="sent" as="section" className="mt-10">
          <SectionHeading title="What they receive" meta={approved ? `Sent ${AT.outreachSent}` : 'Nothing sent yet'} />
          <LabelValue items={receives} />
        </Evidence>
      </div>

      <DecisionBar
        note={approved
          ? <StatusText state="done">{`Sent to all ${n} at ${AT.outreachSent}`}</StatusText>
          : <span className="tabular-nums">{`Sends your scope to all ${n}. Quotes land in the conversation.`}</span>}
        actions={approved ? null : (
          <>
            <Button variant="ghost">{`Reject all ${n}`}</Button>
            <Button onClick={() => onClearGate(GATES.approveOutreach)}>{`Send scope to all ${n}`}</Button>
          </>
        )}
      />

      <ShowcaseDrawer
        contractorId={showcase.id}
        open={showcase.open}
        onClose={() => setShowcase((s) => ({ ...s, open: false }))}
        recommended={recommended}
        booking={booking}
      />
    </div>
  );
}
