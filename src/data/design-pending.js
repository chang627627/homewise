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
export const pendingAdditions = [];
