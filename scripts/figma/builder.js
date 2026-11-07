// Shared builder: appends items (from the browser capture) into a frame.
const FR = await figma.getNodeByIdAsync(FRAME_ID);
await Promise.all([
  figma.loadFontAsync({ family: "Audiowide", style: "Regular" }),
  figma.loadFontAsync({ family: "Roboto Mono", style: "Regular" }),
  figma.loadFontAsync({ family: "Roboto Mono", style: "Medium" }),
  figma.loadFontAsync({ family: "Roboto Mono", style: "SemiBold" }),
  figma.loadFontAsync({ family: "Roboto Mono", style: "Bold" }),
  figma.loadFontAsync({ family: "Inter", style: "Regular" }),
]);
const comps = {};
for (const [k, id] of Object.entries(COMPONENTS)) comps[k] = await figma.getNodeByIdAsync(id);
const mono = (w) => (w >= 700 ? "Bold" : w >= 600 ? "SemiBold" : w >= 500 ? "Medium" : "Regular");
const solid = (c) => ({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b } });
const created = [], images = [], errors = [];
for (const it of ITEMS) {
  try {
    let n;
    if (it.t === "rect") {
      n = figma.createRectangle(); n.resize(Math.max(it.w, 0.01), Math.max(it.h, 0.01));
      n.fills = [solid(it.fill)]; n.name = it.name === "Block" ? (it.h <= 1.5 || it.w <= 1.5 ? "Hairline rule" : "Block") : it.name;
    } else if (it.t === "fade") {
      n = figma.createRectangle(); n.resize(it.w, it.h); n.name = it.name;
      n.fills = [{ type: "GRADIENT_LINEAR", gradientTransform: [[0, 1, 0], [-1, 0, 1]], gradientStops: [
        { position: 0, color: { r: 0.949, g: 0.949, b: 0.933, a: 0.92 } }, { position: 1, color: { r: 0.949, g: 0.949, b: 0.933, a: 0 } }] }];
    } else if (it.t === "text") {
      n = figma.createText();
      n.fontName = it.font === "display" ? { family: "Audiowide", style: "Regular" } : it.font === "mono" ? { family: "Roboto Mono", style: mono(it.weight) } : { family: "Inter", style: "Regular" };
      n.characters = it.s; n.fontSize = it.size;
      n.letterSpacing = { unit: "PIXELS", value: it.ls || 0 };
      n.lineHeight = { unit: "PIXELS", value: Math.max(1, it.h) };
      n.fills = it.color && it.color.a > 0.01 ? [{ ...solid(it.color), opacity: it.color.a }] : [];
      if (it.stroke) { n.strokes = [{ ...solid(it.stroke.color), opacity: it.stroke.color.a }]; n.strokeWeight = it.stroke.w; }
      n.textAutoResize = "WIDTH_AND_HEIGHT";
      n.name = it.s.slice(0, 40);
    } else if (it.t === "svg") {
      const comp = it.name === "Power FC crest" || it.name === "Power FC" ? comps.crest : null;
      if (comp) { n = comp.createInstance(); n.rescale(it.h / comp.height); }
      else { n = figma.createNodeFromSvg(it.svg); n.name = it.name; }
      if (it.shadow) n.effects = [{ type: "DROP_SHADOW", color: { r: 0.05, g: 0.06, b: 0.055, a: 0.9 }, offset: { x: 8 * it.h / 221, y: 10 * it.h / 221 }, radius: 0, spread: 0, visible: true, blendMode: "NORMAL" }];
    } else if (it.t === "img") {
      if (it.key === LOGO_ASSET && comps.logo) { n = comps.logo.createInstance(); n.resize(it.w, it.h); n.name = "Power Soccer logo"; }
      else {
        n = figma.createRectangle(); n.resize(it.w, it.h); n.name = it.name;
        n.fills = [{ type: "IMAGE", imageHash: HASHES[it.key], scaleMode: "FILL" }];
        images.push(n.id);
      }
    }
    if (!n) continue;
    FR.appendChild(n);
    n.x = it.x; n.y = it.y;
    if (it.t === "text") {
      if (it.align === "right" || it.align === "end") n.x = it.x + it.w - n.width;
      else if (it.align === "center") n.x = it.x + (it.w - n.width) / 2;
      if (it.skew) {
        const c = Math.tan(it.skew * Math.PI / 180), h = n.height;
        try { n.relativeTransform = [[1, c, n.x - c * h / 2], [0, 1, n.y]]; } catch (e) { errors.push("skew: " + e.message); }
      }
    }
    if (it.a !== undefined && it.a < 0.999) n.opacity = Math.max(0, Math.min(1, it.a));
    if (it.blend === "multiply") n.blendMode = "MULTIPLY";
    created.push(n.id);
  } catch (e) { errors.push(`${it.t} ${it.name}: ${e.message}`); }
}
return { frame: FR.id, created: created.length, images, errors: errors.slice(0, 10) };
