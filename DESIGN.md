---
version: v1
name: Hearth
product: Homewise
tagline: The warmth at the center of every home
description: Hearth is the design system behind Homewise, a 2026 AI home command center for homeowners. Built on a warm cream canvas (#F6F4EF), near-black ink for primary surfaces and CTAs, and a tri-role color story · sage (trust), ember (caution), sky2026 (info). Type is sans-only (Geist) with editorial weight, capped at 52px because larger sans reads as shouty. Shadows are banned; cards rely on hairline borders, ring-1 surfaces, and background contrast for separation. The result reads as a calm, premium homeowner tool · closer to Notion / Linear's surface logic than a SaaS analytics dashboard, with a humanist warmth most AI brands skip.

colors:
  # Canvas — warm off-white page surfaces
  canvas: "#F6F4EF"
  canvas-soft: "#FAF8F3"
  canvas-deep: "#EEEAE1"

  # Ink — text and dark surfaces
  ink-900: "#1A1A17"
  ink-700: "#3C3C38"
  ink-500: "#6B6B65"
  ink-300: "#A8A8A1"
  ink-200: "#CFCEC7"
  ink-100: "#E7E5DE"

  # Semantic aliases — read components by role, not hue
  primary: "#1A1A17"           # ink-900 — primary CTAs, "Approve Jason", FlowProgress current step
  on-primary: "#FAF8F3"        # canvas-soft — text on primary
  trust: "#4F6942"             # sage-500 — AI recommendation tint, success badges, completed flow dots
  trust-tint: "#F1F4EF"        # sage-50 — AI pick column wash, "+1 you" badges
  caution: "#B98132"           # ember-400 — insurance flagged, warning pills
  caution-tint: "#FBF3EA"      # ember-50 — flagged cell background
  info: "#4E6F7A"              # sky2026-500 — scheduled / live status
  info-tint: "#EEF3F5"         # sky2026-50

  # Sage — trust scale (AI matches, success, completed states)
  sage-50: "#F1F4EF"
  sage-100: "#E2E8DC"
  sage-200: "#C6D2BB"
  sage-300: "#9AAE8C"
  sage-400: "#738A63"
  sage-500: "#4F6942"
  sage-600: "#3D5333"
  sage-700: "#2F4027"

  # Ember — caution scale (insurance flags, urgency, warnings)
  ember-50: "#FBF3EA"
  ember-100: "#F5E4CE"
  ember-200: "#EBC89B"
  ember-300: "#D9A461"
  ember-400: "#B98132"
  ember-500: "#8E601E"

  # Sky2026 — info scale (scheduled, live monitoring)
  sky2026-50: "#EEF3F5"
  sky2026-100: "#D9E4E9"
  sky2026-300: "#8FAAB3"
  sky2026-500: "#4E6F7A"
  sky2026-700: "#2E4850"

  # Hairlines — use these two only
  hairline: "rgba(26, 26, 23, 0.06)"        # default card separation
  hairline-strong: "rgba(26, 26, 23, 0.10)" # stronger card separation, focus outlines

typography:
  # Geist variable axis 300–800. Deliberate weight ladder:
  #   Display headlines = 500 (editorial-light at scale)
  #   AI narration       = 400 italic (.editorial-italic class)
  #   Card titles / labels = 500 (medium)
  #   Body / sub-copy    = 400 (regular)
  #   Money / figures    = 500 tabular (.figure class)
  #   Eyebrows / buttons = 500
  # Capped at 52px — sans at larger sizes reads shouty.

  hero-l:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "36 / 44 / 52 px"   # mobile / md / lg
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.040em"
    cssClass: ".editorial"
    use: "Empty Overview hero only. Largest type in the app."
  hero-m:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "24 / 30 px"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.040em"
    cssClass: ".editorial"
    use: "Page headers (Tasks, Schedule, focused-flow pages), populated Overview hero."
  section-l:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "22 / 26 px"
    fontWeight: 500
    lineHeight: 1.10
    letterSpacing: "-0.040em"
    cssClass: ".editorial"
    use: "Section titles inside pages."
  stat-l:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 28
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: "-0.040em"
    fontFeature: "tnum"
    cssClass: ".editorial .tabular-nums"
    use: "Overview at-a-glance stat numbers."
  doc-total:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "22 / 26 px"
    fontWeight: 500
    fontFeature: "tnum"
    cssClass: ".editorial .tabular-nums"
    use: "Quote totals, document money figures."
  ai-narration:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: "16 px"
    fontWeight: 400
    fontStyle: italic
    letterSpacing: "-0.012em"
    cssClass: ".editorial-italic"
    use: "AI plain-language summary callouts ('Jason is the cheapest that's complete…'). Quiet, conversational, distinct from display headings."
  figure:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontWeight: 500
    fontFeature: "tnum, cv11"
    fontVariantNumeric: tabular-nums
    letterSpacing: "-0.005em"
    cssClass: ".figure"
    use: "Inline body numerics — rating scores, hour counts, material costs, item quantities, confidence percentages. Replaces ad-hoc `font-semibold tabular-nums` combos. Geist `cv11` character variant enables straight-sided digits for a more refined data voice."
    deployments:
      - "[Confidence.jsx](src/components/ui/Confidence.jsx) — % value"
      - "[ScopePage.jsx](src/pages/ScopePage.jsx) — task numbers, hour counts, material qty + est cost"
      - "[ContractorComparePage.jsx](src/pages/ContractorComparePage.jsx) — rating score in matrix"
      - "[QuoteComparePage.jsx](src/pages/QuoteComparePage.jsx) — rating score in contact drawer"
  title-md:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 15
    fontWeight: 500
    lineHeight: 1.3
    use: "Card titles, contractor names in matrix. Medium weight — labels should not be heavier than display."
  body-md:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 14
    fontWeight: 400
    lineHeight: 1.55
    use: "Default body, descriptions, list items."
  body-sm:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 12.5
    fontWeight: 400
    lineHeight: 1.5
    use: "Compact body in cards, secondary lines."
  caption:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 12
    fontWeight: 500
    lineHeight: 1.4
    use: "Status text, metadata."
  eyebrow:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 11
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.20em"
    textTransform: uppercase
    use: "Section eyebrows on every focused page header. Always paired with a leading 24px hairline rule."
  micro-cap:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 10.5
    fontWeight: 600
    letterSpacing: "0.18em"
    textTransform: uppercase
    use: "FlowProgress 'Then book' trailing hint, smallest UI label."
  button:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 13.5
    fontWeight: 500
    lineHeight: 1.0
    letterSpacing: "-0.005em"
  wordmark:
    fontFamily: "Geist, Inter, system-ui, sans-serif"
    fontSize: 17
    fontWeight: 600
    letterSpacing: "-0.020em"
    use: "Brand wordmark in sidebar and onboarding."

rounded:
  sm: 8px            # small chips, pills (when not full pill)
  md: 12px           # inputs, BackBar button, small tiles
  lg: 16px           # buttons (Button.jsx md/lg size uses rounded-2xl = 16)
  xl: 20px           # FlowProgress / nav containers
  xxl: 24px          # cards (Card.jsx base = rounded-3xl = 24)
  pill: 9999px       # status pills, slot chips

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px      # marketing-style section breathing on long pages

motion:
  # framer-motion is the only motion library. Reuse these curves.
  ease-out-soft: "[0.22, 1, 0.36, 1]"   # Confidence bar, drawer slide
  duration-fast: 200ms                   # button hover, tone transitions
  duration-medium: 350ms                 # drawer slide-in
  duration-confidence: 1200ms            # Confidence bar fill
  pulse: "1.8s ease-in-out infinite"     # live dot

iconography:
  library: "lucide-react"
  default-stroke: 1.8
  rule: "All chrome icons (arrows, chevrons, icons inside buttons, sidebar nav, page actions) use strokeWidth={1.8}. Small icons at size 9-13px stay at strokeWidth={2} because thinner strokes disappear at that scale (size-dependent weight, same approach as Apple SF Symbols)."
  exceptions:
    sparkles-brand-mark: "strokeWidth={2.2} — the AI brand-chip Sparkles icon needs heavier stroke at small size to read as a brand element."
    flow-progress-check: "strokeWidth={2.5} — the completion check at 11px needs the extra weight."
    star-rating: "strokeWidth={1.5} or {0} — filled stars use lighter stroke or none, since the fill carries the visual weight."

components:
  # All buttons go through src/components/ui/Button.jsx — variants below match
  # that file 1:1. Do not hand-roll button classes per page.

  button-primary:
    role: "Approve / commit action. One per band."
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"        # rounded-2xl
    height: 40px
    padding: 0 16px
    ring: "1px {colors.ink-900}/5"

  button-secondary:
    role: "Default action button. White on cream canvas."
    backgroundColor: "#FFFFFF"
    textColor: "{colors.ink-900}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: 40px
    padding: 0 16px
    ring: "1px {colors.ink-200}/70"

  button-ghost:
    role: "Tertiary inline link-like action."
    backgroundColor: transparent
    textColor: "{colors.ink-700}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: 40px

  button-sage:
    role: "Confirmation / trust accent. Used sparingly."
    backgroundColor: "{colors.trust}"
    textColor: "#FFFFFF"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: 40px

  button-outline:
    role: "Secondary on focused pages, e.g. 'Ask before booking'."
    backgroundColor: transparent
    textColor: "{colors.ink-900}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    height: 40px
    ring: "1px {colors.ink-200}"

  button-soft:
    role: "Quiet pill for chip rows."
    backgroundColor: "{colors.ink-100}/60"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    height: 40px

  button-hero:
    role: "Flow-advance CTA. The large dark next-step button on the empty Overview and at the foot of focused-flow pages (Scope, Contractor Compare, Quote Tracking, Onboarding). One per page. API: variant=hero (sizing is self-contained, pass no size)."
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    fontSize: 13.5
    fontWeight: 600                  # font-semibold — heavier than the standard button role for presence
    rounded: "{rounded.lg}"          # rounded-2xl
    height: 48px                     # h-12, self-contained — does NOT use the sm/md/lg size scale
    padding: "pl-5 pr-3"             # asymmetric; the trailing chip balances the right edge
    texture: "grain-dark + hairline-on-dark (no ring)"
    trailingChip: "iconRight rides in a 32x32 (h-8 w-8) rounded-xl chip — bg-canvas-soft/15, group-hover bg-canvas-soft/25. ArrowRight for entry CTAs, ChevronRight to advance within a flow."
    leadingIcon: "optional icon (e.g. Send) renders inline at 14px before the label."

  pill-neutral:
    backgroundColor: "{colors.ink-100}/80"
    textColor: "{colors.ink-700}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    ring: "1px {colors.ink-200}"

  pill-sage:
    role: "AI top match, completed states, success."
    backgroundColor: "{colors.trust-tint}"
    textColor: "{colors.sage-600}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    ring: "1px {colors.sage-100}"

  pill-ember:
    role: "Insurance flagged, warnings."
    backgroundColor: "{colors.caution-tint}"
    textColor: "{colors.ember-500}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    ring: "1px {colors.ember-100}"

  pill-sky:
    role: "Scheduled, live monitoring."
    backgroundColor: "{colors.info-tint}"
    textColor: "{colors.sky2026-700}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
    ring: "1px {colors.sky2026-100}"

  pill-live:
    role: "Same as sage but with pulsing 1.5×1.5 dot."
    backgroundColor: "{colors.trust-tint}"
    textColor: "{colors.sage-600}"
    rounded: "{rounded.pill}"
    dot: "sage-500 pulsing 1.8s"

  card-default:
    backgroundColor: "#FFFFFF/80"
    rounded: "{rounded.xxl}"            # rounded-3xl
    border: "1px {colors.ink-100}/70"
    padding: "24px"
    backdropFilter: "blur(2px)"

  card-quiet:
    backgroundColor: "{colors.canvas-soft}/70"
    rounded: "{rounded.xxl}"
    border: "1px {colors.ink-100}/60"

  card-flat:
    role: "Sage-tinted AI top-match cards (Jason column header)."
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.xxl}"
    border: "1px {colors.ink-100}/80"

  card-ai-pick-tint:
    role: "Continuous sage-50/40 tint across AI-top-match column on Contractor Compare. Use the lg:-my-4 lg:py-4 padding trick so tint bleeds through row dividers."
    backgroundColor: "{colors.trust-tint}/40"

  card-flagged-cell:
    role: "Insurance-flagged matrix cell. Bold uppercase FLAGGED label inside."
    backgroundColor: "{colors.caution-tint}/60"
    rounded: "{rounded.md}"
    border: "1px {colors.ember-100}"

  page-eyebrow:
    composition: "24px hairline rule (h-px w-6 bg-ink-300) + uppercase eyebrow text. PageHeader and SectionHeader own this. Never use eyebrow text without the hairline."
    typography: "{typography.eyebrow}"
    textColor: "{colors.ink-500}"

  rule:
    role: "BRAND GESTURE. The recurring 1px horizontal hairline that pairs with eyebrows, section numbers, and titles. This is the signature visual element of the system. Deploy whenever an eyebrow, numbered section, or label needs a typographic anchor."
    component: "src/components/ui/Rule.jsx"
    height: "1px"
    tones:
      default: "{colors.ink-200}"     # most contexts
      strong: "{colors.ink-300}"      # PageHeader / SectionHeader (more prominent)
      soft: "{colors.ink-100}"        # quiet groupings
      trust: "{colors.sage-300}"      # completed-state dividers, sage-context
    widths:
      xs: "12px (w-3) — micro labels, NavGroup category labels"
      sm: "24px (w-6) — eyebrows on PageHeader / SectionHeader"
      md: "48px (w-12) — section dividers, standalone"
      lg: "96px (w-24) — page-level dividers"
      full: "100% — fills container, used in Sidebar brand row"
    deployments:
      - "Sidebar brand row — flex-1 fill rule to the right of the Homewise wordmark"
      - "Sidebar NavGroup label — xs rule before WORKSPACE eyebrow"
      - "PageHeader / SectionHeader — sm rule before uppercase eyebrow (existing pattern, the seed of the gesture)"
      - "Onboarding Question — 16px rule between number and label ('01 —— Home type')"
      - "Completion Section — 16px rule between number and title ('01 —— Confirm work is done')"
      - "Scope SectionBlock — 16px rule before the numbered label ('—— 01 · Diagnosis')"

  back-bar:
    role: "Top-left back button on every focused-flow page. ArrowLeft icon, label, optional uppercase context eyebrow on the right."
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.md}"
    border: "1px {colors.ink-100}"
    height: 36px

  flow-progress:
    role: "3-step pill row (Scope → Contractors → Quotes) + 'Then book' trailing hint. Current step ink-900 fill; completed steps white w/ sage check dot; future steps muted."
    height: 32px
    current: "{colors.primary} bg, {colors.on-primary} text"
    complete: "white bg, ink-700 text, sage-500 check dot"
    future: "transparent, ink-400 text, ink-100 dot"

  confidence-bar:
    role: "Animated horizontal bar. Color thresholds: ≥85 sage, ≥65 ember, else ink. Always paired with uppercase label + tabular % value."
    height: "6px (md) or 8px (lg)"
    track: "{colors.ink-100}/80"
    motion: "framer width 0→% over 1.2s ease-out-soft + shimmer overlay"

  drawer-right:
    role: "Side panels (ShowcaseDrawer on Contractor Compare, ContactDrawer on Quote Compare)."
    backgroundColor: "#FFFFFF"
    width: "min(480px, 92vw)"
    motion: "slide x:100%→0 over 350ms ease-out-soft"
    portal: "createPortal to document.body — required, App-level motion.div transform creates a containing block otherwise"
    bodyScrollLock: "set body overflow:hidden + padding-right compensation for scrollbar"

  sidebar:
    role: "Edge-flush left rail. Brand wordmark, home selector, '+ New AI task' CTA, 3 nav items, user row at bottom. No floating margin, no rounded outer corners."
    backgroundColor: "{colors.canvas-soft}"
    width: 264px
    border: "1px {colors.ink-100} right edge only"

  slot-chip:
    role: "Availability slot picker on Quote Compare."
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    border: "1px {colors.ink-200}"
    selected: "{colors.primary} bg, {colors.on-primary} text"

shadows: none
  # All shadow utilities are intentionally banned. Use border + ring + background
  # contrast for separation. shadow-soft / shadow-card / shadow-glow / shadow-inset-soft
  # are still in tailwind.config.js but MUST NOT be used in source.

textures:
  # Brand textures defined in tailwind.config.js + index.css. Used sparingly
  # to anchor empty/dark surfaces without crossing into decoration.

  dot-grid:
    class: ".dot-grid"
    base: "radial-gradient(rgba(26,26,23,0.06) 1px, transparent 1px) 18px×18px"
    deployments:
      - "OverviewPage.jsx EmptyOverview hero band — 50% opacity, layered under the ambient sage + ember gradients"
    use: "Empty-state visual anchor. Quiet brand mark for spaces that would otherwise be pure canvas."

  grain-dark:
    class: ".grain-dark"
    technique: "::before pseudo-element with SVG fractal-noise (baseFrequency 0.9, 2 octaves) at 4% opacity, mix-blend-mode overlay"
    pairing: "Always paired with .hairline-on-dark on ink-900 surfaces"
    deployments:
      - "FlowProgress current step"
      - "All ink-900 primary CTAs across Sidebar / Overview / Onboarding (3 buttons) / Scope / Tasks / Quote Compare (Approve) / Completion / ActiveTasks (16 spots total)"
    use: "Makes ink-900 surfaces read as machined-metal craft rather than flat-painted plastic. Subtle — feel it more than see it."
    skip:
      - "Small sage-500 selected chips (grain on saturated color reads weird)"
      - "Small ember/sky pills (texture barely visible at chip scale)"
---

## Overview

Homewise is an AI home command center prototype — a homeowner uses an AI agent to find, vet, and hire contractors. The product spans empty state → intake → scope → contractor compare → quote compare → booking → schedule → completion.

The visual system is deliberately **calm and warm** where most AI brands lean cool-blue and slate. The palette anchors on a tinted cream `canvas` (#F6F4EF), near-black `ink-900` for type and primary CTAs, and a tri-role color story:

- **Sage** carries trust. AI recommendations, success states, completed steps, "+1 you" badges.
- **Ember** carries caution. Insurance flags, warnings, "Heads up" notes.
- **Sky2026** carries info. Scheduled visits, live monitoring pills.

The accent never decorates — every sage or ember surface reinforces a meaning. A pill that's sage tells the user "this is the AI's pick." A pill that's ember tells them "before booking, look here."

Type is **sans-only Geist** at editorial weight (500) with negative tracking (−0.040em) on headlines. The Empty Overview hero peaks at 52px (lg breakpoint). All other page headers sit at 24–30px. Sans at 76px reads shouty — the cap is the design.

**Shadows are banned.** Every card relies on a `border-ink-100/70` hairline + `ring-1` + the underlying canvas/white contrast. Old `shadow-soft / card / glow` tokens still exist in [tailwind.config.js](tailwind.config.js) but must never be applied. The flatness is intentional — it reads as document-craft, not SaaS-dashboard.

## Surface logic — 5-tier ladder

Five surface tiers, layered shallowly. Every visible surface lives on exactly one tier.

| Tier | Token | Hex | Use |
|---|---|---|---|
| 0 | `canvas` | `#F6F4EF` | Page background. Body element. |
| 1 | `canvas-soft` | `#FAF8F3` | Sidebar fill, secondary buttons, hover states, document header tints. |
| 2 | `card-white` | `#FFFFFF/80` | Primary content tiles. The default card surface. |
| 3 | `canvas-deep` | `#EEEAE1` | **Inset wells** — totals rows, money summaries, contract-document footers. Pair with `.hairline-inset`. |
| 4 | `ink-900` | `#1A1A17` | Primary CTAs, FlowProgress current step, inverted callouts. Pair with `.hairline-on-dark`. |

**Hairline pairings** (utility classes in [src/index.css](src/index.css)):

- **`.hairline`** — `inset 0 0 0 1px rgba(26,26,23,0.06)` — default card separation.
- **`.hairline-strong`** — `inset 0 0 0 1px rgba(26,26,23,0.10)` — stronger card separation, focus outlines.
- **`.hairline-inset`** — `inset 0 1px 0 rgba(255,255,255,0.6)` + `inset 0 0 0 1px rgba(26,26,23,0.04)` — tier-3 surfaces and pressed/selected states. Adds a subtle top highlight that reads as carved-out depth without a shadow.
- **`.hairline-on-dark`** — `inset 0 1px 0 rgba(255,255,255,0.08)` — top specular edge on ink-900 surfaces. Applied to every primary CTA + FlowProgress current step + selected slot chips so dark surfaces read as crafted, not flat-painted.

**Don't introduce a sixth surface tier.** Five is the ladder. If something needs to read deeper than canvas-deep, it's an ink-900 callout. If it needs to read brighter than card-white, it's an opacity adjustment, not a new tier.

## Voice and copy

- **No em dashes (—)** in any user-facing copy. Use periods, commas, or colons. Em dashes are allowed in code comments only.
- **Sentence case** for all headings. Eyebrows are UPPERCASE 11px with 0.20em tracking and always paired with a 24px hairline rule.
- **Plain language** in AI narration. Italics are reserved as quote markers.
- **No technical claims as trust signals**. "End-to-end encrypted" was removed from sign-up — the actual hook is "No contractor sees your home until you ask."

## Page template anatomy

Every focused-flow page (Intake, Scope, Contractor Compare, Quote Tracking, Quote Compare, Conversation, Completion) follows this shell:

```
BackBar (top-left button + optional uppercase context eyebrow on the right)
FlowProgress (only on Scope, Contractor Compare, Quote Compare)
PageHeader (eyebrow + hero-m title + description, CTAs in a row underneath when present)
[ page body ]
```

CTAs appear **once per page**. No top + bottom duplication. The only exception is Quote Compare's per-contractor approve buttons (per-column decisions, not duplicates of a single top action).

Two surfaces sit apart from this shell. **Quote Tracking** (the "watch quotes roll in" interstitial between Contractor Compare and Quote Compare) keeps BackBar + FlowProgress but swaps the PageHeader for a live agent-status header. **BidFormPage** (the contractor-facing `/bidform` and `/bid/:id` routes) is a separate surface that does not use the homeowner shell at all.

## Component principles

- **All buttons go through [Button.jsx](src/components/ui/Button.jsx).** Six variants (primary, secondary, ghost, sage, soft, outline) × three sizes (sm/md/lg), plus a self-sized **hero** variant (the dark arrow-chip flow-advance CTA, see button-hero). Do not hand-roll button classes per page — that was the root cause of the Quote Compare sizing drift in Round 1 testing.
- **All status pills go through [Pill.jsx](src/components/ui/Pill.jsx).** Six tones (neutral, sage, ember, sky, live, soft). `live` adds a pulsing 1.5×1.5 dot.
- **All cards go through [Card.jsx](src/components/ui/Card.jsx).** Variants: default, quiet, glass, flat. Base radius is `rounded-3xl` (24px). Never `rounded-2xl` for cards (that's the button radius).
- **Drawers must portal to document.body.** The App-level `motion.div` page-transition wrapper has a `y` transform which creates a containing block for any `position: fixed` descendant. Without `createPortal`, the drawer attaches to the padded main column instead of the viewport corner.

## State-aware copy

Three pages have empty + populated variants driven by `hasStartedFirstTask`:

- **Overview** — empty shows a "Tell it what happened" hero + "Your home's watchlist" (the maintenance items carried over from onboarding). Populated shows a contextual hero that switches by state: pre-decision ("1 decision today. / Pick your plumber."), post-decision ("Fri 2 PM with Jason. / Homewise is watching for changes."), post-completion ("Job closed out. / [recommendation status].").
- **Tasks (Conversations)** — empty shows a prompt to start, populated shows the active task list.
- **Schedule** — empty shows "Nothing scheduled yet," populated shows the week strip + visit card.

The populated Overview hero is **never** a static brand line ("Your AI is on it"). That works on empty as wallpaper; on populated it's redundant — the user is already in the product.

## Density / layout rules

- **Two-column shell.** Sidebar (264px, edge-flush, no rounded outer corners) + main. Never a third column. No persistent right AI panel.
- **Three sidebar nav items, one CTA.** Overview, Conversations, Schedule + "+ New AI task". Adding more nav items has been thrashed on — three is the answer.
- **Focused-flow pages have stacked headers.** Eyebrow → title → description → CTAs in a row underneath. Never split left/right.

## What NOT to do

- Don't reintroduce shadows. Period.
- Don't use serif type. Geist everywhere.
- Don't go above 52px on any text.
- Don't put em dashes in user copy.
- Don't hand-roll buttons / pills / cards outside the `ui/` primitives.
- Don't add a fourth color role beyond sage / ember / sky2026.
- Don't add a fourth surface tier.
- Don't reintroduce the 92% confidence number on Scope. The diagnosis content carries trust.
- Don't add `bg-[#xxx]` / `text-[#xxx]` raw-hex Tailwind arbitrary values in source. If you need a color, it's already in the token map.
- Don't use `text-[Npx]` inline sizes for anything that has a named type role above. Inline px is for one-off spots only.

## How to check yourself

Before opening a PR, run:

```bash
npm run design-check
```

It greps the source for the common drift patterns: raw hex in Tailwind classes, em dashes in JSX text, dead shadow tokens, and `text-[Npx]` inline sizes. It exits 0 with warnings unless `--strict` is passed.

## Companion docs

- [CLAUDE.md](CLAUDE.md) — how the project is *built*. State machine, page flows, focused-flow gates, mock data shape, deploy pipeline. Read this when changing behavior.
- This file — how the project should *look*. Tokens, recipes, voice rules. Read this when changing visuals.

The split is deliberate. CLAUDE.md is "how it works"; DESIGN.md is "how it looks." If you touch a token, update DESIGN.md. If you touch state or a flow, update CLAUDE.md.
