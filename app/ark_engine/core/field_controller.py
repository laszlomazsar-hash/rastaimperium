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
    def __init__(self) -> None:
        self.ark = Ark()
        self.nyabinghi_connected = False
        self.current_state = "ROOTS_GROUNDING"

    def update_state(self, vibe: str, score: float) -> None:
        """Logic to shift the machine's frequency state."""
        v = vibe.lower()
        old_state = self.current_state

        if score < 0.3:
            self.current_state = "BABYLON_BURN"
        elif "zion" in v or "joy" in v or score > 0.9:
            self.current_state = "ZION_FLOW"
        elif "action" in v or "drive" in v or "network" in v:
            self.current_state = "NYABINGHI_DRIVE"
        else:
            self.current_state = "ROOTS_GROUNDING"

        if old_state != self.current_state:
            print(f"[STATE SHIFT]: {old_state} -> {self.current_state}")

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
    I_Field = IFieldController()
    seed_the_ark(I_Field)

    run_daily_reflection(I_Field, "I feel great joy in the Zion vision for the network.")
