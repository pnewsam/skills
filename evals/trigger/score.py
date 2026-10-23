# Score trigger results: share of runs whose first registry skill is an expected owner.
import json, sys, collections
base = sys.argv[1]
rows = [json.loads(l) for l in open(f'{base}/results.jsonl')]
exp = json.load(open(f'{base}/expect.json'))
arms = sorted({r['arm'] for r in rows}); cats = list(exp)
hit = collections.defaultdict(lambda: [0, 0]); dist = collections.defaultdict(collections.Counter)
for r in rows:
    k = (r['arm'], r['cat']); hit[k][1] += 1
    if r['first'] in exp[r['cat']][r['arm']]: hit[k][0] += 1
    dist[k][r['first'] or 'none'] += 1
print('category'.ljust(9), *[a.center(9) for a in arms])
for c in cats:
    print(c.ljust(9), *[f"{hit[(a,c)][0]}/{hit[(a,c)][1]}".center(9) for a in arms])
tot = {a: [sum(hit[(a, c)][0] for c in cats), sum(hit[(a, c)][1] for c in cats)] for a in arms}
print('TOTAL'.ljust(9), *[f"{t[0]}/{t[1]}".center(9) for t in tot.values()])
print('\nwhat fired (first registry skill):')
for c in cats:
    for a in arms: print(f'  {c:8} {a}: ' + ', '.join(f'{s} {n}' for s, n in dist[(a, c)].most_common()))
