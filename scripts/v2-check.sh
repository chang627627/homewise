#!/usr/bin/env bash
# V2 acceptance greps (visual spec 7.1). Every check must find nothing.
#
# Usage: scripts/v2-check.sh [file-or-dir ...]
#   With no arguments it checks the V2 set:
#   src/App.jsx src/components/shell src/components/artifacts src/components/v2
#
# Uses ripgrep when an rg binary is on PATH, otherwise grep -E (and perl for
# the two checks that need lookahead or \s). Exits 1 if any check has a hit,
# 2 on a usage problem, 0 when everything is clean.

set -u
ROOT="$(CDPATH= cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"

# Arguments resolve against the caller's directory, then become repo-relative
# so the per-file exclusions below match absolute and relative paths alike.
if [ "$#" -gt 0 ]; then
  TARGETS=()
  for t in "$@"; do
    d="$(CDPATH= cd -- "$(dirname -- "$t")" 2>/dev/null && pwd)" || { echo "v2-check: skipping missing path: $t" >&2; continue; }
    a="$d/$(basename -- "$t")"
    if [ "$a" = "$ROOT/." ] || [ "$a" = "$ROOT" ]; then a="."; else a="${a#"$ROOT"/}"; fi
    TARGETS+=("$a")
  done
  DEFAULT_SET=0
else
  TARGETS=(src/App.jsx src/components/shell src/components/artifacts src/components/v2)
  DEFAULT_SET=1
fi
cd "$ROOT" || exit 2

PATHS=()
for t in "${TARGETS[@]+"${TARGETS[@]}"}"; do
  if [ -e "$t" ]; then PATHS+=("$t"); else echo "v2-check: skipping missing path: $t" >&2; fi
done
if [ "${#PATHS[@]}" -eq 0 ]; then
  echo "v2-check: nothing to check" >&2
  exit 2
fi

FILES=()
while IFS= read -r -d '' f; do FILES+=("$f"); done < <(find "${PATHS[@]}" -type f \( -name '*.js' -o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' -o -name '*.css' -o -name '*.md' \) -print0)
if [ "${#FILES[@]}" -eq 0 ]; then
  echo "v2-check: no source files under: ${PATHS[*]}" >&2
  exit 2
fi

HAVE_RG=0
if [ "$(type -t rg 2>/dev/null)" = "file" ]; then HAVE_RG=1; fi

# ere PATTERN: extended regex over every file, printed as file:line:text.
ere() {
  if [ "$HAVE_RG" = 1 ]; then
    rg -nH --no-heading --color never -e "$1" -- "${FILES[@]}"
  else
    grep -nE -e "$1" -- "${FILES[@]}" /dev/null
  fi
}

# pcre PATTERN: Perl-compatible regex (lookahead, \s).
pcre() {
  if [ "$HAVE_RG" = 1 ]; then
    rg -nHP --no-heading --color never -e "$1" -- "${FILES[@]}"
  else
    perl -ne 'BEGIN { $re = shift @ARGV } print "$ARGV:$.:$_" if /$re/; close ARGV if eof' "$1" "${FILES[@]}"
  fi
}

HITS=0
report() { # report NAME OUTPUT
  if [ -n "$2" ]; then
    HITS=$((HITS + 1))
    echo "FAIL  $1"
    printf '%s\n' "$2" | sed 's/^/      /'
  fi
}

report "banned imports and glyphs" "$(ere 'Sparkles|Pill|ui/Button|ui/Card|ui/IconButton|ui/PhotoFill|pages/ScopePage|\bBell\b|ChevronRight|ChevronsUpDown')"
report "type outside the five tokens" "$(ere 'text-\[|text-(xs|sm|base|lg|xl|2xl|3xl)\b|font-bold|uppercase|italic|tracking-')"
report "radii outside the scale" "$(ere 'rounded-(sm|2xl|3xl|tr|tl|br|bl|\[)|rounded("|'"'"'| |`|$)')"
report "retired utilities" "$(ere 'grain|hairline|editorial|["'"'"' ]figure["'"'"' ]|glass|dot-grid|shimmer|pulseDot|backdrop-blur|active:scale|mode="wait"')"
report "native title tooltips on DOM tags" "$(pcre '<(button|span|div|a|img|svg|li|p|section|nav)\b[^>]*\stitle=')"
report "-50 steps (V2 uses -wash)" "$(ere '(sage|ember|sky2026|ink|canvas)-50\b')"
report "shadows" "$(ere 'shadow-(soft|card|glow|inset|sm|md|lg|xl|2xl)')"
report "delay: outside ScopeArtifact" "$(ere 'delay:' | grep -v 'ScopeArtifact')"
report "em dashes" "$(ere '—')"
report "strokeWidth other than 1.5" "$(pcre 'strokeWidth=\{(?!1\.5\})')"

# Color allowlist: any palette utility outside the V2 set.
TOKEN='\b(bg|text|border|ring|outline|divide|decoration|fill|stroke|placeholder)-(canvas|ink|sage|ember|sky2026|line|shade)(-[a-z0-9]+)?'
ALLOWED='^(bg|text|border|ring|outline|divide|decoration|fill|stroke|placeholder)-(ink-(900|700|500|300|200)|sage-(500|600|wash)|ember-(400|500|wash)|sky2026-(500|700|wash)|canvas-v2|line|shade-(1|2|3))$'
if [ "$HAVE_RG" = 1 ]; then
  BAD="$(rg -oN --no-filename --color never -e "$TOKEN" -- "${FILES[@]}" | sort -u | grep -vE "$ALLOWED")"
else
  BAD="$(grep -ohE -e "$TOKEN" -- "${FILES[@]}" | sort -u | grep -vE "$ALLOWED")"
fi
WHERE=""
if [ -n "$BAD" ]; then
  while IFS= read -r tok; do
    WHERE+="$tok"$'\n'"$(ere "\\b${tok}([^a-z0-9-]|$)" | sed 's/^/  /')"$'\n'
  done <<< "$BAD"
fi
report "colors outside the V2 allowlist" "${WHERE%$'\n'}"

# The one loop lives in Status.jsx; the float shadow only on drawers and the
# compact Rail overlay.
report "animate-spin outside v2/Status.jsx" "$(ere 'animate-spin' | grep -vE '(^|/)src/components/v2/Status\.jsx:')"
report "shadow-float outside Drawer and Rail" "$(ere 'shadow-float' | grep -vE '(^|/)src/components/(v2/Drawer|shell/Rail)\.jsx:')"

# Shared code stays byte-identical (default set only).
if [ "$DEFAULT_SET" = 1 ] && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  report "changes in src/components/ui or index.html" "$(git --no-pager diff --stat -- src/components/ui index.html)"
  report "removed lines in tailwind.config.js" "$(git --no-pager diff --numstat -- tailwind.config.js | awk '$2 != 0')"
fi

if [ "$HITS" -gt 0 ]; then
  echo "v2-check: $HITS check(s) failed"
  exit 1
fi
echo "v2-check: clean (${#FILES[@]} files)"
