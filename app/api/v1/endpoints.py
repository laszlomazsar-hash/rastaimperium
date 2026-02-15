import json
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.ark_engine.api.routers.divine_guidance import router as divine_router
from app.ark_engine.api.routers.evolution import router as evolution_router
from app.ark_engine.core.field_controller import IFieldController, seed_the_ark
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer
from app.core.database import get_db
from app.core.redis import redis_manager
from app.models.lead import Lead
from app.schemas.lead import (
    LeadCaptureRequest,
    LeadLifecycleStatus,
    LeadResponse,
    LeadStatusSummary,
    LeadStatusUpdateRequest,
    PaymentWebhookEvent,
)

router = APIRouter()
router.include_router(divine_router, prefix="/divine", tags=["divine"])
router.include_router(evolution_router, tags=["evolution", "nuggets"])


@router.get("/wisdom")
async def get_wisdom():
    cache_key = "wisdom_archive"

    cached_wisdom = await redis_manager.redis_client.get(cache_key)

    if cached_wisdom:
        return {"source": "Redis Memory", "data": json.loads(cached_wisdom)}

    wisdom_data = {
        "title": "The Root of the Imperium",
        "teachings": "The frequency of the King is the foundation of all movement.",
        "status": "Archived",
    }

    await redis_manager.redis_client.setex(cache_key, 3600, json.dumps(wisdom_data))

    return {"source": "Fresh Computation", "data": wisdom_data}


@router.get("/codex")
async def get_codex():
    repo_root = Path(__file__).resolve().parents[3]
    codex_path = repo_root / "Codex.html"
    return FileResponse(codex_path, media_type="text/html")


@router.get("/manifest")
async def get_manifest():
    repo_root = Path(__file__).resolve().parents[3]
    manifest_path = repo_root / "Manifest.txt"
    return FileResponse(manifest_path, media_type="text/plain")


@router.get("/simulate")
async def get_simulation():
    optimizer = EvolutionaryCulturalOptimizer()
    initial_cultures = [
        {"name": "Roots", "values": ["integrity", "stewardship"], "energy": 0.82},
        {"name": "Zion", "values": ["vision", "joy"], "energy": 0.91},
    ]
    return optimizer.cultural_evolution_simulation(initial_cultures=initial_cultures, steps=10)


@router.get("/nuggets")
async def get_nuggets():
    controller = IFieldController()
    seed_the_ark(controller)
    return {
        "count": len(controller.ark.storage),
        "nuggets": [
            {
                "content": nugget.content,
                "resonance_weight": nugget.resonance_weight,
                "tags": sorted(nugget.tags),
            }
            for nugget in controller.ark.storage.values()
        ],
    }


@router.post("/leads", response_model=LeadResponse, status_code=status.HTTP_201_CREATED)
def capture_lead(payload: LeadCaptureRequest, db: Session = Depends(get_db)):
    if not payload.consent:
        raise HTTPException(status_code=400, detail="Consent is required before submitting.")

    lead = Lead(
        full_name=payload.full_name,
        email=payload.email,
        company=payload.company,
        message=payload.message,
        source_page=payload.source_page,
        consent=payload.consent,
        qualification_metadata=payload.qualification_metadata,
        lifecycle_status=LeadLifecycleStatus.NEW.value,
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.patch("/leads/{lead_id}/status", response_model=LeadResponse)
def update_lead_status(lead_id: int, payload: LeadStatusUpdateRequest, db: Session = Depends(get_db)):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found.")

    lead.lifecycle_status = payload.lifecycle_status.value
    if payload.qualification_metadata:
        existing_metadata = lead.qualification_metadata or {}
        lead.qualification_metadata = {**existing_metadata, **payload.qualification_metadata}

    db.commit()
    db.refresh(lead)
    return lead


@router.get("/admin/leads/pipeline", response_model=list[LeadStatusSummary])
def get_lead_pipeline(db: Session = Depends(get_db)):
    counts = (
        db.query(Lead.lifecycle_status, func.count(Lead.id))
        .group_by(Lead.lifecycle_status)
        .all()
    )
    count_map = {status: count for status, count in counts}

    return [
        LeadStatusSummary(status=status_value, count=count_map.get(status_value.value, 0))
        for status_value in LeadLifecycleStatus
    ]


@router.post("/webhooks/payments")
def payment_webhook(event: PaymentWebhookEvent, db: Session = Depends(get_db)):
    lead_query = db.query(Lead)
    if event.customer_id:
        lead_query = lead_query.filter(Lead.subscription_customer_id == event.customer_id)
    elif event.email:
        lead_query = lead_query.filter(Lead.email == event.email)
    else:
        raise HTTPException(status_code=400, detail="email or customer_id is required")

    lead = lead_query.order_by(Lead.id.desc()).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found for payment event")

    lead.subscription_customer_id = event.customer_id or lead.subscription_customer_id
    lead.payment_status = event.event_type

    lifecycle_from_event = {
        "checkout.session.completed": LeadLifecycleStatus.WON.value,
        "invoice.paid": LeadLifecycleStatus.WON.value,
        "customer.subscription.updated": LeadLifecycleStatus.PROPOSAL_SENT.value,
        "invoice.payment_failed": LeadLifecycleStatus.LOST.value,
        "customer.subscription.deleted": LeadLifecycleStatus.LOST.value,
    }
    if event.event_type in lifecycle_from_event:
        lead.lifecycle_status = lifecycle_from_event[event.event_type]

    existing_metadata = lead.qualification_metadata or {}
    lead.qualification_metadata = {
        **existing_metadata,
        "last_payment_event": event.event_type,
        "payment_metadata": event.metadata,
    }

    db.commit()
    db.refresh(lead)
    return {"ok": True, "lead_id": lead.id, "status": lead.lifecycle_status}
