import os
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from app.core.config import settings
from app.api.v1.endpoints import router as api_v1_router
from app.core.redis import redis_manager

# --- THE HEART ---
# This variable 'app' is what Uvicorn looks for to ignite the engine
app = FastAPI(title=settings.PROJECT_NAME)

# --- THE PATH ALIGNMENT ---
# We find the exact location of this file to prevent "TemplateNotFound" errors
BASE_DIR = Path(__file__).resolve().parent

# Mount the Static chamber (for your Red, Gold, and Green CSS)
app.mount(
    "/static", 
    StaticFiles(directory=str(BASE_DIR / "static")), 
    name="static"
)

# Setup the Template engine (for your index.html)
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

# --- THE WISDOM GATES ---
# Connecting the API routes
app.include_router(api_v1_router, prefix="/api/v1")

# --- LIFECYCLE EVENTS ---
@app.on_event("startup")
async def startup_event():
    """Ignite the memory connections when the kingdom wakes."""
    try:
        await redis_manager.connect()
    except Exception as e:
        print(f"Waiting for Redis frequency: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """Safely rest the connections when the kingdom sleeps."""
    await redis_manager.disconnect()

# --- THE VISUAL GATEWAY ---
@app.get("/")
async def root(request: Request):
    """Manifest the landing page for the King."""
    try:
        with open(BASE_DIR / "templates" / "index.html", encoding="utf-8") as file:
            return HTMLResponse(file.read())
    except Exception:
        return HTMLResponse(
            """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <title>Rasta Imperium — Presence</title>
              <style>
                body { margin: 0; font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                       background: #050608; color: #f5f5f5; }
                .fallback-hero { padding: 2.5rem 1.5rem; background: #0c0f1a; }
                .fallback-hero h1 { margin: 0 0 0.75rem; font-size: 2.2rem; }
                .fallback-hero p { margin: 0 0 0.5rem; color: #d6d6d6; }
              </style>
            </head>
            <body>
              <header class="fallback-hero">
                <p>Rasta Imperium</p>
                <h1>The Presence Gateway</h1>
                <p>An always-on introduction to the field, even if templates fail to render.</p>
              </header>
            </body>
            </html>
            """
        )

@app.get("/curiosity")
async def curiosity(request: Request):
    """The second gateway. The first contact with the field."""
    return templates.TemplateResponse("curiosity.html", {"request": request})

@app.get("/nuggets")
async def nuggets(request: Request):
    """Daily resonance, distilled into quick calibrations."""
    return templates.TemplateResponse("nuggets.html", {"request": request})

@app.get("/recognition")
async def recognition(request: Request):
    """The third gateway. The revelation of structure."""
    return templates.TemplateResponse("recognition.html", {"request": request})

@app.get("/recognition/architecture")
async def architecture(request: Request):
    """The geometric skeleton and operational flows of the Imperium."""
    return templates.TemplateResponse("architecture.html", {"request": request})

@app.get("/recognition/safety")
async def safety(request: Request):
    """The containment protocols and boundaries for engaging with the field."""
    return templates.TemplateResponse("safety.html", {"request": request})

@app.get("/recognition/governance")
async def governance(request: Request):
    """The decision-making layer and ethical spine of the Imperium."""
    return templates.TemplateResponse("governance.html", {"request": request})

@app.get("/codex")
async def codex(request: Request):
    """The Daily Resonance Codex — the operational manual."""
    return templates.TemplateResponse("codex.html", {"request": request})

@app.get("/ark")
async def ark(request: Request):
    """The ARK Engine — autonomous resonance kernel."""
    return templates.TemplateResponse("ark.html", {"request": request})
