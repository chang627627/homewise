# Contributing to Homewise

Homewise is built feature-by-feature with [Claude Code](https://claude.com/claude-code), backed by the **Hearth · v1** design system. This guide covers onboarding, how to use Claude Code with Hearth, and how to extend the design system without breaking consistency.

## First-time setup

```bash
git clone https://github.com/chang627627/homewise.git
cd homewise
npm install
```

Make sure Claude Code is installed (claude.com/claude-code). It auto-loads `CLAUDE.md` + `DESIGN.md` from this repo, so the design system is in the agent's context from your first message.

## Every working session

1. **Pull the latest:**
   ```bash
   git pull
   ```
   This refreshes the Hearth tokens, components, and CLAUDE.md rules. Claude Code reads them on its next session start.

2. **Start Claude Code** in the repo directory.

3. **Describe the feature in plain English**, not in pixel terms:

   ```
   GOOD:  "Add a Documents page where users can upload receipts"
   BAD:   "Make a sage card with ember badges and Geist 500 at 24px"
   ```

   Claude Code fills in the visuals from Hearth automatically. You don't need to say "follow the design system."

4. **Preview locally:**
   ```bash
   npm run dev          # http://localhost:5173
   ```

5. **Before pushing, run the drift linter:**
   ```bash
   npm run design-check
   ```
   It catches em dashes in user copy, raw hex in Tailwind classes, banned shadow utilities, and other drift patterns. Run with `--strict` to fail on violations.

## PR workflow

Main is protected: non-admins can't push directly.

```bash
git checkout -b feature/your-feature-name
git add .
git commit -m "Brief description of what shipped"
git push -u origin feature/your-feature-name
gh pr create
```

The owner reviews and merges. Vercel auto-deploys main within ~30 seconds.

## Using the Hearth design system

### Use existing components

The system already covers most needs. Route through these primitives:

| For | Use |
|---|---|
| Buttons | [src/components/ui/Button.jsx](src/components/ui/Button.jsx) (6 variants × 3 sizes) |
| Status pills | [src/components/ui/Pill.jsx](src/components/ui/Pill.jsx) (6 tones) |
| Cards | [src/components/ui/Card.jsx](src/components/ui/Card.jsx) (4 variants) |
| Confidence bars | [src/components/ui/Confidence.jsx](src/components/ui/Confidence.jsx) |
| Section dividers | [src/components/ui/Rule.jsx](src/components/ui/Rule.jsx) (the brand gesture) |
| Page headers | [src/components/ui/PageHeader.jsx](src/components/ui/PageHeader.jsx) |
| Back navigation | [src/components/ui/BackBar.jsx](src/components/ui/BackBar.jsx) |
| Flow progress | [src/components/ui/FlowProgress.jsx](src/components/ui/FlowProgress.jsx) |

For tokens (colors, type roles, spacing, hairlines), see **[DESIGN.md](DESIGN.md)** or the visual reference at https://homewise-rust.vercel.app/designsystem.

### Voice rules

- **No em dashes** in user-facing copy. Use periods, commas, colons, or the middle dot (·).
- **Sentence case** for all headings.
- **Plain language** for AI narration. Italics are quote markers, not decoration.
- **No technical claims as trust signals.** Lead with what the user actually cares about ("No contractor sees your home until you ask" beats "End-to-end encrypted").

The `design-check` script catches the em-dash violation automatically.

### Proposing new tokens or components

Need something the system doesn't have yet? **Don't add it to DESIGN.md directly.** All new visual additions go through a review gate.

1. Append a proposal to [src/data/design-pending.js](src/data/design-pending.js):

   ```js
   {
     id: 'color-2026-05-12-001',
     type: 'color',
     name: 'sage-tint',
     description: 'Lighter sage variant for very subtle AI moments...',
     proposedBy: 'Your name',
     proposedDate: '2026-05-12',
     preview: { kind: 'swatch', bg: '#F8FAF6', hex: '#F8FAF6' },
   }
   ```

   Valid `type` values: `color`, `type`, `component`, `pattern`, `hairline`, `texture`, `other`.

2. Your proposal will surface at the top of `/designsystem` under "Pending review" with a sage "Awaiting your approval" pill.

3. The owner reviews. If approved, they move the spec into DESIGN.md + the main `DesignSystemPage` section. If rejected, they remove the entry.

This gate keeps the design system from drifting. **Don't bypass it.** Bypassing it means the visual reference page and the canonical spec fall out of sync.

## Common tasks

### Adding a new page

1. Describe it in plain English to Claude Code
2. Claude adds the page component in `src/pages/`
3. Claude registers it in the `pageMap` in [App.jsx](src/App.jsx)
4. Claude adds navigation (sidebar item, CTA, or both)
5. Run `npm run design-check`

### Updating an existing token across the app

1. Update the value in [tailwind.config.js](tailwind.config.js) (for colors and spacing) or [src/index.css](src/index.css) (for utility classes)
2. Update [DESIGN.md](DESIGN.md) to reflect the change
3. Update the swatch or example in [src/pages/DesignSystemPage.jsx](src/pages/DesignSystemPage.jsx) if visible there
4. Run `npm run design-check`

This is a token *change*, not a new addition, so it does NOT need to go through the pending gate.

### Modifying the state machine

The app's state lives at the top of [App.jsx](src/App.jsx). Don't add new state unless it needs to persist across pages. Use local component state otherwise. See [CLAUDE.md](CLAUDE.md) for the state-machine documentation.

## What NOT to do

These rules are also documented in [CLAUDE.md](CLAUDE.md):

- **Don't reintroduce shadows.** Use border + ring + background contrast.
- **Don't use serif typefaces.** Geist sans-only.
- **Don't use type sizes above 52px.** Sans reads shouty at larger sizes.
- **Don't put em dashes in user copy.**
- **Don't hand-roll buttons / pills / cards** outside `src/components/ui/`.
- **Don't bypass the pending-review gate** for new tokens.
- **Don't add a fourth color role** beyond sage / ember / sky2026.
- **Don't add a fourth surface tier** beyond canvas / canvas-soft / card-white / canvas-deep / ink-900.
- **Don't push directly to main without a PR** unless you're the admin.

## Questions

Open an issue, ping the owner, or read [CLAUDE.md](CLAUDE.md) for the full project context.
