import importlib.util
import sys
from pathlib import Path

from fastapi.testclient import TestClient


REPLAY_MODULE_PATH = Path("evo-v-core/app/core/replay.py")
APP_MODULE_PATH = Path("evo-v-core/app/main.py")

APP_ROOT = Path("evo-v-core/app").resolve()
if str(APP_ROOT) not in sys.path:
    sys.path.insert(0, str(APP_ROOT))


def _load_module(path: Path, module_name: str):
    spec = importlib.util.spec_from_file_location(module_name, path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"unable to load module from {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def _proof_sequence() -> list[dict]:
    return [
        {
            "metadata": {
                "operation_order": ["energy", "position"],
                "numeric_scheme": "fixed-point-1e-9",
                "solver_settings": {"max_iterations": 3, "method": "deterministic-gauss"},
                "iteration_counts": {"solve": 2},
                "projection_steps": [{"name": "clamp", "bounds": [0.0, 1.0]}],
            },
            "delta": {"position": {"x": 0.30000000004}, "energy": 0.9},
        },
        {
            "metadata": {
                "operation_order": ["energy", "position"],
                "numeric_scheme": "fixed-point-1e-9",
                "solver_settings": {"max_iterations": 3, "method": "deterministic-gauss"},
                "iteration_counts": {"solve": 1},
                "projection_steps": [{"name": "normalize", "norm": "l2"}],
            },
            "delta": {"position": {"y": 0.70000000005}, "energy": 0.85},
        },
    ]


def test_replay_reconstructs_identical_hashes_across_runs() -> None:
    replay_module = _load_module(REPLAY_MODULE_PATH, "evo_v_replay")
    initial_state = {"energy": 1.0, "position": {"x": 0.0, "y": 0.0}}
    proofs = _proof_sequence()

    first_hashes = replay_module.replay_state_hashes(initial_state, proofs)
    second_hashes = replay_module.replay_state_hashes(initial_state, proofs)

    assert first_hashes == second_hashes


def test_replay_canonicalizes_payload_before_hashing() -> None:
    replay_module = _load_module(REPLAY_MODULE_PATH, "evo_v_replay_canonical")

    payload_a = {"b": 2.1234567899, "a": {"z": 2, "x": 1}}
    payload_b = {"a": {"x": 1, "z": 2}, "b": 2.12345678991}

    assert replay_module.payload_hash(payload_a) == replay_module.payload_hash(payload_b)


def test_replay_verify_endpoint_returns_first_divergence_tick() -> None:
    app_module = _load_module(APP_MODULE_PATH, "evo_v_main")

    with TestClient(app_module.app) as client:
        initial_state = {"energy": 1.0, "position": {"x": 0.0, "y": 0.0}}
        proofs = _proof_sequence()

        baseline = client.post(
            "/proof/replay/verify",
            json={"initial_state": initial_state, "proof_sequence": proofs},
        )
        baseline_hashes = baseline.json()["reconstructed_hashes"]

        mutated_hashes = list(baseline_hashes)
        mutated_hashes[2] = "deadbeef"

        result = client.post(
            "/proof/replay/verify",
            json={
                "initial_state": initial_state,
                "proof_sequence": proofs,
                "expected_hashes": mutated_hashes,
            },
        )

    payload = result.json()
    assert result.status_code == 200
    assert payload["success"] is False
    assert payload["first_divergence_tick"] == 2
