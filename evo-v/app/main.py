from fastapi import FastAPI

from api import observatory, provisioning

app = FastAPI(title="EVO-V v1.4 Codex Engine")

app.include_router(observatory.router, prefix="/api/observatory")
app.include_router(provisioning.router, prefix="/api/provisioning")


@app.get("/")
def root() -> dict:
    return {"service": "evo-v", "status": "ok"}


@app.get("/health")
def health() -> dict:
    return {"status": "healthy"}


@app.get("/state")
def state() -> dict:
    return {"state": "running"}
