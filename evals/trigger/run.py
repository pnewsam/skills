# Trigger test: which registry skill does a fresh session pick for each prompt?
# Usage: python3 run.py <trigdir> <reps> <arms...>
# Env: PROMPTS (default prompts.json), RESULTS (default results.jsonl),
#      FIXTURE (a git repo to copy as each arm's workspace instead of an empty one).
import json, os, shutil, subprocess, sys, threading, time
from concurrent.futures import ThreadPoolExecutor
base, reps, arms = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
prompts = json.load(open(f"{base}/{os.environ.get('PROMPTS', 'prompts.json')}"))
REFS = {'pr-conventions', 'writing-conventions', 'work-conventions'}
out = open(f"{base}/{os.environ.get('RESULTS', 'results.jsonl')}", 'a'); lock = threading.Lock()

def one(arm, i, rep):
    cwd = f'{base}/repos/{arm}'
    cmd = ['claude', '-p', prompts[i]['p'], '--setting-sources', 'project',
           '--output-format', 'stream-json', '--verbose']
    proc = subprocess.Popen(cmd, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, text=True)
    skills, tools, cost, stop = [], [], None, 'end'
    t0 = time.time()
    for line in proc.stdout:
        try: d = json.loads(line)
        except ValueError: continue
        if d.get('type') == 'assistant':
            for b in d['message'].get('content', []):
                if b.get('type') != 'tool_use': continue
                tools.append(b['name'])
                if b['name'] == 'Skill': skills.append(b['input'].get('skill'))
        if d.get('type') == 'result': cost = d.get('total_cost_usd')
        picked = [s for s in skills if s not in REFS]
        if picked: stop = 'skill'; break
        if len(tools) >= 6: stop = 'tools'; break
        if time.time() - t0 > 240: stop = 'timeout'; break
    if proc.poll() is None: proc.kill()
    proc.wait()
    first = next((s for s in skills if s not in REFS), None)
    row = dict(arm=arm, i=i, cat=prompts[i]['cat'], rep=rep, first=first, skills=skills,
               tools=tools, stop=stop, cost=cost, secs=round(time.time() - t0, 1))
    with lock: out.write(json.dumps(row) + '\n'); out.flush()

for arm in arms:
    repo = f'{base}/repos/{arm}'
    shutil.rmtree(repo, ignore_errors=True)
    if os.environ.get('FIXTURE'):
        shutil.copytree(os.environ['FIXTURE'], repo, symlinks=True)
    else:
        os.makedirs(repo); subprocess.run(['git', 'init', '-q'], cwd=repo)
    os.makedirs(f'{repo}/.claude', exist_ok=True)
    shutil.copytree(f'{base}/arms/{arm}/registry', f'{repo}/.claude/skills')
    jobs = [(arm, i, r) for r in range(reps) for i in range(len(prompts))]
    with ThreadPoolExecutor(4) as ex: list(ex.map(lambda j: one(*j), jobs))
    print(arm, 'done', flush=True)
