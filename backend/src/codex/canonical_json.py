from __future__ import annotations

import json
import math
from decimal import Decimal, ROUND_HALF_EVEN, localcontext
from typing import Any

_SIGNIFICANT_DIGITS = 15
_SCIENTIFIC_LOWER_EXP = -6
_SCIENTIFIC_UPPER_EXP = 20


def _round_to_significant_digits(value: Decimal, digits: int = _SIGNIFICANT_DIGITS) -> Decimal:
    if value.is_zero():
        return Decimal("0")

    exponent = value.adjusted() - digits + 1
    quantum = Decimal(f"1e{exponent}")

    with localcontext() as ctx:
        ctx.prec = max(digits + 8, 32)
        ctx.rounding = ROUND_HALF_EVEN
        return value.quantize(quantum)


def canonicalize_float(value: float) -> str:
    """Canonical float formatter for cross-runtime stable JSON serialization.

    Rules:
    - IEEE non-finite values are rejected.
    - Negative zero is normalized to ``0``.
    - Values are rounded to 15 significant digits using round-half-even.
    - Scientific notation is allowed and used for exponents < -6 or >= 20.
    - Scientific exponents use explicit sign and at least two digits (e.g. ``e+06``).
    """

    if not math.isfinite(value):
        raise ValueError("Non-finite float values are not supported in canonical JSON")

    if value == 0.0:
        return "0"

    rounded = _round_to_significant_digits(Decimal.from_float(value))
    if rounded.is_zero():
        return "0"

    exponent = rounded.adjusted()
    use_scientific = exponent < _SCIENTIFIC_LOWER_EXP or exponent >= _SCIENTIFIC_UPPER_EXP

    if use_scientific:
        digits = rounded.normalize().as_tuple().digits
        sign = "-" if rounded.is_signed() else ""
        coefficient = "".join(str(d) for d in digits)
        mantissa = coefficient[0]
        fractional = coefficient[1:].rstrip("0")
        if fractional:
            mantissa = f"{mantissa}.{fractional}"
        exp_str = f"{exponent:+03d}"
        return f"{sign}{mantissa}e{exp_str}"

    as_plain = format(rounded, "f")
    if "." in as_plain:
        as_plain = as_plain.rstrip("0").rstrip(".")
    return as_plain


def dumps_canonical(value: Any) -> str:
    """Serialize values into canonical JSON with stable float formatting."""

    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int) and not isinstance(value, bool):
        return str(value)
    if isinstance(value, float):
        return canonicalize_float(value)
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, list):
        return "[" + ",".join(dumps_canonical(item) for item in value) + "]"
    if isinstance(value, dict):
        keys = sorted(value)
        parts = []
        for key in keys:
            if not isinstance(key, str):
                raise TypeError("Canonical JSON object keys must be strings")
            parts.append(f"{dumps_canonical(key)}:{dumps_canonical(value[key])}")
        return "{" + ",".join(parts) + "}"

    raise TypeError(f"Type {type(value)!r} is not serializable in canonical JSON")
