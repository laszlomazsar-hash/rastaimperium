from scripts.validate_architecture_version import extract_canonical_version, validate_versions


def test_extract_canonical_version():
    markdown = """
# Sample
- Canonical architecture version: `3.5.0`
"""
    assert extract_canonical_version(markdown) == "3.5.0"


def test_validate_versions_success():
    blueprint = {
        "version": "3.5.0",
        "metadata": {
            "architectureVersion": "3.5.0",
            "sourceOfTruth": "docs/ARCHITECTURE_CANONICAL.md",
        },
    }

    errors = validate_versions("3.5.0", blueprint, "docs/ARCHITECTURE_CANONICAL.md")

    assert errors == []


def test_validate_versions_reports_mismatch():
    blueprint = {
        "version": "v3.5",
        "metadata": {
            "architectureVersion": "3.4.0",
            "sourceOfTruth": "docs/OTHER.md",
        },
    }

    errors = validate_versions("3.5.0", blueprint, "docs/ARCHITECTURE_CANONICAL.md")

    assert any("blueprint.metadata.architectureVersion" in error for error in errors)
    assert any("blueprint.version" in error for error in errors)
    assert any("Source-of-truth mismatch" in error for error in errors)
