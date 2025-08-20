# 🏎️ F1 Barcode Scanner

A React Native app built with Expo that scans barcodes and identifies F1 car models.

## Features

- 📱 **Barcode/QR Code scanning** with camera
- 🏎️ **F1 Model Detection** - Recognizes all F1 team codes
- 🔍 **Zoom Controls** - Zoom in/out for better scanning
- 💡 **Flashlight Toggle** - Scan in dark environments
- ✨ **Smart Recognition** - Shows which code you scanned and the matching pair

## Supported F1 Teams

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

## Installation

### Development
```bash
npm install
expo start
```

### Build APK
```bash
eas build -p android --profile preview
```

## Usage

1. Point camera at barcode/QR code
2. App automatically scans and identifies F1 models
3. Use zoom and flashlight controls as needed
4. Tap "Scan Again" to scan another code

## Permissions

- **Camera**: Required for barcode scanning

## Tech Stack

- React Native
- Expo
- Expo Camera
- JavaScript

---

Built for F1 enthusiasts! 🏁
