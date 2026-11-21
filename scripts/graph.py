"""Build graph.json from the vault: structure only (no note names or text).
usage: python3 scripts/graph.py /path/to/fineri-vault > graph.json"""
import json, os, re, sys
root = sys.argv[1]
GROUPS = ['00_', '10_', '20_', '30_', '40_', '50_', '60_', '90_']
notes, paths = [], {}
for d, ds, fs in os.walk(root):
    ds[:] = sorted(x for x in ds if not x.startswith('.'))
    for f in sorted(fs):
        if f.endswith('.md'):
            k = f[:-3]; paths[k] = os.path.join(d, f); notes.append(k)
idx = {k: i for i, k in enumerate(notes)}
def grp(p):
    rel = os.path.relpath(p, root)
    for i, g in enumerate(GROUPS):
        if rel.startswith(g): return i + 1
    return 0
E = set()
for k in notes:
    for m in re.findall(r'\[\[([^\]|#]+)', open(paths[k], encoding='utf8').read()):
        m = os.path.basename(m.strip())
        if m in idx and m != k: E.add(tuple(sorted((idx[k], idx[m]))))
deg = [0] * len(notes)
for a, b in E: deg[a] += 1; deg[b] += 1
print(json.dumps({'n': len(notes), 'hub': max(range(len(notes)), key=lambda i: deg[i]),
                  'g': [grp(paths[k]) for k in notes], 'e': sorted(map(list, E))}, separators=(',', ':')))
