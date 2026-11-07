const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), crypto = require('crypto');
// Usage: node scripts/figma/capture.js <output-dir>   (draft served at DRAFT_URL)
const OUT = process.argv[2];
const URL = process.env.DRAFT_URL || "http://localhost:4173/First-website/draft/";
const extractSrc = fs.readFileSync(path.join(__dirname, 'extract-page.js'), 'utf8');
const store = {}; // sha -> file
const save = (name, data) => {
  const imgs = {};
  for (const [k, url] of Object.entries(data.images)) {
    const buf = Buffer.from(url.split(',')[1], 'base64');
    const sha = crypto.createHash('sha1').update(buf).digest('hex').slice(0, 12);
    if (!store[sha]) { store[sha] = `asset-${sha}.png`; fs.writeFileSync(path.join(OUT, store[sha]), buf); }
    imgs[k] = store[sha];
  }
  data.items.forEach((it) => { if (it.key) it.key = imgs[it.key]; });
  delete data.images;
  fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(data));
  console.log(name, data.w, data.h, data.items.length, 'items');
};
const scrollTo = async (p, target) => { for (let y = 0; y <= target; y += 40) { await p.evaluate((y) => window.scrollTo(0, y), Math.min(y, target)); await p.waitForTimeout(30); } };
const open = async (b, w, h) => { const p = await b.newPage({ viewport: { width: w, height: h } }); await p.addInitScript(extractSrc); return p; };
(async () => {
  const b = await chromium.launch();
  // Desktop
  let p = await open(b, 1440, 900);
  await p.goto(URL, { waitUntil: 'commit' }); await p.waitForFunction(() => performance.now() > 800);
  await p.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  save('d1-opening-lines', await p.evaluate(() => __extract('viewport')));
  await p.close();
  p = await open(b, 1440, 900);
  await p.goto(URL, { waitUntil: 'commit' }); await p.waitForFunction(() => performance.now() > 2150);
  await p.evaluate(() => document.getAnimations().forEach((a) => a.pause()));
  save('d2-opening-player-forms', await p.evaluate(() => __extract('viewport')));
  await p.close();
  p = await open(b, 1440, 900);
  await p.goto(URL); await p.waitForTimeout(4800); await p.mouse.move(2, 2);
  const heroD = await p.evaluate(() => document.querySelector('[data-hero] canvas').toDataURL('image/png'));
  save('d3-hero', await p.evaluate(() => __extract('viewport')));
  await scrollTo(p, 620); await p.waitForTimeout(120);
  save('d4-scrolling-slime-crawls', await p.evaluate(() => __extract('viewport')));
  const end = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await scrollTo(p, end); await p.waitForTimeout(3000);
  save('d5-logos', await p.evaluate(() => __extract('viewport')));
  save('d6-full-page', await p.evaluate((c) => __extract('page', { 0: c }), heroD));
  await p.close();
  // Phone
  p = await open(b, 390, 844);
  await p.goto(URL); await p.waitForTimeout(4800);
  const heroP = await p.evaluate(() => document.querySelector('[data-hero] canvas').toDataURL('image/png'));
  save('p1-hero', await p.evaluate(() => __extract('viewport')));
  const endP = await p.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  await scrollTo(p, endP); await p.waitForTimeout(3000);
  save('p2-logos', await p.evaluate(() => __extract('viewport')));
  save('p3-full-page', await p.evaluate((c) => __extract('page', { 0: c }), heroP));
  await b.close();
  console.log('assets', Object.keys(store).length);
})();
