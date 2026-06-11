import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Target images
const srcLogo = path.resolve('src/assets/images/serenity_forest_elegant_logo_1781092348423.png');
const targets = [
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'favicon.png',
  'favicon.ico'
];

if (fs.existsSync(srcLogo)) {
  for (const target of targets) {
    const dest = path.join(publicDir, target);
    fs.copyFileSync(srcLogo, dest);
    console.log(`[PWA Asset Builder] Compiled ${target} successfully.`);
  }
} else {
  console.warn('[PWA Asset Builder] Warning: brand logo source not found at:', srcLogo);
}
