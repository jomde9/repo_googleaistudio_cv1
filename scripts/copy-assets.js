import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src/assets/images');
const destDir = path.join(__dirname, '../public/assets/images');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all files
if (fs.existsSync(srcDir)) {
  const files = fs.readdirSync(srcDir);
  let count = 0;
  files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const destFile = path.join(destDir, file);
    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, destFile);
      count++;
    }
  });
  console.log(`Successfully copied ${count} images from src/assets/images to public/assets/images`);
} else {
  console.warn(`Source directory ${srcDir} does not exist`);
}
