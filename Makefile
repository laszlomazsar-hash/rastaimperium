.PHONY: test pytest ruff flake8 lint smoke smoke-backend smoke-evo-v policy-consistency ci

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
	cd /workspace/rastaimperium/evo-v && PYTHONPATH="$(PYTHONPATH_EVO_V)" pytest tests

ruff:
	cd /workspace/rastaimperium && ruff check app src tests
	cd /workspace/rastaimperium/evo-v && ruff check app tests

flake8:
	cd /workspace/rastaimperium && flake8 app src tests
	cd /workspace/rastaimperium/evo-v && flake8 app tests

lint: ruff flake8

smoke: smoke-backend smoke-evo-v

smoke-backend:
	cd /workspace/rastaimperium && PYTHONPATH="$(PYTHONPATH_ROOT)" timeout "$(SMOKE_TIMEOUT_SECONDS)" uvicorn app.main:app --host "$(UVICORN_HOST)" --port "$(UVICORN_PORT_BACKEND)" || [ $$? -eq 124 ]

smoke-evo-v:
	cd /workspace/rastaimperium/evo-v && PYTHONPATH="$(PYTHONPATH_EVO_V)" timeout "$(SMOKE_TIMEOUT_SECONDS)" uvicorn app.main:app --host "$(UVICORN_HOST)" --port "$(UVICORN_PORT_EVO_V)" || [ $$? -eq 124 ]

policy-consistency:
	cd /workspace/rastaimperium && ./tools/check-policy-consistency

ci: lint policy-consistency pytest smoke
