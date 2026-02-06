import os
from fastapi import FastAPI, Request
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
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Mount the Static chamber (for your Red, Gold, and Green CSS)
app.mount(
    "/static", 
    StaticFiles(directory=os.path.join(BASE_DIR, "static")), 
    name="static"
)

# Setup the Template engine (for your index.html)
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

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
    return templates.TemplateResponse(
        "index.html", 
        {
            "request": request, 
            "king": "Laszlo Mazsar",
            "location": "46 Thomas Street"
        }
    )

@app.get("/curiosity")
async def curiosity(request: Request):
    """The second gateway. The first contact with the field."""
    return templates.TemplateResponse("curiosity.html", {"request": request})

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