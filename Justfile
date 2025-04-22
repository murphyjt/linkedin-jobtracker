build:
    npm run build
    for size in 16 32 48 96 128 256 384; do rsvg-convert -w $size -h $size src/icon.svg -o dist/icons/icon-${size}.png; done
    zip -r store/LinkedIn_JobTracker.zip dist/
