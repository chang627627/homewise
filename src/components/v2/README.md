# V2 primitives (`src/components/v2/`)

The API every V2 surface codes against. Shell and artifact files import UI only from this folder, `lucide-react`, `framer-motion` and `src/data/photos`. Facts come from `src/data/demo.js`; nothing here hardcodes one.

Review every primitive in every state at **`/kit`** (`KitPage.jsx`). Check your files with `scripts/v2-check.sh <files or dirs>` (no args = the whole V2 set; exit 1 on any hit).

Import paths below are relative to this folder, so from `src/components/shell/*` or `src/components/artifacts/*` use `../v2/Name`.

## Tokens (Tailwind, added keys)

| Kind | Classes |
|---|---|
| Type | `text-title` 26/32 600 (one H1 per view, add `text-balance`), `text-figure` 20/24 600 (add `tabular-nums`), `text-heading` 16/24 600, `text-ui` 14/20 (prose adds `leading-[22px] text-pretty`), `text-meta` 12/16 |
| Surfaces | `bg-canvas-v2` (Rail, Thread, gutters, empty photo slots), `bg-white` (Stage panel, composer, drawers) |
| Line | `border-line`, `divide-line`, `ring-line`, `bg-line` (the only rule color) |
| State fills | `bg-shade-1` hover, `bg-shade-2` selected and secondary, `bg-shade-3` secondary hover |
| Washes | `bg-sage-wash` (pick panel, done day), `bg-ember-wash` (exception cell), `bg-sky2026-wash` (booked day) |
| Elevation | The `float` box shadow, for drawers and the compact Rail overlay only (the check script enforces it) |

Weights 400, 500, 600 only. Focus is always `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900/25` (full-width rows add `focus-visible:ring-inset`). Disabled is `disabled:opacity-40 disabled:pointer-events-none`. The root is `<div className="v2 flex h-screen overflow-hidden bg-canvas-v2 text-ink-900 antialiased">`; `.v2` sets the caret, the selection color, and zeroes CSS transitions under reduced motion.

Text link recipe (no component): `text-ui font-medium text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline`; `text-meta` in meta contexts; `text-ink-500` for "Cancel visit".

## `motion.js`

| Export | Value |
|---|---|
| `ease` | `[0.22, 1, 0.36, 1]` |
| `dur` | `{ fast: 0.15, base: 0.2, slow: 0.3 }` (seconds) |
| `enter` | opacity 0 to 1 and y 4 to 0, `dur.base`. Spread onto a `motion.*`: `<motion.div {...enter}>` |
| `fade` | opacity in and out, `dur.base`. `<motion.div {...fade}>` |
| `collapse` | height 0 to auto plus opacity, `dur.base`. Use inside `<AnimatePresence>` on an `overflow-hidden` element |
| `REDUCED_MOTION` | `'(prefers-reduced-motion: reduce)'` |
| `prefersReducedMotion()` | synchronous check, for one-off decisions (scroll behavior) |

Importing this module sets framer's `MotionGlobalConfig.skipAnimations` while the OS asks for reduced motion, so **every framer duration is 0** (fades and layout too) without any per-call work. Use the tokens instead of literal numbers. For reduced-motion branches in render (Scope renders complete, no stream) use `usePrefersReducedMotion()`.

## Hooks

- **`useScrolled()`** (default, `useScrolled.js`) returns `[scrolled, onScroll]`. Put `onScroll` on the scroll container; `scrolled` is `scrollTop > 0`. Scroll-aware header: `` className={`border-b transition-colors duration-150 ${scrolled ? 'border-line' : 'border-transparent'}`} ``.
- **`useMediaQuery(query)`** (default, `useMediaQuery.js`) returns a live boolean. `const compact = useMediaQuery('(max-width: 1023px)')`.
- **`usePrefersReducedMotion()`** (named, `useMediaQuery.js`) returns a live boolean.

## `Tooltip.jsx`

`<Tooltip label side="top" | "right" | "bottom" | "left">{oneChild}</Tooltip>`

- `label`: string or node. Falsy renders the child untouched.
- `side`: `top` in matrices, `right` on collapsed panes, `bottom` in headers. Flips to the other side if it would leave the viewport, and is clamped 8px inside it.
- The child must pass `onPointerEnter`, `onPointerLeave`, `onPointerDown`, `onFocus`, `onBlur` and `aria-describedby` through to a DOM node (a DOM element, or a component that spreads its props). It needs no ref.
- Opens on mouse hover after 500ms, or at once if any tooltip closed in the last 300ms. Opens at once on keyboard focus (`:focus-visible` only, never on click focus). Closes on leave, blur, Escape, and pointer down (and stays closed until the pointer leaves).
- Ink bubble, portaled to `body`, `z-[60]`, no shadow. `aria-describedby` is set while open, except when it would repeat the child's own `aria-label`.
- Never use a native `title` attribute anywhere in V2.

## `IconButton.jsx`

`<IconButton icon={PanelLeftClose} label="Collapse sidebar" size="md" side="bottom" onClick={...} className="" />`

- `icon` (required): a lucide component from the allowed list. Rendered at 16px, `strokeWidth={1.5}`.
- `label` (required): accessible name and tooltip text.
- `size`: `'md'` 32px (default) or `'sm'` 28px. `side`: tooltip side, default `'bottom'`.
- Any other prop (`disabled`, `aria-expanded`, `aria-pressed`) goes to the `<button>`. No badge.
- Rotating the glyph: `className="[&_svg]:rotate-180"`.

## `Row.jsx` (Rail rows)

`<Row lead={<HouseMark />} title="..." meta="Fri" selected muted collapsed tooltip="..." preview onClick={...} />`

- `lead`: a 16px icon, `<HouseMark />`, or a `<StatusGlyph />`. It is ink-500, ink-900 on hover or when selected (status glyphs keep their own color).
- `title`: one line, truncates. `meta`: right-aligned `text-meta tabular-nums`.
- `selected`: sets `aria-current="true"` and the `bg-shade-2` fill. `muted`: title in ink-500 (a done task).
- `preview`: `bg-shade-1` without selecting (the Evidence hover state for Home targets on the Maple Street row).
- `collapsed`: a 32x32 square, title hidden, `aria-label={title}`, and a right-side Tooltip showing `tooltip` (falls back to `title`). Task rows pass `` tooltip={`${title} · ${status}`} ``.
- Extra props go to the `<button>`.

## `Button.jsx`

`<Button variant="primary" | "secondary" | "ghost" size="md" | "sm" full as="button" | "a" disabled>Label</Button>`

- Text only: no icon props, no other variants. md is 36px, sm is 32px. `full` adds `w-full`.
- Default `variant="primary"`. At most one primary is visible per screen.
- `as="a"` renders an anchor: pass `href` (for example `` href={`tel:${phone.replace(/\D/g, '')}`} ``). `disabled` on an anchor drops the href and sets `aria-disabled`.
- Other props (`onClick`, `type`, `aria-*`) pass through.

## `Status.jsx`

States everywhere: `'working' | 'needs-you' | 'waiting' | 'done' | 'idle'` (same vocabulary as `STATUS[*].state` in demo.js).

- **`<StatusGlyph state live={false} progress={0} />`**: 14px, `aria-hidden`.
  - `working`: a sage pie filled to `progress` (0..1, never below 1/8, a full disc at 1).
  - `working` with `live`: the spinning arc, **the app's one loop**. Render it in exactly one place (composer status row, collapsed Thread strip, or the Stage header in focus mode). Under reduced motion it renders the static pie instead of a frozen arc.
  - `needs-you`: ember dot. `waiting`: dashed sky ring. `done`: sage disc with a check. `idle`: ink-300 ring.
- **`<StatusText state progress>{label}</StatusText>`**: glyph plus `text-ui font-medium` words, toned sage-600, ember-500, sky2026-700, sage-600 (idle ink-500). Status line pattern:
  ```jsx
  <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
    <StatusText state={s.state}>{s.label}</StatusText>
    <span className="text-ui text-ink-500">{sentence}</span>
  </div>
  ```
- **`<Dot />`**: 6px ember dot, `aria-hidden`. Only on a non-active tab (Tabs renders it for you).

Sink `progress` = reached plan marks (scope-approved, matched, sent, booked) / 4.

## `Matrix.jsx`

One table directly on the white panel. Every row is a `MatrixRow` holding four cells: the label cell, then one cell per contractor in `CONTRACTORS` order. Rules break at the column gutters; the sage pick panel sits behind the pick's column from 12px above the header to 12px below the last row. Below 1024 the matrix scrolls sideways inside its own wrapper with the label column pinned (built in).

```jsx
import Matrix, { MatrixRow, MatrixCorner, MatrixHeader, RowLabel, ValueCell, GroupLabel, Included, Absent, Exception, Outlier, MatrixFooter } from '../v2/Matrix';

<Matrix pickIndex={CONTRACTORS.findIndex((c) => c.aiPick)} label="Contractors compared" className="mt-8" footer={bookRow}>
  <MatrixRow>
    <MatrixCorner />
    {CONTRACTORS.map((c) => <MatrixHeader key={c.id} id={c.id} name={c.name} pick={c.aiPick} meta={`${c.rating.score} · ${c.rating.reviews} reviews`} />)}
  </MatrixRow>
  <MatrixRow evidence="row:license">
    <RowLabel label="License" definition="Active, verified with the state board" />
    {CONTRACTORS.map((c) => <ValueCell key={c.id}><Included>{number}</Included></ValueCell>)}
  </MatrixRow>
  <GroupLabel>Terms</GroupLabel>
  ...
</Matrix>
```

| Export | Props | Notes |
|---|---|---|
| `default Matrix` | `pickIndex` (0..2, or omit for no panel), `label` (aria), `footer`, `className` (on its own outer wrapper, so margins like `mt-8` hold at every width), `children` | Wrapper + pick panel + `role="table"` grid |
| `COLS`, `GRID` | style object, class string | `<div className={GRID} style={COLS}>` gives the same 4 columns (label 120px, 168px at xl; gutters 12px, 16px at xl) |
| `PickPanel` | `index` | The sage layer alone. `Matrix` already renders it |
| `MatrixRow` | `evidence?`, `className`, `children` | `display: contents` row. With `evidence` it becomes an `Evidence` subgrid row, so the outline draws around the whole row while cells keep the parent columns |
| `MatrixCorner` | `children?` | Empty label-column header with the same rule |
| `MatrixHeader` | `id`, `name`, `pick`, `meta?`, `className`, `children?` | Always an `Evidence` with id `col:${id}` (and `data-col`). Fixed slots: 16px "Homewise pick" label (reserved when empty), name (2 lines max), meta. Quotes put the price, the waiting status and the call link in `children` |
| `RowLabel` | `label`, `definition?`, `className`, `children?` | `definition` goes in a top Tooltip on a dotted-underline, focusable label, never inline. With `children` it becomes the tall label cell (the Quotes "Your times" chips go here) |
| `ValueCell` | `evidence?`, `tall?`, `className`, `children` | 44px, `text-ui tabular-nums text-ink-900`. `tall`: auto height, `py-3`, column layout (the Visit row radios). `evidence` makes the cell an `Evidence` (e.g. `recs:reyes`) |
| `GroupLabel` | `children` | Full-width `text-meta font-medium text-ink-500` group row ("Scope", "Terms", "Visit"), no rule |
| `Included` | `children?`, `label='Included'` | Check glyph, then optional short `text-ink-700` value. Alone, `label` is read to screen readers |
| `Absent` | `children?`, `label='None'` | Words in ink-500 ("None stated"), or with no children the ink-300 dash, with `label` read to screen readers |
| `Exception` | `evidence?`, `children` | The single ember evidence cell for a fact: ember wash, AlertTriangle, ember-500 words. Pass `evidence="insurance:eastbay"` to make the chip itself the Evidence target |
| `Outlier` | `children` | `font-medium text-ember-500` value without a wash (Bayline's fee) |
| `MatrixFooter` | `label`, `children` (3 cells) | The Quotes Book row: sticky to the Stage bottom at 1024 and up, static below. Pass it as `Matrix`'s `footer` (it must be a direct child of the wrapper for sticky to work). Each child is one column cell, e.g. `<div key={c.id}><Button size="sm" full>...</Button></div>` |

Only two glyphs ever appear in a matrix body: `Included` (Check) and `Exception` (AlertTriangle). No sublabels, no per-cell boxes, units in the row label.

Waiting column fade-in: wrap the column's cells' content in `<motion.span {...fade}>`, or key the cell on arrival.

## `RangeRail.jsx`

`<RangeRail arrived={quotesIn} className="mt-6" />`

- `arrived`: Set or array of contractor ids whose quote is in. Only those get a tick. Ticks already in when the rail mounts render at once; a tick that arrives later fades in (200ms).
- Totals, names (`short`), the pick (sage tick) and the local band all come from demo.js. Scale is derived from the data ($150 to $420 today).
- Tick labels are measured and nudged apart so they never overlap or leave the rail at any width.
- The root is `Evidence id="range"` with `role="img"` and a spoken summary. Default `className` is `mt-6`.

## `SectionHeading.jsx`

`<SectionHeading title="Labor" meta="1.75 hr at $95/hr" id? className? />`: `h2 text-heading` with an optional right `text-meta tabular-nums` meta, a `line` underline and 16px below. Sections are `mt-10` apart (on your section wrapper). No numbering, no icons.

## `LabelValue.jsx`

`<LabelValue items={[{ label, value, key? }]} strong={false} className />`: 112px label column, `text-ui` values at 22px leading. `strong` (labels in ink-900 500) is only for "Why these three". `key` defaults to `label`.

## `Avatar.jsx`

`<Avatar />`: Mara's 24px initial, from `HOME.owner.first`. The only person avatar. Contractors and the agent get none.

## `HouseMark.jsx`

`<HouseMark className="h-4 w-4" />`: the Rail logo house paths, bare, stroke 1.5. It always renders `text-ink-900` itself (set on the svg), so the row's ink-500 lead color never reaches it. Used once, as the Maple Street row lead.

## Controls

- **`Chip.jsx`**: `<Chip on={bool} onClick disabled>{label}</Chip>` (or `label` prop). 28px, `aria-pressed`, fill shows selection, no check.
- **`Radio.jsx`**
  - `default Radio`: `<Radio checked disabled onClick>{label}</Radio>` (`on` works as an alias of `checked`), a single `role="radio"` row (forwards ref). Use it inside a `RadioGroup`.
  - `RadioGroup`: `<RadioGroup value onChange={(v) => ...} options={[{ value, label, disabled? }]} label="..." | labelledBy="id" disabled className />`. One tab stop (the checked radio, else the first enabled). Arrow keys move focus and select, wrapping; Home and End jump; Space or click selects. `value` may be null (no default, as in close-out Q3). Keyboard focus draws an outline around the circle.
- **`Kbd.jsx`**: `<Kbd>{n}</Kbd>`, the 20px keycap.
- **`Toggle.jsx`**: `<Toggle on onChange={(next) => ...} label="..." | labelledBy="id" disabled />`, `role="switch"`. On is ink-900. The showcase toggle defaults off; never flip that default.

## `Photo.jsx`

`<Photo photo="under-sink" label="Under the sink" note="Slip nut weeping" pin pinVisible={bool} aspect="aspect-[4/3]" align="left" | "right" alt="" className="w-[160px]" />`

- `photo`: a key of `photos` in `src/data/photos.js` (an unknown key renders the empty `bg-canvas-v2` slot).
- `pin`: shows the hollow 20px photo-read pin from `photoPins[photo]`; `pinVisible` fades it (200ms). Pinned photos keep the default 4:3 aspect (the coordinates are measured on the 4:3 frames). When `pin` is on, `note` names what the pin marks.
- Caption under the image: `label` in ink-900 500, `note` in ink-500; omitted when both are empty (Showcase jobs). No overlays on the image.

`photoPins` (in `src/data/photos.js`): `under-sink`, `faucet-base`, `under-sink-after`, `faucet-base-after`, `ac-condenser`.

## `Tabs.jsx`

`<Tabs tabs={[{ id, label, needsYou?, fresh? }]} active="scope" preview={evidenceTabOrNull} onSelect={(id) => ...} label="Views" />`

- One tab renders as a static label (Home, AC and gutters Overviews).
- `needsYou` shows the `Dot` on a non-active tab. `fresh` fades a just-unlocked tab in. `preview` (from Evidence hover) inks the label and shows a 30% underline. The active underline slides (200ms, `layoutId="stage-tab"`).
- Placement: put `<Tabs>` directly in the Stage header row (`flex items-stretch` with `border-b border-line`), or in a wrapper that also stretches to the full header height. The nav reaches 1px over the header's bottom rule so the 2px underline sits on it.

## `DecisionBar.jsx`

`<DecisionBar note="Next: ..." actions={<><Button variant="ghost">...</Button><Button>...</Button></>} />` (`children` works in place of `actions`). Sticky to the panel bottom, 64px, `line` top rule. Resolved: `note={<StatusText state="done">...</StatusText>}` and no actions. Artifact structure so it pins on short documents:

```jsx
<div className="mx-auto flex w-full max-w-[720px] flex-1 flex-col">
  <div className="flex-1">{content}</div>
  <DecisionBar ... />
</div>
```

The Stage scroll wrapper's inner div is `flex min-h-full flex-col px-4 pt-8 lg:px-6 xl:px-8`.

## `Evidence.jsx` (signature 1)

| Export | Use |
|---|---|
| `default Evidence` | `<Evidence id="totals" as="div" artifact? className>`: wraps a proving element. Sets `data-evidence={id}` (and `data-evidence-artifact`), and shows a 40% ink outline on hover, solid ink while held, fading out over 300ms. Extra props pass through |
| `EvidenceContext` | App provides `{ evidence, hover, point }`. Default value is inert (`evidence: null`, no-op functions), so artifacts render without a provider |
| `useEvidence()` | returns that value. `evidence` is `{ artifact, id, mode: 'hover' \| 'hold' } \| null`; `hover(target \| null)`; `point(target)`; `target = { artifact, id }`, `artifact` a tab id or `'home'` |
| `EvidenceScope` | `<EvidenceScope artifact={tabId}>{artifact}</EvidenceScope>`: Stage wraps each staged artifact so ids shared across artifacts (`col:reyes` exists on Contractors and Quotes) only light up for their own artifact. An `artifact` prop on `Evidence` overrides it |
| `useEvidenceHandlers(target)` | Thread lines: `<button {...useEvidenceHandlers({ artifact: 'quotes', id: 'col:reyes' })}>`. Hover and keyboard focus call `hover`, leaving clears it, click calls `point`. `null` target returns `{}` |
| `useEvidenceController({ restage })` | Optional ready-made provider value for App: `const evidence = useEvidenceController({ restage: (artifact) => ... })` then `<EvidenceContext.Provider value={evidence}>`. `point` calls `restage(artifact)` (stage it as a user click), scrolls `[data-evidence]` to center on the next frame, holds 1200ms, then clears. Hover is ignored during a hold |

Evidence ids (contract): scope `totals`; contractors `row:license`, `insurance:eastbay`, `sent`, `recs:${id}`, `col:${id}`; quotes `col:${id}`, `range`, `book:${id}`; schedule `when`; completion `photos`, `report`; home `watch:${id}`.

## `Drawer.jsx`

`<Drawer open={bool} onClose={() => ...} title="Reyes Plumbing" meta="4.8 · 168 reviews · usually replies within 2 hours">{body}</Drawer>`

- Portaled to `body`: flat `bg-ink-900/20` scrim (click closes), panel 440px inset 8px from the top, right and bottom, `rounded-xl`, the float shadow. Slides in over 300ms; the scrim fades over 200ms.
- Header: `text-heading` title and `text-meta tabular-nums` meta, `IconButton X` "Close"; its bottom rule appears once the body scrolls.
- Body: `flex-1 overflow-y-auto px-6 pb-8` around `children` (no top padding, add your own if a block needs air).
- `role="dialog"` with `aria-modal`, focus moves into the panel and returns to the opener on close, Tab is trapped, Escape closes (without reaching the shell's Esc handler). Body scroll is locked with scrollbar compensation.
- No ink-filled button inside a drawer.

## Panels (recipes, no component)

| Panel | Classes |
|---|---|
| Stage panel | `<section className="my-2 mr-2 flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white ring-1 ring-line">`. Focus mode `m-2`. Below 1024 `m-0 rounded-none ring-0` |
| Composer | `<div className="mx-3 mb-3 overflow-hidden rounded-xl bg-white ring-1 ring-line">` |
| Artifact H1 | `<h1 className="text-title text-balance text-ink-900">`, then the status line (`mt-2`), then an optional `mt-1 text-meta tabular-nums text-ink-500` facts line |
