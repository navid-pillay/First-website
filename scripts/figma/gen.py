import json, sys, os, math
def rnd(o):
    if isinstance(o, float): return round(o, 2)
    if isinstance(o, dict): return {k: rnd(v) for k, v in o.items()}
    if isinstance(o, list): return [rnd(v) for v in o]
    return o
def chunks(name, limit=36000):
    d = json.load(open(name + ".json"))
    items = rnd(d["items"]); out = []; cur = []; size = 0
    for it in items:
        s = len(json.dumps(it, separators=(",", ":")))
        if cur and size + s > limit: out.append(cur); cur = []; size = 0
        cur.append(it); size += s
    if cur: out.append(cur)
    return d, out
if __name__ == "__main__":
    name, frame_id, comps, logo = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
    d, cs = chunks(name)
    b = open("builder.js").read()
    for i, c in enumerate(cs):
        hashes = dict(l.split() for l in open("hashes.txt"))
        used = {it["key"] for it in c if it.get("key")}
        code = f"const HASHES = {json.dumps({k: v for k, v in hashes.items() if k in used})};\nconst FRAME_ID = {json.dumps(frame_id)};\nconst COMPONENTS = {comps};\nconst LOGO_ASSET = {json.dumps(logo)};\nconst ITEMS = {json.dumps(c, separators=(',', ':'))};\n" + b
        open(f"code-{name}-{i}.js", "w").write(code)
        print(f"code-{name}-{i}.js", len(code))
