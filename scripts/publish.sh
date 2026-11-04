#!/usr/bin/env bash
# Builds the static site and publishes it to the branch GitHub Pages serves
# (add-power-fc-site) at https://navid-pillay.github.io/First-website/
set -euo pipefail
cd "$(dirname "$0")/.."
# A new id per publish lets open pages notice that a newer version is live.
build_id="$(date -u +%Y%m%d%H%M%S)-$(git rev-parse --short HEAD)"
NEXT_PUBLIC_BASE_PATH=/First-website NEXT_PUBLIC_BUILD_ID="$build_id" npm run build
printf '%s\n' "$build_id" > out/version.txt
tmp=$(mktemp -d)
git fetch -q origin add-power-fc-site
git worktree add -q "$tmp" origin/add-power-fc-site
(
  cd "$tmp"
  git checkout -q -B add-power-fc-site origin/add-power-fc-site
  git rm -rq --ignore-unmatch .
  cp -r "$OLDPWD/out/." .
  touch .nojekyll
  git add -A
  git commit -qm "Publish site from $(git -C "$OLDPWD" rev-parse --short HEAD)" || echo "No changes to publish"
  git push -q origin add-power-fc-site
)
git worktree remove --force "$tmp"
