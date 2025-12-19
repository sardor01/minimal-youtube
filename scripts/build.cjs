/* eslint-disable node/prefer-global/process */
const fs = require('node:fs');
const path = require('node:path');

// Always resolve paths relative to the project root (where package.json is)
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Safety check: ensure we're in the right project
if (!fs.existsSync(path.join(ROOT, 'manifest.json'))) {
  console.error('Error: manifest.json not found. Are you in the right directory?');
  process.exit(1);
}

// Safety check: ensure dist is inside the project
if (!DIST.startsWith(ROOT)) {
  console.error('Error: dist path is outside project root');
  process.exit(1);
}

// Clean dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}

// Create directories
fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

// Copy files
const copies = [
  ['assets/16x16.png', 'assets/16x16.png'],
  ['assets/48x48.png', 'assets/48x48.png'],
  ['assets/128x128.png', 'assets/128x128.png'],
  ['assets/logo.png', 'assets/logo.png'],
  ['src/content/content.js', 'content.js'],
  ['src/styles/styles.css', 'styles.css'],
  ['src/popup/popup.html', 'popup.html'],
  ['src/popup/popup.css', 'popup.css'],
  ['src/popup/popup.js', 'popup.js'],
  ['src/background/background.js', 'background.js'],
  ['LICENSE', 'LICENSE'],
  ['README.md', 'README.md'],
];

for (const [src, dest] of copies) {
  const srcPath = path.join(ROOT, src);
  const destPath = path.join(DIST, dest);
  if (fs.existsSync(srcPath)) {
    // Remove TypeScript reference directive from content.js
    if (dest === 'content.js') {
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace(/^\/\/\/ <reference types="chrome" \/>\n{0,2}/, '');
      fs.writeFileSync(destPath, content);
    } else if (dest === 'popup.html') {
      // Fix asset path for flat dist structure
      let content = fs.readFileSync(srcPath, 'utf8');
      content = content.replace('../../assets/', 'assets/');
      fs.writeFileSync(destPath, content);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Copy and modify manifest
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, 'manifest.json'), 'utf8'));
manifest.content_scripts[0].css = ['styles.css'];
manifest.content_scripts[0].js = ['content.js'];
manifest.action.default_popup = 'popup.html';
manifest.background.service_worker = 'background.js';
fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 4));

console.log('Build complete: dist/');
