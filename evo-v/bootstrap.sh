#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-7860}"

python - <<'PY'
import importlib

required_modules = ("fastapi", "uvicorn", "app.main")
for module_name in required_modules:
    importlib.import_module(module_name)
PY

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
