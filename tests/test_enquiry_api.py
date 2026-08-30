from fastapi.testclient import TestClient

from src.ark_safety import enquiries
from src.ark_safety.main import app


def _payload() -> dict[str, str]:
    return {
        "name": "Ada Lovelace",
        "email": "ADA@EXAMPLE.COM",
        "context": "We need to inspect an approval workflow before a bounded pilot.",
        "consent": True,
        "website": "",
    }


def test_valid_enquiry_is_persisted_and_returns_reference(monkeypatch) -> None:
    writes: list[dict[str, object]] = []
    monkeypatch.setattr(enquiries, "rate_limiter", enquiries.EnquiryRateLimiter())
    monkeypatch.setattr(enquiries, "save_enquiry", lambda payload: writes.append(payload.model_dump()) or 42)
    response = TestClient(app).post("/api/enquiries", json=_payload())
    assert response.status_code == 201
    assert response.json() == {"ok": True, "reference": "RI-000042"}
    assert writes[0]["email"] == "ADA@example.com"
    assert writes[0]["consent"] is True


def test_invalid_payload_and_honeypot_are_rejected(monkeypatch) -> None:
    monkeypatch.setattr(enquiries, "rate_limiter", enquiries.EnquiryRateLimiter())
    invalid = _payload() | {"name": "A", "email": "bad", "context": "short"}
    assert TestClient(app).post("/api/enquiries", json=invalid).status_code == 422
    honeypot = _payload() | {"website": "filled"}
    assert TestClient(app).post("/api/enquiries", json=honeypot).status_code == 422


def test_repeated_requests_are_rate_limited(monkeypatch) -> None:
    monkeypatch.setattr(enquiries, "rate_limiter", enquiries.EnquiryRateLimiter())
    monkeypatch.setattr(enquiries, "save_enquiry", lambda payload: 1)
    client = TestClient(app)
    responses = [client.post("/api/enquiries", json=_payload()) for _ in range(6)]
    assert sum(response.status_code == 429 for response in responses) == 1
