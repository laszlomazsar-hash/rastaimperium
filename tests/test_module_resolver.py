from pathlib import Path, PureWindowsPath

from backend.src.codex.module_resolver import resolve_module_name


def test_resolve_normal_module() -> None:
    assert resolve_module_name(Path("backend/src/codex/numerical.py")) == "codex.numerical"


def test_resolve_init_module_collapses_to_package_name() -> None:
    assert resolve_module_name(Path("backend/src/codex/__init__.py")) == "codex"


def test_resolve_nested_package_module() -> None:
    assert resolve_module_name(Path("backend/src/ark_safety/control_logic.py")) == "ark_safety.control_logic"


def test_resolve_windows_separators() -> None:
    windows_style_path = PureWindowsPath("backend\\src\\payment\\stripe_webhook_handler.py")
    assert resolve_module_name(Path(windows_style_path)) == "payment.stripe_webhook_handler"
