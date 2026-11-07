@AGENTS.md

## Figma board of the draft

The owner keeps a Figma file of the `/draft` page: "Power FC draft – all
frames", https://www.figma.com/design/gnfJoLPSMTMD4B2typn7jT. It is a set of
editable frames, one per moment (opening, hero, scrolling, programs, full
page; desktop and phone), with a note above each.

- PAUSED: the owner has asked to leave Figma alone for now (their Figma plan's
  tool-call limit is used up). Don't update Figma until they say to resume.
  When resumed: frame 4 still shows the old snake-shaped slime (the draft now
  has a ball) and its note still says "crawls".
- Whenever you change the draft (anything shown on `/draft`), also update the
  Figma file in the same task: rebuild the frames the change affects, and add
  a new frame + note for any new moment or section. Tell the owner which
  frames you updated. The tools and steps are in `scripts/figma/README.md`.
- When the owner says they changed something in Figma, read the file with the
  Figma tools (get_screenshot / use_figma reads) and make the draft match, then
  re-sync the frames so Figma and the site agree.
- Never publish the old site's pages from the draft; the draft stands alone.
