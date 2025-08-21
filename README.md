# 🏎️ F1 Barcode Scanner

A React Native app built with Expo that scans barcodes and identifies F1 car models.

## 🌐 Try It NOW - Works on ALL Devices!

### 🚀 Instant Web App (No Install Required!)

[![Open Web App](https://img.shields.io/badge/🌐%20Open%20Web%20App-Live%20Now!-success?style=for-the-badge)](https://danxdz.github.io/Brikscanner)

[![Deploy to Netlify](https://img.shields.io/badge/Deploy%20to-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://app.netlify.com/start/deploy?repository=https://github.com/danxdz/Brikscanner)

[![Deploy to Vercel](https://img.shields.io/badge/Deploy%20to-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https://github.com/danxdz/Brikscanner)

[![Open in CodeSandbox](https://img.shields.io/badge/Open%20in-CodeSandbox-040404?style=for-the-badge&logo=codesandbox&logoColor=DBDBDB)](https://codesandbox.io/s/github/danxdz/Brikscanner)

### ☁️ Build Native Apps

[![Build with Expo EAS](https://img.shields.io/badge/Build%20with-Expo%20EAS-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/accounts/danxdz/projects/f1-barcode-scanner/builds)

[![Deploy to Codemagic](https://img.shields.io/badge/Deploy%20to-Codemagic-F7DF1E?style=for-the-badge&logo=codemagic&logoColor=black)](https://codemagic.io/apps/new?repo=https://github.com/danxdz/Brikscanner)

[![Open in Gitpod](https://img.shields.io/badge/Open%20in-Gitpod-1966D2?style=for-the-badge&logo=gitpod&logoColor=white)](https://gitpod.io/#https://github.com/danxdz/Brikscanner)

### 📱 Direct APK Download

[![Download APK](https://img.shields.io/badge/Download-APK-green?style=for-the-badge&logo=android&logoColor=white)](https://github.com/danxdz/Brikscanner/releases/latest)

[![GitHub Actions](https://img.shields.io/github/actions/workflow/status/danxdz/Brikscanner/build-apk.yml?style=for-the-badge&label=Build%20Status)](https://github.com/danxdz/Brikscanner/actions)

## 📋 Features

- 📷 **Camera barcode scanning** with real-time detection
- 🏎️ **F1 model detection** - Recognizes all F1 team codes
- 🔍 **Zoom controls** - Pinch or button controls
- 💡 **Flashlight toggle** - Scan in any lighting
- ✨ **Dual code recognition** - Each model has 2 unique codes

## 🏁 Supported F1 Teams

| Team | Code 1 | Code 2 |
|------|--------|--------|
| 🔴 Ferrari | 6536841 | 6538305 |
| 🔵 RB20 | 6536842 | 6538306 |
| ⚪ Mercedes-AMG | 6536843 | 6538307 |
| 🟢 Aston Martin | 6536844 | 6538308 |
| 🔵 VCARB | 6536845 | 6538309 |
| ⚫ Sauber | 6536846 | 6538310 |
| 🔵 Alpine | 6536847 | 6538311 |
| 🔵 Williams | 6536848 | 6538312 |
| ⚪ Haas | 6536849 | 6538313 |
| 🟠 McLaren | 6536850 | 6538314 |
| 🏁 F1 | 6536851 | 6538315 |
| 🎓 F1 ACADEMY | 6536852 | 6538316 |

## 🔨 Build Your Own APK

### Method 1: Expo EAS (Recommended - Free)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo (create free account at expo.dev)
eas login

# Build APK
eas build -p android --profile preview
```

### Method 2: Codemagic (Free 500 min/month)
1. Click [![Deploy to Codemagic](https://img.shields.io/badge/Deploy-Codemagic-yellow)](https://codemagic.io/apps/new?repo=https://github.com/danxdz/Brikscanner)
2. Sign in with GitHub
3. Select this repository
4. Start build
5. Download APK when ready

### Method 3: Local Build with Docker
```bash
# Clone repository
git clone https://github.com/danxdz/Brikscanner.git
cd Brikscanner

# Build with Docker
./docker-build.sh

# APK will be saved as: f1-scanner.apk
```

### Method 4: Manual Local Build
```bash
# Prerequisites: Node.js 18+ and Java 17

# Clone and install
git clone https://github.com/danxdz/Brikscanner.git
cd Brikscanner
npm install

# Generate Android project
npx expo prebuild -p android

# Build APK
cd android
./gradlew assembleDebug

# Find APK at: android/app/build/outputs/apk/debug/app-debug.apk
```

## 💻 Development

### Run in Development Mode
```bash
# Install dependencies
npm install

# Start Expo
npx expo start

# Scan QR code with Expo Go app on your phone
```

### Web Development
```bash
# Run on web
npx expo start --web
```

## 🐳 Docker Support

Build APK using Docker (no Android SDK required):
```bash
docker build -t f1-scanner .
docker run -v $(pwd):/output f1-scanner
```

## 📱 Installation

### From Release
1. Go to [Releases](https://github.com/danxdz/Brikscanner/releases)
2. Download the latest APK
3. Enable "Install from Unknown Sources" on your Android device
4. Install the APK

### Using ADB
```bash
adb install f1-scanner.apk
```

## 🛠️ Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo SDK 51** - Development platform
- **expo-camera** - Camera and barcode scanning
- **JavaScript** - Programming language

## 📄 License

MIT License - Feel free to use this project for any purpose!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests

## 📞 Support

- 📧 Create an [Issue](https://github.com/danxdz/Brikscanner/issues)
- ⭐ Star this repo if you find it useful!

---

Built with ❤️ for F1 enthusiasts! 🏁