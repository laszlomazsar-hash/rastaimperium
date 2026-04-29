#!/usr/bin/env bash
set -uo pipefail

# Run strict flake8 once and preserve raw output + exit code while also printing
# a deduplicated undefined-name (F821) summary for maintainers/CI logs.
LOG_FILE="${1:-/tmp/flake8.strict.log}"
shift || true

targets=("$@")
if [ ${#targets[@]} -eq 0 ]; then
  targets=(src migrations)
fi

flake8 "${targets[@]}" --count --select=E9,F63,F7,F82 --show-source --statistics 2>&1 | tee "$LOG_FILE"
flake8_rc=${PIPESTATUS[0]}

echo

echo "F821 summary (unique file + undefined symbol):"
awk -F: '
  /F821/ {
    file=$1
    msg=$0
    sub(/^.*F821[[:space:]]+undefined name /, "", msg)
    gsub(/^["\047]|["\047]$/, "", msg)
    key=file "|" msg
    if (!(key in seen)) {
      seen[key]=1
      print "- " file ": " msg
      count++
    }
  }
  END {
    if (count == 0) {
      print "- none"
    } else {
      print "Total unique F821 issues: " count
    }
  }
' "$LOG_FILE"

exit "$flake8_rc"
