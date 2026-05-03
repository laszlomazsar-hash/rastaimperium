from __future__ import annotations

from dataclasses import dataclass
from typing import Callable, Mapping

DIAGNOSTICS_SCHEMA_VERSION = "1.0.0"


@dataclass(frozen=True)
class ComputeModeDiagnostics:
    """Versioned diagnostics emitted on each compute-mode control tick."""

    schema_version: str
    mode: str
    previous_mode: str
    triggers: dict[str, object]
    hysteresis_counter: int
    budget_state_snapshot: dict[str, float]


@dataclass(frozen=True)
class _Rule:
    name: str
    target_mode: str
    predicate: Callable[[Mapping[str, float]], bool]


class ComputeModeController:
    """Deterministic compute-mode controller with explainable transitions."""

    def __init__(self, initial_mode: str = "balanced", hysteresis_ticks: int = 2) -> None:
        self._mode = initial_mode
        self._hysteresis_ticks = max(1, hysteresis_ticks)
        self._pending_mode = initial_mode
        self._hysteresis_counter = 0
        self._diagnostic_log: list[ComputeModeDiagnostics] = []
        self._rules: tuple[_Rule, ...] = (
            _Rule(
                name="upgrade_to_turbo_on_pressure",
                target_mode="turbo",
                predicate=lambda state: state.get("pressure", 0.0) >= 0.8
                or state.get("budget_remaining", 1.0) <= 0.2,
            ),
            _Rule(
                name="downgrade_to_eco_on_slack",
                target_mode="eco",
                predicate=lambda state: state.get("pressure", 0.0) <= 0.35
                and state.get("budget_remaining", 1.0) >= 0.6,
            ),
            _Rule(
                name="stabilize_at_balanced",
                target_mode="balanced",
                predicate=lambda _state: True,
            ),
        )

    def tick(self, budget_state: Mapping[str, float]) -> ComputeModeDiagnostics:
        snapshot = {key: float(value) for key, value in sorted(budget_state.items())}
        previous_mode = self._mode

        matched_rules = [rule for rule in self._rules if rule.predicate(snapshot)]
        selected_rule = matched_rules[0]
        suppressed_rules = [rule.name for rule in matched_rules[1:]]

        if selected_rule.target_mode == self._mode:
            self._pending_mode = self._mode
            self._hysteresis_counter = 0
            fired_rule = f"{selected_rule.name}:already_in_mode"
        else:
            if self._pending_mode == selected_rule.target_mode:
                self._hysteresis_counter += 1
            else:
                self._pending_mode = selected_rule.target_mode
                self._hysteresis_counter = 1

            fired_rule = selected_rule.name
            if self._hysteresis_counter >= self._hysteresis_ticks:
                self._mode = selected_rule.target_mode
                self._hysteresis_counter = 0
                fired_rule = f"{selected_rule.name}:transition_committed"
            else:
                fired_rule = f"{selected_rule.name}:pending_hysteresis"

        diagnostics = ComputeModeDiagnostics(
            schema_version=DIAGNOSTICS_SCHEMA_VERSION,
            mode=self._mode,
            previous_mode=previous_mode,
            triggers={
                "fired_rule": fired_rule,
                "selected_rule": selected_rule.name,
                "suppressed_rules": suppressed_rules,
                "matched_rules": [rule.name for rule in matched_rules],
            },
            hysteresis_counter=self._hysteresis_counter,
            budget_state_snapshot=snapshot,
        )
        self._diagnostic_log.append(diagnostics)
        return diagnostics

    @property
    def diagnostic_log(self) -> list[ComputeModeDiagnostics]:
        return list(self._diagnostic_log)


def replay_mode_timeline(
    budget_state_history: list[Mapping[str, float]],
    *,
    initial_mode: str = "balanced",
    hysteresis_ticks: int = 2,
) -> list[ComputeModeDiagnostics]:
    """Replay a budget history through a fresh controller and collect diagnostics."""

    controller = ComputeModeController(initial_mode=initial_mode, hysteresis_ticks=hysteresis_ticks)
    return [controller.tick(state) for state in budget_state_history]
