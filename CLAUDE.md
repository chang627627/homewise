# Homewise — Claude Notes

A 2026 AI home command center prototype. Single-page React app, no backend.
Demonstrates a homeowner using an AI agent to find, vet, and hire home
contractors — empty state → intake → scope → contractor compare → quote
compare → booking → schedule.

**Live:** https://homewise-rust.vercel.app

## Design system source of truth

The design system has a name: **Hearth · v1**. The visual reference page lives
at [/designsystem](https://homewise-rust.vercel.app/designsystem).

**[DESIGN.md](DESIGN.md)** is the canonical reference for tokens, type scale,
component recipes, color roles, and voice. Read it before changing visuals.

This file (CLAUDE.md) covers **how it's built** — state machine, page flows,
focused-flow gates, mock data, deploy. DESIGN.md covers **how it should
look**. Don't duplicate token definitions here; update DESIGN.md instead.

### If you are an AI agent adding a new visual token, component, or pattern

**Do NOT add it to DESIGN.md directly.** All new visual additions go through
a pending-review queue gated by the owner.

Workflow:

1. Append a proposal to [src/data/design-pending.js](src/data/design-pending.js)
   with `id`, `type`, `name`, `description`, `proposedBy`, `proposedDate`, and
   an optional `preview`.
2. Do NOT modify DESIGN.md or the main sections of
   [src/pages/DesignSystemPage.jsx](src/pages/DesignSystemPage.jsx).
3. The proposal will surface at the top of `/designsystem` under "Pending
   review" with an "Awaiting your approval" pill.
4. The owner approves by manually moving the spec into DESIGN.md + the main
   DesignSystemPage section, then removing the entry from `design-pending.js`.

This applies to: new color tokens, new type roles, new component variants,
new hairlines, new textures, new patterns. It does NOT apply to bug fixes,
refactors, or applying existing tokens to new spots — those are normal changes.

### Red-flag checklist (run before opening a PR)

```bash
npm run design-check
```

Or manually grep your diff for:

- `bg-[#` / `text-[#` / `ring-[#` — raw hex in Tailwind arbitrary values. Use a token.
- `—` inside JSX text content. Em dashes are banned in user copy (allowed in `//` comments).
- `shadow-soft` / `shadow-card` / `shadow-glow` / `shadow-inset-soft` — banned, even though still defined in `tailwind.config.js`.
- `text-[Npx]` for type that has a named role (hero-l, hero-m, section-l, eyebrow…). Inline px is for one-off spots only.
- Hand-rolled button / pill / card classes outside `src/components/ui/`. Route through Button.jsx / Pill.jsx / Card.jsx.
- A fourth color role beyond sage / ember / sky2026. We have three. Don't add a fourth.
- A fourth surface tier beyond canvas / white card / ink-900. We have three. Don't add a fourth.

## Stack

- **Vite 5** + **React 18** + **Tailwind 3**
- **framer-motion** (page transitions, message reveals, confidence bars)
- **lucide-react** (icons)
- **Geist** (Google Fonts) — sans-only, no serif
- No backend, no API calls, no auth, no router (state-based "routing" in `App.jsx`)
- No tests
- Dev: `npm run dev` → http://localhost:5173
- Build: `npm run build` → `dist/`
- Deploy: `npx vercel --prod --yes`
- Vercel-ready: `vercel.json` rewrites `/(.*)` → `/index.html`

## Visual system (current)

**Type:** Geist everywhere via `.editorial` class. Variable weights 300–800.
Inter + system stack as fallback. No serif. Letter-spacing −0.028em on
editorial headings.

**Type scale (rebalanced for sans — never go bigger than 52px):**
- Hero L (Empty Overview): `36 / 44 / 52` (mobile / md / lg)
- Hero M (page headers, focused pages, populated Overview): `24 / 30`
- Section title L: `22 / 26`
- Big stat numbers: `28`
- Document totals/prices: `22 / 26`
- Contractor avatar initials: `15 / 18 / 22`
- Brand wordmark: `17`

**Color (warm canvas + sage primary + ember accent + sky2026 secondary):**
- `canvas` (warm off-white #F6F4EF), `canvas-soft`, `canvas-deep`
- `ink-900` (text), `ink-700`, `ink-500`, `ink-300`, `ink-200`, `ink-100`
- `sage` (primary, trust): 50–700 — primary buttons are `bg-ink-900` not sage
- `ember` (warning/attention): 50–500
- `sky2026` (info/secondary): 50–700

**Shadows: NONE.** All shadow utilities have been stripped. Cards rely on
`border-ink-100/80`, `ring-1`, and background contrast for separation. Old
custom shadow tokens (`shadow-soft`, `shadow-card`, `shadow-glow`,
`shadow-inset-soft`) are still defined in `tailwind.config.js` but unused.

**Content rules:**
- **No em dashes** (—) anywhere in user-facing copy. Use periods, commas, or
  colons instead. Comments may still contain them.
- **Sentence case** for headings.
- **Plain language** in AI narration (italics OK as quote markers).

## File map

```
src/
├── App.jsx                          ← root, page state machine + onboarding gate
├── main.jsx                         ← React entry
├── index.css                        ← Tailwind + custom utilities (.editorial, .glass, .dot-grid, .no-scrollbar)
├── assets/
│   ├── google.svg                   ← Google G logo (real multi-color, from Wikimedia)
│   └── apple.svg                    ← Apple logo (rendered white on dark via `invert`)
├── components/
│   ├── Sidebar.jsx                  ← left rail: brand, home selector, "+ New AI task", 3 nav items, user
│   ├── OverviewCards.jsx            ← stripped 4-up stat cards (label + number only, no charts/icons)
│   ├── ApprovalSection.jsx          ← single decision card (no longer used on Overview, kept as legacy)
│   ├── ActiveTasks.jsx              ← task cards w/ flow dots, AI is doing, Next, confidence + "Confirm visit" CTA
│   ├── ContractorMatch.jsx          ← featured Jason card (legacy — was on the cut Contractors page)
│   ├── QuoteIntelligence.jsx        ← 3 quote cards + dark AI rec card (legacy — was on the cut Quotes page)
│   └── ui/
│       ├── Card.jsx
│       ├── Pill.jsx                 ← status pills with optional live dot, icon, tones
│       ├── Button.jsx
│       ├── Confidence.jsx           ← animated confidence bar
│       ├── SectionHeader.jsx
│       ├── PageHeader.jsx           ← used on deep pages (Tasks, Schedule)
│       ├── BackBar.jsx              ← used on focused-flow pages
│       └── FlowProgress.jsx         ← 3-step pill row (Scope → Contractors → Quotes), clickable back-nav
└── pages/
    ├── OnboardingPage.jsx           ← 3-step Flow 1: signup → 5 questions → maintenance plan
    ├── OverviewPage.jsx             ← EmptyOverview + PopulatedOverview (state-aware, contextual hero)
    ├── TasksPage.jsx                ← Conversations list (state-aware)
    ├── SchedulePage.jsx             ← EmptySchedule + PopulatedSchedule (state-aware)
    ├── ConversationPage.jsx         ← full thread for one task; post-approval tail appended dynamically
    ├── IntakePage.jsx               ← ChatGPT-style intake (gated on Upload + Urgency clicks, reactive replies)
    ├── ScopePage.jsx                ← AI-generated scope (no 92% number — killed per testing)
    ├── ContractorComparePage.jsx    ← side-by-side 3 contractors + showcase drawer + recommendation row
    ├── QuoteComparePage.jsx         ← apples-to-apples + availability windows + slot picker + contact drawer
    └── CompletionPage.jsx           ← Flow 3 close-out: confirm work + photo opt-in + binary recommend
```

**Deleted, do not recreate:** `ApprovalsPage.jsx`, `ContractorsPage.jsx`,
`QuotesPage.jsx`, `DocumentsPage.jsx`, `WarrantiesPage.jsx`,
`HomeMemory.jsx`, `AgentPanel.jsx`, `AgentTimeline.jsx`, `CommandBar.jsx`,
`Header.jsx`. They were duplicate scaffolding or belonged to abandoned
patterns.

## State machine (lives in App.jsx)

Seven pieces of app state drive the entire UX:

| State | Type | Trigger | Effect |
|---|---|---|---|
| `hasOnboarded` | bool | `OnboardingPage` `onComplete` callback | when `false`, App returns the onboarding flow **before** the main layout renders. Refresh resets to `false`. |
| `page` | string | sidebar click, CTA click | which page renders |
| `conversationId` | string | task card click → `onNavigate({ page: 'conversation', conversationId: 'sink' })` | which thread to show in ConversationPage |
| `hasStartedFirstTask` | bool | navigating to `scope` | empty → populated everywhere |
| `decisionHandled` | bool | per-contractor approve on Quote Compare | pending → approved everywhere |
| `scheduledSlot` | string | passed alongside `decisionHandled` from Quote Compare (e.g. `"Fri 2 PM"`) | drives the "Scheduled · X" pill copy + active task description |
| `jobCompleted` | bool | submit on `CompletionPage` | active task flips from "Scheduled" → "Completed"; Contractor Compare shows "+1 you" badge on Jason |
| `recommended` | `'yes'` \| `'no'` \| null | passed alongside `jobCompleted` from `CompletionPage` | drives recommendation row count bump + post-completion hero copy |
| `photosShared` | bool | photo-approval toggle in CompletionPage | future-use (the consent flag); doesn't currently drive visible UI |

`handleNavigate(id, opts)` accepts either a string id OR an object
`{ page, conversationId?, decisionHandled?, scheduledSlot?, jobCompleted?, recommended?, photosShared? }`.

**No reset button.** This is treated as a real product. To reset state,
refresh the page.

## Pages and routing

`OnboardingPage` is **outside** the page map — it short-circuits in
App.jsx when `hasOnboarded === false` and renders its own full-viewport
layout (no sidebar). After `onComplete`, the main app layout takes over.

State-based pseudo-routing via `pageMap` in App.jsx:

| Key | Component | Sidebar nav | Notes |
|---|---|---|---|
| `overview` | OverviewPage | ✓ | Empty + Populated states; populated has state-aware hero |
| `tasks` | TasksPage | ✓ ("Conversations") | Empty + Populated states |
| `schedule` | SchedulePage | ✓ | Empty + Populated states |
| `intake` | IntakePage | hidden | Focused flow; gated on user clicks |
| `scope` | ScopePage | hidden | Focused flow |
| `contractor-compare` | ContractorComparePage | hidden | Focused flow + showcase drawer |
| `quote-compare` | QuoteComparePage | hidden | Focused flow + contact drawer |
| `conversation` | ConversationPage | hidden | Focused flow |
| `completion` | CompletionPage | hidden | Focused flow; entry via "Confirm visit complete" on Overview |

`fullViewportPages = new Set(['intake', 'conversation'])` — these pages hide
the page footer so the chat input pins to the viewport bottom without page
scroll competing.

**Footer pinned to viewport bottom:** `<main>` is `flex flex-col`, content
wrapped in `flex-1`, footer is the last child. Short pages still push the
footer to the screen edge.

## Demo flow (the case-study story)

```
[ Onboarding · screen 1 — Sign-up ]
  Brand mark top-left. Centered.
  Eyebrow: "— GET STARTED"
  H1: "Start with your home. / Take it from there."
  Sub: "Two minutes. Then your home's first plan, ready when you are."
  CTAs: Continue with Google (white, real Google G) · Continue with Apple
        (dark, white Apple via .invert) · "OR" divider · Continue with email
  Trust line: "🛡 No contractor sees your home until you ask."
  Terms below.
        │
        ▼  click any SSO/email
[ Onboarding · screen 2 — Profile (5 questions, all pre-filled for demo) ]
  Back link top-left ("← Back"). Step 1 of 2 indicator top-right.
  Eyebrow: "QUICK SETUP · ABOUT A MINUTE"
  H1: "Five questions, then we plan."
  Q01 Home type (chip-select, "House" pre-selected)
  Q02 Year built (chip-select, "1980–2000" pre-selected)
  Q03 Where you live (text address + ZIP — "124 Maple St, Oakland, CA" + "94609")
  Q04 Outdoor features (multi-select chips, Yard + Mature trees pre-selected)
  Q05 Major systems (multi-select chips, Central HVAC + Water heater pre-selected)
        │
        ▼  click "Show my maintenance plan"
[ Onboarding · screen 3 — Maintenance plan ]
  Back link "← Edit my answers". Step 2 of 2 indicator.
  Eyebrow: "YOUR HOME'S BASELINE PLAN"
  H1: "Here's what's on your radar."
  Sub: "Homewise will quietly track these, ping you ahead of seasonal windows,
        and find pros when you're ready."
  4–5 maintenance items, each tagged with a "From: [source]" pill so the
  user can see why each item is on the list (HVAC service · From Central HVAC,
  Gutter cleaning · From Yard + Mature trees, Smoke + CO test · Standard
  for every home, etc.).
        │
        ▼  click "Continue to your home"  →  hasOnboarded = true
[ Empty Overview ]
  Hero: "Your AI is ready. Tell it what happened."
  + Big "Start your first task" CTA
  + 4-step "How it works" grid
  Sidebar: Overview · Conversations (no badge) · Schedule (no badge)
        │
        ▼  click CTA OR sidebar "+ New AI task"
[ Intake (chat) ]
  ChatGPT-style: messages scroll inside the card, input pinned at bottom,
  page footer hidden so nothing competes for scroll. **Input bar is
  permanent** — never replaced by a CTA dock.
  Conversation auto-plays but **gates on real user clicks** at 2 points:
    - User describes leak (auto)
    - AI thinking → photo request (3 specific shots, with "Upload photos"
      button) → **GATE: waits for user to click Upload photos**
    - User reply "Sending the first two" (auto) → photos block → AI thinking
    - Urgency picker (3 options) → **GATE: waits for user to click an option**
    - User reply text is **dynamic** based on which urgency was picked
      (e.g., "Active leak right now. Need someone today." vs. "Slow leak.
      Sometime this week is fine.")
    - AI clarifying questions (panel photo + handle type)
    - User reply + final photo (auto)
    - AI scope summary message + "Scoped as" summary card
  Once `done`, two suggested chips appear in the chat: white "I have more
  to add" (focuses input) and dark "Generate scope of work" (the actual
  advance). Suggested-prompt pattern; input bar stays put.
        │
        ▼  click "Generate scope of work"  →  hasStartedFirstTask = true
[ Scope ]                                     (Sidebar badges appear: Conversations 1 · Schedule 1)
  Full-width layout (NOT centered max-w-4xl — that read as misaligned vs.
  the other deep pages). BackBar + FlowProgress + header all span the page;
  only the document <article> stays narrow centered at max-w-4xl mx-auto.
  FlowProgress: 1 Scope of work · 2 Contractors · 3 Quotes · Then book
  AI-generated disclaimer banner.
  Document body: 01 Diagnosis (eyebrow now "Most likely cause", no 92%
  confidence number — killed per Round 1 testing), 02 Job summary,
  03 Itemized labor, 04 Materials, 05 Exclusions, 06 Unit-priced add-ons,
  07 Acceptance criteria.
        │
        ▼  click "Approve & find contractors"
[ Contractor Compare ]
  BackBar + FlowProgress (step 2). Header stacked vertically with CTAs
  (Reject all 3 · Show 3 different · Approve all 3 & send scope).
  Global ember "Heads up" note above the matrix when any contractor has
  flagged insurance (lists names: "See Quickfix's row before booking.")
  Column headers: Jason's card has sage-50/50 fill + "AI top match" pill;
  Quickfix's card has ember "Insurance flagged" pill mirroring Jason's.
  Comparison matrix rows: Rating · Years licensed · License · Insurance
  (Quickfix wrapped in ember-tinted card with bold FLAGGED) · Relevant
  past work · Permit history · Earliest availability · **Recommended
  by Homewisers** (count chip or "New to Homewise" if <3; tap opens
  showcase drawer).
  Jason's column is tinted **continuously sage-50/40** through every row
  via aiPickIndex prop on CompareRow (lg:-my-4 lg:py-4 padding trick
  so tint bleeds through divides).
  Single shared "Why we picked these three" rationale card below matrix.

  Showcase drawer (opens on tap of a "Recommended by N Homewisers" chip):
    Portal'd to document.body to escape the App-level motion.div
    transform's containing block; bg-white, body scroll locked with
    paddingRight compensation for the disappearing scrollbar.
    Header: contractor avatar + "RECOMMENDED BY N HOMEWISERS" eyebrow.
    Cards: past recommended jobs — tinted before/after photo + job
    category + scope summary + completion date + privacy footer
    ("No names or addresses appear").
        │
        ▼  click "Approve all 3 & send scope"
[ Quote Compare ]
  BackBar + FlowProgress (step 3). Header stacked vertically with status
  pills + plain-language summary card.
  3 quote total cards (Jason "AI pick" with sage outline).
  Matrix: line-by-line scope deviations + outlier flags ($75 fee, missing
  materials, BETTER 1-yr warranty).
  Totals row.
  **Your availability** picker row (4 toggle chips: Weekday AM/PM, Evenings,
  Weekend — defaults to Weekday PM + Weekend).
  **Pick a slot & approve** row (per contractor):
    - Filtered slot chips (only the contractor's slots whose window
      matches the user's selected windows — "No overlap with your
      availability" if none match)
    - Secondary white "Ask [Name] before booking" button **above** the
      Approve CTA (was a small ghost link below, missed per testing)
    - Primary "Approve [Name] · [picked slot]" button — Jason ink-900,
      Bayline + Quickfix white outline. Disabled if no overlap.

  Contact drawer (opens on "Ask [Name] before booking"):
    Portal'd, bg-white, body-scroll locked.
    Header: contractor avatar + rating + response time.
    About: short bio.
    Direct contact: prominent ink-900 click-to-call card with phone number.
    Things to ask: static numbered list of 4 reference questions (NOT a
    textarea; phone communication stays on the phone).
        │
        ▼  click "Approve Jason · Fri 2 PM"  →  decisionHandled = true, scheduledSlot
[ Back to Overview — POPULATED · pre-completion ]
  Eyebrow: "GOOD MORNING, MARA · APRIL 23"
  Hero is **state-aware contextual** (was "Your AI is on it / You decide
  what matters" — that's brand wallpaper).
    - Pre-decision: "1 decision today. / Pick your plumber."
    - Post-decision: "Fri 2 PM with Jason. / Homewise is watching for changes."
  "AT A GLANCE · FOR YOUR ACTIVE JOB" eyebrow above the 4-up stat strip:
    Task in motion · 1
    Decision today / Decisions waiting · 1/0 (ember/sage tone)
    Quotes received · 3
    Contractors verified · 3
  Active task card shows "Scheduled · Fri 2 PM" pill, flow all done except
  Scheduled now active, AI IS DOING "Scheduled with Jason · monitoring",
  NEXT FROM YOU "Visit confirmed · Fri 2 PM", confidence 96%, plus a new
  dark "Confirm visit complete" CTA at the bottom of the card.
        │
        ▼  click "Confirm visit complete" on the active task card
[ Completion ]
  BackBar "Back to overview".
  Eyebrow: "FINAL STEP · CLOSE OUT THE JOB"
  H1: "Jason marked the visit complete."
  3 stacked sections:
    01 Confirm work is done — 3 cards (Yes, it's done / Not yet / Something's
       wrong; "Yes" pre-selected for demo)
    02 Approve photos for Jason's showcase — 3 "after" thumbnails + opt-in
       toggle (default off per Flow 3 spec)
    03 Would you recommend Jason — binary Yes / No (no stars, no comment)
  Submit "Close out the job" → jobCompleted = true + recommended.
        │
        ▼  back to Overview (now POPULATED · post-completion)
  Hero: "Job closed out. / You recommended Jason. Homewise is keeping a quiet eye."
  Active task card pivots: "Completed" pill, "AI is doing: You recommended
  Jason · He's now Recommended by 13 Homewisers", sage-tinted
  "Recommendation sent" badge inside the card.
  On Contractor Compare, Jason's recommendation row now shows "13" with
  a "+1 YOU" badge.
        │
        ▼  click active task card
[ Conversation ]
  Full thread:
    intake (problem → photos → urgency → clarifying → final photo)
  + AI actions (license, insurance, benchmark, outreach)
  + Jason quote arrives → inline quote artifact card
  + AI proactive side-by-side ("Quick side-by-side now that the others
    are in...") — NO fake user question; the side-by-side is unprompted
  + Inline quote-compare artifact card
  + [ post-approval tail when decisionHandled is true: ]
    action "You approved Jason · Friday 2 PM" (was a fake typed message,
    now an action entry per testing — users don't actually type approval)
    action "Booking confirmed with Jason Plumbing Co."
    action "Added to your calendar"
    AI "Booked. Jason will text you 30 min before…"
    live indicator "Confirmed · Friday April 25, 2:00 PM"
  + Side rail: status pill, artifacts (scope/contractors/quotes),
  suggested next swaps from approval-themed to scheduling-themed.
        │
        ▼  click Schedule in sidebar
[ Schedule ]
  Week strip with Wed 23 (today) highlighted dark, Friday 25 dotted sage.
  Single visit card: "Friday · April 25 · 2:00 PM · Confirmed · Booked"
  with Reschedule / Message Jason / Cancel actions.
  Pre-approval state shows ember "Pending your approval" with CTA to
  the quote page instead.
```

## Design decisions (the canon)

### Visual

- **Sans-only.** Geist via `font-family` on body and `.editorial` class.
  No serif anywhere. The mix-with-Instrument-Serif version was tried and
  rejected — sans is more current and matches the AI-product moment.
- **No shadows.** Cards rely on borders + ring + background contrast.
  Stripped via sed across all jsx files. This is intentional flatness.
- **No floating sidebar.** Sidebar is edge-flush left, square outer corners,
  border-r only on the inside.
- **Type scale capped.** Sans at 76px reads as shouty. Largest editorial
  size in the app is 52px (Empty Overview hero). Most page heroes are
  24/30px.
- **One typeface, one personality.** Geist's slightly geometric character
  + humanist exits (l tail, t curve, two-story a) does the work.

### IA / structure

- **Two-column shell** (sidebar + main). No persistent right AI panel.
  Tried it three times — kept losing to the "two chats" problem on intake
  and the "third dashboard" problem everywhere else.
- **Sidebar = 3 nav items + 1 CTA.** Overview, Conversations, Schedule.
  Plus "+ New AI task". No reset button — treat as real product.
- **State-aware pages.** Overview, Tasks, Schedule all have empty +
  populated variants driven by `hasStartedFirstTask`. The dashboard
  literally fills in as the user completes their first task.
- **Each task is a conversation.** ConversationPage is the natural home
  for any ongoing job. ActiveTasks card → click → ConversationPage with
  the full thread + inline artifact cards linking back to scope/contractor/
  quote pages.
- **Focused flow pages have stacked headers.** Eyebrow → title →
  description → CTAs in a horizontal row underneath. Never split
  left/right.
- **CTAs appear once per page.** No top + bottom duplication. Per-contractor
  approve buttons in Quote Compare matrix are the only exception (they're
  per-column decisions, not duplicates of a top action).
- **Back buttons follow the flow chain.**
  - Intake → Overview
  - Scope → Intake
  - Contractor Compare → Scope
  - Quote Compare → Contractor Compare
  - Conversation → Conversations (Active tasks)

### Tradeoffs we explicitly chose

- **State-aware empty/populated** over always-populated. Logical
  coherence beats demo-friendliness. A first-time visitor doesn't see
  "1 decision waiting" before they've done anything.
- **Per-contractor approve buttons** over a single top "Approve" CTA.
  The Quote Compare decision is "which of three" — that's inherently
  per-column.
- **Light AI cards** ("Why we picked these three", "Plain-language summary")
  over dark gradient cards. Matches the no-shadow flat aesthetic.
- **Schedule as the third nav item** over Documents/Warranties/Contractors.
  Schedule is genuinely different (calendar/time-axis view) and closes
  the loop on Step 7 of the PDF spec. Documents/etc would be thin
  wrappers.

## Round 1 testing changes (n=4, May 2026)

Trust hypotheses T1–T5 tested with 4 homeowners. Synthesis surfaced 3
universal/near-universal frictions; each fix below maps to a specific
finding:

### Contact contractor before booking (4/4 — universal)
- New "Ask [Name] before booking" button on Quote Compare, **above** the
  Approve CTA, sized equal to it (h-10, ring-1, phone icon). Was
  originally a small ghost link below approve and got missed.
- Click opens portal'd contact drawer (`bg-white`, body-scroll locked,
  flush right edge) with: contractor avatar + rating + response time,
  bio, click-to-call card with phone number (primary `bg-ink-900`
  card), and a static numbered list of "things to ask when you call."
- **No in-app messaging.** Phone communication belongs on the phone,
  not threaded into the conversation page. Drawer is contact info +
  call action + reference questions. Don't add a textarea.

### Confidence score killed entirely (3/4 questioned 92%)
- Testing said the score "isn't carrying its weight." Tried sourcing
  it inline ("based on photo match…"), then a step-by-step "How
  Homewise got here" panel. Both added chrome.
- **Final move: removed the score.** Diagnosis eyebrow on Scope is
  now `Most likely cause` (was `Primary diagnosis · 92% confidence`).
  The diagnosis content + local benchmark range already do the trust
  work the number wasn't doing.

### Insurance flag — three layered signals (3/4)
- Global ember note above the matrix listing flagged contractors by
  name ("Heads up. 1 of 3 contractors has flagged insurance. See
  Quickfix's row before booking.")
- Column-header ember pill under Quickfix's name (parallels Jason's
  "AI top match" sage pill).
- Insurance matrix cell wrapped in an ember-tinted card with bold
  uppercase FLAGGED label (vs. plain inline text).
- Earlier full-banner attempt was "ugly as fuck" per user. Three
  smaller signals reinforce without dominating.

### Sage tint on AI top match column (Banks's "paid to be promoted")
- The "AI TOP MATCH" pill alone wasn't pulling the eye. Banks
  assumed Jason was paid to be promoted because the visual hierarchy
  didn't reinforce the label.
- Jason's whole column on Contractor Compare is now tinted
  `bg-sage-50/40` continuously from header through every matrix row,
  with `lg:-my-4 lg:py-4` padding tricks so the tint bleeds through
  row dividers and reads as one continuous column.
- `aiPickIndex` is computed once and passed to every `CompareRow`.

### Overview cards stripped to "at a glance" strip
- Was: 4-card grid with sparklines, icon chips, hover arrows, delta
  sublines, and big numbers. Felt like a SaaS analytics dashboard.
- Now: 4 minimal cards — just label + big number (+ optional one-line
  sub on the action card). No sparklines, no icons, no hover arrows.
- Above the grid: `AT A GLANCE · FOR YOUR ACTIVE JOB` eyebrow to
  scope what these counts mean (state, not analytics — the active
  task is the only "job," not a 30-day rollup).

### Populated Overview hero made state-aware
- Was: static `Your AI is on it. / You decide what matters.` (brand
  wallpaper that worked on Empty Overview, redundant on Populated).
- Now: contextual to state.
  - Pre-decision: `1 decision today. / Pick your plumber.`
  - Post-decision: `[scheduledSlot] with Jason. / Homewise is
    watching for changes.`
  - Post-completion: `Job closed out. / [recommendation status].`
- Same Mobbin pattern as Rox's "Here's your focus for today,"
  Base44's "Pick up where you left off."

### Sign-up trust line tightened
- Was: `End-to-end encrypted · No contractor sees your home until
  you ask` — two claims in one line, encryption is technical noise
  for this audience.
- Now: `No contractor sees your home until you ask` — single claim,
  the actual emotional hook.

## What was tried and rejected (do NOT redo)

- Persistent right AI panel on every page → two-chat conflict on intake;
  duplicated info; felt like 3 dashboards stacked.
- Approvals/Contractors/Quotes/Schedule(old)/Documents/Warranties as
  separate sidebar items → all were thin wrappers around single components.
- Empty state replacing populated dashboard → cut the harder design work
  (density, hierarchy). Now solved with state-machine instead.
- "Needs your approval" section on Overview → triplicated by stat card
  + active task card + sidebar badge.
- Camera button in chat input → laptops don't take photos directly;
  paperclip handles uploads.
- Per-contractor "Why we picked them" blurbs on Contractor Compare →
  PDF spec wants ONE shared rationale framing tradeoffs.
- Floating sidebar with rounded corners and outer margin → too "early
  2024 SaaS." Edge-flush is more honest.
- Big editorial serif at 76px → moved to sans, sans at that size is
  shouty.
- Em dashes — in user copy → replaced with periods/commas/colons.
- Reset demo button → real product, refresh to start over.
- Auto-trigger `decisionHandled` when navigating to contractor-compare →
  was wrong, decision happens on quote-compare's approve buttons.

## PDF spec (Flow 2 reference) — what's in the focused screens

The 4 focused-flow pages were built to a product spec PDF the user
provided ("Flow 2: Reactive Problem-Solving — MVP Loop"). Key
spec-driven elements:

- **Intake**: AI proactively requests specific photos with shot guidance
  ("Under the sink — the P-trap area"). AI captures urgency signal
  ("active leak now / slow leak this week / just an annoyance"). Done in
  this app via the `requestShots` field on agent messages and the
  `agent-urgency` message type.
- **Scope**: includes Diagnosis (primary + alternative), Unit-priced
  add-ons (base scope + per-unit pricing for hidden uncertainty),
  Acceptance criteria, qualitative confidence (HIGH/MEDIUM/LOW alongside
  %), explicit "AI-generated, please review" disclaimer, recommendation
  to "proceed to quotes" or "book in-person diagnostic".
- **Contractor Compare**: criteria are Rating (with reviews), Years
  licensed, License/Insurance status, Relevant past work (X verified
  jobs of this type · 12 mo, pulled from permit records), Permit
  history, Earliest availability. ONE shared "Why we picked these
  three" rationale framing tradeoffs (not 3 separate blurbs).
- **Quote Compare**: line-level scope deviations + outlier flags. Plain-
  language summary card. Per-contractor approve actions in the matrix.

## Onboarding (Flow 1)

Per the Flow 1 PDF — but trimmed to avoid repeating Empty Overview
content. Three screens, all in `OnboardingPage.jsx`:

1. **Sign-up** — brand mark + headline + 3 CTAs (Google / Apple /
   email). Google G uses the real multi-color Wikimedia SVG; Apple
   logo is the black silhouette flipped white via Tailwind `invert`
   on a dark button. Trust line is **just** the privacy promise
   ("No contractor sees your home until you ask") — encryption
   claim was dropped as technical noise. No "Sign in" link (the
   demo is single-flow).
2. **Profile** — 5 questions, **all pre-filled for the demo**:
   home type (House), year built (1980–2000), address + ZIP
   (124 Maple St, Oakland, CA / 94609), outdoor (Yard + Mature
   trees), systems (Central HVAC + Water heater). Back link to
   sign-up; Step 1 of 2 indicator.
3. **Maintenance plan** — derived from the profile via
   `buildMaintenance(profile)`. Each item carries a `source` field
   ("From Central HVAC", "From Yard + Mature trees", "Standard for
   every home") so the connection between Step 2's selections and
   Step 3's items is visible — users wondered "I picked 2, why
   does this show 4?" before the source pills were added. Back
   link reads "Edit my answers"; Step 2 of 2 indicator.

**Photos are NOT collected in onboarding.** The first AI task's
intake already collects photos; asking again would be repetitive.

## Flow 3 — Job completion, recommendation, showcase

After Jason finishes the visit, the homeowner closes the loop.
Entry point: a "Confirm visit complete" CTA inside the Overview's
active task card, visible when `decisionHandled && !jobCompleted`.

`CompletionPage.jsx` is one screen with three numbered sections per
the Flow 3 PDF:

- **01 Confirm work is done** — Yes / Not yet / Something's wrong.
  Only "Yes" is wired for the demo; the other two would stub to
  reschedule and ops escalation respectively.
- **02 Approve photos for Jason's showcase** — 3 contractor-uploaded
  "after" thumbnails + opt-in toggle (default OFF per the design
  principle in the PDF; "Privacy default is OFF for photo approval.
  Never flip the default.").
- **03 Would you recommend Jason** — binary Yes / No. No stars, no
  comment box, no follow-up granularity. The count is the signal.

Submit fires `onNavigate({ page: 'overview', jobCompleted: true,
recommended, photosShared })`. Overview hero pivots to post-completion
copy; active task card flips to "Completed" with a sage
"Recommendation sent" badge; Contractor Compare's "Recommended by
Homewisers" row bumps Jason's count by 1 with a sage "+1 you" badge.

**Showcase row on Contractor Compare** uses `CellRecommend` to render
the count chip (or "New to Homewise" when `recommendCount < 3` — the
cold-start threshold per Flow 3 spec, not hardcoded). Tap opens the
`ShowcaseDrawer` listing past recommended jobs with category +
before/after photo + scope summary + completion date. No homeowner
names or addresses appear, per spec.

## Quote Compare availability overlap

The Quote Compare page is more than the apples-to-apples matrix — it
also closes the scheduling loop. Per testing feedback ("Friday 2 PM
is bad UX, I need to find a time that works for both of us"), the
page has a two-step decision area below the matrix:

- **Your availability** (4 toggle chips: Weekday AM, Weekday PM,
  Evenings, Weekend). Default selection: Weekday PM + Weekend.
- **Pick a slot & approve** (per-contractor column):
  - **Slot chips** — filtered to overlaps between the contractor's
    offered slots and the user's selected windows. "No overlap
    with your availability" empty state when nothing matches; the
    Approve button is disabled.
  - **Ask [Name] before booking** — secondary white button **above**
    Approve. Opens the ContactDrawer (bio + click-to-call card +
    static reference questions).
  - **Approve [Name] · [picked slot]** — primary CTA. Jason is
    `bg-ink-900` (the AI pick); others are white outline.

The picked slot is passed to App via `onNavigate({ ...,
scheduledSlot: sel.time })` and flows through to the active task
card's "Scheduled · X" pill, the conversation thread's booking
action, and the Schedule page's visit card.

## Operations: Figma capture, Mobbin research, Vercel auto-deploy

- **Figma capture script** is left in `index.html` (`<script src="
  https://mcp.figma.com/mcp/html-to-design/capture.js" async>`)
  per Figma MCP guidance ("Leave the capture script in the HTML
  unless the user explicitly asks you to remove it"). It's a no-op
  unless the URL hash includes `#figmacapture=…`, so it's safe
  in production. Used to capture localhost screens into a portfolio
  Figma file via the `mcp__figma__generate_figma_design` tool.
  Chrome viewport for captures: `osascript -e 'tell application
  "Google Chrome" to set bounds of front window to {0, 0, 1450,
  1021}'` → 1440×900 inner viewport (1450 accounts for scrollbar
  width).
- **Mobbin MCP** is registered for this project
  (`https://api.mobbin.com/mcp`). Use `mcp__mobbin__search_screens`
  for design-pattern research when stuck on a specific UX problem
  (e.g., "data widget too complicated → search comparison/dashboard
  patterns"). Don't do screen-by-screen Mobbin passes — testing-
  driven changes win over pattern matching.
- **Vercel auto-deploy** is connected to the GitHub repo
  (`chang627627/homewise`). Every push to `main` triggers an
  auto-build + deploy to `homewise-rust.vercel.app` within ~30s.
  Main branch is protected (PRs required for non-admins); the
  admin (chang) can bypass and push directly. Teammate
  `radiiiianttt` has write access via collaborator invite.

## Component conventions

- **Pill**: `<Pill tone="sage|ember|sky|neutral|soft" icon={X} live>` —
  `live` adds a pulsing dot.
- **Confidence**: `<Confidence value={92} label="..." size="md|lg">` —
  animated bar, color-coded by threshold (≥85 sage, ≥65 ember, else ink).
  *Note: the 92% on Scope was killed; this component is still used on
  the active task card and inside ConversationPage's side rail.*
- **BackBar**: focused-flow pages use this; `onBack` prop, `label`,
  optional `context` eyebrow.
- **FlowProgress**: 3-step pill row (Scope → Contractors → Quotes) +
  trailing "Then book" hint. `current` prop picks which step is active;
  completed steps are clickable and call `onNavigate`. Used on all three
  Flow 2 focused-flow pages.
- **PageHeader**: deep-page intro; `eyebrow`, `title`, `description`,
  optional `trailing` pill.
- All page components accept `onNavigate(id, opts?)` for navigation.
- `onNavigate` accepts either a string `id` or an object
  `{ page, conversationId?, decisionHandled?, scheduledSlot?,
    jobCompleted?, recommended?, photosShared? }`.

### Drawer pattern (Showcase + Contact)

Both right-side drawers (ShowcaseDrawer on Contractor Compare,
ContactDrawer on Quote Compare) follow the same three rules:

1. **Portal to `document.body`** via `createPortal`. The App-level
   `motion.div` page-transition wrapper has a `y` transform which
   creates a containing block for any `position: fixed` descendant.
   Without portaling, the drawer attaches to the padded main column
   instead of the viewport corner.
2. **Body scroll lock** on mount, restored on unmount, with
   `padding-right: ${scrollBarWidth}px` compensation so the page
   underneath doesn't shift when the scrollbar disappears.
3. **`bg-white` panel on `bg-canvas` page** so the drawer visually
   distinguishes itself from the warm off-white page background.

```js
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
```

The animation is `motion.aside` sliding from `x: '100%'` to `x: 0` over
350ms ease-out. Reuse this pattern for any future right-side panel.

## Custom Tailwind (still defined, mostly unused now)

- **Fonts**: `font-serif` / `editorial` class → all aliased to Geist.
- **Shadows**: `shadow-soft`, `shadow-card`, `shadow-glow`,
  `shadow-inset-soft` — defined but never used (we stripped all shadow
  utilities).
- **Backgrounds**: `bg-grain` (SVG noise), `dot-grid` class (CSS
  background pattern, used on dark gradient cards).
- **Animations**: `animate-pulseDot` (1.8s pulsing), `animate-shimmer`
  (2.4s linear).
- **No-scrollbar utility**: `.no-scrollbar` (used on horizontally-
  scrolling chip rows).

## Mock data

All page-level data is hardcoded inline at the top of each page or
component file. Three conversation datasets (`sink`, `hvac`, `warranty`)
live in `ConversationPage.jsx`. The `decisionHandled` post-approval tail
is appended dynamically to the `sink` conversation only (other two
conversations don't have a post-approval state because the demo only
exercises sink).

The trimmed app shows just one active task (Kitchen sink leak). All
other tasks (HVAC, water heater warranty) were removed from the demo
data — though the conversation datasets still contain HVAC and warranty
threads for completeness.

## How to verify the demo end-to-end

1. `npm run dev` → http://localhost:5173
2. Land on **empty Overview**: hero, "Start your first task" CTA, 4-step
   How It Works grid. Sidebar: Overview / Conversations / Schedule
   (no badges).
3. Click "Start your first task" → **Intake**. Conversation auto-plays in
   ~10 sec.
4. Click "Generate scope of work" → **Scope** (`hasStartedFirstTask = true`,
   sidebar badges appear).
5. Click "Approve & find contractors" → **Contractor Compare**.
6. Click "Approve all 3 & send scope" → **Quote Compare**.
7. Click "Approve Jason" (the AI pick, dark button) → back to Overview
   (`decisionHandled = true`).
8. Overview is now POPULATED with post-approval state: stats updated,
   active task card shows "Scheduled · Friday 2 PM".
9. Click sidebar **Schedule** → see the confirmed Friday Apr 25, 2 PM
   visit on the week strip + visit card.
10. Click sidebar **Conversations** → click the kitchen sink card →
    **Conversation** with the full thread including the post-approval
    booking confirmation tail.
11. Refresh the page to reset.

## Deploy

```bash
npx vercel --prod --yes
```

Project: `homewise` on Vercel scope `changs-projects-4800cbf2`.
Production URL: https://homewise-rust.vercel.app

`vercel.json` has SPA rewrites so any deep link still serves index.html
(though the app uses internal state-based routing, not URL routing).

## What NOT to do (lessons from many iterations)

- Don't add more sidebar nav items beyond the current 3. We've thrashed
  on this — three is the right number.
- Don't reintroduce the persistent right AI panel.
- Don't add empty `Approvals` / `Contractors` / `Quotes` / `Documents` /
  `Warranties` deep pages back. They were duplicates.
- Don't show "decision waiting" before the user has done anything (state
  machine handles this).
- Don't make every page a chat. Conversation lives in `IntakePage` (new)
  and `ConversationPage` (historical). Deep artifacts (scope, contractor
  compare, quote compare) are documents/tables, not chat.
- Don't add a TodoWrite for trivial single-edit tasks.
- Don't put em dashes (—) in user-facing copy.
- Don't bring back shadows.
- Don't use serif typefaces.
- Don't bring back the 92% confidence score on Scope. Testing
  killed it — the diagnosis content carries trust on its own.
- Don't add a textarea or send button to the contact drawer on
  Quote Compare. Phone communication stays on the phone. The
  drawer is contact info + call CTA + reference questions only.
- Don't reintroduce sparklines / icon chips / hover arrows / delta
  sublines on the Overview "at a glance" cards. Numbers are
  single-digit state, not analytics — they don't earn that chrome.
- Don't make the Populated Overview hero a static brand line. It
  has to be state-aware (decision today / scheduled / completed).
- Don't add "End-to-end encrypted" or other technical claims to
  the sign-up trust line. The audience cares about "no contractor
  sees your home until you ask," not crypto.
- Don't add a Reset demo button — refresh handles it.
