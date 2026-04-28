from fastapi import FastAPI

from app.api import codex, epistemic, observatory, provisioning
from app.api.epistemic import router as epistemic_router
from app.health import health_router
from app.watchdog import start_watchdog

app = FastAPI(title="EVO-V Kernel")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "status": "EVO-V ONLINE",
        "mode": "deterministic-runtime",
        "heartbeat": "active",
    }


app.include_router(health_router)
app.include_router(codex.router)
app.include_router(observatory.router, prefix="/api/observatory")
app.include_router(provisioning.router, prefix="/api/provisioning")
app.include_router(epistemic_router)
app.include_router(epistemic.router, prefix="/api")

start_watchdog(app)
