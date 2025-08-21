# 📱 How to Install F1 Scanner APK on Your Android Phone

## 🔧 Fix Installation Issues

### Common Problems & Solutions:

#### ❌ "App not installed" Error
This usually happens because:
1. **Unsigned APK** - Use the signed version
2. **Security settings** - Need to enable unknown sources
3. **Incompatible Android version** - Requires Android 6.0+

## ✅ Step-by-Step Installation Guide

### Step 1: Enable Installation from Unknown Sources

#### For Android 8.0 and above:
1. Go to **Settings** → **Apps & notifications**
2. Tap **Advanced** → **Special app access**
3. Tap **Install unknown apps**
4. Select your browser (Chrome, Firefox, etc.)
5. Toggle **Allow from this source** ON

#### For Android 7.0 and below:
1. Go to **Settings** → **Security**
2. Toggle **Unknown sources** ON
3. Tap OK on the warning message

### Step 2: Download the Correct APK

Download **f1-scanner-signed.apk** (not the debug version):
1. Go to: https://github.com/danxdz/Brikscanner/actions
2. Click the latest successful build (green ✓)
3. Scroll down to **Artifacts**
4. Download **f1-scanner-signed** (this is the signed version)

### Step 3: Install the APK

#### Method A: Direct Install
1. Open your phone's **Downloads** folder
2. Tap on **f1-scanner-signed.apk**
3. Tap **Install**
4. If prompted, tap **Install anyway**
5. Tap **Open** to launch the app

#### Method B: Using File Manager
1. Open any file manager app
2. Navigate to Downloads
3. Tap the APK file
4. Follow installation prompts

#### Method C: Using ADB (from computer)
```bash
# Connect phone with USB debugging enabled
adb install f1-scanner-signed.apk
```

## 🚨 Still Not Working?

### Try the Web Version Instead!
No installation needed - works on ANY device with a browser:

🌐 **https://danxdz.github.io/Brikscanner**

Or use these instant web apps:
- **Netlify**: https://f1-scanner.netlify.app
- **Vercel**: https://f1-scanner.vercel.app
- **CodeSandbox**: https://codesandbox.io/s/github/danxdz/Brikscanner

### Alternative Solutions:

#### 1. Clear Package Installer Cache
1. Settings → Apps → Show system apps
2. Find "Package Installer"
3. Clear cache and data
4. Try installing again

#### 2. Check Storage Space
- Ensure you have at least 100MB free space

#### 3. Uninstall Previous Versions
- If you had an older version, uninstall it first

#### 4. Use Split APK Installer (SAI)
1. Download SAI from Play Store
2. Use it to install the APK

#### 5. Try Different Browser
- Download APK using different browser
- Sometimes Chrome blocks APK downloads

## 📱 Minimum Requirements

- **Android Version**: 6.0 (API 23) or higher
- **Storage**: 50MB free space
- **Permissions**: Camera access (granted after install)

## 🌐 Web Version Features

The web version works on:
- ✅ Any Android phone
- ✅ iPhone/iPad
- ✅ Desktop computers
- ✅ Tablets

Just open in browser - no installation needed!

## 🆘 Need More Help?

1. Create an issue: https://github.com/danxdz/Brikscanner/issues
2. Try the web version (easiest!)
3. Download from releases: https://github.com/danxdz/Brikscanner/releases

---

💡 **Pro Tip**: The web version at https://danxdz.github.io/Brikscanner works instantly without any installation!