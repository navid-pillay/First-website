import json, glob, subprocess
from PIL import Image
cov = {}
for f in glob.glob("asset-*.png"):
    im = Image.open(f).convert("RGBA"); h = im.getchannel("A").histogram(); cov[f] = sum(h[10:]) / (im.width * im.height)
ids = {"d1-opening-lines":"2:75","d2-opening-player-forms":"2:79","d3-hero":"2:83","d4-scrolling-slime-crawls":"2:87","d5-logos":"2:91","d6-full-page":"2:95","p1-hero":"2:99","p2-logos":"2:103","p3-full-page":"2:107"}
for f in ids:
    d = json.load(open(f + ".json"))
    d["items"] = [it for it in d["items"] if not (it["t"] == "text" and it["s"].endswith("ACADEMY:") and it["w"] > 500) and not (it["t"] == "img" and cov.get(it["key"], 1) < 0.003)]
    for it in d["items"]:
        if it["t"] == "svg" and it["name"] in ("Power FC crest", "Power FC"): it["svg"] = ""
        if it["t"] == "text" and it["font"] == "sans": it["font"] = "display"
    json.dump(d, open(f + ".json", "w"))
comps = json.dumps({"crest": "2:70", "logo": "2:71"})
for f, fid in ids.items():
    subprocess.run(["python3", "gen.py", f, fid, comps, "asset-d924f422e7a1.png"])
