#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SOURCE_DIR="$ROOT_DIR/docs/sales"
PUBLIC_SOURCE_DIR="$ROOT_DIR/frontend/public/sales-assets/source"
PUBLIC_EXPORT_DIR="$ROOT_DIR/frontend/public/sales-assets/exports"

mkdir -p "$PUBLIC_SOURCE_DIR" "$PUBLIC_EXPORT_DIR"

SOURCE_FILES=(
  "pitch-narrative-outline.md"
  "one-pager.md"
  "pricing-matrix.md"
  "objection-handling-notes.md"
  "deck-sections.md"
)

for file in "${SOURCE_FILES[@]}"; do
  cp "$SOURCE_DIR/$file" "$PUBLIC_SOURCE_DIR/$file"
done

if ! command -v pandoc >/dev/null 2>&1; then
  echo "pandoc not installed; copied markdown sources only."
  exit 0
fi

for file in "${SOURCE_FILES[@]}"; do
  name="${file%.md}"
  pandoc "$SOURCE_DIR/$file" -o "$PUBLIC_EXPORT_DIR/$name.pdf"
  pandoc "$SOURCE_DIR/$file" -t pptx -o "$PUBLIC_EXPORT_DIR/$name.pptx"
done

echo "Sales collateral exports generated in frontend/public/sales-assets/exports/."
