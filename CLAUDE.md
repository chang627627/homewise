# Homewise — Claude Notes

A 2026 AI home command center prototype. Single-page React app, no backend.
Demonstrates a homeowner using an AI agent to find, vet, and hire home
contractors — empty state → intake → scope → contractor compare → quote
compare → booking → schedule.

**Live:** https://homewise-rust.vercel.app

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
├── App.jsx                          ← root, page state machine
├── main.jsx                         ← React entry
├── index.css                        ← Tailwind + custom utilities (.editorial, .glass, .dot-grid, .no-scrollbar)
├── components/
│   ├── Sidebar.jsx                  ← left rail: brand, home selector, "+ New AI task", 3 nav items, user
│   ├── OverviewCards.jsx            ← 4 stat tiles (clickable to deep pages, decision-aware)
│   ├── ApprovalSection.jsx          ← single decision card (no longer used on Overview, kept as legacy)
│   ├── ActiveTasks.jsx              ← task cards with flow dots, AI is doing, Next from you, confidence
│   ├── ContractorMatch.jsx          ← featured Jason card (legacy — was on the cut Contractors page)
│   ├── QuoteIntelligence.jsx        ← 3 quote cards + dark AI rec card (legacy — was on the cut Quotes page)
│   └── ui/
│       ├── Card.jsx
│       ├── Pill.jsx                 ← status pills with optional live dot, icon, tones
│       ├── Button.jsx
│       ├── Confidence.jsx           ← animated confidence bar
│       ├── SectionHeader.jsx
│       ├── PageHeader.jsx           ← used on deep pages (Tasks, Schedule)
│       └── BackBar.jsx              ← used on focused-flow pages
└── pages/
    ├── OverviewPage.jsx             ← EmptyOverview + PopulatedOverview (state-aware)
    ├── TasksPage.jsx                ← Conversations list (state-aware)
    ├── SchedulePage.jsx             ← EmptySchedule + PopulatedSchedule (state-aware)
    ├── ConversationPage.jsx         ← full thread for one task; post-approval tail appended dynamically
    ├── IntakePage.jsx               ← ChatGPT-style intake conversation
    ├── ScopePage.jsx                ← AI-generated scope of work (PDF spec)
    ├── ContractorComparePage.jsx    ← side-by-side 3 contractors (PDF spec)
    └── QuoteComparePage.jsx         ← apples-to-apples quote comparison (PDF spec)
```

**Deleted, do not recreate:** `ApprovalsPage.jsx`, `ContractorsPage.jsx`,
`QuotesPage.jsx`, `DocumentsPage.jsx`, `WarrantiesPage.jsx`,
`HomeMemory.jsx`, `AgentPanel.jsx`, `AgentTimeline.jsx`, `CommandBar.jsx`,
`Header.jsx`. They were duplicate scaffolding or belonged to abandoned
patterns.

## State machine (lives in App.jsx)

Three pieces of app state drive the entire UX:

| State | Type | Trigger | Effect |
|---|---|---|---|
| `page` | string | sidebar click, CTA click | which page renders |
| `conversationId` | string | task card click → `onNavigate({ page: 'conversation', conversationId: 'sink' })` | which thread to show in ConversationPage |
| `hasStartedFirstTask` | bool | navigating to `scope` | empty → populated everywhere |
| `decisionHandled` | bool | `onNavigate({ page: 'overview', decisionHandled: true })` from per-contractor approve buttons on Quote Compare | pending → approved everywhere |

`handleNavigate(id, opts)` accepts either a string id OR an object
`{ page, conversationId?, decisionHandled? }`.

**No reset button.** This is treated as a real product. To reset state,
refresh the page.

## Pages and routing

State-based pseudo-routing via `pageMap` in App.jsx:

| Key | Component | Sidebar nav | Notes |
|---|---|---|---|
| `overview` | OverviewPage | ✓ | Empty + Populated states |
| `tasks` | TasksPage | ✓ ("Conversations") | Empty + Populated states |
| `schedule` | SchedulePage | ✓ | Empty + Populated states |
| `intake` | IntakePage | hidden | Focused flow |
| `scope` | ScopePage | hidden | Focused flow |
| `contractor-compare` | ContractorComparePage | hidden | Focused flow |
| `quote-compare` | QuoteComparePage | hidden | Focused flow |
| `conversation` | ConversationPage | hidden | Focused flow |

`fullViewportPages = new Set(['intake', 'conversation'])` — these pages hide
the page footer so the chat input pins to the viewport bottom without page
scroll competing.

**Footer pinned to viewport bottom:** `<main>` is `flex flex-col`, content
wrapped in `flex-1`, footer is the last child. Short pages still push the
footer to the screen edge.

## Demo flow (the case-study story)

```
[ Empty Overview ]
  Hero: "Your AI is ready. Tell it what happened."
  + Big "Start your first task" CTA
  + 4-step "How it works" grid
  Sidebar: Overview · Conversations (no badge) · Schedule (no badge)
        │
        ▼  click CTA OR sidebar "+ New AI task"
[ Intake (chat) ]
  ChatGPT-style: messages scroll inside the card, input pinned at bottom,
  page footer hidden so nothing competes for scroll.
  Conversation auto-plays:
    - User describes leak
    - AI proactively requests 3 specific photos (per PDF: shot guidance)
    - User uploads 2
    - AI thinking → urgency capture (3 options, "slow leak this week" pre-selected)
    - User reply → AI clarifying questions (panel photo + handle type)
    - User reply + final photo → AI scope summary
        │
        ▼  click "Generate scope of work"  →  hasStartedFirstTask = true
[ Scope ]                                     (Sidebar badges appear: Conversations 1 · Schedule 1)
  Centered (max-w-4xl mx-auto). Header is stacked vertically:
    eyebrow → title → description → CTAs (Export PDF · Edit scope · Approve & find contractors)
  AI-generated disclaimer banner.
  Document body: 01 Diagnosis (primary + alternative), 02 Job summary,
  03 Itemized labor, 04 Materials, 05 Exclusions, 06 Unit-priced add-ons,
  07 Acceptance criteria. NO side rail (deleted: AI confidence, Ask AI,
  Attached evidence, Will be sent to).
        │
        ▼  click "Approve & find contractors"
[ Contractor Compare ]
  Header stacked vertically with CTAs (Reject all 3 · Show 3 different ·
  Approve all 3 & send scope).
  Comparison matrix: Rating, Years licensed, License (✓/Flagged), Insurance,
  Relevant past work, Permit history, Earliest availability.
  Single shared "Why we picked these three" rationale card — light style,
  matches Quote Compare's plain-language summary visually.
        │
        ▼  click "Approve all 3 & send scope"
[ Quote Compare ]
  Header stacked vertically with status pills.
  Plain-language summary card (light, sage accent strip).
  3 quote total cards.
  Matrix: line-by-line scope deviations + outlier flags ($75 fee, missing
  materials, BETTER 1-yr warranty). Per-contractor "Pick this contractor"
  row at the bottom of the matrix — Jason highlighted (`bg-ink-900`,
  not sage), Bayline + Quickfix outline buttons.
  NO Homewise verdict, NO deviations rail, NO status strip (all deleted as
  redundant).
        │
        ▼  click "Approve Jason"  →  decisionHandled = true (via opts)
[ Back to Overview — POPULATED ]
  Hero updates: "No decisions waiting. The kitchen sink job is moving."
  4 stat cards reflect: 1 task, 0 decisions (was 1), 3 quotes, 3 vetted.
  Active task card shows "Scheduled · Friday 2 PM" pill, flow all done
  except Scheduled now active, AI IS DOING "Scheduled with Jason ·
  monitoring", NEXT FROM YOU "Visit confirmed · 2 days away", confidence 96%.
        │
        ▼  click active task card
[ Conversation ]
  Full thread (25 messages now, was 21 — booking-confirmation tail
  appended dynamically when decisionHandled is true):
    user describes problem → AI photo request → user uploads + answers
    urgency + clarifying questions → AI actions (license, insurance,
    benchmark, outreach) → AI message about Jason's quote + inline quote
    artifact card → user asks comparison question → AI summary + inline
    quote-compare artifact card →
    [ post-approval tail: ]
    user "Approve Jason for Friday 2 PM"
    action "Booking confirmed with Jason Plumbing Co."
    action "Added to your calendar"
    AI "Booked. Jason will text you 30 min before…"
    live indicator "Confirmed · Friday April 25, 2:00 PM · 2 days away"
  + Side rail: status pill becomes "Confirmed · Friday 2 PM",
  artifacts (scope/contractors/quotes), suggested next swaps from
  approval-themed to scheduling-themed.
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

## Component conventions

- **Pill**: `<Pill tone="sage|ember|sky|neutral|soft" icon={X} live>` —
  `live` adds a pulsing dot.
- **Confidence**: `<Confidence value={92} label="..." size="md|lg">` —
  animated bar, color-coded by threshold (≥85 sage, ≥65 ember, else ink).
- **BackBar**: focused-flow pages use this; `onBack` prop, `label`,
  optional `context` eyebrow.
- **PageHeader**: deep-page intro; `eyebrow`, `title`, `description`,
  optional `trailing` pill.
- All page components accept `onNavigate(id, opts?)` for navigation.
- `onNavigate` accepts either a string `id` or an object
  `{ page: string, conversationId?: string, decisionHandled?: boolean }`.

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
- Don't add a Reset demo button — refresh handles it.
