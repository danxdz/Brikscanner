# 🏎️ F1 Barcode Scanner

A React Native app built with Expo that scans barcodes and identifies F1 car models.

## 🚀 Deploy to CodeSandbox

### Option 1: Import from GitHub
1. Push this repository to GitHub
2. Go to [CodeSandbox](https://codesandbox.io)
3. Click "Create Sandbox" → "Import from GitHub"
4. Paste your repository URL
5. CodeSandbox will automatically detect it as an Expo project

### Option 2: Manual Upload
1. Go to [CodeSandbox](https://codesandbox.io)
2. Click "Create Sandbox" → "Upload Project"
3. Upload this entire project folder
4. Select "Node" as the template if prompted

### Option 3: Direct Link (After GitHub Push)
Use this URL format: `https://codesandbox.io/s/github/[YOUR-USERNAME]/[REPO-NAME]`

## 📝 Important CodeSandbox Notes

- **Camera Access**: The camera functionality requires HTTPS. CodeSandbox provides HTTPS by default.
- **Browser Support**: Works best in Chrome, Firefox, or Edge. Safari may have limited camera support.
- **Permissions**: Users will need to grant camera permissions when prompted by the browser.
- **Web Limitations**: Some Expo features may work differently in web vs native. The app is optimized for web deployment on CodeSandbox.

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
