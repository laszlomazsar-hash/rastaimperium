import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Add paths so all test imports resolve correctly.
# Do NOT insert ROOT/backend: that shadows root src/ (e.g. src.governance.fsm).
paths_to_add = [
    str(ROOT),
    str(ROOT / "backend" / "src"),
    str(ROOT / "non-kernel" / "frontend"),
]

for p in paths_to_add:
    if p not in sys.path:
        sys.path.insert(0, p)
