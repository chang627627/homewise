import React from 'react';
import Drawer from '../../v2/Drawer';
import Photo from '../../v2/Photo';
import { getContractor, recommendCount } from '../../../data/demo';

// Opened from "See work" on Contractors. The count includes the user's own
// recommendation, so the meta matches the matrix cell it was opened from.
export default function ShowcaseDrawer({ contractorId, open, onClose, recommended = null, booking = null }) {
  const c = getContractor(contractorId);
  const n = c ? recommendCount(c.id, { recommended, booking }) : 0;
  return (
    <Drawer
      open={open && !!c}
      onClose={onClose}
      title={c?.name}
      meta={c ? `Recommended by ${n} ${n === 1 ? 'Homewiser' : 'Homewisers'}` : null}
    >
      {c && (
        <div className="pt-4">
          <ul className="space-y-6">
            {c.showcase.map((job) => (
              <li key={job.photo}>
                <Photo photo={job.photo} aspect="aspect-[16/9]" alt={job.photoLabel} />
                <div className="mt-2 flex items-baseline justify-between gap-4">
                  <span className="min-w-0 text-ui font-medium text-ink-900">{job.category}</span>
                  <span className="shrink-0 text-meta tabular-nums text-ink-500">{job.date}</span>
                </div>
                <p className="text-ui text-ink-700 text-pretty">{job.scope}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-meta text-ink-500 text-pretty">
            Only jobs completed through Homewise, shared by the homeowner. No names or addresses.
          </p>
        </div>
      )}
    </Drawer>
  );
}
