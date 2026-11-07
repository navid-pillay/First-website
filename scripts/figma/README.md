# Figma board of the draft

The Figma file **"Power FC draft – all frames"** shows every moment of the
`/draft` page as editable frames:
https://www.figma.com/design/gnfJoLPSMTMD4B2typn7jT (file key `gnfJoLPSMTMD4B2typn7jT`).

## Layout of the file (page "Draft – all frames")

| Frame | Node id | Captured |
|---|---|---|
| 1 · Opening: the lines draw in | `2:75` | desktop 1440×900, ~0.8s after load, animations paused |
| 2 · Opening: the player forms from dots | `2:79` | desktop, ~2.15s after load |
| 3 · The finished hero | `2:83` | desktop, after the opening |
| 4 · Scrolling: the slime crawls down | `2:87` | desktop, scrolled ~620px |
| 5 · The two programs | `2:91` | desktop, scrolled to the end |
| 6 · The whole page (desktop) | `2:95` | desktop, full page (hero copied from frame 3 + section below) |
| 7 · Phone: the hero | `2:99` | 390×844 |
| 8 · Phone: the programs | `2:103` | phone, scrolled to the end |
| 9 · Phone: the whole page | `2:107` | phone, full page |

Above each frame is a note (`Note · …`) saying what moves. Top left is a
"How to use this file" guide; top right "Colours, fonts and parts" with the
logo components: `Logo / Power FC crest` (`2:70`) and `Logo / Power Soccer`
(`2:71`, image fill).

## Updating it after the draft changes

1. Build the site with `NEXT_PUBLIC_BASE_PATH=/First-website npm run build`
   and serve `out/` at `/First-website/` (e.g. copy it to `<dir>/First-website`
   and run `python3 -m http.server 4173` in `<dir>`).
2. Copy this folder to a scratch directory and run `node capture.js .` there.
   It writes one JSON per moment (`d1-…`, `p3-…`) plus `asset-<sha>.png`
   images (canvases, logo, photo). Then `python3 post.py` cleans the capture
   and writes `code-<frame>-0.js` Figma scripts (via `gen.py` + `builder.js`).
   `gen.py` reads `hashes.txt` (`<asset file> <full sha1>` per line,
   `sha1sum asset-*.png`).
3. Upload new images with the Figma MCP `upload_assets` tool (POST each PNG to
   its URL; needs `mcp.figma.com` allowed). Figma's image hash is the file's
   SHA-1, so the scripts set image fills directly by hash.
4. Clear the changed frame's children, then run its `code-…js` with
   `use_figma` (one call per frame; each must stay under 50k characters).
   For a new moment, add a frame + note in the same style and add it here.

Known limits: Figma has no gooey blur, so slime/blobs are circles joined by
thick round strokes; animations are shown as still moments.
