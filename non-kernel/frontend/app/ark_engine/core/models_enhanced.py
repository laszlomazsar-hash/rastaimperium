"""Enhanced model definitions for ARK Engine."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional


@dataclass
class EnhancedModuleModification:
    modification_id: str
    target_component: str
    component_type: str
    level: str
    original_version: str
    modified_version: str
    description: str
    rationale: str
    author: str
    harmony_score: Optional[float] = None
    community_impact: Dict[str, Any] = field(default_factory=dict)
    meditation_notes: List[str] = field(default_factory=list)

    def add_meditation_note(self, note: str) -> None:
        self.meditation_notes.append(note)
