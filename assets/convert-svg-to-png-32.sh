#!/bin/sh
set -e

rsvg-convert -v > /dev/null 2>&1 || { echo "rsvg-convert is not installed, run: 'brew install librsvg' if you are on a mac with brew, or 'apt-get install librsvg' on debian/ubuntu" >&2; exit 1; }

ASSETS_FOLDER=$1

if [ "$ASSETS_FOLDER" == "" ]; then
  echo "Usage: $0 /path/to/assets/icons" >&2
  exit 1
fi

if [ ! -d "$ASSETS_FOLDER" ]; then
  echo "$ASSETS_FOLDER path not found" >&2
  exit 1
fi

for FILE_PATH in $(find $ASSETS_FOLDER -name '*.svg'); do
  PATH_NO_EXT="${FILE_PATH%.*}"
  # DIRNAME="$(dirname $PATH_NO_EXT)"
  # FILENAME="$(basename $PATH_NO_EXT)"
  # rsvg-convert $FILE_PATH -o "${PATH_NO_EXT}.png"
  rsvg-convert $FILE_PATH -w 32 -a -o "${PATH_NO_EXT}.png"
  # rsvg-convert $FILE_PATH -x 2 -y 2 -o "${PATH_NO_EXT}@2x.png"
  rsvg-convert $FILE_PATH -w 64 -a -o "${PATH_NO_EXT}@2x.png"
  # rsvg-convert $FILE_PATH -x 3 -y 3 -o "${PATH_NO_EXT}@3x.png"
  rsvg-convert $FILE_PATH -w 96 -a -o "${PATH_NO_EXT}@3x.png"
done
