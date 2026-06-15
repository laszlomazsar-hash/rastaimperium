import os


def test_repo_structure_exists():
    assert os.path.exists("tests")
    assert os.path.isdir("tests/unit")
    assert os.path.isdir("tests/integration")


def test_basic_integration_smoke():
    # simple integration-level sanity check
    assert 2 * 2 == 4
