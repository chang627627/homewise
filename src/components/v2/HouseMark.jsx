import React from 'react';
import { House } from 'lucide-react';

// The home row's lead glyph. Lucide's House so it shares stroke, corners and
// optical size with every other icon; the color comes from the Row lead
// (ink-500 at rest, ink-900 when selected or hovered).
export default function HouseMark({ className = '' }) {
  return <House size={16} strokeWidth={1.5} aria-hidden="true" className={`shrink-0 ${className}`} />;
}
