// Runs in the page. Walks the visible DOM and returns drawable items in paint
// order, in frame coordinates. mode: "viewport" (clip to the window) or "page".
window.__extract = (mode, canvasOverride) => {
  const sy = mode === "page" ? window.scrollY : 0;
  const W = innerWidth, H = mode === "page" ? document.documentElement.scrollHeight : innerHeight;
  const items = [], images = {};
  const css = (el) => getComputedStyle(el);
  const rgba = (s) => {
    const m = s.match(/-?[\d.]+(e-?\d+)?/g); if (!m) return null;
    const v = m.map(Number), alpha = v[3] === undefined ? 1 : v[3];
    if (s.startsWith("oklab")) {
      const [L, A, B] = v;
      const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3, mm = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3, ss = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
      const lin = [4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss, -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss, -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * ss];
      const g = lin.map((c) => Math.min(1, Math.max(0, c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055)));
      return { r: g[0], g: g[1], b: g[2], a: alpha };
    }
    return { r: v[0] / 255, g: v[1] / 255, b: v[2] / 255, a: alpha };
  };
  const opacityOf = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +css(e).opacity; return o; };
  const blendOf = (el) => { for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const b = css(e).mixBlendMode; if (b && b !== "normal") return b; } return "normal"; };
  const inHeader = (el) => !!el.closest("header");
  const box = (r, el) => ({ x: r.left, y: r.top + (inHeader(el) ? 0 : sy), w: r.width, h: r.height });
  const visible = (b) => b.w > 0.5 && b.h > 0.5 && b.x < W && b.x + b.w > 0 && b.y < H && b.y + b.h > 0;
  const zOf = (el) => { let z = 0; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const s = css(e); if (s.position !== "static" && s.zIndex !== "auto") z = Math.max(z, +s.zIndex); } return z; };
  let order = 0;
  const push = (it, el) => { it.z = zOf(el); it.o = order++; items.push(it); };
  const hex = (c) => "#" + [c.r, c.g, c.b].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("");

  const sampleD = (path, frac, sx, sy2) => {
    const L = path.getTotalLength(), n = Math.max(8, Math.round(80 * frac));
    const pts = [];
    for (let i = 0; i <= n; i++) { const p = path.getPointAtLength((i / n) * frac * L); pts.push(`${(p.x * sx).toFixed(1)},${(p.y * sy2).toFixed(1)}`); }
    return "M" + pts.join(" L");
  };

  const handleSvg = (svg) => {
    const r = svg.getBoundingClientRect(), b = box(r, svg);
    if (!visible(b)) return;
    const color = rgba(css(svg).color);
    const o = opacityOf(svg), blend = blendOf(svg);
    const vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal : null;
    const goo = svg.querySelector("filter feColorMatrix");
    let out;
    if (goo) {
      // Gooey blobs: circles + thick round strokes in green, no filter.
      const g = svg.querySelector("g[filter]");
      const sw = g ? +(g.getAttribute("stroke-width") || 0) : 0;
      const parts = [];
      svg.querySelectorAll("polyline").forEach((pl) => { const pts = pl.getAttribute("points"); if (pts && sw) parts.push(`<polyline points="${pts}" fill="none" stroke="#42e202" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`); });
      svg.querySelectorAll("circle").forEach((c) => { const rr = +c.getAttribute("r"); if (rr > 0.3) parts.push(`<circle cx="${c.getAttribute("cx")}" cy="${c.getAttribute("cy")}" r="${rr}" fill="#42e202"/>`); });
      if (!parts.length) return;
      const vbs = vb ? `${vb.x} ${vb.y} ${vb.width} ${vb.height}` : `0 0 ${r.width} ${r.height}`;
      out = `<svg xmlns="http://www.w3.org/2000/svg" width="${r.width.toFixed(1)}" height="${r.height.toFixed(1)}" viewBox="${vbs}">${parts.join("")}</svg>`;
      push({ t: "svg", ...b, svg: out, a: o, blend, name: "Green blob" }, svg);
      return;
    }
    const clone = svg.cloneNode(true);
    const stretch = svg.getAttribute("preserveAspectRatio") === "none" && vb;
    const sx = stretch ? r.width / vb.width : 1, sy2 = stretch ? r.height / vb.height : 1;
    // Paths: drop partly traced ones to their drawn part; stretch if needed.
    const orig = svg.querySelectorAll("path"), copies = clone.querySelectorAll("path");
    orig.forEach((p, i) => {
      const cp = copies[i], s = css(p);
      const off = parseFloat(s.strokeDashoffset) || 0, dash = s.strokeDasharray;
      const traced = dash && dash !== "none" && p.getAttribute("pathLength");
      const frac = traced ? Math.max(0, Math.min(1, 1 - off)) : 1;
      cp.removeAttribute("pathLength"); cp.removeAttribute("vector-effect"); cp.removeAttribute("class"); cp.removeAttribute("style");
      if (frac < 0.002) { cp.remove(); return; }
      if (stretch || frac < 0.998) cp.setAttribute("d", sampleD(p, frac, sx, sy2));
      const so = +s.opacity; if (so < 1) cp.setAttribute("opacity", String(so * (+(p.getAttribute("opacity") || 1)) / (+(p.getAttribute("opacity") || 1))));
    });
    clone.querySelectorAll("[class]").forEach((e) => e.removeAttribute("class"));
    clone.removeAttribute("class"); clone.removeAttribute("style"); clone.removeAttribute("aria-hidden"); clone.removeAttribute("role"); clone.removeAttribute("aria-label"); clone.removeAttribute("focusable");
    if (stretch) { clone.setAttribute("viewBox", `0 0 ${r.width.toFixed(1)} ${r.height.toFixed(1)}`); clone.removeAttribute("preserveAspectRatio"); }
    clone.setAttribute("width", r.width.toFixed(1)); clone.setAttribute("height", r.height.toFixed(1));
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    let s = clone.outerHTML.replace(/currentColor/g, color ? hex(color) : "#0d0f0e");
    const shadow = /drop-shadow/.test(css(svg).filter);
    push({ t: "svg", ...b, svg: s, a: o * (color && /currentColor/.test(svg.outerHTML) ? color.a : 1), blend, shadow, name: svg.getAttribute("aria-label") || (svg.querySelector("linearGradient") ? "Power FC crest" : "Drawing") }, svg);
  };

  const imgKey = (src) => { const k = "img" + Object.keys(images).length; images[k] = src; return k; };
  const srcKeys = {};
  let canvasIndex = 0;

  const walk = (el) => {
    if (el.nodeType !== 1) return;
    const tag = el.tagName.toLowerCase();
    if (["script", "style", "noscript", "head", "template"].includes(tag)) return;
    const s = css(el);
    if (s.display === "none" || s.visibility === "hidden") return;
    if (opacityOf(el) < 0.02 && tag !== "canvas") return;
    if (tag === "svg") { handleSvg(el); return; }
    const r = el.getBoundingClientRect(), b = box(r, el);
    if (tag === "img") {
      if (!visible(b)) return;
      const src = el.currentSrc || el.src;
      if (!srcKeys[src]) {
        const c = document.createElement("canvas"); c.width = el.naturalWidth; c.height = el.naturalHeight;
        c.getContext("2d").drawImage(el, 0, 0); srcKeys[src] = imgKey(c.toDataURL("image/png"));
      }
      push({ t: "img", ...b, key: srcKeys[src], a: opacityOf(el), name: el.alt || "Image" }, el);
      return;
    }
    if (tag === "canvas") {
      const idx = canvasIndex++;
      if (!visible(b) || opacityOf(el) < 0.02) return;
      const data = (canvasOverride && canvasOverride[idx]) || el.toDataURL("image/png");
      push({ t: "img", ...b, key: imgKey(data), a: opacityOf(el), blend: blendOf(el), name: el.closest("[data-hero]") ? "Player (halftone dots)" : "Dot cluster" }, el);
      return;
    }
    if (visible(b)) {
      const bg = rgba(s.backgroundColor);
      const big = b.w >= W * 0.95 && b.h >= Math.min(H, 700) * 0.9;
      if (bg && bg.a > 0.01 && !big) push({ t: "rect", ...b, fill: bg, a: opacityOf(el) * bg.a, blend: blendOf(el), name: "Block" }, el);
      if (/linear-gradient/.test(s.backgroundImage)) push({ t: "fade", ...b, a: opacityOf(el), name: "Fade under the bar" }, el);
      const bt = parseFloat(s.borderTopWidth), bc = rgba(s.borderTopColor);
      if (bt > 0 && bc && bc.a > 0) push({ t: "rect", x: b.x, y: b.y, w: b.w, h: bt, fill: bc, a: opacityOf(el) * bc.a, name: "Rule" }, el);
    }
    for (const n of el.childNodes) {
      if (n.nodeType === 3 && n.textContent.trim()) {
        const rg = document.createRange(); rg.selectNodeContents(n);
        const rr = rg.getBoundingClientRect(), tb = box(rr, el);
        if (!visible(tb)) continue;
        const st = css(el);
        let txt = n.textContent.replace(/\s+/g, " ").trim();
        if (st.textTransform === "uppercase") txt = txt.toUpperCase();
        const fam = /audiowide/i.test(st.fontFamily) ? "display" : /mono/i.test(st.fontFamily) ? "mono" : "sans";
        const fill = rgba(st.webkitTextFillColor && st.webkitTextFillColor !== st.color ? st.webkitTextFillColor : st.color);
        const strokeW = parseFloat(st.webkitTextStrokeWidth) || 0;
        let skew = 0;
        for (let e = el, k = 0; e && k < 4; e = e.parentElement, k++) { const m = css(e).transform.match(/matrix\(([^)]+)\)/); if (m) { const v = m[1].split(",").map(Number); if (Math.abs(v[2]) > 0.01) { skew = Math.atan(v[2]) * 180 / Math.PI; break; } } }
        if (st.webkitTextStrokeWidth && strokeW === 0 && fill && fill.a === 0) continue;
        push({
          t: "text", ...tb, s: txt, font: fam, size: parseFloat(st.fontSize), weight: +st.fontWeight || 400,
          ls: st.letterSpacing === "normal" ? 0 : parseFloat(st.letterSpacing), lh: st.lineHeight === "normal" ? null : parseFloat(st.lineHeight),
          color: fill, a: opacityOf(el), stroke: strokeW ? { w: strokeW, color: rgba(st.webkitTextStrokeColor) } : null, skew,
          align: st.textAlign, name: txt.slice(0, 40),
        }, el);
      }
      if (n.nodeType === 1) walk(n);
    }
  };
  walk(document.body);
  items.sort((a, b) => a.z - b.z || a.o - b.o);
  return { w: W, h: H, items: items.map(({ z, o, ...it }) => it), images };
};
