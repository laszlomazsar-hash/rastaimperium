#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-7860}"
uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"
