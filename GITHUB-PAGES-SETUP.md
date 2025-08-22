# GitHub Pages Deployment Guide

## How GitHub Pages Works for This Project

This Expo web app is configured to deploy automatically to GitHub Pages whenever you push to the `main` branch.

### 🚀 Automatic Deployment (Recommended)

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to Settings → Pages
   - Under "Source", select "GitHub Actions"

2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. **The workflow will automatically:**
   - Install dependencies
   - Build the Expo web app
   - Deploy to GitHub Pages
   - Your app will be available at: `https://[your-username].github.io/Brikscanner/`

### 🛠️ Manual Deployment (Alternative)

If you prefer to deploy manually from your local machine:

```bash
# Install dependencies (if not already installed)
npm install --legacy-peer-deps

# Deploy to GitHub Pages
npm run deploy:gh-pages
```

### 📁 Project Structure for GitHub Pages

- **GitHub Actions Workflow:** `.github/workflows/deploy-web.yml`
  - Automatically builds and deploys on push to main
  - Uses Node.js 18 and npm caching for faster builds

- **Metro Configuration:** `metro.config.js`
  - Handles the base path `/Brikscanner` for GitHub Pages
  - Ensures assets load correctly from the subdirectory

- **Build Scripts in package.json:**
  - `build:gh-pages` - Builds with GitHub Pages base URL
  - `deploy:gh-pages` - Manual deployment using gh-pages package

### 🔧 Key Differences from Netlify

| Feature | GitHub Pages | Netlify |
|---------|--------------|---------|
| Base URL | `/Brikscanner` (subdirectory) | `/` (root) |
| Deployment | Via GitHub Actions or gh-pages CLI | Direct from repository |
| Build Environment | GitHub Actions runner | Netlify build servers |
| Custom Domain | Supported (CNAME file) | Supported |
| HTTPS | Automatic | Automatic |
| SPA Routing | Requires 404.html trick | Native support with _redirects |

### 🐛 Troubleshooting

1. **404 errors on refresh:**
   - GitHub Pages doesn't natively support SPA routing
   - The workflow adds a `.nojekyll` file to prevent Jekyll processing
   - For better SPA support, consider using HashRouter in your React app

2. **Assets not loading:**
   - Check that PUBLIC_URL is set correctly in the workflow
   - Verify the repository name matches in the scripts

3. **Build failures:**
   - Check the Actions tab in your GitHub repository
   - Review the workflow logs for specific errors
   - Ensure all dependencies are in package.json

### 📝 Notes

- The app uses camera features which require HTTPS (provided by GitHub Pages)
- GitHub Pages has a soft limit of 100GB bandwidth/month
- The site may take a few minutes to update after deployment
- GitHub Pages runs from the `gh-pages` branch (created automatically)

### 🔗 Useful Links

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- Your deployed app: `https://[your-username].github.io/Brikscanner/`