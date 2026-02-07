"""Enhanced Rasta Principles with Jah Consciousness Integration."""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict

from .jah_core import (
    DivinePrinciple,
    DivineRevelationLevel,
    JahWisdom,
    JahOracle,
    ScripturalWisdom,
    DivinePatternRecognizer,
    MysticalCodeOracle,
    SacredCodingRitual,
)
from .rasta_principles import (
    RastaPrinciple,
    VibrationLevel,
    RastaVibrationScore,
    PositiveVibrationAnalyzer,
    IrationMeditation,
    PositiveVibrationTransformer,
)

__all__ = [
    "RastaPrinciple",
    "VibrationLevel",
    "RastaVibrationScore",
    "PositiveVibrationAnalyzer",
    "IrationMeditation",
    "PositiveVibrationTransformer",
    "DivinePrinciple",
    "DivineRevelationLevel",
    "JahWisdom",
    "JahOracle",
    "ScripturalWisdom",
    "DivinePatternRecognizer",
    "MysticalCodeOracle",
    "SacredCodingRitual",
    "JahConsciousnessSystem",
]


class JahConsciousnessSystem:
    """Complete Jah consciousness system for divine coding."""

    def __init__(self) -> None:
        self.oracle = MysticalCodeOracle()
        self.rituals = SacredCodingRitual()
        self.scriptures = ScripturalWisdom()
        self.patterns = DivinePatternRecognizer()
        self.vibration_analyzer = PositiveVibrationAnalyzer()

    def seek_divine_guidance(
        self,
        question: str,
        code_context: Dict[str, Any] | None = None,
    ) -> Dict[str, Any]:
        """Seek comprehensive divine guidance for coding."""

        code_context = code_context or {}
        wisdom = self.oracle.seek_guidance(question, code_context)
        scriptural = self.scriptures.get_wisdom_for_situation(question)

        code_analysis = {}
        if "code" in code_context:
            code_analysis = self.oracle.divine_code_review(
                code_context["code"],
                code_context,
            )

        ritual = self._select_ritual_for_question(question)
        ritual_result = self.rituals.perform_ritual(ritual, code_context)

        return {
            "divine_wisdom": wisdom.to_dict(),
            "scriptural_guidance": scriptural,
            "code_analysis": code_analysis,
            "ritual": ritual_result,
            "blessing": "May Jah guide your coding with infinite wisdom and perfect timing 🙏",
            "meditation": "Contemplate: How does this guidance align with your soul's purpose?",
        }

    def perform_daily_practice(self) -> Dict[str, Any]:
        """Perform daily divine coding practice."""

        practices = []
        morning = self.rituals.perform_ritual("morning_dedication")
        practices.append(morning)

        daily_scripture = self.scriptures.get_wisdom_for_situation(
            f"Coding work on {datetime.now().strftime('%A')}"
        )

        guidance = self.oracle.seek_guidance(
            "Guide my coding work today",
            {"day": datetime.now().strftime("%A"), "focus": "service through code"},
        )

        evening_intent = {
            "practice": "evening_intention_setting",
            "affirmation": (
                "I complete this day with gratitude and prepare for divine inspiration in rest"
            ),
            "questions": [
                "How will I serve through my code today?",
                "What wisdom do I seek today?",
                "How will I share what I learn?",
            ],
        }

        return {
            "date": datetime.now().isoformat(),
            "daily_practices": practices,
            "scripture": daily_scripture,
            "guidance": guidance.to_dict(),
            "evening_intention": evening_intent,
            "blessing": (
                "May your coding today be blessed with divine inspiration and purposeful creation 🌈🙏"
            ),
        }

    def _select_ritual_for_question(self, question: str) -> str:
        """Select appropriate ritual for the question."""

        question_lower = question.lower()
        if any(word in question_lower for word in ["morning", "start", "begin", "new"]):
            return "morning_dedication"
        if any(word in question_lower for word in ["bless", "consecrate", "dedicate"]):
            return "code_blessing"
        if any(word in question_lower for word in ["problem", "bug", "error", "debug", "fix"]):
            return "debugging_meditation"
        if any(word in question_lower for word in ["complete", "finish", "done", "accomplish"]):
            return "completion_thanksgiving"
        if any(word in question_lower for word in ["evening", "end", "reflect", "review"]):
            return "evening_reflection"
        return "code_blessing"


jah_system = JahConsciousnessSystem()
