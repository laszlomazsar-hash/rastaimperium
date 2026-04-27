from src.ark_safety.main import epistemic, health, state
from src.ark_safety.monitor_checks import validate_required_keys, validate_schema_compatibility


def test_health_payload_has_required_keys_and_compatible_version() -> None:
    payload = health()

    required_check = validate_required_keys(payload, {"schema_version", "status"})
    compat_check = validate_schema_compatibility(payload, supported_major=1)

    assert required_check.compatible is True
    assert compat_check.compatible is True


def test_state_payload_has_required_keys_and_compatible_version() -> None:
    payload = state()

    required_check = validate_required_keys(payload, {"schema_version", "coverage", "rollback_ready"})
    compat_check = validate_schema_compatibility(payload, supported_major=1)

    assert required_check.compatible is True
    assert compat_check.compatible is True


def test_epistemic_payload_has_required_keys_and_compatible_version() -> None:
    payload = epistemic()

    required_check = validate_required_keys(
        payload,
        {"schema_version", "trace_coverage", "rollback_ready", "latest_audit_digest"},
    )
    compat_check = validate_schema_compatibility(payload, supported_major=1)

    assert required_check.compatible is True
    assert compat_check.compatible is True


def test_monitor_compatibility_ignores_additional_fields() -> None:
    payload = {
        "schema_version": "1.2.3",
        "status": "ok",
        "extra_field": "safe-additive-change",
    }

    required_check = validate_required_keys(payload, {"schema_version", "status"})
    compat_check = validate_schema_compatibility(payload, supported_major=1)

    assert required_check.compatible is True
    assert compat_check.compatible is True
