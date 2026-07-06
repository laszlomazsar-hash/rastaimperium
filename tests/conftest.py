import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

# Add paths so all test imports resolve correctly
paths_to_add = [
    str(ROOT),
    str(ROOT / "backend" / "src"),
    str(ROOT / "non-kernel" / "frontend"),
    str(ROOT / "backend"),
]

for p in paths_to_add:
    if p not in sys.path:
        sys.path.insert(0, p)
