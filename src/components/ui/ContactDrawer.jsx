import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Phone, Star, ArrowRight } from 'lucide-react';

const accentBg = {
  sage: 'from-sage-200 to-sage-400 ring-sage-300/40 text-sage-700',
  sky: 'from-sky2026-100 to-sky2026-300 ring-sky2026-300/40 text-sky2026-700',
  ember: 'from-ember-100 to-ember-300 ring-ember-300/40 text-ember-500',
};

const suggestedQuestions = [
  'Can you confirm cost includes materials?',
  'Will the area need to be cleared before you arrive?',
  'How long do you expect the visit to take?',
  'What happens if more work is needed once you start?',
];

export default function ContactDrawer({ contractor, onClose }) {
  useEffect(() => {
    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-ink-900/30 backdrop-blur-[2px]"
      />
      <motion.aside
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 right-0 z-50 h-screen w-full max-w-[480px] bg-white border-l border-ink-100 overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-5 border-b border-ink-100 bg-white/95 backdrop-blur flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`relative h-9 w-9 rounded-2xl bg-gradient-to-br ${accentBg[contractor.accent]} ring-1 flex items-center justify-center shrink-0`}
            >
              <span className="editorial text-[13px]">{contractor.initials}</span>
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-ink-900 truncate">
                {contractor.name}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] text-ink-500">
                <Star size={10} className="text-ember-300 fill-ember-300" strokeWidth={0} />
                <span className="text-ink-700">{contractor.rating.score}</span>
                <span>({contractor.rating.reviews})</span>
                <span className="mx-1 text-ink-300">·</span>
                <span>{contractor.responseTime}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl ring-1 ring-ink-100 hover:ring-ink-200 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-all shrink-0"
          >
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-5">
          {/* About */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-3 bg-ink-200" />
              <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                About
              </span>
            </div>
            <p className="text-[13px] text-ink-700 leading-relaxed">{contractor.bio}</p>
          </section>

          {/* Direct contact */}
          {contractor.phone && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-3 bg-ink-200" />
                <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                  Direct contact
                </span>
              </div>
              <a
                href={`tel:${contractor.phone.replace(/\D/g, '')}`}
                className="group flex items-center justify-between gap-3 rounded-2xl bg-ink-900 hover:bg-ink-700 text-canvas-soft hairline-on-dark grain-dark px-4 py-3 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-canvas-soft/15 text-canvas-soft shrink-0">
                    <Phone size={14} strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <div className="text-[13.5px] font-semibold tabular-nums">
                      {contractor.phone}
                    </div>
                    <div className="text-[11px] text-canvas-soft/70">
                      Call {contractor.name.split(' ')[0]} directly
                    </div>
                  </div>
                </div>
                <ArrowRight size={13} className="opacity-70 group-hover:translate-x-0.5 transition-all shrink-0" strokeWidth={2} />
              </a>
            </section>
          )}

          {/* Suggested questions */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-px w-3 bg-ink-200" />
              <span className="text-[10.5px] uppercase tracking-[0.16em] text-ink-500 font-semibold">
                Things to ask when you call
              </span>
            </div>
            <ul className="space-y-1.5">
              {suggestedQuestions.map((q, i) => (
                <li key={q} className="flex items-start gap-2 text-[12.5px] text-ink-700 leading-snug">
                  <span className="shrink-0 mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-md bg-canvas-soft text-ink-500 text-[10px] font-bold tabular-nums">
                    {i + 1}
                  </span>
                  {q}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.aside>
    </>,
    document.body
  );
}
