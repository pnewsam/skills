# U1: Exact money record
Status: integrated locally on main at `877b90561e3611628c0da7f636b6552b972b77a7`.
Contract: normalize accepts decimal-like input; returns minor integer units and currency USD. Decimal half cents round up.
Evidence: `python3 -m unittest discover -s tests -p test_money.py`, 2 tests pass at `877b90561e3611628c0da7f636b6552b972b77a7`.
