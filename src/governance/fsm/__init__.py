"""FSM governance package."""

from .transition_matrix import TransitionResult, apply_transition, is_transition_allowed

__all__ = ["TransitionResult", "apply_transition", "is_transition_allowed"]
