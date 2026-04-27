#!/bin/sh
set -eu

echo "[EVO-V] Boot sequence initiated..."

export PORT="${PORT:-7860}"

python -c "import fastapi, uvicorn" >/dev/null

exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
