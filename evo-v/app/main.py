from fastapi import FastAPI

from api import epistemic, observatory, provisioning

app = FastAPI(title="EVO-V v1.4 Codex Engine")

app.include_router(observatory.router, prefix="/api/observatory")
app.include_router(provisioning.router, prefix="/api/provisioning")
app.include_router(epistemic.router, prefix="/api")
