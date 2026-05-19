.PHONY: test pytest ruff flake8 lint policy-consistency ci

# Shared environment defaults so local and CI use identical command contracts.
PYTHONPATH_ROOT ?= .
PYTHONPATH_EVO_V ?= .
UVICORN_HOST ?= 127.0.0.1
UVICORN_PORT_BACKEND ?= 8001
UVICORN_PORT_EVO_V ?= 8002
SMOKE_TIMEOUT_SECONDS ?= 8

test: pytest

pytest:
	cd /workspace/rastaimperium && PYTHONPATH="$(PYTHONPATH_ROOT)" pytest tests

ruff:
	cd /workspace/rastaimperium && ruff check runtime ledger governance tests

flake8:
	cd /workspace/rastaimperium && flake8 runtime ledger governance tests

lint: ruff flake8

policy-consistency:
	cd /workspace/rastaimperium && ./tools/check-policy-consistency

ci: lint policy-consistency pytest
