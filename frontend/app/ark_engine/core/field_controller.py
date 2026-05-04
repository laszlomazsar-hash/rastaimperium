"""Field controller and chronicle module for resonance tracking."""

from __future__ import annotations

import datetime
from typing import Any, Dict, List, Set


class GoldenNugget:
    def __init__(self, content: str, resonance_weight: float, tags: List[str]) -> None:
        self.content = content
        self.resonance_weight = resonance_weight
        self.tags = set(tags)

    def fingerprint(self) -> str:
        return f"{hash(self.content)}::{round(self.resonance_weight, 2)}"


class Ark:
    def __init__(self) -> None:
        self.storage: Dict[str, GoldenNugget] = {}
        self.tag_index: Dict[str, Set[str]] = {}

    def store(self, nugget: GoldenNugget) -> bool:
        fp = nugget.fingerprint()
        if fp in self.storage:
            return False
        self.storage[fp] = nugget
        for tag in nugget.tags:
            self.tag_index.setdefault(tag, set()).add(fp)
        return True


class IFieldController:
    def __init__(self, *, _container_token: object | None = None) -> None:
        from app.core.container import is_container_token

        if not is_container_token(_container_token):
            raise RuntimeError("IFieldController must be created by AppContainer via get_container().")

        self.ark = Ark()
        self.nyabinghi_connected = False
        self.current_state = "ROOTS_GROUNDING"
        self.state_tick = 0
        self.state_entered_tick = 0
        self.min_dwell_ticks = 2
        self.action_thresholds = {
            "BABYLON_BURN": {"enter": 0.30, "exit": 0.40},
            "ZION_FLOW": {"enter": 0.90, "exit": 0.75},
            "NYABINGHI_DRIVE": {"enter": 0.60, "exit": 0.55},
        }
        self.current_action_state: Dict[str, Any] = {
            "state": self.current_state,
            "reason": "initial_state",
            "tick": self.state_tick,
        }
        self.transition_log: List[Dict[str, Any]] = []

    def _build_boundary_metrics(self, vibe: str, score: float) -> Dict[str, Any]:
        v = vibe.lower()
        return {
            "score": round(score, 3),
            "contains_zion_or_joy": ("zion" in v or "joy" in v),
            "contains_drive_signal": (
                "action" in v or "drive" in v or "network" in v
            ),
            "thresholds": self.action_thresholds,
            "ticks_in_state": self.state_tick - self.state_entered_tick,
        }

    def _determine_candidate_state(
        self,
        vibe: str,
        score: float,
        metrics: Dict[str, Any],
    ) -> tuple[str, str]:
        v = vibe.lower()

        if self.current_state == "BABYLON_BURN":
            if score < self.action_thresholds["BABYLON_BURN"]["exit"]:
                return "BABYLON_BURN", "hold_babylon_burn_until_exit_threshold"
        elif score < self.action_thresholds["BABYLON_BURN"]["enter"]:
            return "BABYLON_BURN", "score_below_babylon_enter_threshold"

        if self.current_state == "ZION_FLOW":
            has_zion_signal = metrics["contains_zion_or_joy"]
            if has_zion_signal or score >= self.action_thresholds["ZION_FLOW"]["exit"]:
                return "ZION_FLOW", "hold_zion_flow_until_exit_threshold"
        elif metrics["contains_zion_or_joy"] or score > self.action_thresholds["ZION_FLOW"]["enter"]:
            return "ZION_FLOW", "zion_signal_or_score_above_zion_enter_threshold"

        if self.current_state == "NYABINGHI_DRIVE":
            if metrics["contains_drive_signal"] or score >= self.action_thresholds["NYABINGHI_DRIVE"]["exit"]:
                return "NYABINGHI_DRIVE", "hold_nyabinghi_drive_until_exit_threshold"
        elif metrics["contains_drive_signal"] and score >= self.action_thresholds["NYABINGHI_DRIVE"]["enter"]:
            return "NYABINGHI_DRIVE", "drive_signal_and_score_above_drive_enter_threshold"

        if "action" in v or "drive" in v or "network" in v:
            return "NYABINGHI_DRIVE", "drive_signal_present"

        return "ROOTS_GROUNDING", "default_roots_grounding"

    def _record_transition(
        self,
        old_state: str,
        new_state: str,
        reason: str,
        metrics: Dict[str, Any],
    ) -> None:
        event = {
            "tick": self.state_tick,
            "from": old_state,
            "to": new_state,
            "reason": reason,
            "boundary_metrics": metrics,
        }
        self.transition_log.append(event)
        self.current_action_state = {
            "state": new_state,
            "reason": reason,
            "tick": self.state_tick,
        }

    def get_transition_replay(self) -> List[Dict[str, Any]]:
        return list(self.transition_log)

    def update_state(self, vibe: str, score: float) -> None:
        """Logic to shift the machine's frequency state."""
        self.state_tick += 1
        old_state = self.current_state
        metrics = self._build_boundary_metrics(vibe, score)
        candidate_state, candidate_reason = self._determine_candidate_state(
            vibe,
            score,
            metrics,
        )

        ticks_in_state = self.state_tick - self.state_entered_tick
        if candidate_state != old_state and ticks_in_state < self.min_dwell_ticks:
            self.current_action_state = {
                "state": old_state,
                "reason": (
                    f"dwell_guard_active({ticks_in_state}/"
                    f"{self.min_dwell_ticks}) blocked {old_state}->{candidate_state}"
                ),
                "tick": self.state_tick,
            }
            return

        self.current_state = candidate_state

        if old_state != self.current_state:
            self.state_entered_tick = self.state_tick
            self._record_transition(
                old_state,
                self.current_state,
                candidate_reason,
                metrics,
            )
            print(f"[STATE SHIFT]: {old_state} -> {self.current_state}")
        else:
            self.current_action_state = {
                "state": self.current_state,
                "reason": candidate_reason,
                "tick": self.state_tick,
            }

    def meditate(self, vibe: str, silent: bool = False) -> Dict[str, Any]:
        vibe_lower = vibe.lower()
        results = []

        for nugget in self.ark.storage.values():
            score = 0.0
            for tag in nugget.tags:
                if tag in vibe_lower:
                    score += 0.6
            if "integrity" in vibe_lower and "integrity" in nugget.tags:
                score += 0.4
            if "wellingborough" in vibe_lower and "wellingborough" in nugget.tags:
                score += 0.3

            score *= nugget.resonance_weight
            if score > 0:
                results.append({"nugget": nugget, "score": round(score, 3)})

        if not results:
            for nugget in self.ark.storage.values():
                if "integrity" in nugget.tags:
                    results.append({"nugget": nugget, "score": nugget.resonance_weight})

        results.sort(key=lambda r: r["score"], reverse=True)
        top_score = results[0]["score"] if results else 0.0

        self.update_state(vibe, top_score)

        return {
            "vibe": vibe,
            "state": self.current_state,
            "results": [
                {"content": r["nugget"].content, "score": r["score"]}
                for r in results[:3]
            ],
        }


class ChronicleModule:
    def __init__(self, controller: IFieldController) -> None:
        self.controller = controller
        self.diary_path = "king_timeline_diary.txt"

    def compose_entry(self, audit: Dict[str, Any]) -> str:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        vibe = audit["vibe"]
        state = audit["state"]
        primary = audit["results"][0] if audit["results"] else None

        mood_prefix = {
            "ROOTS_GROUNDING": "The King is steady. The roots are deep.",
            "ZION_FLOW": "The spirit soars. Vision is clear.",
            "NYABINGHI_DRIVE": "The drums of expansion beat loud.",
            "BABYLON_BURN": "Alert: The shield is hot. Filtering static.",
        }.get(state, "")

        entry = (
            f"--- CHRONICLE ENTRY: {timestamp} ---\n"
            f"State: {state} | {mood_prefix}\n"
            f"Reflection: {vibe}\n"
            f"Ark Resonance: {primary['content'] if primary else 'None'}\n"
            "Selah.\n"
        )
        return entry

    def record(self, entry: str) -> None:
        with open(self.diary_path, "a", encoding="utf-8") as f:
            f.write(entry + "\n")
        print("[CHRONICLE]: Entry recorded for the King.")


def seed_the_ark(controller: IFieldController) -> None:
    seeds = [
        GoldenNugget(
            "The system is anchored in human accountability.",
            1.0,
            ["identity", "integrity"],
        ),
        GoldenNugget("Integrity acts as a gatekeeper.", 0.98, ["integrity", "law"]),
        GoldenNugget(
            "Wellingborough, NN8, is the grounding node.",
            0.95,
            ["wellingborough", "grounding"],
        ),
    ]
    for nugget in seeds:
        controller.ark.store(nugget)


def run_daily_reflection(controller: IFieldController, vibe: str) -> None:
    audit = controller.meditate(vibe)
    chronicler = ChronicleModule(controller)
    entry = chronicler.compose_entry(audit)
    chronicler.record(entry)
    print("\n" + entry)


if __name__ == "__main__":
    from app.core.container import get_container

    I_Field = get_container().field_controller
    seed_the_ark(I_Field)

    run_daily_reflection(I_Field, "I feel great joy in the Zion vision for the network.")
