from __future__ import annotations

import hashlib
import hmac
import json
import math
import unicodedata
from collections import Counter
from copy import deepcopy
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Any, Callable, Dict, List, Literal, Mapping, Optional, Protocol, Tuple

from .canonical_json import dumps_canonical
