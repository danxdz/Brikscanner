const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');
const indexPath = path.join(distPath, 'index.html');

// Read the index.html file
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths for GitHub Pages
// This ensures assets load correctly from /Brikscanner subdirectory
html = html.replace(/href="\//g, 'href="./');
html = html.replace(/src="\//g, 'src="./');
html = html.replace(/url\(\//g, 'url(./');

// Write the modified HTML back
fs.writeFileSync(indexPath, html);

console.log('Fixed asset paths for GitHub Pages deployment');

// Also check if there are any JS files that need path fixes
const jsDir = path.join(distPath, '_expo', 'static', 'js', 'web');
if (fs.existsSync(jsDir)) {
  const files = fs.readdirSync(jsDir);
  files.forEach(file => {
    if (file.endsWith('.js')) {
      const filePath = path.join(jsDir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      // Fix any hardcoded paths in JS files
      content = content.replace(/["']\/\_expo/g, '"./_expo');
      content = content.replace(/["']\/assets/g, '"./assets');
      fs.writeFileSync(filePath, content);
    }
  });
  console.log('Fixed JS file paths');
}