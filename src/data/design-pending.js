// Hearth · pending design-system proposals.
//
// Items here surface on /designsystem under "Pending review" for the owner
// to approve before they become part of the canonical system.
//
// WORKFLOW for agents and contributors:
//
// 1. To PROPOSE a new token / component / pattern / texture:
//    - Append an entry to the `pendingAdditions` array below.
//    - DO NOT add it to DESIGN.md.
//    - DO NOT add it to the main sections of DesignSystemPage.jsx.
//    - The page will render your proposal at the top of /designsystem
//      with a sage "Awaiting your approval" pill.
//
// 2. After the owner APPROVES a proposal, they will:
//    - Remove the item from this array
//    - Add the spec to DESIGN.md (in the right section)
//    - Add the visual to the appropriate main section of DesignSystemPage.jsx
//    - Commit as "Hearth: promote X from pending"
//
// 3. After the owner REJECTS a proposal, they will:
//    - Remove the item from this array
//    - Commit as "Hearth: reject X from pending"
//
// Each item must include: id, type, name, description, proposedBy, proposedDate.
// `preview` is optional and lets the page render a visual sample.

/**
 * @typedef {Object} PendingAddition
 * @property {string}  id            Unique id, e.g. "color-2026-05-12-001"
 * @property {'color'|'type'|'component'|'pattern'|'hairline'|'texture'|'other'} type
 * @property {string}  name          Token / component name being proposed
 * @property {string}  description   What it is, why it's being proposed, where it goes
 * @property {string}  proposedBy    "Claude session", a human name, etc.
 * @property {string}  proposedDate  ISO date "2026-05-12"
 * @property {Object=} preview       Optional visual preview
 * @property {'swatch'|'component'|'text'|'none'} preview.kind
 * @property {string=} preview.bg    Tailwind class or hex (for kind='swatch')
 * @property {string=} preview.hex   Hex string to display
 * @property {string=} preview.text  Sample text (for kind='text')
 * @property {string=} preview.cls   Custom Tailwind class string (for kind='component')
 */

/** @type {PendingAddition[]} */
export const pendingAdditions = [
  {
    id: 'type-2026-10-16-002',
    type: 'type',
    name: 'Size-graded editorial tracking',
    description:
      "Owner-approved direction (decision 1, 2026-10-16). Keep -0.040em as the hero-l 52px signature, loosen at smaller editorial sizes so Geist letter pairs stop touching: .editorial-m -0.026em (hero-m 24/30, leading 1.10), .editorial-s -0.018em (section-l 22/26, stat-l 28, doc-total), .editorial-xs -0.012em (20px and below). Implemented as modifier classes in index.css. To promote: update the letterSpacing values on hero-m, section-l, stat-l in DESIGN.md.",
    proposedBy: 'Claude session',
    proposedDate: '2026-10-16',
    preview: { kind: 'text', text: 'Three contractors, side by side.' },
  },
  {
    id: 'component-2026-10-16-003',
    type: 'component',
    name: 'Neutral selected state for user choices',
    description:
      "Owner-approved direction (decision 2, 2026-10-16). A user's own selection (availability windows, slot chips, completion confirm and recommend options) is drawn bg-canvas-deep + ring-1 ring-ink-300 + text-ink-900 with a 12px Check (no .hairline-inset: it and ring-1 are both box-shadows, so the ring would cancel it), never ink-900 and never sage. Ink-900 stays reserved for the single decisive action per pane; sage stays reserved for the AI's pick. To promote: replace slot-chip.selected in DESIGN.md.",
    proposedBy: 'Claude session',
    proposedDate: '2026-10-16',
    preview: { kind: 'component', cls: 'inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-canvas-deep ring-1 ring-ink-300 text-ink-900 text-[12px] font-medium', text: 'Weekday PM' },
  },
  {
    id: 'component-2026-10-16-004',
    type: 'component',
    name: 'Segmented artifact tabs (V2 stage header)',
    description:
      "V2 only. The stage's artifact pills become one segmented control: a bg-ink-100/60 rounded-2xl p-1 track, the active tab a white thumb with .hairline-strong that slides between tabs (framer layoutId, 200ms ease-out-soft), inactive tabs text-ink-500 on transparent. Replaces the ink-900 active pill so the stage's only dark element is its decision CTA.",
    proposedBy: 'Claude session',
    proposedDate: '2026-10-16',
    preview: { kind: 'none' },
  },
  {
    id: 'other-2026-10-16-005',
    type: 'other',
    name: 'Neutral contractor monograms',
    description:
      "Owner-approved direction (decision 5, 2026-10-16). Contractor avatars drop the sage / sky / ember gradients (accent color used as decoration, and it pre-judged Quickfix as 'ember' before any flag was read). Monograms become bg-canvas-deep + .hairline-inset with ink-700 initials; the AI-pick lane and the flag pill carry meaning instead. Faces stay out per the photography art direction.",
    proposedBy: 'Claude session',
    proposedDate: '2026-10-16',
    preview: { kind: 'component', cls: 'inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-canvas-deep hairline-inset text-ink-700 editorial text-[15px]', text: 'J' },
  },
  {
    id: 'pattern-2026-10-16-001',
    type: 'pattern',
    name: 'Photography in photo slots',
    description:
      "Real photos replace the tinted gradient + dot-grid placeholders in every photo slot: intake shots, the scope photo strip (also on the contractor bid form), completion after-photos, and the showcase drawer. Rendered through ui/PhotoFill with object-cover; the label pill and AI-tag chip overlays are unchanged, and the gradient stays as the fallback for any slot without a photo. Art direction: unstaged homeowner or contractor documentation shots, natural light, no people, hands, faces, readable text, or logos, so the imagery itself keeps the 'no faces, no addresses' privacy promise. Photos were AI-generated (Figma, gpt-image) and live in src/assets/photos.",
    proposedBy: 'Claude session',
    proposedDate: '2026-10-16',
    preview: { kind: 'none' },
  },
];
