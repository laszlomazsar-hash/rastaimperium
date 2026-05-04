from tests.architecture.policy import CANONICAL_RUNTIME_ROOT, FORBIDDEN_NAMESPACES


def test_architecture_policy_has_no_contradictory_namespace_rules() -> None:
    canonical_root_name = CANONICAL_RUNTIME_ROOT.name

    assert all(
        not canonical_root_name.startswith(prefix.rstrip(".")) for prefix in FORBIDDEN_NAMESPACES
    ), "forbidden namespace prefix collides with canonical runtime root"
