from fastapi import FastAPI

from api import observatory, proof_attack, provisioning
from health import health_router
from watchdog import start_watchdog

app = FastAPI(title="EVO-V Kernel")


@app.get("/")
def root() -> dict[str, str]:
    return {
        "status": "EVO-V ONLINE",
        "mode": "deterministic-runtime",
        "heartbeat": "active",
    }


app.include_router(health_router)
app.include_router(observatory.router, prefix="/api/observatory")
app.include_router(provisioning.router, prefix="/api/provisioning")
app.include_router(proof_attack.router, prefix="/api/proof-attacks")

start_watchdog(app)
