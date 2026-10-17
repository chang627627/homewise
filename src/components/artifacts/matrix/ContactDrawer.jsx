import React from 'react';
import Drawer from '../../v2/Drawer';
import Button from '../../v2/Button';
import SectionHeading from '../../v2/SectionHeading';
import { getContractor } from '../../../data/demo';

const QUESTIONS = [
  'Can you confirm the cost includes materials?',
  'Will the area need to be cleared before you arrive?',
  'How long do you expect the visit to take?',
  'What happens if more work is needed once you start?',
];

const lowerFirst = (s) => `${s.charAt(0).toLowerCase()}${s.slice(1)}`;

function visitFacts({ hours, followUp }) {
  return followUp ? `About ${hours} hr, plus a second visit for the warranty` : `One visit, about ${hours} hr`;
}

// Opened from "Call ... first" on Quotes. Phone stays on the phone: no
// textarea, no send button, and no ink-filled action.
export default function ContactDrawer({ contractorId, open, onClose }) {
  const c = getContractor(contractorId);
  const tel = c ? `tel:${c.phone.replace(/\D/g, '')}` : undefined;
  return (
    <Drawer
      open={open && !!c}
      onClose={onClose}
      title={c?.name}
      meta={c ? `${c.rating.score} · ${c.rating.reviews} reviews · ${lowerFirst(c.responseTime)}` : null}
    >
      {c && (
        <div className="space-y-8 pt-4">
          <p className="text-ui leading-[22px] text-ink-700 text-pretty">{c.bio}</p>

          <div>
            <a
              href={tel}
              className="rounded-md text-figure tabular-nums text-ink-900 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25"
            >
              {c.phone}
            </a>
            <div className="mt-3">
              <Button variant="secondary" size="sm" as="a" href={tel}>
                {`Call ${c.short}`}
              </Button>
            </div>
          </div>

          <section>
            <SectionHeading title="In their words" />
            <p className="text-ui leading-[22px] text-ink-700 text-pretty">{c.quote.note}</p>
            <p className="mt-2 text-meta tabular-nums text-ink-500">{visitFacts(c.quote.visit)}</p>
          </section>

          <section>
            <SectionHeading title="Before you call" />
            <ol className="space-y-2 text-ui leading-[22px] text-ink-700">
              {QUESTIONS.map((q, i) => (
                <li key={q} className="grid grid-cols-[20px_1fr] items-baseline">
                  <span className="text-meta tabular-nums text-ink-500">{`${i + 1}.`}</span>
                  <span className="text-pretty">{q}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </Drawer>
  );
}
