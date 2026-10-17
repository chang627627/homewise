import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Camera,
  ShieldCheck,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import Button from '../ui/Button';
import Pill from '../ui/Pill';
import PhotoFill from '../ui/PhotoFill';

// Flow 3 close-out as a stage artifact. The visit-complete event lands in the
// thread; the decision (confirm + photo consent + recommendation) lives here.
// Privacy default is OFF for photo approval. Never flip the default.
const completionPhotos = [
  { tone: 'sage', label: 'Under sink · after', tag: 'Dry, no leak', photo: 'under-sink-after' },
  { tone: 'sky', label: 'Faucet base · after', tag: 'Drip resolved', photo: 'faucet-base-after' },
  { tone: 'ember', label: 'P-trap · new', tag: 'PVC installed', photo: 'p-trap-new' },
];

export default function CompletionArtifact({ gates, scheduledSlot, recommended, photosShared, onClearGate }) {
  const done = !!gates['close-out'];
  const [confirm, setConfirm] = useState('yes');
  const [share, setShare] = useState(false);
  const [recommend, setRecommend] = useState(null);

  if (done) {
    return (
      <div className="space-y-5">
        <header>
          <h1 className="editorial editorial-m text-[24px] md:text-[30px] leading-[1.1] text-ink-900">
            Job closed out.
          </h1>
          <p className="mt-2 text-[14px] text-ink-500 max-w-xl leading-[1.55]">
            Logged in your home file. Homewise is keeping a quiet eye out for follow-ups.
          </p>
        </header>
        <section className="rounded-3xl bg-white border border-sage-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-sage-100 bg-sage-50/40 flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-500 text-white shrink-0">
              <CheckCircle2 size={14} strokeWidth={1.8} />
            </span>
            <div className="text-[15px] font-medium leading-[1.3] text-ink-900">
              Kitchen sink leak &amp; drip repair · completed {scheduledSlot || 'Fri 2 PM'}
            </div>
          </div>
          <div className="divide-y divide-ink-100">
            <SummaryRow label="Work confirmed" value="Done. Leak resolved, no follow-up needed." />
            <SummaryRow
              label="Recommendation"
              value={recommended === 'yes' ? 'You recommended Jason. He is now Recommended by 13 Homewisers.' : 'You chose not to recommend Jason. Only the count moves, nothing is posted.'}
            />
            <SummaryRow
              label="Showcase photos"
              value={photosShared ? "3 after photos approved for Jason's showcase. No personal info shown." : 'Kept private. You can change this anytime.'}
            />
          </div>
        </section>
      </div>
    );
  }

  const canSubmit = confirm === 'yes' && recommend !== null;

  return (
    <div className="space-y-7">
      <header>
        <h1 className="editorial editorial-m text-[24px] md:text-[30px] leading-[1.1] text-ink-900">
          Jason marked the visit complete.
        </h1>
        <p className="mt-2 text-[14px] text-ink-500 max-w-xl leading-[1.55]">
          Take a minute to close it out. Your recommendation is the trust signal other Homewisers see.
        </p>
      </header>

      {/* 1. Confirm work */}
      <Section num="01" title="Confirm the work is done">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <ConfirmOption id="yes" current={confirm} onSelect={setConfirm} icon={Check} label="Yes, it's done" sub="Looks resolved, no follow-up needed" />
          <ConfirmOption id="not-yet" current={confirm} onSelect={setConfirm} icon={Sparkles} label="Not yet" sub="Remind me later" />
          <ConfirmOption id="wrong" current={confirm} onSelect={setConfirm} icon={AlertTriangle} label="Something's wrong" sub="Escalate to Homewise" />
        </div>
      </Section>

      {/* 2. Photo approval */}
      <Section
        num="02"
        title="Approve photos for Jason's showcase"
        sub="Optional. Off by default. Photos go up exactly as shown: no faces, no addresses."
      >
        <div className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100/80 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Camera size={14} className="text-ink-500" strokeWidth={1.8} />
              <span className="text-[12px] font-medium text-ink-500">
                Jason uploaded · 3 photos
              </span>
            </div>
            <Pill tone="sage" icon={Check}>
              Same angles as your intake shots
            </Pill>
          </div>
          {/* Photos carry their own edge: no ring, the card already owns the
              stroke. Overlay labels are opaque pills, no blur, no dark fill. */}
          <div className="p-5 grid grid-cols-3 gap-3">
            {completionPhotos.map((p, i) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <PhotoFill photo={p.photo} tone={p.tone} />
                <div className="absolute top-2 left-2 right-2">
                  <Pill tone="neutral" icon={ImageIcon} className="max-w-full whitespace-nowrap overflow-hidden">
                    {p.label}
                  </Pill>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <Pill tone="sage" icon={Sparkles} className="max-w-full whitespace-nowrap overflow-hidden">
                    AI: {p.tag}
                  </Pill>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 border-t border-ink-100/80 bg-canvas-soft/30 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2">
              <ShieldCheck size={14} className="text-sage-500 mt-0.5 shrink-0" strokeWidth={1.8} />
              <div>
                <div className="text-[13.5px] font-medium text-ink-900">
                  Allow these photos in Jason's Homewise showcase
                </div>
                <div className="text-[12px] text-ink-500 mt-0.5">
                  Other Homewisers can see them when comparing contractors. No personal info shown.
                </div>
              </div>
            </div>
            <Toggle on={share} onChange={setShare} />
          </div>
        </div>
      </Section>

      {/* 3. Recommend */}
      <Section
        num="03"
        title="Would you recommend Jason to other Homewisers?"
        sub="Binary. The count is the signal, not stars or comments."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <RecommendOption id="yes" current={recommend} onSelect={setRecommend} icon={ThumbsUp} label="Yes, recommend" />
          <RecommendOption id="no" current={recommend} onSelect={setRecommend} icon={ThumbsDown} label="No, don't recommend" />
        </div>
      </Section>

      {/* Submit */}
      <div className="pt-1 flex items-center gap-3 flex-wrap">
        <Button
          variant="hero"
          iconRight={ArrowRight}
          disabled={!canSubmit}
          onClick={() => canSubmit && onClearGate('close-out', { recommended: recommend || 'no', photosShared: share })}
        >
          Close out the job
        </Button>
        <span className="text-[12px] text-ink-500">
          {recommend === null ? 'Pick a recommendation to submit.' : 'You can change your mind anytime.'}
        </span>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="px-5 py-3.5 flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-lg bg-sage-50 text-sage-600 ring-1 ring-sage-100 shrink-0">
        <Check size={12} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-[12px] font-medium text-ink-500">{label}</div>
        <div className="text-[12.5px] text-ink-700 leading-[1.5] mt-0.5">{value}</div>
      </div>
    </div>
  );
}

// Rule deployment: '01 ── Title'. Number as a figure, 16px hairline, then
// the title in the editorial-small role.
function Section({ num, title, sub, children }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-3 flex-wrap">
        <span className="figure text-[11px] text-ink-500">{num}</span>
        <span className="h-px w-4 bg-ink-200" />
        <h3 className="editorial editorial-xs text-[17px] leading-[1.25] text-ink-900">{title}</h3>
      </div>
      {sub && <p className="ml-7 mb-3 text-[12.5px] text-ink-500 max-w-2xl leading-[1.5]">{sub}</p>}
      <div className="ml-7">{children}</div>
    </section>
  );
}

// The user's own choice: neutral selected state with a leading check (the
// check replaces the option glyph while selected). Never ink-900 and never
// sage here; sage means the AI's pick.
const optionSelected = 'bg-canvas-deep ring-1 ring-ink-300 text-ink-900';
const optionUnselected = 'bg-white ring-1 ring-ink-200 text-ink-700 hover:ring-ink-300';

function ConfirmOption({ id, current, onSelect, icon: Icon, label, sub }) {
  const selected = current === id;
  return (
    <button
      onClick={() => onSelect(id)}
      className={`text-left rounded-2xl p-4 transition-all ${selected ? optionSelected : optionUnselected}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        {selected ? <Check size={12} strokeWidth={2} /> : <Icon size={12} strokeWidth={2} />}
        <span className="text-[13.5px] font-medium">{label}</span>
      </div>
      <div className="text-[12px] text-ink-500">{sub}</div>
    </button>
  );
}

function RecommendOption({ id, current, onSelect, icon: Icon, label }) {
  const selected = current === id;
  return (
    <button
      onClick={() => onSelect(id)}
      className={`rounded-2xl p-4 transition-all inline-flex items-center justify-center gap-2 text-[13.5px] font-medium ${
        selected ? optionSelected : optionUnselected
      }`}
    >
      {selected ? <Check size={12} strokeWidth={2} /> : <Icon size={12} strokeWidth={2} />}
      {label}
    </button>
  );
}

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${on ? 'bg-sage-500' : 'bg-ink-200'}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`} />
    </button>
  );
}
