from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, List


UNDETERMINED_MODE = "undetermined"
INSUFFICIENT_EVIDENCE_MODE = "insufficient_evidence"


@dataclass
class DetectorSignal:
    detector: str
    mode: str
    confidence: float
    data_points: int
    metrics: Dict[str, float] = field(default_factory=dict)


@dataclass
class ModeDecision:
    mode: str
    confidence: float
    committed: bool
    reason: str
    supporting_detectors: List[str] = field(default_factory=list)


@dataclass
class ModeAuditRecord:
    timestamp: str
    window_id: int
    decision: ModeDecision
    detector_signals: List[Dict[str, Any]]


class NoiseAwareModeResolver:
    """Reduces false mode declarations in noisy finite windows."""

    def __init__(
        self,
        detector_min_data_points: Dict[str, int],
        detector_min_confidence: Dict[str, float] | None = None,
        required_agreement_windows: int = 3,
        min_agreeing_detectors: int = 2,
    ) -> None:
        self._detector_min_data_points = detector_min_data_points
        self._detector_min_confidence = detector_min_confidence or {}
        self._required_agreement_windows = max(1, required_agreement_windows)
        self._min_agreeing_detectors = max(1, min_agreeing_detectors)
        self._window_id = 0
        self._committed_mode = UNDETERMINED_MODE
        self._candidate_mode = UNDETERMINED_MODE
        self._candidate_streak = 0
        self._audit_log: List[ModeAuditRecord] = []

    def evaluate(self, signals: List[DetectorSignal]) -> ModeDecision:
        self._window_id += 1
        valid, insufficient = self._partition_signals(signals)

        if not valid:
            decision = ModeDecision(
                mode=INSUFFICIENT_EVIDENCE_MODE,
                confidence=0.0,
                committed=False,
                reason="No detector met minimum data/confidence thresholds.",
                supporting_detectors=[],
            )
            self._record_audit(signals, decision, insufficient)
            return decision

        mode_support: Dict[str, List[DetectorSignal]] = {}
        for signal in valid:
            mode_support.setdefault(signal.mode, []).append(signal)

        selected_mode, supporters = max(mode_support.items(), key=lambda item: len(item[1]))
        avg_confidence = round(sum(item.confidence for item in supporters) / len(supporters), 4)

        if len(supporters) < self._min_agreeing_detectors:
            decision = ModeDecision(
                mode=UNDETERMINED_MODE,
                confidence=avg_confidence,
                committed=False,
                reason="Detector agreement count below commitment threshold.",
                supporting_detectors=[item.detector for item in supporters],
            )
            self._advance_candidate(UNDETERMINED_MODE)
            self._record_audit(signals, decision, insufficient)
            return decision

        if selected_mode == self._candidate_mode:
            self._candidate_streak += 1
        else:
            self._candidate_mode = selected_mode
            self._candidate_streak = 1

        committed = self._candidate_streak >= self._required_agreement_windows
        if committed:
            self._committed_mode = selected_mode

        decision = ModeDecision(
            mode=selected_mode if committed else UNDETERMINED_MODE,
            confidence=avg_confidence,
            committed=committed,
            reason=(
                "Mode committed after sustained multi-window agreement."
                if committed
                else "Awaiting sustained agreement before commitment."
            ),
            supporting_detectors=[item.detector for item in supporters],
        )
        self._record_audit(signals, decision, insufficient)
        return decision

    def _partition_signals(self, signals: List[DetectorSignal]) -> tuple[List[DetectorSignal], List[str]]:
        valid: List[DetectorSignal] = []
        insufficient: List[str] = []

        for signal in signals:
            min_points = self._detector_min_data_points.get(signal.detector, 1)
            min_confidence = self._detector_min_confidence.get(signal.detector, 0.0)
            if signal.data_points < min_points or signal.confidence < min_confidence:
                insufficient.append(signal.detector)
                continue
            valid.append(signal)

        return valid, insufficient

    def _advance_candidate(self, mode: str) -> None:
        if self._candidate_mode == mode:
            self._candidate_streak += 1
            return
        self._candidate_mode = mode
        self._candidate_streak = 1

    def _record_audit(self, signals: List[DetectorSignal], decision: ModeDecision, insufficient: List[str]) -> None:
        detector_rows = []
        for signal in signals:
            detector_rows.append(
                {
                    "detector": signal.detector,
                    "mode": signal.mode,
                    "confidence": signal.confidence,
                    "data_points": signal.data_points,
                    "metrics": signal.metrics,
                    "status": (
                        INSUFFICIENT_EVIDENCE_MODE if signal.detector in insufficient else "accepted"
                    ),
                }
            )

        self._audit_log.append(
            ModeAuditRecord(
                timestamp=datetime.now(timezone.utc).isoformat(),
                window_id=self._window_id,
                decision=decision,
                detector_signals=detector_rows,
            )
        )

    @property
    def committed_mode(self) -> str:
        return self._committed_mode

    @property
    def audit_log(self) -> List[ModeAuditRecord]:
        return list(self._audit_log)
