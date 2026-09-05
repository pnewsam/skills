from pathlib import Path
import subprocess,json,argparse
parser=argparse.ArgumentParser(description="Build a disposable local initiative fixture")
parser.add_argument("destination",type=Path)
p=parser.parse_args().destination.resolve()
if p.exists():
    parser.error("destination must not exist; use a fresh temporary path")
p.mkdir(parents=True)
def git(*args): return subprocess.check_output(['git',*args],cwd=p,text=True).strip()
def write(name,s):
 q=p/name;q.parent.mkdir(parents=True,exist_ok=True);q.write_text(s)
def commit(msg):
 git('add','.');git('commit','-qm',msg);return git('rev-parse','HEAD')
git('init','-q','-b','main');git('config','user.name','Fixture Author');git('config','user.email','fixture@example.invalid')
write('money.py','''def normalize(amount):
    return round(float(amount) * 100), "USD"
''')
write('output.py','''TITLE = "Money report"


def heading():
    return TITLE
''')
write('README.md','# Money reports\n\nA small local reporting package.\n\nRun tests with `python3 -m unittest discover -s tests`.\n')
write('tests/test_money.py','''import unittest
from money import normalize

class MoneyTests(unittest.TestCase):
    def test_decimal_amount(self):
        self.assertEqual(normalize("12.34"), (1234, "USD"))
''')
base=commit('Initial money reporting package')
git('checkout','-qb','unit/receipt')
write('output.py','''from money import normalize

TITLE = "Receipt"


def heading():
    return TITLE


def format_receipt(amount):
    cents, currency = normalize(amount)
    return f"{heading()}: {cents / 100:.2f} {currency}"
''')
write('tests/test_receipt.py','''import unittest
from output import format_receipt

class ReceiptTests(unittest.TestCase):
    def test_receipt(self):
        self.assertEqual(format_receipt("12.34"), "Receipt: 12.34 USD")
''')
r=commit('Implement receipt against original tuple money contract')
git('checkout','-q','main');git('checkout','-qb','unit/export')
write('output.py','''import json

TITLE = "Export"


def heading():
    return TITLE


def format_export(record):
    return json.dumps(record, sort_keys=True)
''')
write('tests/test_export.py','''import unittest
from output import format_export

class ExportTests(unittest.TestCase):
    def test_export(self):
        self.assertEqual(format_export({"minor": 1234, "currency": "USD"}), '{"currency": "USD", "minor": 1234}')
''')
e=commit('Implement record export on independent branch')
git('checkout','-q','main')
write('money.py','''from decimal import Decimal, ROUND_HALF_UP


def normalize(amount):
    minor = int((Decimal(str(amount)) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    return {"minor": minor, "currency": "USD"}
''')
write('tests/test_money.py','''import unittest
from money import normalize

class MoneyTests(unittest.TestCase):
    def test_decimal_amount(self):
        self.assertEqual(normalize("12.34"), {"minor": 1234, "currency": "USD"})

    def test_half_cent_rounds_up(self):
        self.assertEqual(normalize("1.005")["minor"], 101)
''')
u1=commit('U1: Adopt named money fields and exact decimal rounding')
write('.gitignore','__pycache__/\n*.pyc\n')
write('docs/epics/reporting.md',f'''# EP-1: Consistent money reports

Outcome: a caller can normalize an amount once and produce a human receipt and a machine-readable export without inconsistent money values. Local delivery only; no remote exists.

## Units
| ID | Outcome | Dependencies | Record | Last recorded state |
| --- | --- | --- | --- | --- |
| U1 | Named money fields and decimal rounding | none | ../work/u1-money.md | integrated |
| U2 | Human receipt | U1 contract | ../work/u2-receipt.md | running, owned by worker-receipt |
| U3 | JSON export of money record | U1 contract | ../work/u3-export.md | implemented |
| U4 | Combined behavior proof and integration | U1, U2, U3 | ../work/u4-integration.md | waiting |
| U5 | Document public examples | U1 contract | ../work/u5-docs.md | ready |

## Decisions
- The original tuple contract was superseded by U1 after receipt work had started. The authoritative contract is now `{{"minor": int, "currency": str}}`; use decimal half-up rounding. Do not revert this to accommodate a consumer.
- Receipt is `Receipt: 12.34 USD`; JSON export contains exactly the named money fields. The generic heading helper has no separate compatibility requirement.
- Integration owner is the coordinator. Keep completed unit commits as separate history; locally merge/rebase or make adaptation commits as appropriate.
- Unit completion requires current relevant evidence. Final initiative completion requires combined behavior on one identified integrated tree and documentation examples verified against it.

## Last checkpoint
Worker-receipt was interrupted before the contract change was reconciled. The owner field has not yet been cleared. Export was built separately. U4 has never run against their combination. U5 can proceed independently of the stopped worker. See runtime snapshot for observed worker state.
''')
write('docs/work/u1-money.md',f'''# U1: Exact money record
Status: integrated locally on main at `{u1}`.
Contract: normalize accepts decimal-like input; returns minor integer units and currency USD. Decimal half cents round up.
Evidence: `python3 -m unittest discover -s tests -p test_money.py`, 2 tests pass at `{u1}`.
''')
write('docs/work/u2-receipt.md',f'''# U2: Receipt
Outcome: `format_receipt("12.34")` produces `Receipt: 12.34 USD`.
Parent: ../epics/reporting.md
Dependency: U1 contract (original tuple when work began).
Owner: worker-receipt
Status: running (last checkpoint before interruption).
Branch: unit/receipt
Candidate: `{r}`; base `{base}`.
Evidence: `python3 -m unittest discover -s tests -p test_receipt.py`, 1 test passed at `{r}` before U1 contract changed.
Handoff: implementation committed; no uncommitted changes reported. Integration and current-contract adaptation not attempted.
''')
write('docs/work/u3-export.md',f'''# U3: JSON export
Outcome: format_export(record) serializes named money fields as JSON; key ordering deterministic.
Parent: ../epics/reporting.md
Dependency: U1 named record accepted in design; branch implementation itself only depends on standard library.
Status: implemented; not integrated.
Owner: worker-export (finished).
Branch: unit/export
Candidate: `{e}`; base `{base}`.
Evidence: `python3 -m unittest discover -s tests -p test_export.py`, 1 test passed at `{e}`.
Handoff: output.py also changes heading; inspect overlap with receipt before combining. No review of combined semantics performed.
''')
write('docs/work/u4-integration.md','''# U4: Combined reporting
Status: waiting for usable U1/U2/U3 implementations.
Parent: ../epics/reporting.md
Acceptance: receipt and JSON export agree for 12.34 and the half-cent input 1.005 (1.01 USD / 101 minor units). No named-contract regression. Tests cover real normalize-to-receipt and normalize-to-export flow, not just substituted records. Run the full suite on the final combined candidate. Record which tree was checked and distinguish local integration from external publication.
''')
write('docs/work/u5-docs.md','''# U5: Public examples
Status: ready; unclaimed.
Parent: ../epics/reporting.md
Dependency: settled U1 named record contract only. Can draft while consumer integration is pending.
Acceptance: README describes normalize/receipt/export with executable examples and exact half-cent behavior. Verify examples against the integrated tree before marking complete. Do not document the retired tuple API.
''')
write('runtime-snapshot.json',json.dumps({'captured_at':'2026-09-05T18:00:00Z','workers':{'worker-receipt':{'state':'stopped','reason':'session interrupted','worktree_uncommitted_changes':False},'worker-export':{'state':'completed','worktree_uncommitted_changes':False}},'remote':'none','publication':'not attempted'},indent=2)+'\n')
head=commit('Record initiative checkpoint after interrupted parallel work')
print(json.dumps({'path':str(p),'base':base,'u1':u1,'receipt':r,'export':e,'checkpoint':head},indent=2))
