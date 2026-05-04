from pathlib import Path

from tools.find_fastapi_apps import find_fastapi_apps


def test_find_fastapi_apps_detects_direct_constructor_with_alias_import(tmp_path: Path) -> None:
    file_path = tmp_path / "app.py"
    file_path.write_text(
        "from fastapi import FastAPI as F\napi = F(title='x')\n",
        encoding="utf-8",
    )

    apps = find_fastapi_apps(file_path)

    assert [(app.target_name, app.lineno) for app in apps] == [("api", 2)]


def test_find_fastapi_apps_detects_qualified_constructor_with_module_alias(tmp_path: Path) -> None:
    file_path = tmp_path / "app.py"
    file_path.write_text(
        "import fastapi as f\napp = f.FastAPI()\n",
        encoding="utf-8",
    )

    apps = find_fastapi_apps(file_path)

    assert [(app.target_name, app.lineno) for app in apps] == [("app", 2)]
