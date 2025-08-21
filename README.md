# 🏎️ F1 Barcode Scanner

A React Native app built with Expo that scans barcodes and identifies F1 car models.

## 📱 Quick Start

### Install Dependencies
```bash
npm install
```

### Run the App
```bash
# Start Expo
npx expo start

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios

# Run on Web
npx expo start --web
```

## 🔨 Build APK

### Method 1: EAS Build (Cloud)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build APK
eas build -p android --profile preview
```

### Method 2: Local Build
```bash
# Generate Android folder
npx expo prebuild -p android

# Build APK
cd android
./gradlew assembleRelease

# APK location: android/app/build/outputs/apk/release/app-release.apk
```

## 🏁 Supported F1 Teams

- Ferrari
- RB20
- Mercedes-AMG
- Aston Martin
- VCARB
- Sauber
- Alpine
- Williams
- Haas
- McLaren
- F1
- F1 ACADEMY

## 📋 Features

- 📷 Camera barcode scanning
- 🏎️ F1 model detection
- 🔍 Zoom controls
- 💡 Flashlight toggle
- ✨ Dual code recognition