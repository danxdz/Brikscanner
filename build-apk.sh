#!/bin/bash

echo "🏎️ F1 Barcode Scanner - APK Builder"
echo "====================================="
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node version: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "📦 Installing EAS CLI..."
    npm install -g eas-cli
fi

echo ""
echo "Choose build method:"
echo "1) EAS Build (Cloud - Recommended)"
echo "2) Local Build (Requires Android SDK)"
echo "3) Debug APK (Quick, no signing)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo "☁️ Building with EAS..."
        echo "Please login to your Expo account:"
        eas login
        eas build -p android --profile preview
        ;;
    2)
        echo "🔨 Building locally..."
        npx expo prebuild -p android --clean
        cd android
        ./gradlew assembleRelease
        echo "✅ APK ready at: android/app/build/outputs/apk/release/app-release.apk"
        ;;
    3)
        echo "🔧 Building debug APK..."
        npx expo prebuild -p android --clean
        cd android
        ./gradlew assembleDebug
        cp app/build/outputs/apk/debug/app-debug.apk ../f1-scanner-debug.apk
        echo "✅ Debug APK ready: f1-scanner-debug.apk"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🏁 Build process complete!"