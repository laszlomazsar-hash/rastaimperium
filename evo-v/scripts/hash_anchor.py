import json
import sys

from app.core.blockchain_anchor import anchor_state


def main() -> int:
    payload = {"args": sys.argv[1:]}
    print(json.dumps(payload, indent=2))
    anchor_state(payload)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
