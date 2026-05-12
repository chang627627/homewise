# Homewise

A 2026 AI home command center prototype. Demonstrates a homeowner using an AI agent to find, vet, and hire home contractors: empty state → intake → scope → contractor compare → quote compare → booking → completion.

**Live:** https://homewise-rust.vercel.app
**Design system:** [Hearth · v1](https://homewise-rust.vercel.app/designsystem)

## What's here

- Single-page React app, no backend, state-based pseudo-routing in `App.jsx`
- Vite 5 + React 18 + Tailwind 3 + framer-motion + lucide-react + Geist
- **Hearth · v1** design system: tokens in [DESIGN.md](DESIGN.md), visual reference at [/designsystem](https://homewise-rust.vercel.app/designsystem), drift linter via `npm run design-check`
- Pending-review gate for new design tokens (see [CONTRIBUTING.md](CONTRIBUTING.md))

## Quickstart

```bash
git clone https://github.com/chang627627/homewise.git
cd homewise
npm install
npm run dev          # http://localhost:5173
```

## Project docs

| File | Purpose |
|---|---|
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to add features with Claude Code + the design system |
| [CLAUDE.md](CLAUDE.md) | How the project is built (state machine, page flows, deploy) |
| [DESIGN.md](DESIGN.md) | Hearth · v1 design system (tokens, components, voice) |
| `/designsystem` (live) | Visual reference for every Hearth token + component |

## Stack

- **Vite 5** + **React 18** + **Tailwind 3**
- **framer-motion** for page transitions and animations
- **lucide-react** for icons (at strokeWidth 1.8 by Hearth convention)
- **Geist** for type (sans-only, no serif anywhere)
- No tests, no backend, no auth, no URL router (state-based routing in [App.jsx](src/App.jsx))

## Deploy

`git push origin main` triggers a Vercel auto-deploy to https://homewise-rust.vercel.app within ~30 seconds. Main is protected: non-admins open PRs (see [CONTRIBUTING.md](CONTRIBUTING.md)).

---

Built with [Claude Code](https://claude.com/claude-code). It auto-loads `CLAUDE.md` + `DESIGN.md` from this repo so the design system is the default behavior, not something you have to ask for.
