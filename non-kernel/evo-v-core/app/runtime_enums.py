"""Canonical runtime enums shared by state and proof workflows."""

from __future__ import annotations

from enum import Enum


class ProofStatus(str, Enum):
    UNKNOWN = "UNKNOWN"
    VALID = "VALID"
    INVALID = "INVALID"


class RuntimeMode(str, Enum):
    NORMAL = "NORMAL"
    COMPROMISE = "COMPROMISE"
