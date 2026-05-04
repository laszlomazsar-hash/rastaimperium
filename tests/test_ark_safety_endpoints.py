from fastapi.testclient import TestClient

from src.ark_safety.main import app


def test_violation_status_is_exposed_in_observability_endpoints() -> None:
    client = TestClient(app)

    coverage_response = client.get("/telemetry/coverage")
    assert coverage_response.status_code == 200
    assert "violation_status" in coverage_response.json()

    violation_response = client.get("/telemetry/violations")
    payload = violation_response.json()
    assert violation_response.status_code == 200
    assert "fault_model" in payload
    assert "collapse_resistance" in payload
    assert "integrity" in payload
