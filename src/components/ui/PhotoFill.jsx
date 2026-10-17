import React from 'react';
import { photos } from '../../data/photos';

// Fills a relative, overflow-hidden photo slot. Renders the real photo when the
// slot has a key in data/photos.js, otherwise the original tinted placeholder.
// alt is empty because every slot already carries a visible label pill.
const tones = {
  sage: 'from-sage-200 to-sage-300',
  sky: 'from-sky2026-100 to-sky2026-300',
  ember: 'from-ember-100 to-ember-200',
};

export default function PhotoFill({ photo, tone = 'sage' }) {
  const src = photo && photos[photo];
  if (src) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <>
      <div className={`absolute inset-0 bg-gradient-to-br ${tones[tone] || tones.sage}`} />
      <div className="absolute inset-0 dot-grid opacity-30" />
    </>
  );
}
