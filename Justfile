build:
    cd icons && ./generate-icons.sh
    npm run build
    rm -f store/LinkedIn_JobTracker.zip
    zip -r store/LinkedIn_JobTracker.zip dist/
