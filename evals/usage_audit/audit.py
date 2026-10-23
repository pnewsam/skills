# Usage audit: how often registry skills fire on real requests, read from local
# Claude Code transcripts. Prints aggregates only; never commit its output.
# Usage: python3 audit.py [days=28] [--registry <path to registry/>]
import collections, glob, json, os, re, sys, time

DAYS = int(next((a for a in sys.argv[1:] if a.isdigit()), 28))
REG = sys.argv[sys.argv.index('--registry') + 1] if '--registry' in sys.argv else os.path.join(os.path.dirname(__file__), '..', '..', 'registry')
ROOT = os.path.expanduser('~/.claude/projects')
cut = time.time() - DAYS * 86400

# Request categories, the skills that should own them, and repeat-ask signals.
CATS = {
    'address review': (r'(got|received|have) (a|another|new|final|some)?\s*(new |final )?(review|comment)|address (the |it|review|comment)', {'reconcile-work'}),
    'rebase/conflicts': (r'\brebase|conflict', {'reconcile-work'}),
    'open/update PR': (r'draft pr|open (a )?(draft )?pr|create (a )?pr|make (a )?(draft )?pr|pr against|push (it|this|and)', {'publish-work'}),
    'PR description': (r'pr description|description.{0,30}(messy|trim|update|align)', {'publish-work', 'reconcile-work'}),
    'screenshots': (r'screen ?shot|screens\b|before/after', {'validate-work'}),
    'manual QA': (r'manual qa|\bqa\b|how (would|can|do) i (test|verify)|testing plan|checklist', {'validate-work'}),
    'file issue': (r'file an issue|create (an )?issue|linear ticket|create (a )?ticket', {'plan-work'}),
}
REASKS = {
    'pr-conventions re-ask': r'pr-conventions|align.{0,20}pr description',
    'where are the screens': r'where are (the )?(screen|screens|screenshots)',
}

def turns(path):
    cur, skills = None, []
    for line in open(path, errors='ignore'):
        try: d = json.loads(line)
        except ValueError: continue
        if d.get('type') == 'user':
            c = d.get('message', {}).get('content')
            human = d.get('origin', {}).get('kind') == 'human' or d.get('promptSource') == 'typed'
            text = c if isinstance(c, str) else ' '.join(b.get('text', '') for b in (c or []) if isinstance(b, dict) and b.get('type') == 'text')
            if human and text and not text.startswith('<'):
                if cur is not None: yield cur, skills
                cur, skills = text, []
        elif d.get('type') == 'assistant' and cur is not None:
            for b in d.get('message', {}).get('content', []) or []:
                if b.get('type') == 'tool_use' and b.get('name') == 'Skill':
                    skills.append(b.get('input', {}).get('skill'))
    if cur is not None: yield cur, skills

# Skip eval and scratch sessions (trigger tests, workflow fixtures) under temp dirs.
files = [f for f in glob.glob(ROOT + '/*/*.jsonl')
         if os.path.getmtime(f) >= cut and '-private-tmp-' not in f and '-tmp-' not in os.path.basename(os.path.dirname(f))]
sess_skill = collections.defaultdict(set); prompts = 0
cat = {k: [0, 0, 0] for k in CATS}; reask = collections.Counter()
for f in files:
    for text, skills in turns(f):
        prompts += 1
        for s in skills: sess_skill[s].add(f)
        for k, (rx, owners) in CATS.items():
            if re.search(rx, text, re.I):
                cat[k][0] += 1; cat[k][1] += bool(set(skills) & owners); cat[k][2] += bool(skills)
        for k, rx in REASKS.items():
            if re.search(rx, text, re.I): reask[k] += 1

print(f'Window: {DAYS} days, {len(files)} sessions, {prompts} human prompts\n')
print('Routing on real requests (turns / owner fired / any skill fired):')
for k, (n, hit, any_) in cat.items():
    print(f'  {k:18} {n:4}  {hit / n if n else 0:5.0%}  {any_ / n if n else 0:5.0%}')
print('\nRepeat asks:'); [print(f'  {k:24} {reask[k]}') for k in REASKS]
active = sorted(d for d in os.listdir(REG) if os.path.exists(os.path.join(REG, d, 'SKILL.md')))
print('\nSessions using each registry skill:')
for s in sorted(active, key=lambda s: -len(sess_skill[s])): print(f'  {s:32} {len(sess_skill[s])}')
