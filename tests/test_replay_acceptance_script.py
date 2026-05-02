import json
import subprocess
import sys


def test_replay_acceptance_script_passes_for_numeric_tolerance(tmp_path) -> None:
    replay_file = tmp_path / "replay.json"
    replay_file.write_text(json.dumps({"hash_match": True, "max_abs_error": 1e-7, "p_value": 0.999}))

    result = subprocess.run(
        [sys.executable, "scripts/check_replay_acceptance.py", "--input", str(replay_file)],
        check=False,
        capture_output=True,
        text=True,
    )

    assert result.returncode == 0
    assert '"accepted": true' in result.stdout
