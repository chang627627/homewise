import React from 'react';
import { motion } from 'framer-motion';
import { photos, photoPins } from '../../data/photos';
import { dur, ease } from './motion';

// Pin coordinates are measured on the 4:3 source frames, so a pinned photo
// keeps the default 4:3 aspect.
export default function Photo({ photo, label, note, aspect = 'aspect-[4/3]', pin = false, pinVisible = true, align = 'left', alt = '', className = '' }) {
  const p = pin && photoPins[photo];
  return (
    <figure className={`min-w-0 ${className}`}>
      <div className={`relative overflow-hidden rounded-lg bg-canvas-v2 ${aspect}`}>
        {photos[photo] && <img src={photos[photo]} alt={alt} draggable={false} className="absolute inset-0 h-full w-full object-cover" />}
        {p && (
          <motion.span
            aria-hidden="true"
            initial={false}
            animate={{ opacity: pinVisible ? 1 : 0 }}
            transition={{ duration: dur.base, ease }}
            className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-[1.5px] ring-white outline outline-1 outline-offset-[1.5px] outline-ink-900/30"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          />
        )}
      </div>
      {(label || note) && (
        <figcaption className={`mt-1.5 text-meta ${align === 'right' ? 'text-right' : ''}`}>
          {label && <span className="block font-medium text-ink-900">{label}</span>}
          {note && <span className="block text-ink-500">{note}</span>}
        </figcaption>
      )}
    </figure>
  );
}
