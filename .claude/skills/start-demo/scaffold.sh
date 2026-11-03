#!/usr/bin/env bash
# Scaffold a blank Next.js demo site in the standard format.
# Usage: scaffold.sh <target-dir>
#   target-dir defaults to "./site"
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SKILL_DIR/template"
TARGET="${1:-site}"

if [ -e "$TARGET" ] && [ -n "$(ls -A "$TARGET" 2>/dev/null || true)" ]; then
  echo "ERROR: target '$TARGET' already exists and is not empty. Aborting." >&2
  exit 1
fi

echo "Scaffolding demo site into: $TARGET"
mkdir -p "$TARGET"
# Copy template tree (dotfiles included via the . trailing form)
cp -R "$TEMPLATE/." "$TARGET/"
# Restore the ignore file to its dot name
if [ -f "$TARGET/gitignore" ]; then
  mv "$TARGET/gitignore" "$TARGET/.gitignore"
fi

echo "Installing dependencies (npm install)..."
cd "$TARGET"
npm install

echo ""
echo "Done. Standard demo stack ready:"
echo "  Next.js 16 (App Router, TS) · React 19 · Tailwind v4"
echo "  Lenis · GSAP · Framer Motion · Three.js · clsx + tailwind-merge (cn)"
echo ""
echo "Start it with:  (cd $TARGET && npm run dev)  ->  http://localhost:3000"
