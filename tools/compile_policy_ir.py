#!/usr/bin/env python3
import argparse
import json
from pathlib import Path


def _load_json(path: Path) -> object:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _canonicalize(policy: dict) -> dict:
    rules = policy.get("rules", [])
    if not isinstance(rules, list):
        raise ValueError("policy source must contain a list at 'rules'")

    normalized_rules: list[dict] = []
    for rule in rules:
        if not isinstance(rule, dict):
            raise ValueError("each rule must be an object")
        rule_id = rule.get("id")
        condition = rule.get("condition")
        action = rule.get("action")
        if not isinstance(rule_id, str) or not rule_id:
            raise ValueError("each rule requires non-empty string 'id'")
        if not isinstance(condition, str) or not condition:
            raise ValueError(f"rule {rule_id!r} requires non-empty string 'condition'")
        if not isinstance(action, str) or not action:
            raise ValueError(f"rule {rule_id!r} requires non-empty string 'action'")
        normalized_rules.append(
            {
                "id": rule_id,
                "condition": condition,
                "action": action,
                "priority": int(rule.get("priority", 100)),
                "metadata": rule.get("metadata", None),
            }
        )

    normalized_rules.sort(key=lambda item: (item["priority"], item["id"]))

    return {
        "schema_version": "1.0.0",
        "ruleset_version": policy.get("ruleset_version", "1.0.0"),
        "governance_version": policy.get("governance_version", "1.0.0"),
        "canon_spec_version": "1.0.0",
        "cert_profile": policy.get("cert_profile", None),
        "rules": normalized_rules,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--output", required=True)
    args = parser.parse_args()

    source_payload = _load_json(Path(args.source))
    if not isinstance(source_payload, dict):
        raise ValueError("policy source must be a JSON object")

    ir_payload = _canonicalize(source_payload)
    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8", newline="\n") as handle:
        json.dump(ir_payload, handle, ensure_ascii=False, sort_keys=True, indent=2)
        handle.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
