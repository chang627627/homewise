#!/usr/bin/env bash
# design-check — greps the source for common design-system drift patterns
# documented in DESIGN.md. Exits 0 with warnings by default; pass --strict
# to exit 1 when any violations are found.

set -u

STRICT=0
if [[ "${1:-}" == "--strict" ]]; then
  STRICT=1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# Colors
if [[ -t 1 ]]; then
  RED=$'\033[31m'; YELLOW=$'\033[33m'; GREEN=$'\033[32m'; DIM=$'\033[2m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  RED=""; YELLOW=""; GREEN=""; DIM=""; BOLD=""; RESET=""
fi

VIOLATIONS=0
WARNINGS=0

section() {
  echo
  echo "${BOLD}$1${RESET}"
}

# --- 1. Raw hex in Tailwind arbitrary values ----------------------------------
section "1. Raw hex in Tailwind classes (use a token instead)"
HEX_MATCHES=$(grep -rn -E '(bg|text|ring|border|fill|stroke|from|to|via)-\[#[0-9A-Fa-f]{3,8}' src/ --include='*.jsx' --include='*.js' --include='*.tsx' --include='*.ts' 2>/dev/null || true)
if [[ -n "$HEX_MATCHES" ]]; then
  COUNT=$(echo "$HEX_MATCHES" | wc -l | tr -d ' ')
  echo "${RED}✗ $COUNT match(es)${RESET}"
  echo "$HEX_MATCHES" | head -20 | sed 's/^/  /'
  VIOLATIONS=$((VIOLATIONS + COUNT))
else
  echo "${GREEN}✓ none${RESET}"
fi

# --- 2. Em dashes in JSX text content -----------------------------------------
section "2. Em dashes in JSX (banned in user-facing copy)"
# Grep for em dashes, then strip out comment lines:
#   - // single-line comments
#   - * JSDoc continuation lines
#   - {/* ... */} JSX block comments (filtered when the line contains {/*)
# False positives still possible — eyeball anything that survives.
EMDASH_MATCHES=$(grep -rn '—' src/ --include='*.jsx' --include='*.js' --include='*.tsx' --include='*.ts' 2>/dev/null \
  | grep -v -E ':[[:space:]]*//' \
  | grep -v -E ':[[:space:]]*\*' \
  | grep -v -F '{/*' \
  | grep -v -E '//[^"'"'"']*—' \
  || true)
if [[ -n "$EMDASH_MATCHES" ]]; then
  COUNT=$(echo "$EMDASH_MATCHES" | wc -l | tr -d ' ')
  echo "${RED}✗ $COUNT match(es) ${DIM}(comment lines filtered, may still include false positives)${RESET}"
  echo "$EMDASH_MATCHES" | head -20 | sed 's/^/  /'
  VIOLATIONS=$((VIOLATIONS + COUNT))
else
  echo "${GREEN}✓ none${RESET}"
fi

# --- 3. Banned shadow tokens --------------------------------------------------
section "3. Banned shadow utilities (no shadows in this design system)"
SHADOW_MATCHES=$(grep -rn -E 'shadow-(soft|card|glow|inset-soft)' src/ --include='*.jsx' --include='*.js' --include='*.tsx' --include='*.ts' 2>/dev/null || true)
if [[ -n "$SHADOW_MATCHES" ]]; then
  COUNT=$(echo "$SHADOW_MATCHES" | wc -l | tr -d ' ')
  echo "${RED}✗ $COUNT match(es)${RESET}"
  echo "$SHADOW_MATCHES" | head -20 | sed 's/^/  /'
  VIOLATIONS=$((VIOLATIONS + COUNT))
else
  echo "${GREEN}✓ none${RESET}"
fi

# --- 4. Inline px sizes (warning only — too common to block) -----------------
section "4. Inline text-[Npx] sizes ${DIM}(warning: use a named type role when one exists)${RESET}"
INLINE_PX=$(grep -rn -E 'text-\[[0-9]+(\.[0-9]+)?px\]' src/ --include='*.jsx' --include='*.js' --include='*.tsx' --include='*.ts' 2>/dev/null || true)
if [[ -n "$INLINE_PX" ]]; then
  COUNT=$(echo "$INLINE_PX" | wc -l | tr -d ' ')
  echo "${YELLOW}⚠ $COUNT match(es) ${DIM}(warning, does not fail --strict)${RESET}"
  echo "$INLINE_PX" | head -10 | sed 's/^/  /'
  if [[ $COUNT -gt 10 ]]; then
    echo "  ${DIM}... and $((COUNT - 10)) more${RESET}"
  fi
  WARNINGS=$((WARNINGS + COUNT))
else
  echo "${GREEN}✓ none${RESET}"
fi

# --- Summary ------------------------------------------------------------------
echo
echo "${BOLD}Summary${RESET}"
echo "  Violations: $VIOLATIONS"
echo "  Warnings:   $WARNINGS"

if [[ $VIOLATIONS -gt 0 ]]; then
  if [[ $STRICT -eq 1 ]]; then
    echo
    echo "${RED}${BOLD}FAIL${RESET} (--strict)"
    exit 1
  else
    echo
    echo "${YELLOW}Run with --strict to fail on violations.${RESET}"
  fi
fi

if [[ $VIOLATIONS -eq 0 && $WARNINGS -eq 0 ]]; then
  echo
  echo "${GREEN}${BOLD}OK${RESET} — no drift detected."
fi

exit 0
