from __future__ import annotations

import hashlib
import hmac
import json
import math
from collections import Counter
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Any, Callable, Dict, List, Literal, Mapping, Optional, Protocol

# Changed relative import to absolute import
from codex.canonical_json import dumps_canonical

class TopologyOperation(Protocol):
    """Pure topology operation.

    Implementations must be side-effect free and return a new candidate topology
    based on the provided input topology.
    """

    def apply(self, topology: Dict[str, Any]) -> Dict[str, Any]:
        """Return a new topology candidate."""

...
