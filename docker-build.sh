#!/bin/bash

echo "🏎️ Building F1 Scanner APK with Docker..."
echo "========================================="

# Build Docker image
docker build -t f1-scanner-builder .

# Create container and copy APK
docker create --name temp-container f1-scanner-builder
docker cp temp-container:/app/android/app/build/outputs/apk/debug/app-debug.apk ./f1-scanner.apk
docker rm temp-container

echo "✅ APK ready: f1-scanner.apk"
echo "You can now install this APK on any Android device!"