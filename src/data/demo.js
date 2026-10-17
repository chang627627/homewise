// Homewise V2 demo facts: the one source for every name, date, price and
// status the scripted kitchen-sink demo shows. Components derive their copy
// from these values and helpers instead of hardcoding figures.
// Plain ES module (no React, no asset imports): `photo` fields are keys into
// src/data/photos.js, so this file also loads under node for checks.

// ── Calendar and formatting ──────────────────────────────────────────────────
// Times are Oakland wall-clock ISO strings. Helpers read the digits directly
// instead of `new Date(iso)` in local time, so output is identical in every
// runtime timezone. All demo dates fall inside PDT (Mar 8 to Nov 1, 2026).
const OFFSET = '-07:00';
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const TODAY = '2026-04-22'; // Wednesday (`cal 4 2026`)

const pad = (n) => String(n).padStart(2, '0');

function parts(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(iso || '');
  if (!m) throw new Error(`demo.js: not an ISO date: ${iso}`);
  return { y: +m[1], mo: +m[2], d: +m[3], h: +(m[4] || 0), mi: +(m[5] || 0) };
}

// Wall-clock milliseconds: the wall time read as if it were UTC. Only ever
// compared or offset, never shown.
const wallMs = (iso) => {
  const p = parts(iso);
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi);
};
const fromWallMs = (ms) => {
  const t = new Date(ms);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}T${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:00${OFFSET}`;
};
const weekdayOf = (iso) => new Date(wallMs(iso)).getUTCDay();
const at = (hhmm, day = TODAY) => `${day}T${hhmm}:00${OFFSET}`;
const toHas = (c) => (c instanceof Set ? (x) => c.has(x) : Array.isArray(c) ? (x) => c.includes(x) : () => false);

export const addMinutes = (iso, n) => fromWallMs(wallMs(iso) + n * 60000);
export const compareIso = (a, b) => wallMs(a) - wallMs(b);
export const dayKey = (iso) => iso.slice(0, 10);
export const isToday = (iso) => dayKey(iso) === TODAY;

// '2 PM', '2:48 PM'; { minutes: true } forces '2:00 PM'.
export function fmtTime(iso, { minutes = false } = {}) {
  const { h, mi } = parts(iso);
  const mer = h < 12 ? 'AM' : 'PM';
  return mi || minutes ? `${h % 12 || 12}:${pad(mi)} ${mer}` : `${h % 12 || 12} ${mer}`;
}

// 'Today' is only ever a prefix, never a stand-in for the date.
const withToday = (iso, relative, s) => (relative && isToday(iso) ? `Today · ${s}` : s);

export const fmtDay = (iso) => DAY_SHORT[weekdayOf(iso)]; // 'Fri'
export const fmtShort = (iso, { relative = false } = {}) =>
  withToday(iso, relative, `${fmtDay(iso)}, ${MONTH_SHORT[parts(iso).mo - 1]} ${parts(iso).d}`); // 'Fri, Apr 24'
export const fmtLong = (iso, { relative = false } = {}) =>
  withToday(iso, relative, `${DAY_LONG[weekdayOf(iso)]}, ${MONTH_LONG[parts(iso).mo - 1]} ${parts(iso).d}`); // 'Friday, April 24'
export const fmtSlot = (iso, { relative = false } = {}) => withToday(iso, relative, `${fmtDay(iso)} ${fmtTime(iso)}`); // 'Fri 2 PM'
export const fmtDateTime = (iso) => `${fmtShort(iso)}, ${fmtTime(iso)}`; // 'Fri, Apr 24, 4 PM'
export const fmtDateYear = (iso) => `${MONTH_SHORT[parts(iso).mo - 1]} ${parts(iso).d}, ${parts(iso).y}`; // 'Apr 22, 2026'
export const fmtMonthYear = (iso) => `${MONTH_SHORT[parts(iso).mo - 1]} ${parts(iso).y}`; // 'May 2025'
// Same 6 PM evening boundary as windowFor, so prose and slot chips agree.
export const fmtDayPart = (iso) => {
  const { h } = parts(iso);
  return `${DAY_LONG[weekdayOf(iso)]} ${h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'}`; // 'Friday afternoon'
};
// '2 to 4 PM', '11 AM to 1 PM'
export function fmtTimeRange(startIso, endIso) {
  const start = fmtTime(startIso);
  const end = fmtTime(endIso);
  return `${start.slice(-2) === end.slice(-2) ? start.slice(0, -3) : start} to ${end}`;
}
export const fmtUsd = (n) => `$${Math.round(n)}`;
// Glues a short label into one unbreakable run (slot chips, Approve buttons).
export const keepTogether = (s) => s.replace(/ /g, ' ');

export function weekDays(anchor = TODAY) {
  const monday = addMinutes(`${dayKey(anchor)}T00:00:00${OFFSET}`, -((weekdayOf(anchor) + 6) % 7) * 1440);
  return Array.from({ length: 7 }, (_, i) => {
    const iso = addMinutes(monday, i * 1440);
    // `dom` is the day of month (24). Match days to slots on `iso`, not on slot.date ('Apr 24').
    return { iso: dayKey(iso), day: fmtDay(iso), dom: parts(iso).d, isToday: isToday(iso), isPast: dayKey(iso) < TODAY };
  });
}
export const weekLabel = (anchor = TODAY) => {
  const { mo, d } = parts(weekDays(anchor)[0].iso);
  return `Week of ${MONTH_LONG[mo - 1]} ${d}`; // 'Week of April 20'
};

export const CALENDAR = {
  today: TODAY,
  timezone: 'America/Los_Angeles',
  week: weekDays(TODAY), // Mon Apr 20 to Sun Apr 26
  weekLabel: weekLabel(TODAY),
};

// ── Home, job, intake ────────────────────────────────────────────────────────
const number = '124';
const street = 'Maple St';
const city = 'Oakland';
const zip = '94609';
const type = 'Single-family';

// The house as the home profile describes it: a 1948 Craftsman bungalow.
const FACTS = { built: 1948, sqft: 1640, beds: 3, baths: 2 };
const factsSize = `${FACTS.beds} bed, ${FACTS.baths} bath, ${FACTS.sqft.toLocaleString('en-US')} sq ft`; // '3 bed, 2 bath, 1,640 sq ft'

// Major systems, from the profile's "Major systems" answers. `since` is the
// last install-level work, `serviced` the last service visit (ISO date).
// Consistency: the HVAC condenser is the unit in the AC task's photo, and its
// May service is why the watchlist's HVAC row is due in May; the gutters sit
// under the street tree behind the watchlist's "Yard, mature trees" row; the
// kitchen trap is the sink job's (JOB.system), logged here once closed out.
const SYSTEMS = [
  {
    id: 'hvac',
    name: 'Heating and cooling',
    detail: 'Central forced air. Carrier gas furnace and AC condenser',
    since: { verb: 'Installed', year: 2016 },
    serviced: '2025-05-14',
  },
  { id: 'water-heater', name: 'Water heater', detail: 'Gas, 50 gallon tank', since: { verb: 'Installed', year: 2019 } },
  { id: 'plumbing', name: 'Plumbing', detail: 'Copper supply, PVC drains', since: { verb: 'Repiped', year: 1998 } },
  {
    id: 'roof',
    name: 'Roof and gutters',
    detail: 'Composition shingle. Aluminum gutters under a mature street tree',
    since: { verb: 'Reroofed', year: 2011 },
  },
  { id: 'electrical', name: 'Electrical', detail: '200 amp panel', since: { verb: 'Upgraded', year: 2018 } },
].map((s) => ({
  ...s,
  // A serviced system keeps its install year in the detail; the right column
  // always shows the latest dated work.
  detail: s.serviced ? `${s.detail}, ${s.since.verb.toLowerCase()} ${s.since.year}` : s.detail,
  meta: s.serviced ? `Serviced ${fmtMonthYear(s.serviced)}` : `${s.since.verb} ${s.since.year}`,
}));

export const HOME = {
  owner: { first: 'Mara', last: 'Halligan' },
  name: 'Maple Street', // Home view title and the Rail's home row
  type,
  number,
  street,
  city,
  state: 'CA',
  zip,
  // Pros see only the public line; the house number goes to the booked pro alone.
  publicAddress: `${street}, ${city} ${zip}`,
  streetAddress: `${number} ${street}, ${city}`, // '124 Maple St, Oakland'
  fullAddress: `${number} ${street}, ${city}, CA ${zip}`,
  facts: { ...FACTS, size: factsSize },
  // '124 Maple St, Oakland · Single-family, built 1948 · 3 bed, 2 bath, 1,640 sq ft'
  factsLine: `${number} ${street}, ${city} · ${type}, built ${FACTS.built} · ${factsSize}`,
  systems: SYSTEMS,
};
export const getSystem = (id) => HOME.systems.find((s) => s.id === id) || null;

// ── Watchlist ────────────────────────────────────────────────────────────────
// Recurring jobs from the home profile. `month` is the next due month (1-12),
// `from` the profile answer that put the item on the list, and `detail` leads
// with the repeat interval.
const GUTTERS_MONTH = 9;
const WATCH = [
  {
    id: 'hvac',
    title: 'HVAC service',
    month: 5,
    from: 'Central HVAC',
    detail: 'Every spring, before peak season. Filter swap and coil clean; catches small issues before they become emergency calls.',
  },
  {
    id: 'water-heater',
    title: 'Water heater check',
    month: 6,
    from: 'Water heater',
    detail: 'Every 6 months. Anode rod check and sediment flush. Adds years to the unit.',
  },
  {
    id: 'smoke',
    title: 'Smoke and CO test',
    month: 7,
    from: 'Every home',
    detail: 'Every 6 months. Test each unit, swap batteries, replace units older than 10 years.',
  },
  {
    id: 'gutters',
    title: 'Gutter cleaning',
    month: GUTTERS_MONTH,
    from: 'Yard, mature trees',
    why: 'Yard with mature trees',
    // Oakland has no freeze, so the risk is winter rain, not ice.
    detail: 'Every fall, before the leaves drop. Clogged gutters overflow onto the foundation in winter rains.',
  },
];

// Sorted by next due, counted from TODAY (a month already past wraps to next year).
const monthsUntil = (month) => (month - parts(TODAY).mo + 12) % 12;
export const WATCHLIST = WATCH
  .map((w) => ({ ...w, when: MONTH_LONG[w.month - 1], dueIn: monthsUntil(w.month) }))
  .sort((a, b) => a.dueIn - b.dueIn);
export const getWatch = (id) => WATCHLIST.find((w) => w.id === id) || null;

// The ladder "yes" at close-out. `status` is the rail sub (18-char rule),
// `watch` the watchlist When cell, `meta` the rail row meta, `system` the
// HOME.systems row the gutters belong to.
export const GUTTERS_PLAN = {
  title: WATCH.find((w) => w.id === 'gutters').title,
  system: 'roof',
  month: GUTTERS_MONTH,
  long: `early ${MONTH_LONG[GUTTERS_MONTH - 1]}`, // 'early September'
  short: `early ${MONTH_SHORT[GUTTERS_MONTH - 1]}`, // 'early Sep'
  status: `Planned for ${MONTH_SHORT[GUTTERS_MONTH - 1]}`, // 'Planned for Sep'
  watch: `Planned for ${MONTH_LONG[GUTTERS_MONTH - 1]}`, // 'Planned for September'
  meta: MONTH_SHORT[GUTTERS_MONTH - 1], // 'Sep'
};

// `system` is the HOME.systems row the job works on; `logged` is the line the
// home file adds to that row once the job is closed out.
export const JOB = {
  name: 'Kitchen sink leak',
  scope: 'P-trap and faucet cartridge replacement',
  system: 'plumbing',
  logged: 'Kitchen P-trap and faucet cartridge replaced',
};

// quoteWindowDays: how long pros get to quote. The urgent answer has to
// change it, so no copy may print a fixed "5-day" window after urgency.
export const URGENCY = {
  urgent: { label: 'Active leak now', timing: 'Today', scope: 'Today', quoteWindowDays: 1 },
  soon: { label: 'Slow leak', timing: 'This week', scope: 'This week', quoteWindowDays: 5 },
  flexible: { label: 'Just an annoyance', timing: 'Whenever', scope: 'Flexible', quoteWindowDays: 5 },
};
export const DEFAULT_URGENCY = 'soon';
export const QUOTE_WINDOW_DAYS = URGENCY[DEFAULT_URGENCY].quoteWindowDays;
// 'Same-day quote window' (urgent) or '5-day quote window'.
export const quoteWindowText = (urgency = DEFAULT_URGENCY) => {
  const n = (URGENCY[urgency] || URGENCY[DEFAULT_URGENCY]).quoteWindowDays;
  return n === 1 ? 'Same-day quote window' : `${n}-day quote window`;
};

// When outstanding quotes are due: the quote window counted from TODAY, at
// the end of the business day. A one-day window means today.
const QUOTES_DUE_AT = '18:00';
export function quoteDue(urgency = DEFAULT_URGENCY) {
  const n = (URGENCY[urgency] || URGENCY[DEFAULT_URGENCY]).quoteWindowDays;
  const iso = addMinutes(at(QUOTES_DUE_AT), n === 1 ? 0 : n * 1440);
  return { iso, label: n === 1 ? `Due ${fmtTime(iso)}` : `Due ${fmtDay(iso)}` }; // 'Due 6 PM', 'Due Mon'
}

// Both shots are requested under the one Upload gate. The scope, the outreach
// brief and close-out cite exactly these two; nothing else was taken.
export const INTAKE = {
  faucetType: 'single-handle',
  photos: [
    {
      id: 'under-sink',
      label: 'Under the sink',
      instruction: 'The P-trap area, with the cabinet doors open',
      read: 'Standing water right at the P-trap joint. The slip nut is weeping.',
      tag: 'Standing water',
      tone: 'sage',
      photo: 'under-sink',
    },
    {
      id: 'faucet-base',
      label: 'Faucet base',
      // The faucet-base asset shows water seeping at the body seam by the side
      // handle and pooling at the base, with no spout in frame. A leak at the
      // handle is a cartridge seal; O-rings at the base are the alternative.
      instruction: 'Close up of the faucet body, from the handle down to the counter',
      read: 'Water seeping at the seam by the handle and pooling at the base. That points to a worn cartridge seal.',
      tag: 'Slow drip',
      tone: 'sky',
      photo: 'faucet-base',
    },
  ],
  // Both reads in one line, for the Overview's "From your photos" row.
  summary: 'Slip nut weeping at the P-trap, water at the faucet base',
};

// The second scripted task (New task): only its kickoff and one photo exist.
// The photo is the condenser of HOME.systems 'hvac'. `label` and `tag` caption
// it (the tag names what the pin marks); `drafting` is its status once read.
export const AC_TASK = {
  photo: 'ac-condenser',
  label: 'Outdoor condenser',
  tag: 'Side fins matted',
  read: 'Coil fins clogged, unit runs without cooling',
  system: 'hvac',
  drafting: 'Drafting the scope',
};

// What the booked pro uploads at the end of the visit.
export const CLOSEOUT_PHOTOS = [
  { label: 'Under sink · after', tag: 'Dry, no leak', tone: 'sage', photo: 'under-sink-after' },
  { label: 'Faucet base · after', tag: 'Drip resolved', tone: 'sky', photo: 'faucet-base-after' },
  { label: 'P-trap · new', tag: 'PVC installed', tone: 'ember', photo: 'p-trap-new' },
];

// ── Scope and benchmark ──────────────────────────────────────────────────────
export const BENCHMARK = { low: 180, high: 320, jobs: 46, window: 'last 90 days' };

// '$180–$320' for tables, '$180 to $320' for prose.
export const benchmarkRange = ({ words = false } = {}) =>
  `${fmtUsd(BENCHMARK.low)}${words ? ' to ' : '–'}${fmtUsd(BENCHMARK.high)}`;

export function benchmarkDelta(amount) {
  if (amount > BENCHMARK.high) {
    const over = amount - BENCHMARK.high;
    return { position: 'over', amount: over, label: `+${fmtUsd(over)} over local range` };
  }
  if (amount < BENCHMARK.low) {
    const under = BENCHMARK.low - amount;
    return { position: 'under', amount: under, label: `${fmtUsd(under)} under local range` };
  }
  return { position: 'inside', amount: 0, label: 'Inside local range' };
}

const LABOR_RATE = 95;
const SECTIONS = ['Diagnosis', 'Itemized labor', 'Materials', 'Unit-priced add-ons', 'Acceptance criteria'];
const addOnSection = pad(SECTIONS.indexOf('Unit-priced add-ons') + 1);
const today = parts(TODAY);

const MATERIALS = [
  { id: 'p-trap', item: 'P-trap assembly', spec: 'PVC, 1-1/2"', qty: 1, est: 14 },
  { id: 'cartridge', item: 'Faucet cartridge', spec: 'Mfr-matched, single-handle', qty: 1, est: 38 },
  { id: 'misc', item: "Plumber's tape & misc.", spec: 'Sealant, washers', qty: 1, est: 8 },
];
const materialEst = (id) => MATERIALS.find((m) => m.id === id).est;

// Add-on prices are computed from hours at the scope's labor rate plus parts,
// so the "+$" figure always matches its own description. `credit` is a base
// scope material the add-on makes unnecessary (a new faucet replaces the
// cartridge), shown so nobody pays for both.
const addOn = ({ hours, part, credit, ...rest }) => {
  if (hours == null) return { ...rest, add: 'Out of scope: separate ticket', cost: 'TBD', dollars: null, credit: null };
  const dollars = Math.round(hours * LABOR_RATE + (part.cost || 0));
  const partText = part.cost == null ? part.name : `${fmtUsd(part.cost)} ${part.name}`;
  const gross = part.cost == null ? `+${fmtUsd(dollars)} + ${part.name.split(' ')[0]}` : `+${fmtUsd(dollars)}`;
  return {
    ...rest,
    hours,
    dollars, // gross, before any credit
    credit: credit || null,
    add: `+${hours} hr labor + ${partText}`,
    cost: credit ? `${gross}, minus ${fmtUsd(credit.cost)} ${credit.name}` : gross,
  };
};

export const SCOPE = {
  ref: `SOW-${today.y}-${pad(today.mo)}${pad(today.d)}-001`, // 'SOW-2026-0422-001'
  issued: TODAY,
  issuedLabel: fmtDateYear(TODAY), // 'Apr 22, 2026'
  trade: 'Plumbing',
  property: HOME.publicAddress,
  laborRate: LABOR_RATE,
  sections: SECTIONS,
  visitEstimate: '1.5–2 hours',
  diagnosis: {
    likely: 'Worn P-trap seal and worn faucet cartridge (independent issues)',
    likelyDetail: 'Standing water under the trap and the seep by the faucet handle are unrelated.',
    alternative: `Worn O-rings at the faucet base, or a worn faucet body (less likely). The contractor checks both during the diagnostic step. If the body is worn, see unit pricing in section ${addOnSection}.`,
  },
  tasks: [
    { id: 'diagnose', n: 1, title: 'Diagnose faucet & under-sink supply', detail: 'Confirm leak source. Test cartridge and supply valves.', hours: 0.25 },
    { id: 'p-trap', n: 2, title: 'Replace P-trap assembly', detail: 'Remove existing trap, install new 1-1/2" PVC trap and tailpiece. Test for seal.', hours: 0.75 },
    { id: 'cartridge', n: 3, title: 'Replace single-handle faucet cartridge', detail: 'Manufacturer-matched cartridge. Reseat and test for drip-free operation.', hours: 0.5 },
    { id: 'test', n: 4, title: 'Test, clean up, and document', detail: 'Run full hot/cold cycle. Photograph completed work. Wipe down workspace.', hours: 0.25 },
  ],
  materials: MATERIALS,
  addOns: [
    { id: 'valve', if: 'Each supply valve found corroded', hours: 0.5, part: { name: 'valve', cost: 18 }, likelihood: 'Low (5%)' },
    {
      id: 'faucet',
      if: 'Faucet body worn: whole faucet replaced instead of the cartridge',
      hours: 0.75,
      part: { name: 'faucet (you pick the model)', cost: null },
      credit: { name: 'cartridge', cost: materialEst('cartridge') },
      likelihood: 'Low (10%)',
    },
    { id: 'cabinet', if: 'Per sq ft of water-damaged cabinet base requiring replacement', likelihood: 'Very low' },
  ].map(addOn),
  acceptance: [
    'No water at the faucet handle or base after a 5 min run cycle (hot and cold)',
    'No water beading at P-trap joints after 2 min full-flow test',
    'Cabinet floor dry to touch 30 min post-repair',
    'Photo evidence of completed work uploaded to job thread',
  ],
};

const scopeHours = SCOPE.tasks.reduce((s, t) => s + t.hours, 0);
const scopeLabor = Math.round(scopeHours * LABOR_RATE);
const scopeMaterials = SCOPE.materials.reduce((s, m) => s + m.est * m.qty, 0);
export const SCOPE_TOTALS = {
  hours: scopeHours, // 1.75
  labor: scopeLabor, // 166
  materials: scopeMaterials, // 60
  total: scopeLabor + scopeMaterials, // 226
  benchmark: benchmarkDelta(scopeLabor + scopeMaterials),
};

// ── Timeline (all on TODAY) ──────────────────────────────────────────────────
// Visit-day times are not here: they follow the booked slot (describeBooking).
export const TIMELINE = {
  kickoff: at('10:28'),
  photosIn: at('10:30'),
  clarified: at('10:31'), // faucet-type question and answer
  scoped: at('10:32'),
  scopeDrafted: at('10:33'),
  scopeApproved: at('10:34'),
  licensesChecked: at('10:35'),
  insuranceChecked: at('10:36'),
  benchmarkChecked: at('10:38'),
  prosMatched: at('10:39'),
  outreachSent: at('10:42'),
  baylineLate: at('13:30'), // past Bayline's own reply norm (replyWithinHours)
  baylineNudged: at('13:45'),
  quotesCompared: at('16:15'),
  booked: at('16:22'),
};
// Display labels: AT.scopeDrafted === '10:33 AM'.
export const AT = Object.fromEntries(Object.entries(TIMELINE).map(([k, v]) => [k, fmtTime(v)]));

// ── Availability windows and slots ───────────────────────────────────────────
export const WINDOWS = [
  { id: 'weekday-am', label: 'Weekday AM', hint: 'Before noon' },
  { id: 'weekday-pm', label: 'Weekday PM', hint: 'Noon to 6 PM' },
  { id: 'evening', label: 'Evenings', hint: 'After 6 PM' },
  { id: 'weekend', label: 'Weekend', hint: 'Sat and Sun' },
];
export const DEFAULT_AVAILABILITY = ['weekday-pm', 'weekend'];

// Evenings start at 6 PM, so a 5 PM weekday slot is Weekday PM.
function windowFor(iso) {
  const wd = weekdayOf(iso);
  const { h } = parts(iso);
  if (wd === 0 || wd === 6) return 'weekend';
  if (h < 12) return 'weekday-am';
  return h < 18 ? 'weekday-pm' : 'evening';
}

// day/date/time/window are derived from iso, so a slot can never show the
// wrong weekday. Ids are unique across contractors ('reyes-fri24-2pm').
function makeSlot(contractorId, local) {
  const iso = `${local}:00${OFFSET}`;
  const { mo, d } = parts(iso);
  const day = fmtDay(iso);
  const time = fmtTime(iso);
  return {
    id: `${contractorId}-${day.toLowerCase()}${d}-${time.replace(/[\s:]/g, '').toLowerCase()}`,
    contractorId,
    day, // 'Fri'
    date: `${MONTH_SHORT[mo - 1]} ${d}`, // 'Apr 24'
    time, // '2 PM'
    label: `${day} ${time}`, // 'Fri 2 PM'
    window: windowFor(iso),
    iso,
  };
}

// ── Contractors and quotes ───────────────────────────────────────────────────
// 0 = waived, null = not stated (never shown as "$0").
export function warrantyText(days, { adjective = false } = {}) {
  if (days == null) return 'Not stated';
  const [n, unit] = days % 365 === 0 ? [days / 365, 'year'] : [days, 'day'];
  return adjective ? `${n}-${unit}` : `${n} ${unit}${n === 1 ? '' : 's'}`;
}
export const visitText = (visit) => `~${visit.hours} hr${visit.followUp ? ' + follow-up' : ''}`;
// null = no hour norm, replies within the day.
export const replyText = (hours) => (hours == null ? 'Usually replies same day' : `Usually replies within ${hours} hours`);
const STANDARD_WARRANTY_DAYS = 90;
// `plural` is for verb agreement: 'He now has' vs 'They now have'.
const HE = { subject: 'he', object: 'him', possessive: 'his', plural: false };
const THEY = { subject: 'they', object: 'them', possessive: 'their', plural: true };

const RAW_CONTRACTORS = [
  {
    id: 'reyes',
    name: 'Reyes Plumbing',
    owner: { first: 'Jason', last: 'Reyes' },
    short: 'Jason', // how the agent and buttons refer to them
    pronoun: HE, // `short` is a person here, a company for the other two
    aiPick: true,
    rating: { score: 4.8, reviews: 168 },
    licensedSince: 2012,
    // CSLB numbers are issued in sequence, so they rise with licensedSince.
    license: { ok: true, label: 'CA Lic #984221' },
    insurance: { ok: true, label: 'GL + WC current' },
    similarJobs: 6, // same job type, last 12 months, county permit records
    permits: 11, // all permits pulled, last 12 months
    recommendBase: 12,
    replyWithinHours: 2,
    phone: '(510) 555-0142', // 555-0100 to 0199 only: the range reserved for fiction
    bio: (c) => `Family-run since ${c.licensedSince}. ${c.yearsLicensed} years licensed. Specializes in residential plumbing repairs and faucet replacements.`,
    slotTimes: ['2026-04-24T14:00', '2026-04-24T16:00', '2026-04-25T10:00'],
    quote: {
      total: 220,
      receivedAt: at('11:08'),
      fee: { amount: 0, note: 'Waived if booked' },
      warrantyDays: 90,
      materialsIncluded: true,
      cartridgeIncluded: true,
      cleanupIncluded: true,
      visit: { hours: 2, followUp: false },
      note: () => "Price assumes a Moen 1225 cartridge. If it turns out to be Delta, I'll confirm before scheduling so I source the right part.",
    },
    showcase: [
      { category: 'Sink leak repair', scope: 'P-trap and faucet cartridge replacement', date: 'Mar 2026', photoTone: 'sage', photo: 'jason-sink-repair', photoLabel: 'Under sink · after' },
      { category: 'Water heater swap', scope: '50-gal gas heater replacement and permit', date: 'Feb 2026', photoTone: 'sky', photo: 'jason-water-heater', photoLabel: 'New heater · installed' },
      { category: 'Toilet replacement', scope: 'Two-piece toilet swap and supply line', date: 'Jan 2026', photoTone: 'ember', photo: 'jason-toilet', photoLabel: 'Toilet · finished' },
    ],
  },
  {
    id: 'bayline',
    name: 'Bayline Plumbing',
    owner: { first: 'Linda', last: 'Tran' },
    short: 'Bayline',
    pronoun: THEY,
    rating: { score: 4.6, reviews: 92 },
    licensedSince: 2007, // 19 years: Bayline genuinely leads tenure
    license: { ok: true, label: 'CA Lic #886512' },
    insurance: { ok: true, label: 'GL + WC current' },
    similarJobs: 4,
    permits: 7,
    recommendBase: 7,
    replyWithinHours: 2, // so the 1:30 PM "running late" and the nudge are earned
    phone: '(510) 555-0173',
    bio: (c) => `${c.yearsLicensed} years licensed. Offers a ${warrantyText(c.quote.warrantyDays, { adjective: true })} workmanship warranty. Higher-end residential work.`,
    slotTimes: ['2026-04-25T10:00', '2026-04-25T13:00', '2026-04-27T09:00'],
    quote: {
      total: 390, // includes the service fee
      receivedAt: at('14:42'),
      fee: { amount: 75, note: 'Standard for residential calls' },
      warrantyDays: 365,
      materialsIncluded: true,
      cartridgeIncluded: true,
      cleanupIncluded: true,
      visit: { hours: 2, followUp: true },
      note: (c) => `Includes a ${warrantyText(c.quote.warrantyDays, { adjective: true })} workmanship warranty on this job. The ${fmtUsd(c.quote.fee.amount)} service fee is my standard for residential calls, waived only on same-day emergencies.`,
    },
    showcase: [
      { category: 'Pipe repair', scope: 'Burst supply line · drywall left for owner', date: 'Mar 2026', photoTone: 'sky', photo: 'bayline-pipe-repair', photoLabel: 'Pipe · repaired' },
      { category: 'Sink installation', scope: 'Undermount sink and new faucet', date: 'Jan 2026', photoTone: 'sage', photo: 'bayline-sink-install', photoLabel: 'Sink · installed' },
    ],
  },
  {
    id: 'eastbay',
    name: 'Eastbay Plumbing',
    owner: { first: 'Marcus', last: 'Bell' },
    short: 'Eastbay',
    pronoun: THEY,
    rating: { score: 4.5, reviews: 41 },
    licensedSince: 2023,
    license: { ok: true, label: 'CA Lic #1093417' },
    insurance: { ok: false, label: 'Renewal pending' },
    similarJobs: 2,
    permits: 3,
    recommendBase: 1,
    replyWithinHours: null,
    phone: '(510) 555-0186',
    bio: (c) => `Same-day availability for small plumbing fixes. ${c.yearsLicensed} years licensed. Currently has a pending insurance renewal.`,
    slotTimes: ['2026-04-22T17:00', '2026-04-23T09:00', '2026-04-25T10:00'],
    quote: {
      total: 175,
      receivedAt: at('16:15'), // the last quote in triggers the comparison
      fee: { amount: null, note: 'Not stated' },
      warrantyDays: null,
      materialsIncluded: false,
      cartridgeIncluded: null, // not specified
      cleanupIncluded: null,
      visit: { hours: 2, followUp: false },
      note: () => 'Quote is labor only. Materials TBD pending site visit. I can confirm same-day if you book this week.',
    },
    showcase: [],
  },
];

const CURRENT_YEAR = today.y;

export const CONTRACTORS = RAW_CONTRACTORS.map(({ slotTimes, bio, ...raw }) => {
  const c = {
    ...raw,
    aiPick: !!raw.aiPick,
    yearsLicensed: CURRENT_YEAR - raw.licensedSince,
    responseTime: replyText(raw.replyWithinHours),
    slots: slotTimes.map((t) => makeSlot(raw.id, t)).sort((a, b) => compareIso(a.iso, b.iso)),
  };
  c.bio = bio(c);
  c.quote = { ...raw.quote, note: raw.quote.note(c) };
  return c;
});

export const CONTRACTOR_IDS = CONTRACTORS.map((c) => c.id);
export const AI_PICK_ID = CONTRACTORS.find((c) => c.aiPick).id;
export const getContractor = (id) => CONTRACTORS.find((c) => c.id === id) || null;

const SLOT_INDEX = new Map(CONTRACTORS.flatMap((c) => c.slots.map((s) => [s.id, s])));
export const findSlot = (slotId) => SLOT_INDEX.get(slotId) || null;
export const slotsFor = (contractorId, windows = DEFAULT_AVAILABILITY) => {
  const has = toHas(windows);
  return (getContractor(contractorId)?.slots || []).filter((s) => has(s.window));
};
export const earliestSlot = (contractorId) => getContractor(contractorId)?.slots[0] || null;
export const defaultPick = (contractorId, windows = DEFAULT_AVAILABILITY) => slotsFor(contractorId, windows)[0] || null;

export const isCompleteQuote = (q) =>
  q.materialsIncluded && q.cartridgeIncluded === true && q.warrantyDays != null && q.fee.amount != null;

// Who leads what. Every superlative in agent copy must match this.
const leader = (score) => CONTRACTORS.reduce((best, c) => (score(c) > score(best) ? c : best)).id;
export const LEADERS = {
  bestOverallFit: AI_PICK_ID,
  highestRated: leader((c) => c.rating.score),
  mostSimilarJobs: leader((c) => c.similarJobs),
  longestTrackRecord: leader((c) => c.yearsLicensed),
  longestWarranty: leader((c) => c.quote.warrantyDays ?? -1),
  soonestStart: leader((c) => -wallMs(c.slots[0].iso)),
  thinnestReviews: leader((c) => -c.rating.reviews),
  lowestQuote: leader((c) => -c.quote.total),
  lowestCompleteQuote: CONTRACTORS.filter((c) => isCompleteQuote(c.quote)).reduce((a, b) => (b.quote.total < a.quote.total ? b : a)).id,
  sameDay: CONTRACTORS.filter((c) => c.slots.some((s) => isToday(s.iso))).map((c) => c.id),
  insuranceFlagged: CONTRACTORS.filter((c) => !c.insurance.ok).map((c) => c.id),
};

// Header tag per artifact. "Longest warranty" is quote data, so it only
// exists on Quotes; the other two tags are Phase 3 "Best for" proposals.
export function bestFor(contractorId, artifact = 'contractors') {
  if (contractorId === LEADERS.bestOverallFit) return 'Best overall fit';
  if (artifact === 'quotes' && contractorId === LEADERS.longestWarranty) return 'Longest warranty';
  if (contractorId === LEADERS.longestTrackRecord) return 'Longest track record';
  if (LEADERS.sameDay.length === 1 && LEADERS.sameDay[0] === contractorId) return 'Same-day start';
  return null;
}

// Header verdict under each quote total. `exception` marks the ember cases.
export function quoteVerdict(contractorId) {
  const c = getContractor(contractorId);
  if (!c) return null;
  const q = c.quote;
  if (!q.materialsIncluded) return { text: 'Missing materials', exception: true };
  const d = benchmarkDelta(q.total);
  return { text: d.label, exception: d.position !== 'inside' };
}

// Quote matrix rows, built from the scope tasks and each quote's facts.
// Cells are keyed by contractor id.
const hoursOf = (id) => SCOPE.tasks.find((t) => t.id === id).hours;
const cellsFor = (fn) => Object.fromEntries(CONTRACTORS.map((c) => [c.id, fn(c.quote)]));
const cell = (state, text, value, badge) => (badge ? { state, text, value, badge } : { state, text, value });
export const QUOTE_ROWS = [
  {
    id: 'diagnose',
    label: 'Diagnose & test',
    sub: `${hoursOf('diagnose')} hr · standard`,
    cells: cellsFor(() => cell('included', 'Included', 'Standard')),
  },
  {
    id: 'p-trap',
    label: 'Replace P-trap',
    sub: `${hoursOf('p-trap')} hr · materials included`,
    cells: cellsFor((q) => (q.materialsIncluded
      ? cell('included', 'Included', `${hoursOf('p-trap')} hr · PVC trap`)
      : cell('flag', 'Materials TBD', 'Labor only stated'))),
  },
  {
    id: 'cartridge',
    label: 'Replace faucet cartridge',
    sub: `${hoursOf('cartridge')} hr · ${INTAKE.faucetType}`,
    cells: cellsFor((q) => (q.cartridgeIncluded
      ? cell('included', 'Included', `${hoursOf('cartridge')} hr · cartridge`)
      : cell('flag', 'Not specified', 'Bundled or excluded?'))),
  },
  {
    id: 'warranty',
    label: 'Workmanship warranty',
    sub: '',
    cells: cellsFor((q) => (q.warrantyDays == null
      ? cell('flag', 'Not stated', 'Implied none')
      : q.warrantyDays > STANDARD_WARRANTY_DAYS
        ? cell('better', warrantyText(q.warrantyDays), 'Above market', 'Better')
        : cell('included', warrantyText(q.warrantyDays), 'Standard for trade'))),
  },
  {
    id: 'fee',
    label: 'Service / call-out fee',
    sub: 'Charged regardless of work',
    cells: cellsFor((q) => (q.fee.amount == null
      ? cell('flag', 'Not stated', 'Ask before booking')
      : q.fee.amount === 0
        ? cell('included', fmtUsd(0), q.fee.note)
        : cell('higher', `${fmtUsd(q.fee.amount)} premium`, 'Above market', 'Outlier'))),
  },
  {
    id: 'cleanup',
    label: 'Cleanup & photos',
    sub: '',
    cells: cellsFor((q) => (q.cleanupIncluded
      ? cell('included', 'Included', 'Standard')
      : cell('flag', 'Not stated', 'Ask before booking'))),
  },
  {
    id: 'visit',
    label: 'Visit length',
    sub: '',
    cells: cellsFor((q) => cell('included', visitText(q.visit), q.visit.followUp ? 'Second visit for the warranty' : 'One visit')),
  },
];

// Rationale and quote summary, generated so every claim tracks LEADERS.
export function contractorRationale() {
  const pick = getContractor(LEADERS.bestOverallFit);
  const tenure = getContractor(LEADERS.longestTrackRecord);
  const fast = getContractor(LEADERS.soonestStart);
  return [
    { id: null, label: 'All three', text: `are licensed plumbers in good standing with the ${HOME.state} state board.` },
    { id: pick.id, label: pick.short, text: 'has the highest rating and the most jobs like this one in the last 12 months.' },
    { id: tenure.id, label: tenure.short, text: `has the longest track record (${tenure.yearsLicensed} years licensed), but their soonest slot is ${DAY_LONG[weekdayOf(tenure.slots[0].iso)]}.` },
    { id: fast.id, label: fast.short, text: 'is the only same-day option, but has the thinnest review history and an insurance renewal pending.' },
  ];
}

export function quoteSummary({ urgency = DEFAULT_URGENCY } = {}) {
  const pick = getContractor(LEADERS.lowestCompleteQuote);
  const extra = getContractor(LEADERS.longestWarranty);
  const fast = getContractor(LEADERS.soonestStart);
  const x = extra.quote;
  return [
    `${pick.short} is the lowest complete quote at ${fmtUsd(pick.quote.total)}, inside the ${benchmarkRange({ words: true })} local range.`,
    `${extra.short} is ${fmtUsd(x.total)}: the same scope plus a ${warrantyText(x.warrantyDays, { adjective: true })} warranty and a ${fmtUsd(x.fee.amount)} service fee.`,
    `${fast.short} is ${fmtUsd(fast.quote.total)} and ${urgency === 'urgent' ? 'the only one who can start today' : 'can start today'}, but leaves out materials and warranty terms.`,
  ].join(' ');
}

// ── Status vocabulary ────────────────────────────────────────────────────────
// Board gate ids. `book` keeps its legacy string so the Thread script's gate
// still matches; it clears for whichever column was approved.
export const GATES = {
  approveScope: 'approve-scope',
  approveOutreach: 'approve-outreach',
  book: 'approve-jason',
  closeOut: 'close-out',
};

// Who holds the ball: working = the agent, needs-you = Mara, waiting =
// contractors or the calendar, done = closed out.
export const STATE_TONE = { working: 'sage', 'needs-you': 'ember', waiting: 'sky', done: 'sage' };

// Labels are verb-first and at most 18 characters, so rail subs never truncate.
export const STATUS = {
  scoping: { state: 'working', label: 'Scoping the job' },
  'scope-ready': { state: 'needs-you', label: 'Review scope' },
  verifying: { state: 'working', label: 'Verifying pros' },
  matched: { state: 'needs-you', label: 'Approve outreach' },
  'awaiting-quotes': { state: 'waiting', label: 'Waiting on quotes' },
  'quotes-in': { state: 'needs-you', label: 'Pick a quote' },
  booked: { state: 'waiting', label: 'Booked' }, // shown as 'Booked · Fri 2 PM'
  'visit-done': { state: 'needs-you', label: 'Close out' },
  done: { state: 'done', label: 'Done' },
};

const statusOut = (stage, label = STATUS[stage].label) => ({
  stage,
  state: STATUS[stage].state,
  label,
  tone: STATE_TONE[STATUS[stage].state],
});

// `quotesIn` is a Set or array of contractor ids. Quotes unlock with the
// first arrival, so the tab alone does not mean all are in; omitting
// `quotesIn` keeps the old reading (tab unlocked = all in).
const allQuotesIn = (quotesIn) =>
  quotesIn == null || (quotesIn instanceof Set ? quotesIn.size : quotesIn.length) >= CONTRACTORS.length;

// Same ladder and gating as App.jsx's old sinkStage: only the book gate means
// booked, a booking without it changes nothing. The label comes from the
// booking; a missing or invalid one shows plain 'Booked', never Jason's slot.
export function deriveSinkStatus({ unlocked, gates = {}, booking = null, quotesIn } = {}) {
  const has = toHas(unlocked);
  if (gates[GATES.closeOut]) return statusOut('done');
  if (has('completion')) return statusOut('visit-done');
  if (gates[GATES.book]) {
    const b = describeBooking(booking);
    return statusOut('booked', b ? b.status : STATUS.booked.label);
  }
  if (has('quotes')) return statusOut(allQuotesIn(quotesIn) ? 'quotes-in' : 'awaiting-quotes');
  if (gates[GATES.approveOutreach]) return statusOut('awaiting-quotes');
  if (has('contractors')) return statusOut('matched');
  if (gates[GATES.approveScope]) return statusOut('verifying');
  if (has('scope')) return statusOut('scope-ready');
  return statusOut('scoping');
}

// The status pill on each stage artifact bar, from the same vocabulary.
export function artifactStatus(artifactId, { unlocked, gates = {}, booking = null, quotesIn } = {}) {
  const closed = !!gates[GATES.closeOut];
  const booked = !!gates[GATES.book];
  const doneAs = (label) => ({ stage: 'done', state: 'done', label, tone: STATE_TONE.done });
  switch (artifactId) {
    case 'scope':
      return gates[GATES.approveScope] ? doneAs('Approved') : statusOut('scope-ready');
    case 'contractors':
      return gates[GATES.approveOutreach] ? doneAs('Outreach sent') : statusOut('matched');
    case 'quotes':
      return closed ? statusOut('done')
        : booked ? statusOut('booked')
          : statusOut(allQuotesIn(quotesIn) ? 'quotes-in' : 'awaiting-quotes');
    case 'schedule':
      return closed ? statusOut('done') : statusOut('booked');
    case 'completion':
      return closed ? statusOut('done') : statusOut('visit-done');
    default:
      return deriveSinkStatus({ unlocked, gates, booking, quotesIn });
  }
}

// Reached plan marks (scope-approved, matched, sent, booked) out of 4: the
// composer progress line and the working pie.
export function planProgress({ unlocked, gates = {} } = {}) {
  const has = toHas(unlocked);
  const marks = [gates[GATES.approveScope], has('contractors'), gates[GATES.approveOutreach], gates[GATES.book]];
  return marks.filter(Boolean).length / marks.length;
}

// ── Plan card ────────────────────────────────────────────────────────────────
// Four gate steps for the four board gates. Each `mark` belongs on the first
// script entry after that step is finished (step 1 ticks on the approval
// receipt, not on the draft), and `waitsOn` names the gate that makes the
// step the user's turn. Subs make no time claims: the plan renders after the
// urgency answer, and quote timing follows it (quoteWindowText).
export const PLAN = [
  { id: 'scope', label: 'Draft the scope, you approve it', sub: 'From your photos and answers', gate: true, mark: 'scope-approved', waitsOn: [GATES.approveScope] },
  { id: 'match', label: 'Verify and match 3 local pros', sub: 'License, insurance, relevant past work', gate: false, mark: 'matched', waitsOn: [] },
  { id: 'outreach', label: 'Send the same brief to all 3', sub: 'Quotes land in this conversation', gate: true, mark: 'sent', waitsOn: [GATES.approveOutreach] },
  { id: 'book', label: 'You pick, I book', sub: 'Calendar and reminders handled', gate: true, mark: 'booked', waitsOn: [GATES.book] },
  { id: 'closeout', label: 'You confirm the work, I close it out', sub: 'Logged in your home file', gate: true, mark: 'closed', waitsOn: [GATES.closeOut] },
];

// ── Booking ──────────────────────────────────────────────────────────────────
// App stores booking = { contractorId, slotId }; everything shown about the
// visit comes from describeBooking(booking).
// The scripted happy path (AI pick, first default-window slot), for previews
// and checks. Never use as App initial state; App starts with booking = null.
export const DEFAULT_BOOKING = { contractorId: AI_PICK_ID, slotId: defaultPick(AI_PICK_ID).id };
export const bookingFor = (slotId) => {
  const s = findSlot(slotId);
  return s ? { contractorId: s.contractorId, slotId: s.id } : null;
};

export const ARRIVAL_WINDOW_MIN = 120;
export const REMINDER_MIN = 30; // text from the pro before arrival
const CLOSE_OUT_AFTER_MIN = 2;

// Free changes until 6 PM the day before. A slot whose cutoff already passed
// when the booking was made (same-day) has no free-change window.
function changeDeadlineFor(slotIso) {
  const cutoff = addMinutes(`${dayKey(slotIso)}T18:00:00${OFFSET}`, -1440);
  return compareIso(cutoff, TIMELINE.booked) > 0 ? cutoff : null;
}

export function describeBooking(booking) {
  const slot = booking ? findSlot(booking.slotId) : null;
  if (!slot || slot.contractorId !== booking.contractorId) return null;
  const contractor = getContractor(slot.contractorId);
  const deadline = changeDeadlineFor(slot.iso);
  // Arrives at the slot start and stays for the quoted visit length, the same
  // number `onSite` prints. Supersedes the audit's literal 2:48 / 2:50 PM
  // copy: render fmtDateTime(completedAt) and fmtDateTime(closedOutAt).
  const visitMin = contractor.quote.visit.hours * 60;
  const completedAt = addMinutes(slot.iso, visitMin);
  const closedOutAt = addMinutes(completedAt, CLOSE_OUT_AFTER_MIN);
  return {
    contractor,
    slot,
    who: contractor.short, // 'Jason'
    pronoun: contractor.pronoun, // check `plural` for verb agreement
    label: slot.label, // 'Fri 2 PM'
    time: slot.time, // '2 PM'
    short: fmtShort(slot.iso), // 'Fri, Apr 24'
    dateLong: fmtLong(slot.iso), // 'Friday, April 24'
    long: `${fmtLong(slot.iso)} · ${fmtTime(slot.iso, { minutes: true })}`, // 'Friday, April 24 · 2:00 PM'
    arrival: fmtTimeRange(slot.iso, addMinutes(slot.iso, ARRIVAL_WINDOW_MIN)), // '2 to 4 PM'
    window: `${ARRIVAL_WINDOW_MIN / 60}-hour window`, // '2-hour window'
    reminder: `${REMINDER_MIN} min before`, // '30 min before'
    reminderAt: addMinutes(slot.iso, -REMINDER_MIN),
    onSite: `about ${contractor.quote.visit.hours} hr`,
    status: `${STATUS.booked.label} · ${slot.label}`, // 'Booked · Fri 2 PM'
    changeDeadline: deadline ? fmtSlot(deadline) : null, // 'Thu 6 PM'
    changeDeadlineIso: deadline,
    changeLine: deadline
      ? `Reschedule or cancel until ${fmtSlot(deadline)}`
      : `Same-day visit. Call ${contractor.short} to change it`,
    arrivedAt: slot.iso,
    completedAt, // Fri, Apr 24, 4 PM for the default booking
    closedOutAt, // Fri, Apr 24, 4:02 PM
    // ISO time of the nth thread message after close-out (n = 1, 2, 3...).
    afterCloseOut: (n) => addMinutes(closedOutAt, n),
  };
}

// The Schedule strip's week: the booked slot's week, so a Mon Apr 27 visit
// gets its own strip. No valid booking shows the current week.
export function weekFor(booking) {
  const slot = describeBooking(booking)?.slot || null;
  const anchor = slot ? slot.iso : TODAY;
  const bookedDay = slot ? dayKey(slot.iso) : null;
  return {
    days: weekDays(anchor).map((d) => ({ ...d, isBooked: d.iso === bookedDay })),
    label: weekLabel(anchor),
    bookedDay,
  };
}

// Omitting `booking` means the scripted path (the AI pick was booked); an
// explicit null means nothing is booked.
const bookedIdOf = (booking) => (booking === undefined ? AI_PICK_ID : booking?.contractorId ?? null);

// Who the agent offers if the booked pro has to move: the best-ranked other
// contractor with clean insurance, at their earliest slot.
export function backupFor(booking) {
  const bookedId = bookedIdOf(booking);
  if (!getContractor(bookedId)) return null;
  const ranked = [getContractor(AI_PICK_ID), ...CONTRACTORS.filter((c) => !c.aiPick)];
  const contractor = ranked.find((c) => c.id !== bookedId && c.insurance.ok) || null;
  return contractor ? { contractor, slot: contractor.slots[0] } : null;
}

// ── Recommendations ──────────────────────────────────────────────────────────
export const NEW_TO_HOMEWISE_BELOW = 3; // cold-start threshold: below this, show "New to Homewise"

// +1 only for the pro the user actually booked. Omitted booking = the AI pick.
export function recommendCount(contractorId, { recommended = null, booking } = {}) {
  const c = getContractor(contractorId);
  if (!c) return 0;
  return c.recommendBase + (recommended === 'yes' && bookedIdOf(booking) === contractorId ? 1 : 0);
}

// ── Home view ────────────────────────────────────────────────────────────────
// Systems as the home file has them now: closing out the sink job logs its
// work on the system it touched, dated by the booked visit. Once serviced the
// row follows SYSTEMS' serviced rule: the install-level work moves into the
// detail, the right column shows the visit.
export function homeSystems({ gates = {}, booking = null } = {}) {
  const b = gates[GATES.closeOut] ? describeBooking(booking) : null;
  return HOME.systems.map((s) => {
    if (!b || s.id !== JOB.system) return s;
    const base = s.serviced ? s.detail : `${s.detail}, ${s.since.verb.toLowerCase()} ${s.since.year}`;
    // 'Copper supply, PVC drains, repiped 1998. Kitchen P-trap and faucet cartridge replaced'
    return { ...s, detail: `${base}. ${JOB.logged}`, meta: `Serviced ${fmtMonthYear(b.completedAt)}` };
  });
}

// One row per started task for the Home view's Jobs list. `tasks` are the
// started threads in start order: { id, kind: 'sink' | 'ac' | 'gutters',
// title?, photosRead? }. Rows come back open first (newest first), then
// planned, then done; `meta` is the row's right-hand words.
export function homeJobs({ tasks = [], unlocked, gates = {}, booking = null, quotesIn } = {}) {
  const rank = { open: 0, planned: 1, done: 2 };
  const rows = tasks.map((t, order) => {
    if (t.kind === 'sink') {
      const s = deriveSinkStatus({ unlocked, gates, booking, quotesIn });
      const b = describeBooking(booking);
      const n = quotesIn instanceof Set ? quotesIn.size : Array.isArray(quotesIn) ? quotesIn.length : 0;
      // An incomplete quote is labor only, as Schedule says; never a bare total.
      const q = b?.contractor.quote;
      const price = q ? `${fmtUsd(q.total)}${isCompleteQuote(q) ? '' : ' labor only'}` : null;
      const meta = s.stage === 'done' && b
        ? `${s.label} · ${b.short} · ${price} with ${b.contractor.name}` // 'Done · Fri, Apr 24 · $220 with Reyes Plumbing'
        : s.stage === 'awaiting-quotes' && n
          ? `${s.label} · ${n} of ${CONTRACTORS.length} in` // 'Waiting on quotes · 1 of 3 in'
          : s.label; // 'Review scope', 'Booked · Fri 2 PM'
      return {
        id: t.id,
        title: JOB.name,
        state: s.state,
        progress: planProgress({ unlocked, gates }),
        meta,
        muted: s.state === 'done',
        group: s.state === 'done' ? 'done' : 'open',
        order,
      };
    }
    if (t.kind === 'gutters') {
      return { id: t.id, title: GUTTERS_PLAN.title, state: 'waiting', progress: 0, meta: GUTTERS_PLAN.watch, group: 'planned', order };
    }
    return {
      id: t.id,
      title: t.title || 'New task',
      state: 'working',
      progress: 0,
      meta: t.photosRead ? AC_TASK.drafting : STATUS.scoping.label,
      group: 'open',
      order,
    };
  });
  return rows
    .sort((a, b) => rank[a.group] - rank[b.group] || b.order - a.order)
    .map(({ group, order, ...row }) => row);
}

// ── Self-check ───────────────────────────────────────────────────────────────
// Returns the facts that would make agent copy false. Empty array = consistent.
export function auditDemoFacts() {
  const problems = [];
  const expect = (ok, msg) => ok || problems.push(msg);
  const pick = getContractor(LEADERS.bestOverallFit);
  expect(weekdayOf(TODAY) === 3, 'TODAY is not a Wednesday');
  expect(CONTRACTORS.length === 3, 'Copy says "three" contractors');
  expect(CONTRACTORS.every((c) => c.license.ok), 'Rationale says all three are licensed');
  expect(LEADERS.highestRated === pick.id && LEADERS.mostSimilarJobs === pick.id, 'AI pick must lead rating and similar jobs');
  expect(LEADERS.longestTrackRecord !== pick.id, 'Tenure leader must differ from the pick');
  expect(LEADERS.sameDay.length === 1 && LEADERS.sameDay[0] === LEADERS.soonestStart, 'Exactly one contractor must be same-day');
  expect(LEADERS.thinnestReviews === LEADERS.soonestStart, 'Same-day pro must have the thinnest reviews');
  expect(LEADERS.insuranceFlagged.includes(LEADERS.soonestStart), 'Same-day pro must be the insurance flag');
  expect(LEADERS.lowestCompleteQuote === pick.id, 'Pick must be the lowest complete quote');
  expect(benchmarkDelta(pick.quote.total).position === 'inside', 'Pick quote must sit inside the benchmark');
  expect(SCOPE_TOTALS.benchmark.position === 'inside', 'Scope estimate must sit inside the benchmark');
  expect(getContractor(LEADERS.longestWarranty).quote.fee.amount > 0, 'Warranty leader is described with a service fee');
  expect(SCOPE.addOns.length === 3 && SCOPE.acceptance.length === 4, 'Section eyebrows say 3 add-ons, 4 checks');
  const faucet = SCOPE.addOns.find((a) => a.id === 'faucet');
  expect(faucet.credit?.cost === materialEst('cartridge'), 'Faucet add-on must credit the cartridge it replaces');
  expect(PLAN.length === 5, 'Plan card has 5 steps');
  expect(!!describeBooking(DEFAULT_BOOKING), 'DEFAULT_BOOKING does not resolve');
  expect(GUTTERS_PLAN.status.length <= 18, 'Gutters rail sub over 18 chars');
  expect(getWatch('gutters')?.month === GUTTERS_PLAN.month, 'Gutters plan month differs from its watchlist row');
  expect(WATCHLIST.every((w, i, a) => !i || a[i - 1].dueIn <= w.dueIn), 'Watchlist not sorted by next due');
  // Home profile: the systems table, the watchlist and the tasks tell one story.
  const hvac = getSystem('hvac');
  expect(HOME.systems.length === 5, 'Home view lists 5 systems');
  expect(
    !!getSystem(JOB.system) && !!getSystem(AC_TASK.system) && !!getSystem(GUTTERS_PLAN.system),
    'Job, AC task or gutters plan points at a missing system',
  );
  expect(HOME.systems.every((s) => s.since.year >= HOME.facts.built && s.since.year <= today.y), 'System work dated outside the house');
  expect(hvac.serviced && parts(hvac.serviced).mo === getWatch('hvac').month, 'HVAC service month differs from its watchlist row');
  expect(compareIso(hvac.serviced, TODAY) < 0, 'HVAC last service is in the future');
  expect(HOME.factsLine.split('·').length - 1 <= 2, 'Home facts line has more than two middots');
  // Reply norms vs the timeline: only Bayline runs late, and the agent says so
  // only after Bayline's own norm has passed.
  const replyDue = (c) => (c.replyWithinHours == null
    ? `${TODAY}T23:59:00${OFFSET}`
    : addMinutes(TIMELINE.outreachSent, c.replyWithinHours * 60));
  const late = CONTRACTORS.filter((c) => compareIso(c.quote.receivedAt, replyDue(c)) > 0).map((c) => c.id);
  expect(late.join() === 'bayline', 'Only Bayline may miss its reply norm (the thread nudges only Bayline)');
  const bay = getContractor('bayline');
  expect(compareIso(TIMELINE.baylineLate, replyDue(bay)) > 0, 'Agent calls Bayline late before its own norm');
  expect(compareIso(TIMELINE.baylineNudged, bay.quote.receivedAt) < 0, 'Bayline nudge comes after its quote');

  const licenseNo = (c) => +c.license.label.replace(/\D/g, '');
  expect(
    [...CONTRACTORS].sort((a, b) => a.licensedSince - b.licensedSince).every((c, i, a) => !i || licenseNo(a[i - 1]) < licenseNo(c)),
    'License numbers not ascending with licensedSince',
  );
  expect(CONTRACTORS.every((c) => /555-01\d\d$/.test(c.phone)), 'Non-fictional phone number');
  expect(CONTRACTORS.every((c) => c.pronoun && typeof c.pronoun.plural === 'boolean'), 'Contractor missing a pronoun');

  CONTRACTORS.forEach((c) => {
    expect(
      compareIso(c.quote.receivedAt, TIMELINE.outreachSent) > 0 && compareIso(c.quote.receivedAt, TIMELINE.quotesCompared) <= 0,
      `${c.short} quote outside the outreach window`,
    );
    c.slots.forEach((s) => {
      const part = fmtDayPart(s.iso);
      expect(compareIso(s.iso, TIMELINE.booked) > 0, `${s.id} is in the past at booking time`);
      expect(`${STATUS.booked.label} · ${s.label}`.length <= 18, `${s.id} booked label over 18 chars`);
      expect(
        s.window === 'weekend' || (s.window === 'evening') === part.endsWith('evening') && (s.window === 'weekday-am') === part.endsWith('morning'),
        `${s.id}: fmtDayPart and windowFor disagree`,
      );
      expect(weekFor(bookingFor(s.id)).days.some((d) => d.isBooked), `${s.id} has no day on its Schedule strip`);
    });
  });
  Object.entries(STATUS).forEach(([id, s]) => expect(s.label.length <= 18, `STATUS.${id} over 18 chars`));
  return problems;
}

// Runs on import, so a broken fact shows up in the dev console and in node checks.
{
  const problems = auditDemoFacts();
  if (problems.length) console.warn('[demo.js] inconsistent facts:', problems);
}
