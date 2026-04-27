from fastapi import FastAPI

from api import observatory, provisioning
from health import health_state

app = FastAPI(title="EVO-V v1.4 Codex Engine")

app.include_router(observatory.router, prefix="/api/observatory")
app.include_router(provisioning.router, prefix="/api/provisioning")


@app.get("/health")
async def health() -> dict:
    route_paths = {
        route.path
        for route in app.router.routes
        if getattr(route, "path", None)
    }
    return health_state.evaluate(route_paths=route_paths)
