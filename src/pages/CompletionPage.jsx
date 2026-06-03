import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Check,
  CheckCircle2,
  X,
  AlertTriangle,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Camera,
  ShieldCheck,
  ArrowRight,
  Image as ImageIcon,
} from 'lucide-react';
import BackBar from '../components/ui/BackBar';
import Pill from '../components/ui/Pill';

// Mocked photos that "Jason" uploaded — three "after" shots
const completionPhotos = [
  { tone: 'sage', label: 'Under sink · after', tag: 'Dry, no leak' },
  { tone: 'sky', label: 'Faucet base · after', tag: 'Drip resolved' },
  { tone: 'ember', label: 'P-trap · new', tag: 'PVC installed' },
];

const photoTone = {
  sage: 'from-sage-200 to-sage-300',
  sky: 'from-sky2026-100 to-sky2026-300',
  ember: 'from-ember-100 to-ember-200',
};

export default function CompletionPage({ onNavigate, scheduledSlot, noPhotos = false }) {
  const [confirm, setConfirm] = useState('yes'); // 'yes' | 'not-yet' | 'wrong'
  const [photosShared, setPhotosShared] = useState(false);
  const [recommend, setRecommend] = useState(null); // null | 'yes' | 'no'
  const [reminderSent, setReminderSent] = useState(false);

  const submit = () => {
    onNavigate?.({
      page: 'overview',
      jobCompleted: true,
      recommended: recommend || 'no',
      photosShared,
    });
  };

  const canSubmit = confirm === 'yes' && recommend !== null;

  return (
    <div className="space-y-8">
      <BackBar
        onBack={() => onNavigate?.('overview')}
        label="Back to overview"
        context={`Job · Kitchen sink leak · ${scheduledSlot || 'Friday 2 PM'}`}
      />

      {/* Header */}
      <header>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
            <Sparkles size={13} strokeWidth={2.2} />
          </span>
          <span className="text-[11px] uppercase tracking-[0.22em] text-sage-600 font-semibold">
            Final step · close out the job
          </span>
        </div>
        <h1 className="editorial text-[24px] md:text-[30px] leading-[1.04] text-ink-900 tracking-tight">
          Jason marked the visit complete.
        </h1>
        <p className="mt-3 text-[14px] text-ink-500 max-w-xl leading-relaxed">
          Take a minute to close it out. Your recommendation is the trust signal other Homewisers see.
        </p>
      </header>

      {/* 1. Confirm work */}
      <Section num="01" title="Confirm the work is done">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <ConfirmOption
            id="yes"
            current={confirm}
            onSelect={setConfirm}
            tone="sage"
            icon={Check}
            label="Yes, it's done"
            sub="Looks resolved, no follow-up needed"
          />
          <ConfirmOption
            id="not-yet"
            current={confirm}
            onSelect={setConfirm}
            tone="ink"
            icon={Sparkles}
            label="Not yet"
            sub="Remind me later"
          />
          <ConfirmOption
            id="wrong"
            current={confirm}
            onSelect={setConfirm}
            tone="ember"
            icon={AlertTriangle}
            label="Something's wrong"
            sub="Escalate to Homewise"
          />
        </div>
      </Section>

      {/* 2. Photo approval */}
      <Section
        num="02"
        title="Approve photos for Jason's showcase"
        sub="Optional. Off by default. Photos go up exactly as shown: no faces, no addresses."
      >
        <div className="rounded-3xl bg-white border border-ink-100/80 overflow-hidden">
          <div className="px-5 py-4 border-b border-ink-100/80 bg-gradient-to-b from-canvas-soft/30 to-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Camera size={13} className="text-ink-500" strokeWidth={1.8} />
              <span className="text-[11px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                {noPhotos ? 'Jason uploaded · 0 photos' : 'Jason uploaded · 3 photos'}
              </span>
            </div>
            {!noPhotos && (
              <Pill tone="sage" icon={Check}>
                Same angles as your intake shots
              </Pill>
            )}
          </div>

          {noPhotos ? (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={13} strokeWidth={2} className="shrink-0 text-ember-500" />
                <span className="text-[12px] text-ink-700">No photos uploaded yet.</span>
              </div>
              <p className="text-[13px] text-ink-500 leading-relaxed">
                Check back after the visit.
              </p>
              {reminderSent ? (
                <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-sage-600">
                  <CheckCircle2 size={13} strokeWidth={2} />
                  Reminder sent.
                </span>
              ) : (
                <button
                  onClick={() => setReminderSent(true)}
                  className="h-9 px-4 rounded-xl bg-ink-900 hover:bg-ink-700 text-canvas-soft text-[12.5px] font-semibold transition-colors"
                >
                  Remind contractor
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="p-5 grid grid-cols-3 gap-3">
                {completionPhotos.map((p, i) => (
                  <div
                    key={i}
                    className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-ink-100"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${photoTone[p.tone]}`}
                    />
                    <div className="absolute inset-0 dot-grid opacity-30" />
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-1.5 py-0.5 text-[9.5px] font-semibold text-ink-700 ring-1 ring-ink-100">
                        <ImageIcon size={9} strokeWidth={2.2} />
                        {p.label}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="inline-flex items-center gap-1 rounded-md bg-ink-900/80 backdrop-blur px-1.5 py-0.5 text-[9.5px] font-semibold text-canvas-soft">
                        <Sparkles size={9} className="text-sage-200" strokeWidth={2.2} />
                        AI: {p.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-4 border-t border-ink-100/80 bg-canvas-soft/30 flex items-center justify-between gap-3">
                <div className="flex items-start gap-2">
                  <ShieldCheck size={13} className="text-sage-500 mt-0.5 shrink-0" strokeWidth={2} />
                  <div>
                    <div className="text-[12.5px] font-semibold text-ink-900">
                      Allow these photos in Jason's Homewise showcase
                    </div>
                    <div className="text-[11px] text-ink-500 mt-0.5">
                      Other Homewisers can see them when comparing contractors. No personal info shown.
                    </div>
                  </div>
                </div>
                <Toggle on={photosShared} onChange={setPhotosShared} />
              </div>
            </>
          )}
        </div>
      </Section>

      {/* 3. Recommend */}
      <Section
        num="03"
        title="Would you recommend Jason to other Homewisers?"
        sub="Binary. The count is the signal, not stars or comments."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <RecommendOption
            id="yes"
            current={recommend}
            onSelect={setRecommend}
            icon={ThumbsUp}
            label="Yes, recommend"
            tone="sage"
          />
          <RecommendOption
            id="no"
            current={recommend}
            onSelect={setRecommend}
            icon={ThumbsDown}
            label="No, don't recommend"
            tone="ember"
          />
        </div>
      </Section>

      {/* Submit */}
      <div className="pt-2 flex items-center gap-3 flex-wrap">
        <button
          onClick={submit}
          disabled={!canSubmit}
          className={`group h-12 pl-5 pr-3 rounded-2xl inline-flex items-center gap-2.5 text-[13.5px] font-semibold transition-all ${
            canSubmit
              ? 'bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark'
              : 'bg-ink-100 text-ink-400 cursor-not-allowed'
          }`}
        >
          Close out the job
          <span
            className={`flex h-8 w-8 items-center justify-center rounded-xl transition-colors ${
              canSubmit ? 'bg-canvas-soft/15 group-hover:bg-canvas-soft/25' : 'bg-white/30'
            }`}
          >
            <ArrowRight size={14} strokeWidth={2.2} />
          </span>
        </button>
        <span className="text-[12px] text-ink-500">
          {recommend === null ? 'Pick a recommendation to submit.' : 'You can change your mind anytime.'}
        </span>
      </div>
    </div>
  );
}

function Section({ num, title, sub, children }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-3 flex-wrap">
        <span className="text-[11px] tabular-nums text-ink-400 font-bold">{num}</span>
        <span className="h-px w-4 bg-ink-200" />
        <h3 className="editorial text-[17px] leading-tight text-ink-900">{title}</h3>
      </div>
      {sub && (
        <p className="ml-7 mb-3 text-[12.5px] text-ink-500 max-w-2xl leading-relaxed">{sub}</p>
      )}
      <div className="ml-7">{children}</div>
    </section>
  );
}

function ConfirmOption({ id, current, onSelect, tone, icon: Icon, label, sub }) {
  const selected = current === id;
  const toneMap = {
    sage: selected ? 'bg-sage-500 text-white ring-sage-500' : 'bg-white ring-ink-200 hover:ring-ink-300 text-ink-900',
    ember: selected ? 'bg-ember-500 text-white ring-ember-500' : 'bg-white ring-ink-200 hover:ring-ink-300 text-ink-900',
    ink: selected ? 'bg-ink-900 text-canvas-soft ring-ink-900' : 'bg-white ring-ink-200 hover:ring-ink-300 text-ink-900',
  };
  return (
    <button
      onClick={() => onSelect(id)}
      className={`text-left rounded-2xl p-4 ring-1 transition-all ${toneMap[tone]}`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={13} strokeWidth={2.2} />
        <span className="text-[13px] font-semibold tracking-[-0.005em]">{label}</span>
      </div>
      <div className={`text-[11.5px] ${selected ? 'opacity-80' : 'text-ink-500'}`}>{sub}</div>
    </button>
  );
}

function RecommendOption({ id, current, onSelect, icon: Icon, label, tone }) {
  const selected = current === id;
  const toneMap = {
    sage: selected ? 'bg-sage-500 text-white ring-sage-500' : 'bg-white ring-ink-200 hover:ring-ink-300 text-ink-900',
    ember: selected ? 'bg-ink-900 text-canvas-soft ring-ink-900' : 'bg-white ring-ink-200 hover:ring-ink-300 text-ink-900',
  };
  return (
    <button
      onClick={() => onSelect(id)}
      className={`rounded-2xl p-4 ring-1 transition-all inline-flex items-center justify-center gap-2 text-[13.5px] font-semibold ${toneMap[tone]}`}
    >
      <Icon size={14} strokeWidth={2.2} />
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
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        on ? 'bg-sage-500' : 'bg-ink-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          on ? 'translate-x-[22px]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
