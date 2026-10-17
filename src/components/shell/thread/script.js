// The scripted conversations, one ordered list per thread variant. Plain ES
// module (no JSX), so the receipt caps can be checked under node.
//
// Entry types:
//   marker   day marker                  agent    agent prose (`plan`, `readsPhotos`)
//   user     user bubble (`photos`)      receipt  one receipt line (`group`, `mark`, `flags`)
//   finish   finish line                 gate     parks the engine until the gate clears
//   effect   fires once upward           status   sets the composer status row (engine only)
// Any field may be a function of ctx: { urgency, urgencyChoice, b, booking,
// kickoff, ladderChoice, recommended }. `b` is describeBooking() of the booked
// slot and only exists once the book gate is clear. `when(ctx)` drops an entry,
// `wait` is the pause before an entry appears, `mark` ticks a PLAN step.

import {
  AC_TASK,
  AT,
  BENCHMARK,
  CLOSEOUT_PHOTOS,
  CONTRACTORS,
  DEFAULT_URGENCY,
  GATES,
  GUTTERS_PLAN,
  INTAKE,
  JOB,
  LEADERS,
  PLAN,
  REMINDER_MIN,
  SCOPE,
  SCOPE_TOTALS,
  STATUS,
  TIMELINE,
  TODAY,
  URGENCY,
  addMinutes,
  backupFor,
  benchmarkDelta,
  compareIso,
  dayKey,
  fmtDay,
  fmtDayPart,
  fmtTime,
  fmtUsd,
  getContractor,
  isToday,
  quoteDue,
  recommendCount,
} from '../../../data/demo';

export const resolve = (v, ctx) => (typeof v === 'function' ? v(ctx) : v);

const clock = (iso) => fmtTime(iso, { minutes: true });
const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six'];
const count = (n) => WORDS[n] ?? String(n);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const N = CONTRACTORS.length;
const windowDays = (u) => (URGENCY[u] || URGENCY[DEFAULT_URGENCY]).quoteWindowDays;
const windowWords = (u) => (windowDays(u) === 1 ? 'same day' : `${windowDays(u)} days`);
const stepMeta = (planId) => `Step ${PLAN.findIndex((s) => s.id === planId) + 1} of ${PLAN.length}`;

// Plan marks that move the progress line: every step but close-out.
export const PROGRESS_MARKS = PLAN.map((s) => s.mark).filter((m) => m !== 'closed');

const marker = (text, extra) => ({ type: 'marker', text, ...extra });
const agent = (text, extra) => ({ type: 'agent', text, ...extra });
const user = (text, extra) => ({ type: 'user', text, ...extra });
const receipt = (head, result, time, target, extra) => ({ type: 'receipt', head, result, time, target, ...extra });
const finish = (text, extra) => ({ type: 'finish', text, ...extra });
const gate = (id, dock) => ({ type: 'gate', id, dock });
const effect = (e, extra) => ({ type: 'effect', effect: e, ...extra });
const status = (state, text, meta = null, target = null) => ({ type: 'status', state, text, meta, target });
const phase = (id) => ({ type: 'phase', id });

const yes = (c) => c.ladderChoice === 'yes';
const no = (c) => c.ladderChoice === 'no';
const stage = (artifact, id = null) => ({ artifact, id });
const startTask = effect((c) => ({ type: 'task-started', label: c.kickoff.message, railTitle: c.kickoff.railTitle }), { starts: true });

// ── Docks ───────────────────────────────────────────────────────────────────

const kickoffDock = (kickoffs) => ({
  kind: 'choice',
  label: "What's happening at home?",
  initial: 0,
  options: kickoffs.map((k) => ({ label: k.label, value: k })),
});

const uploadDock = (shots, status) => ({
  kind: 'upload',
  status,
  items: shots,
  action: shots.length > 1 ? 'Upload photos' : 'Upload photo',
  busy: shots.length > 1 ? 'Checking photos' : 'Checking photo',
});

const URGENCY_KEYS = ['urgent', 'soon', 'flexible'];
const urgencyDock = {
  kind: 'choice',
  label: 'How active is the leak?',
  status: 'Pick how active the leak is',
  initial: URGENCY_KEYS.indexOf(DEFAULT_URGENCY),
  options: URGENCY_KEYS.map((k) => ({ label: URGENCY[k].label, meta: URGENCY[k].timing, value: k })),
};

const planDock = {
  kind: 'choice',
  label: 'The plan',
  status: 'Review the plan',
  initial: 0,
  options: [
    { label: 'Looks good, start', value: 'start' },
    { label: 'Adjust the plan', value: 'adjust' },
  ],
};

// The ladder comes after close-out, so the strip keeps "Closed out".
const ladderDock = {
  kind: 'choice',
  label: `Plan ${lower(GUTTERS_PLAN.title)}`,
  keepStatus: true,
  initial: 0,
  options: [
    { label: `Yes, plan it for ${GUTTERS_PLAN.long}`, value: 'yes' },
    { label: 'Not now', value: 'no' },
  ],
};

// ── Kickoffs ────────────────────────────────────────────────────────────────

export const SINK_KICKOFFS = [
  { label: 'My kitchen sink is leaking', message: 'My kitchen sink is leaking and the faucet drips.', railTitle: JOB.name },
  { label: "There's water under my sink", message: "There's standing water under my kitchen sink.", railTitle: JOB.name },
  { label: "My faucet won't stop dripping", message: "My kitchen faucet won't stop dripping.", railTitle: JOB.name },
];

export const AC_KICKOFFS = [
  { label: 'My AC is blowing warm air', message: 'My AC is running but blowing warm air.', railTitle: 'AC blowing warm air' },
  { label: 'The AC runs but the house stays warm', message: 'The AC runs all day but the house stays warm.', railTitle: 'AC not cooling' },
  { label: 'Upstairs is barely cooling', message: 'The upstairs AC is barely cooling.', railTitle: 'Upstairs AC weak' },
];

const URGENCY_REPLIES = {
  urgent: 'Active leak right now. Need someone today.',
  soon: 'Slow leak. Sometime this week is fine.',
  flexible: 'Just an annoyance. Whenever convenient.',
};

// ── Derived agent copy ──────────────────────────────────────────────────────

function urgencyAck(u) {
  const n = windowDays(u);
  if (n === 1) return "Then I'll ask for same-day quotes.";
  if (u === 'flexible') return `No rush, so I'll give them ${n} days to quote.`;
  return `Then a standard ${n}-day quote window.`;
}

function pickLine() {
  const pick = getContractor(LEADERS.bestOverallFit);
  const claims = [
    LEADERS.highestRated === pick.id && 'the highest rating',
    LEADERS.mostSimilarJobs === pick.id && 'the most jobs like this one',
  ].filter(Boolean);
  const p = pick.pronoun;
  const flagged = LEADERS.insuranceFlagged.map(getContractor)[0];
  const first = claims.length
    ? `${pick.short} is my pick: ${p.subject} ${p.plural ? 'have' : 'has'} ${claims.join(' and ')}.`
    : `${pick.short} is my pick: the best overall fit.`;
  return flagged
    ? `${first} ${flagged.short}'s insurance renewal is pending, so check ${flagged.pronoun.possessive} row first.`
    : first;
}

function compareLine() {
  const best = getContractor(LEADERS.bestOverallFit);
  const inside = CONTRACTORS.filter((c) => benchmarkDelta(c.quote.total).position === 'inside');
  const lowest = LEADERS.lowestCompleteQuote === best.id;
  const reason = lowest && inside.length === 1 && inside[0].id === best.id
    ? 'complete, and the only one inside the local range'
    : lowest ? 'the lowest complete quote' : 'the best overall fit';
  return `All ${count(N)} are in, normalized to one scope. I'd book ${best.short}: ${reason}.`;
}

function bookedLine(c) {
  const { who, pronoun: p } = c.b;
  const backup = backupFor(c.booking)?.contractor;
  const arrive = `${p.subject} ${p.plural ? 'arrive' : 'arrives'}`;
  return `Booked. ${who} texts you ${REMINDER_MIN} minutes before ${arrive}${backup ? `, and ${backup.short} stays on standby` : ''}.`;
}

function finishLine(c) {
  const days = Math.round(compareIso(dayKey(c.b.slot.iso), TODAY) / 86400000);
  const span = days === 0 ? 'same day' : `in ${plural(days, 'day', 'days')}`;
  return `Closed out ${span} · ${N} pros vetted · ${N} quotes`;
}

// The visit day gets its own marker, except a same-day visit (still today).
const visitIsToday = (c) => isToday(c.b.slot.iso);

// The one contractor past their own reply norm gets the nudge, just before
// their quote lands.
const late = CONTRACTORS.find(
  (c) => c.replyWithinHours != null
    && compareIso(c.quote.receivedAt, addMinutes(TIMELINE.outreachSent, c.replyWithinHours * 60)) > 0,
);
const nudgePart = fmtDayPart(TIMELINE.baylineNudged).split(' ')[1]; // 'afternoon'

const arrivals = [...CONTRACTORS]
  .sort((a, b) => compareIso(a.quote.receivedAt, b.quote.receivedAt))
  .flatMap((c, i, all) => {
    const left = all.length - (i + 1);
    return [
      ...(late && c.id === late.id
        ? [
          agent(`${late.short} hasn't replied yet. I'll nudge ${late.pronoun.object} this ${nudgePart}, or swap in the next-best match if you'd rather not wait.`, { wait: 2400 }),
          receipt(`Nudged ${late.short}`, null, AT.baylineNudged, null, { wait: 1800 }),
        ]
        : []),
      receipt(`Quote in from ${c.short}`, fmtUsd(c.quote.total), clock(c.quote.receivedAt), stage('quotes', `col:${c.id}`), { wait: 2200 }),
      effect({ type: 'quote-in', id: c.id }),
      ...(i === 0 ? [effect({ type: 'stage', artifact: 'quotes' })] : []),
      left > 0
        ? status('waiting', `Waiting on ${plural(left, 'quote', 'quotes')}`, `${i + 1} of ${all.length} in`)
        : status('needs-you', 'Pick a slot and book', null, 'quotes'),
    ];
  });

// ── Receipt groups ──────────────────────────────────────────────────────────

const licensed = CONTRACTORS.filter((c) => c.license.ok).length;
const insured = CONTRACTORS.filter((c) => c.insurance.ok).length;
const flaggedId = LEADERS.insuranceFlagged[0] || null;

export const GROUPS = {
  verify: {
    head: 'Checked license, insurance, pricing',
    meta: (members) => plural(members.length, 'check', 'checks'),
  },
  booking: {
    head: 'Booked and added to calendar',
    meta: (members, c) => c.b.label,
    target: stage('schedule', 'when'),
  },
  closeout: {
    head: 'Closed out the job',
    meta: () => 'home file',
  },
};

// Insurance flag line under the verify group (one per flagged contractor).
export const flagFor = (id) => {
  const c = getContractor(id);
  return { text: `${c.short}: insurance ${c.insurance.label.toLowerCase()}`, target: stage('contractors', `insurance:${id}`) };
};

// ── Phases ──────────────────────────────────────────────────────────────────
// The sink thread reads as a list of phases. Each finished phase folds to one
// line (title, summary, time); only the latest stays open. `summary` shows on
// the folded line, so it states the outcome, not the activity.

const totals = CONTRACTORS.map((c) => c.quote.total);
// A phase on another day than today carries its weekday, so the folded
// times still read in order across the visit day.
const when = (iso) => (isToday(iso) ? clock(iso) : `${fmtDay(iso)} ${clock(iso)}`);

export const PHASES = {
  request: {
    title: 'Your request',
    summary: (c) => `${plural(INTAKE.photos.length, 'photo', 'photos')} · ${URGENCY[c.urgency].label.toLowerCase()}`,
    time: () => AT.kickoff,
  },
  scope: {
    title: 'Scope',
    summary: () => `${fmtUsd(SCOPE_TOTALS.total)} estimate · approved`,
    time: () => AT.scopeDrafted,
  },
  pros: {
    title: 'Contractors',
    summary: () => `${N} vetted · scope sent`,
    time: () => AT.prosMatched,
  },
  quotes: {
    title: 'Quotes',
    summary: () => `${N} in · ${fmtUsd(Math.min(...totals))}–${fmtUsd(Math.max(...totals))}`,
    time: () => AT.outreachSent,
  },
  booking: {
    title: 'Booking',
    summary: (c) => (c.b ? `${c.b.who} · ${c.b.label}` : ''),
    time: () => AT.booked,
  },
  closeout: {
    title: 'Close-out',
    summary: (c) => (c.recommended === 'yes' ? `Done · recommended ${c.b.who}` : 'Done'),
    time: (c) => (c.b ? when(c.b.completedAt) : ''),
  },
  next: {
    title: 'Next up',
    summary: (c) => (c.ladderChoice === 'yes' ? `${GUTTERS_PLAN.title} planned` : 'On your watchlist'),
    time: (c) => (c.b ? when(c.b.closedOutAt) : ''),
  },
};

// ── Scripts ─────────────────────────────────────────────────────────────────

const SINK_SHOTS = INTAKE.photos.map((p) => ({ label: p.label, sub: p.instruction }));
const SINK_PHOTOS = INTAKE.photos.map((p) => ({ photo: p.photo, label: p.label }));

// The status after each in-thread gate sits before it: the dock covers it
// while parked, and it is already in place the moment the dock is answered.
const sink = [
  phase('request'),
  marker(`Today, ${AT.kickoff}`),
  agent("What's happening at home?"),
  status('working', 'Reading your message'),
  gate('kickoff', kickoffDock(SINK_KICKOFFS)),
  user((c) => c.kickoff.message, { wait: 0 }),
  startTask,
  agent(`I need ${count(INTAKE.photos.length)} photos before I scope this.`),
  status('working', 'Looking at your photos'),
  gate('upload', uploadDock(SINK_SHOTS, 'Upload your photos')),
  user('Here they are.', { photos: SINK_PHOTOS, wait: 0 }),
  agent('From your photos: the P-trap slip nut is weeping, and water is pooling at the faucet base. Two separate fixes.', { readsPhotos: true, wait: 1800 }),
  effect({ type: 'photos-read' }),
  agent('How active is the leak right now? It sets how fast I push contractors.'),
  status('working', STATUS.scoping.label),
  gate('urgency', urgencyDock),
  effect((c) => ({ type: 'urgency', value: c.urgencyChoice })),
  user((c) => URGENCY_REPLIES[c.urgencyChoice || c.urgency], { wait: 0 }),
  agent((c) => `${urgencyAck(c.urgency)} Single-handle or two-handle faucet?`),
  user(`${cap(INTAKE.faucetType)}.`, { wait: 1400 }),
  agent(`Scoped as a ${JOB.scope}, about ${SCOPE.visitEstimate}. Here's the plan; nothing goes out without your OK.`, { plan: true }),
  status('working', 'Drafting the scope', stepMeta('scope')),
  gate('plan', planDock),
  receipt('You approved the plan', `${PLAN.length} steps`, AT.scoped, null, { wait: 200 }),
  phase('scope'),
  receipt('Drafted Scope of work', `${BENCHMARK.jobs} local jobs`, AT.scopeDrafted, stage('scope'), { wait: 1800 }),
  effect({ type: 'stage', artifact: 'scope' }),
  status('needs-you', 'Review the scope', null, 'scope'),
  agent(`The scope is on your board. Approve it and I'll find ${N} vetted plumbers.`),

  gate(GATES.approveScope),
  status('working', `Verifying ${N} local pros`, stepMeta('match')),
  receipt('You approved the scope', 'v1', AT.scopeApproved, stage('scope'), { mark: 'scope-approved', wait: 400 }),
  phase('pros'),
  receipt(
    'License records',
    licensed === N ? `all ${N} current` : `${licensed} of ${N} current`,
    AT.licensesChecked,
    stage('contractors', 'row:license'),
    { group: 'verify' },
  ),
  receipt(
    'Insurance',
    `${insured} of ${N} current`,
    AT.insuranceChecked,
    stage('contractors', flaggedId ? `insurance:${flaggedId}` : 'row:license'),
    { group: 'verify', flags: LEADERS.insuranceFlagged },
  ),
  receipt(
    'Local pricing',
    `${BENCHMARK.jobs} jobs, ${BENCHMARK.window.replace(/^last /, '')}`,
    AT.benchmarkChecked,
    stage('scope', 'totals'),
    { group: 'verify' },
  ),
  receipt(`Matched ${N} plumbers`, 'same criteria', AT.prosMatched, stage('contractors'), { mark: 'matched' }),
  effect({ type: 'stage', artifact: 'contractors' }),
  status('needs-you', `Send your scope to all ${N}`, null, 'contractors'),
  agent(pickLine()),

  gate(GATES.approveOutreach),
  status('waiting', `Waiting on ${N} quotes`, (c) => quoteDue(c.urgency).label),
  receipt('Sent your scope', (c) => `${N} plumbers, ${windowWords(c.urgency)}`, AT.outreachSent, stage('contractors', 'sent'), { mark: 'sent', wait: 400 }),
  phase('quotes'),
  ...arrivals,
  agent(compareLine()),
  receipt(`Compared ${N} quotes`, 'one scope', AT.quotesCompared, stage('quotes', 'range')),

  gate(GATES.book),
  status(
    'waiting',
    (c) => `Visit ${c.b.label}`,
    (c) => (c.b.changeDeadline ? `Change by ${c.b.changeDeadline}` : `Call ${c.b.who} to change`),
  ),
  phase('booking'),
  receipt((c) => `You booked ${c.b.who}`, (c) => c.b.label, AT.booked, (c) => stage('quotes', `book:${c.b.contractor.id}`), { mark: 'booked', wait: 400 }),
  receipt((c) => `Confirmed with ${c.b.who}`, (c) => c.b.window, AT.booked, stage('schedule', 'when'), { group: 'booking' }),
  receipt('Added to calendar', `reminder ${REMINDER_MIN} min`, AT.booked, stage('schedule', 'when'), { group: 'booking' }),
  effect({ type: 'stage', artifact: 'schedule' }),
  agent(bookedLine),
  phase('closeout'),
  marker((c) => c.b.dateLong, { when: (c) => !visitIsToday(c), wait: 6500 }),
  receipt(
    (c) => `${c.b.who} marked the visit done`,
    plural(CLOSEOUT_PHOTOS.length, 'photo', 'photos'),
    (c) => clock(c.b.completedAt),
    stage('completion', 'photos'),
    { wait: (c) => (visitIsToday(c) ? 6500 : 900) },
  ),
  effect({ type: 'stage', artifact: 'completion' }),
  status('needs-you', 'Close out the job', null, 'completion'),
  agent('Have a look, then close out the job on your board.'),

  gate(GATES.closeOut),
  status('done', 'Closed out', (c) => c.b.short),
  receipt('You confirmed the work', 'leak fixed', (c) => clock(c.b.closedOutAt), stage('completion', 'report'), { group: 'closeout', mark: 'closed', wait: 400 }),
  receipt(
    (c) => `You recommended ${c.b.who}`,
    (c) => `${recommendCount(c.b.contractor.id, { recommended: c.recommended, booking: c.booking })} total`,
    (c) => clock(c.b.closedOutAt),
    (c) => stage('contractors', `recs:${c.b.contractor.id}`),
    { group: 'closeout', when: (c) => c.recommended === 'yes' },
  ),
  receipt('Saved to your home file', null, (c) => clock(c.b.closedOutAt), null, { group: 'closeout' }),
  finish(finishLine),
  phase('next'),
  agent(`${GUTTERS_PLAN.title} is on your watchlist for fall. Want me to line it up the same way?`, { wait: 1800 }),

  gate('ladder', ladderDock),
  user(`Yes, plan the ${lower(GUTTERS_PLAN.title)}.`, { when: yes, wait: 0 }),
  effect({ type: 'gutters-planned' }, { when: yes }),
  receipt(`Planned ${lower(GUTTERS_PLAN.title)}`, GUTTERS_PLAN.short, (c) => clock(c.b.afterCloseOut(2)), stage('home', 'watch:gutters'), { when: yes }),
  agent(`Done. I'll line up gutter pros in ${GUTTERS_PLAN.long} and check with you first.`, { when: yes }),
  user('Not now.', { when: no, wait: 0 }),
  agent("It stays on your watchlist. I'll remind you before leaf season.", { when: no }),
];

const AC_SHOTS = [{ label: 'Outdoor condenser unit', sub: 'Wide enough to see the top fan and side fins' }];
const AC_PHOTOS = [{ photo: AC_TASK.photo, label: AC_TASK.label }];

// A new task opens at the sink demo's last scripted moment (the booking).
const fresh = [
  marker(`Today, ${AT.booked}`),
  agent("What's happening at home?"),
  status('working', 'Reading your message'),
  gate('kickoff', kickoffDock(AC_KICKOFFS)),
  user((c) => c.kickoff.message, { wait: 0 }),
  startTask,
  agent('I need one photo before I scope this.'),
  status('working', 'Looking at your photo'),
  gate('upload', uploadDock(AC_SHOTS, 'Upload your photo')),
  user('Here it is.', { photos: AC_PHOTOS, wait: 0 }),
  agent("From your photo: the coil fins are clogged, so the unit runs without cooling. I'll ping you here when the scope is ready.", { readsPhotos: true, wait: 1800 }),
  effect({ type: 'photos-read' }),
  status('working', AC_TASK.drafting),
];

const gutters = [
  marker((c) => (visitIsToday(c) ? `Today, ${clock(c.b.closedOutAt)}` : c.b.dateLong)),
  status('waiting', `Planned for ${GUTTERS_PLAN.long}`),
  agent(`${GUTTERS_PLAN.title} is planned for ${GUTTERS_PLAN.long}. I'll line up pros then and check with you first.`),
];

export const SCRIPTS = { sink, fresh, gutters };

// Entries before the first gate or effect are on screen from the first frame.
export const initialStep = (script) => {
  const i = script.findIndex((e) => e.type === 'gate' || e.type === 'effect');
  return i === -1 ? script.length : i;
};

export const WAIT = { marker: 0, agent: 1150, user: 650, receipt: 900, finish: 900 };
