#!/bin/sh
set -eu

echo "[EVO-V] Boot sequence initiated..."

export PORT="${PORT:-7860}"

python -c "import fastapi, uvicorn" >/dev/null 2>&1 || {
  echo "[EVO-V] Missing runtime dependency: fastapi or uvicorn"
  exit 1
}

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
