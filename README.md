# Homewise

A 2026 AI home command center prototype. Demonstrates a homeowner using an AI agent to find, vet, and hire home contractors: empty state → intake → scope → contractor compare → quote compare → booking → completion.

**Live:** https://homewise-rust.vercel.app
**Design system:** [Hearth · v1](https://homewise-rust.vercel.app/designsystem)

## What's here

- Single-page React app, no backend, state-based pseudo-routing in `App.jsx`
- Vite 5 + React 18 + Tailwind 3 + framer-motion + lucide-react + Geist
- **Hearth · v1** design system: tokens in [DESIGN.md](DESIGN.md), visual reference at [/designsystem](https://homewise-rust.vercel.app/designsystem), drift linter via `npm run design-check`
- Pending-review gate for new design tokens (see [CONTRIBUTING.md](CONTRIBUTING.md))

## Getting Started

Please use the GitHub repo version of this project, not a downloaded ZIP. This keeps your local project connected to GitHub so `git pull` works, and you can always get the latest Homewise files, Hearth tokens, and design rules.

### First-time setup

1. Open Terminal.

2. Clone the repo:
   ```bash
   git clone https://github.com/chang627627/homewise.git
   ```

3. Go into the project folder:
   ```bash
   cd homewise
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the local preview:
   ```bash
   npm run dev
   ```

6. Open the app in your browser:
   ```
   http://localhost:5173
   ```

### Before every working session

Pull the latest version:

```bash
git pull
```

This updates your local project with the latest Homewise files, Hearth design system tokens, and rules.

### Working with Claude Code

Start Claude Code inside the `homewise` repo folder. It automatically reads `CLAUDE.md` and `DESIGN.md`, so it already understands the Hearth design system.

Describe the feature in plain English, not the visuals.

Example:

> Add a Documents page for receipt uploads.

Claude Code will apply Hearth tokens, components, and voice rules automatically.

### Before pushing

Run the design check:

```bash
npm run design-check
```

This catches design drift such as raw hex values, banned shadows, or voice issues.

### Submitting your work

Please don't push directly to `main`. Work on your own branch and open a PR:

```bash
git checkout -b feature/your-name
git add .
git commit -m "Brief description"
git push -u origin feature/your-name
gh pr create
```

If `gh pr create` doesn't work, push your branch first, then open the PR directly on GitHub.

After the PR is reviewed and merged, Vercel will automatically deploy the latest version.

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
