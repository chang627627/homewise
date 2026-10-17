import React from 'react';
import { HOME } from '../../data/demo';

// Mara's avatar, the only person avatar in V2. Decorative: her name follows it.
export default function Avatar() {
  return (
    <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-shade-2 text-meta font-medium text-ink-700">
      {HOME.owner.first.charAt(0)}
    </span>
  );
}
