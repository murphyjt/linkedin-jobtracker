#!/bin/bash
set -e

if [ -f icon-16.png ] && [ icon.svg -ot icon-16.png ]; then
  echo "Icons are up to date. Skipping regeneration."
  exit 0
fi

if ! command -v rsvg-convert &> /dev/null; then
  echo "rsvg-convert not found."
  if command -v brew &> /dev/null; then
    echo "You can install it with: brew install librsvg"
  elif command -v apt &> /dev/null; then
    echo "You can install it with: sudo apt install librsvg2-bin"
  elif command -v pacman &> /dev/null; then
    echo "You can install it with: sudo pacman -S librsvg"
  else
    echo "Please install rsvg-convert manually for your system."
  fi
  exit 1
fi

echo "Generating icons..."
for size in 16 32 48 96 128 256 384; do
  rsvg-convert -w $size -h $size icon.svg -o icon-$size.png
done
