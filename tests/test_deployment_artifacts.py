from __future__ import annotations

import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def test_deployment_artifact_integrity_check_passes() -> None:
    result = subprocess.run(
        [sys.executable, "scripts/check_deployment_artifacts.py"],
        cwd=ROOT,
        check=False,
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0, result.stderr


def test_docker_and_pages_resolve_the_canonical_root_artifact() -> None:
    canonical_root = ROOT / "backend/static/index.html"
    dockerfile = (ROOT / "Dockerfile").read_text(encoding="utf-8")
    pages_script = (ROOT / "infra/scripts/deploy-pages.sh").read_text(encoding="utf-8")

    assert canonical_root.is_file()
    assert "src.ark_safety.main:app" in dockerfile
    assert 'STATIC_EXPORT="$REPO_ROOT/backend/static"' in pages_script
    assert 'cp -R "$STATIC_EXPORT/." "$TMP_DIR/"' in pages_script
