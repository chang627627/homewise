import React from 'react';
import { motion } from 'framer-motion';
import { Dot } from './Status';
import { dur, ease, fade } from './motion';

// Text underline tabs for the Stage header. The nav reaches 1px over the
// header's bottom border (-mb-px) so the 2px underline sits on that line;
// overflow-x clipping would otherwise cut the underline in half.
// tabs: [{ id, label, needsYou?, fresh? }]. One tab renders as a static label.
export default function Tabs({ tabs, active, preview, onSelect, label = 'Views' }) {
  return (
    <nav aria-label={label} className="-mx-1.5 -mb-px flex min-w-0 items-stretch gap-5 overflow-x-auto px-1.5 no-scrollbar">
      {tabs.length === 1 ? (
        <span className="inline-flex items-center text-ui font-medium text-ink-900">{tabs[0].label}</span>
      ) : (
        tabs.map((t) => {
          const isActive = t.id === active;
          const isPreview = t.id === preview && !isActive;
          return (
            <motion.button
              key={t.id}
              type="button"
              onClick={() => onSelect?.(t.id)}
              aria-current={isActive ? 'true' : undefined}
              {...(t.fresh ? fade : {})}
              className={`group relative inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-ui font-medium transition-colors duration-150 focus-visible:outline-none
                ${isActive || isPreview ? 'text-ink-900' : 'text-ink-500 hover:text-ink-900'}`}
            >
              <span className="-mx-1.5 rounded-md px-1.5 py-0.5 group-focus-visible:ring-2 group-focus-visible:ring-ink-900/25">{t.label}</span>
              {t.needsYou && !isActive && (
                <>
                  <Dot />
                  <span className="sr-only">, needs you</span>
                </>
              )}
              {isActive && (
                <motion.span layoutId="stage-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-900" transition={{ duration: dur.base, ease }} />
              )}
              {isPreview && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-ink-900/30" />}
            </motion.button>
          );
        })
      )}
    </nav>
  );
}
