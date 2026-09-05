# Visual evidence and helper limits

Capture the changed states from the real app when practical, using the documented runtime and an isolated base checkout for before/after. Inspect the actual images. A representative static render is a limited substitute and cannot prove the real app's behavior.

Optional helpers, resolved relative to this skill package:

- `scripts/check_contrast.py`: calculate contrast for supplied foreground/background pairs; it does not discover all rendered pairs or prove accessibility. Use the applicable text/non-text mode and inspect actual compositing and states.
- `scripts/check_spacing.py`: inspect literal CSS/Tailwind lengths against a supplied project scale. It cannot resolve every token or computed style. Off-scale values are findings to interpret against the chosen design contract, not universally defects.
- `scripts/shot_diff.mjs`: compare deterministic PNG captures. Use its CLI help for thresholds; a difference means pixels changed, not that the change is wrong. Inspect intended differences, false positives, and missing states.

Use transparent limitations when fonts, authentication, runtime, images, or baseline capture are unavailable. Do not substitute a prose description for a viewed image or claim an unrun comparison passed.
