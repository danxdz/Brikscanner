# 🌿 CodeSandbox Branch Selection Guide

## Quick Reference URLs

### For Main Branch:
```
https://codesandbox.io/s/github/[YOUR-USERNAME]/[YOUR-REPO]
```
or
```
https://codesandbox.io/s/github/[YOUR-USERNAME]/[YOUR-REPO]/tree/main
```

### For Your Current Branch (cursor/run-the-application-a395):
```
https://codesandbox.io/s/github/[YOUR-USERNAME]/[YOUR-REPO]/tree/cursor/run-the-application-a395
```

## 🔄 Switching Branches in Existing Sandbox

If you already have a sandbox open:
1. Click on the **Git** icon in the left sidebar
2. Click on the current branch name
3. Select a different branch from the dropdown
4. CodeSandbox will reload with the new branch

## 📝 URL Structure Breakdown

```
https://codesandbox.io/s/github/[USERNAME]/[REPO]/tree/[BRANCH]/[PATH]
```

- `[USERNAME]` - Your GitHub username
- `[REPO]` - Repository name
- `[BRANCH]` - Branch name (optional, defaults to main/master)
- `[PATH]` - Specific folder path (optional)

## 🎯 Examples

### Example 1: Main branch
```
https://codesandbox.io/s/github/johndoe/f1-barcode-scanner
```

### Example 2: Feature branch
```
https://codesandbox.io/s/github/johndoe/f1-barcode-scanner/tree/feature/new-scanner
```

### Example 3: Your current branch
```
https://codesandbox.io/s/github/johndoe/f1-barcode-scanner/tree/cursor/run-the-application-a395
```

### Example 4: Specific folder in a branch
```
https://codesandbox.io/s/github/johndoe/f1-barcode-scanner/tree/develop/src
```

## 🚀 Pro Tips

1. **Bookmark Branch-Specific URLs**: Save the CodeSandbox URLs for your frequently used branches

2. **Use GitHubBox**: Quick shortcut - just change `github.com` to `githubbox.com`:
   - GitHub: `https://github.com/user/repo/tree/branch`
   - GitHubBox: `https://githubbox.com/user/repo/tree/branch`

3. **Branch Naming**: Avoid special characters in branch names for better URL compatibility

4. **Auto-sync**: CodeSandbox can auto-sync with GitHub branches - enable this in sandbox settings

5. **Fork for Experiments**: Fork the sandbox to experiment without affecting the original branch

## 🔗 Quick Links for Your Branches

After pushing to GitHub, use these:

### Main Branch:
```
https://codesandbox.io/s/github/[YOUR-USERNAME]/[YOUR-REPO]/tree/main
```

### Current Working Branch:
```
https://codesandbox.io/s/github/[YOUR-USERNAME]/[YOUR-REPO]/tree/cursor/run-the-application-a395
```

## ⚡ Instant Deploy Commands

### Push current branch to GitHub:
```bash
git push origin cursor/run-the-application-a395
```

### Then open in CodeSandbox:
```bash
# On macOS/Linux
open "https://codesandbox.io/s/github/[YOUR-USERNAME]/[YOUR-REPO]/tree/cursor/run-the-application-a395"

# On Windows
start "https://codesandbox.io/s/github/[YOUR-USERNAME]/[YOUR-REPO]/tree/cursor/run-the-application-a395"
```

## 📌 Remember

- CodeSandbox caches branches for performance
- Use "Hard Reload" if changes don't appear immediately
- Private repos require GitHub integration in CodeSandbox settings

---

Ready to deploy any branch to CodeSandbox! 🎉