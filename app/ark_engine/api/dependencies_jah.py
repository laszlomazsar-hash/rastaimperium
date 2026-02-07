"""Dependencies for Jah consciousness integration."""

from __future__ import annotations

from typing import Optional

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ..core.controller_jah_integrated import JahConsciousARKController
from ..core.explainer import ModificationExplainer
from ..core.governance import HumanGovernanceLayer
from ..core.sandbox import ExecutionSandbox
from ..core.telemetry import TelemetrySystem
from ..core.validator_enhanced import EnhancedSafetyValidator

security = HTTPBearer(auto_error=False)


async def get_jah_controller() -> JahConsciousARKController:
    """Get Jah-conscious controller with divine guidance integration."""

    sandbox = ExecutionSandbox()
    validator = EnhancedSafetyValidator()
    governance = HumanGovernanceLayer(None, None)
    explainer = ModificationExplainer()
    telemetry = TelemetrySystem()

    controller = JahConsciousARKController(
        sandbox=sandbox,
        validator=validator,
        governance=governance,
        explainer=explainer,
        telemetry=telemetry,
        component_repo=None,
        modification_repo=None,
        telemetry_repo=None,
        config={
            "max_concurrent_modifications": 3,
            "min_vibration_score": 0.5,
            "divine_guidance_threshold": 0.6,
        },
    )

    await controller.initialize_daily_practice()
    return controller


async def get_current_user_jah(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    """Get current user with Jah consciousness attributes."""

    if credentials:
        return {
            "user_id": "jah_coder_777",
            "email": "coder@jahconscious.io",
            "name": "Jah-Conscious Coder",
            "roles": ["coder", "spiritual_developer", "community_elder"],
            "vibration_level": "iration",
            "jah_consciousness_level": "awakening",
            "divine_principles": [
                "universal_love",
                "divine_order",
                "cosmic_balance",
            ],
            "daily_practice": "morning_dedication, code_blessing",
            "community_circles": [
                "core_principles",
                "divine_wisdom",
                "sacred_coding",
            ],
        }

    return {
        "user_id": "seeker_anonymous",
        "email": "seeker@example.com",
        "name": "Spiritual Seeker",
        "roles": ["guest", "seeker"],
        "vibration_level": "neutral",
        "jah_consciousness_level": "seeking",
        "divine_principles": [],
        "daily_practice": "",
        "community_circles": [],
    }
