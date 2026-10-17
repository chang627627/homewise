import React from 'react';
import { StatusText } from '../../v2/Status';

// H1, then the status line: StatusText and an optional ink sentence. Ember
// facts named in the sentence stay ink; their one mark is the evidence cell.
export default function ArtifactHeader({ title, state, label, sentence }) {
  return (
    <header>
      <h1 className="text-title text-balance text-ink-900">{title}</h1>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <StatusText state={state}>{label}</StatusText>
        {sentence && <span className="text-ui tabular-nums text-ink-500 text-pretty">{sentence}</span>}
      </div>
    </header>
  );
}
