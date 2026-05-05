import React from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  TrendingUp,
  CalendarCheck2,
  Phone,
  MessageSquareText,
} from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import Pill from './ui/Pill';
import Confidence from './ui/Confidence';

export default function ContractorMatch() {
  const benchmarkLow = 180;
  const benchmarkHigh = 320;
  const quote = 220;
  const pos = ((quote - benchmarkLow) / (benchmarkHigh - benchmarkLow)) * 100;

  return (
    <section className="space-y-6">
      <SectionHeader
        eyebrow="Top AI contractor match"
        title="Jason Plumbing Co. is your strongest match."
        description="Verified, fairly priced, and available when you need them. Here's why Homewise picked them."
      />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[28px] bg-white border border-ink-100/80"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Left: contractor */}
          <div className="lg:col-span-3 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-ink-100/80">
            <div className="flex items-start gap-5">
              <div className="relative h-16 w-16 rounded-3xl bg-gradient-to-br from-sage-200 via-sage-300 to-sage-500 ring-1 ring-sage-300/40 flex items-center justify-center shrink-0">
                <span className="editorial text-[18px] text-sage-700">J</span>
                <span className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full bg-white ring-1 ring-sage-200 flex items-center justify-center">
                  <BadgeCheck size={14} className="text-sage-600" strokeWidth={2.4} />
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Pill tone="sage" icon={Sparkles}>
                    Top match · 92%
                  </Pill>
                  <Pill tone="neutral">Plumbing</Pill>
                </div>
                <h3 className="editorial text-[22px] leading-tight text-ink-900">
                  Jason Plumbing Co.
                </h3>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12.5px] text-ink-500">
                  <span className="inline-flex items-center gap-1">
                    <Star size={12} className="text-ember-300 fill-ember-300" strokeWidth={1.5} />
                    <span className="font-medium text-ink-900">4.8</span>
                    <span>(168 reviews)</span>
                  </span>
                  <span className="text-ink-300">·</span>
                  <span>3.2 mi · Oakland</span>
                  <span className="text-ink-300">·</span>
                  <span>Family-owned, est. 2009</span>
                </div>
              </div>
            </div>

            {/* Stat grid */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: 'License', value: 'Verified', icon: ShieldCheck, tone: 'sage' },
                { label: 'Insurance', value: 'Active', icon: BadgeCheck, tone: 'sage' },
                { label: 'Rating', value: '4.8 / 5', icon: Star, tone: 'ember' },
                { label: 'Quote', value: '$220', icon: TrendingUp, tone: 'sky' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl bg-canvas-soft border border-ink-100 p-3"
                >
                  <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.16em] text-ink-500 mb-2">
                    <s.icon
                      size={11}
                      className={
                        s.tone === 'sage'
                          ? 'text-sage-500'
                          : s.tone === 'ember'
                            ? 'text-ember-400'
                            : 'text-sky2026-500'
                      }
                    />
                    {s.label}
                  </div>
                  <div className="text-[15px] font-semibold text-ink-900 tabular-nums">
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Benchmark bar */}
            <div className="mt-6 rounded-2xl bg-canvas-soft border border-ink-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] uppercase tracking-[0.14em] text-ink-500">
                  Local price benchmark
                </div>
                <Pill tone="sage" icon={TrendingUp}>
                  Fair price
                </Pill>
              </div>
              <div className="relative h-9">
                {/* range bar */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 rounded-full bg-gradient-to-r from-sage-100 via-sage-200 to-ember-100" />
                {/* benchmark labels */}
                <div className="absolute top-0 left-0 text-[10.5px] text-ink-500 tabular-nums">
                  ${benchmarkLow}
                </div>
                <div className="absolute top-0 right-0 text-[10.5px] text-ink-500 tabular-nums">
                  ${benchmarkHigh}
                </div>
                {/* quote marker */}
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `calc(${pos}% - 16px)` }}
                >
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-white ring-2 ring-sage-500 flex items-center justify-center">
                      <span className="text-[10.5px] font-bold text-sage-700 tabular-nums">
                        ${quote}
                      </span>
                    </div>
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-sage-600 font-medium whitespace-nowrap">
                      Your quote
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: AI verdict */}
          <div className="lg:col-span-2 p-6 md:p-7 bg-gradient-to-b from-canvas-soft/60 to-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-700 text-canvas-soft">
                <Sparkles size={13} strokeWidth={2.2} />
              </span>
              <span className="text-[12px] font-semibold tracking-[-0.005em] text-ink-900">
                Why this match?
              </span>
            </div>
            <p className="text-[13.5px] leading-relaxed text-ink-700">
              Homewise recommends this contractor because the
              <span className="text-ink-900 font-medium"> license is verified</span>,
              <span className="text-ink-900 font-medium"> insurance is active</span>,
              the quote sits inside the
              <span className="text-ink-900 font-medium"> local market range</span>,
              and they have
              <span className="text-ink-900 font-medium"> strong recent reviews</span>
              for similar plumbing jobs.
            </p>

            <div className="mt-5">
              <Confidence value={92} label="Match confidence" size="lg" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <button className="h-10 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium transition-all">
                <Phone size={13} strokeWidth={1.9} />
                Call
              </button>
              <button className="h-10 rounded-2xl bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-ink-300 inline-flex items-center justify-center gap-1.5 text-[12px] font-medium transition-all">
                <MessageSquareText size={13} strokeWidth={1.9} />
                Message
              </button>
              <button className="h-10 rounded-2xl bg-sage-500 hover:bg-sage-600 text-white inline-flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-all">
                <CalendarCheck2 size={13} strokeWidth={2} />
                Book
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
