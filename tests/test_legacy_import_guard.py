from __future__ import annotations

import importlib

import pytest

from backend.src.runtime_import_guard import LegacyNamespaceImportError, install_legacy_import_guard


def test_legacy_namespace_import_is_runtime_fatal() -> None:
    install_legacy_import_guard()

    with pytest.raises(LegacyNamespaceImportError, match="runtime-fatal"):
        importlib.import_module("evo_v.api.observatory")
