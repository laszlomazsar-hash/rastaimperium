from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
FRONTEND_ROOT = ROOT / "frontend"
if str(FRONTEND_ROOT) not in sys.path:
    sys.path.insert(0, str(FRONTEND_ROOT))

from app.core.container import AppContainer, get_container


def test_get_container_returns_singleton_across_threads() -> None:
    AppContainer._instance = None

    with ThreadPoolExecutor(max_workers=16) as pool:
        instances = list(pool.map(lambda _: get_container(), range(128)))

    first = instances[0]
    assert all(instance is first for instance in instances)
