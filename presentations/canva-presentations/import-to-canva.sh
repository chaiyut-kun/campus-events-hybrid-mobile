#!/usr/bin/env bash
set -e

echo "=== Canva Design Import & Sync Script ==="
echo "Target Presentation: ./outputs/pptx/campus-events-editable.pptx"

# 1. Export Slidev to editable PPTX if needed
if [ "$1" == "--build" ]; then
  echo "Exporting Slidev with --format pptx-editable..."
  pnpm exec slidev export --format pptx-editable --output ./outputs/pptx/campus-events-editable.pptx
fi

# 2. Import Editable PPTX to Canva
echo "Importing editable PPTX presentation to Canva..."
npx -y @canva/cli@latest api design-imports create \
  --title "Campus Events — App Progress (Editable)" \
  --file ./outputs/pptx/campus-events-editable.pptx

echo "Sync completed successfully."
