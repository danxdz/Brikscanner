# 📦 Deploy to CodeSandbox - Step by Step Guide

## Prerequisites
- A GitHub account (for Option 1)
- OR a CodeSandbox account (free)

## Method 1: Via GitHub (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - F1 Barcode Scanner"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/f1-barcode-scanner.git
git push -u origin main
```

### Step 2: Import to CodeSandbox
1. Visit https://codesandbox.io/dashboard
2. Click "Create Sandbox" or "New"
3. Select "Import from GitHub"
4. Enter your repository URL: `https://github.com/YOUR-USERNAME/f1-barcode-scanner`
5. CodeSandbox will automatically:
   - Detect the Expo project
   - Install dependencies
   - Start the development server

### Step 3: Access Your App
- Your app will be available at: `https://[sandbox-id].csb.app`
- Share the sandbox URL with others
- The app will auto-reload when you make changes

## Method 2: Direct Upload (No GitHub Required)

### Step 1: Prepare Files
1. Download this entire project folder
2. Make sure all files are included:
   - `App.js`
   - `package.json`
   - `app.json`
   - `sandbox.config.json`
   - `.gitignore`

### Step 2: Upload to CodeSandbox
1. Visit https://codesandbox.io
2. Click "Create Sandbox"
3. Choose "Upload Sandbox" or drag and drop your project folder
4. Wait for upload to complete

### Step 3: Configure (if needed)
- CodeSandbox should auto-detect the Expo configuration
- If not, manually select "Node" template
- The sandbox will install dependencies automatically

## Method 3: Fork Existing Sandbox

If someone has already deployed this project, you can:
1. Visit the sandbox URL
2. Click "Fork" button
3. Make your own edits

## 🎯 Quick Deploy URL

After pushing to GitHub, use this URL format:
```
https://codesandbox.io/s/github/[YOUR-USERNAME]/[REPO-NAME]
```

Example:
```
https://codesandbox.io/s/github/johndoe/f1-barcode-scanner
```

## ⚙️ Configuration Notes

### Environment Variables (if needed)
In CodeSandbox, go to:
- Server Control Panel → Secret Keys
- Add any required environment variables

### Port Configuration
- Default Expo web port: 19006
- CodeSandbox handles port forwarding automatically

### Performance Tips
- Enable "Hard Reload on Change" for faster development
- Use Chrome DevTools for debugging
- Clear browser cache if you encounter issues

## 🐛 Troubleshooting

### Camera Not Working?
1. Ensure HTTPS is enabled (CodeSandbox does this automatically)
2. Grant camera permissions when prompted
3. Try a different browser if issues persist

### Dependencies Not Installing?
1. Click "Server Control Panel"
2. Click "Restart Server"
3. Or manually run `npm install` in the terminal

### App Not Loading?
1. Check the console for errors
2. Verify all files are uploaded
3. Try refreshing the sandbox

## 📱 Testing on Mobile

1. Open the CodeSandbox preview URL on your mobile device
2. Grant camera permissions
3. The web version will work on mobile browsers

## 🔗 Useful Links

- [CodeSandbox Documentation](https://codesandbox.io/docs)
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [React Native Web](https://necolas.github.io/react-native-web/)

---

Ready to deploy! 🚀 Your F1 Barcode Scanner will be live in minutes!