const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', 'public', 'images');
const exts = new Set(['.jpg', '.jpeg', '.png']);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (exts.has(path.extname(entry.name).toLowerCase())) acc.push(full);
  }
  return acc;
}

function maxWidthFor(file) {
  const normalized = file.replace(/\\/g, '/');
  if (normalized.includes('/images/og/')) return 1200;
  if (normalized.includes('/images/avatar/')) return 720;
  if (normalized.includes('/images/knowledge/')) return 1400;
  if (normalized.includes('/images/projects/')) return 1600;
  return 1400;
}

(async () => {
  const files = walk(root);
  let totalBefore = 0;
  let totalAfter = 0;
  let changed = 0;

  for (const file of files) {
    const before = fs.statSync(file).size;
    totalBefore += before;

    const ext = path.extname(file).toLowerCase();
    const image = sharp(file, { failOn: 'none' }).rotate();
    const meta = await image.metadata();
    const resize = meta.width && meta.width > maxWidthFor(file)
      ? { width: maxWidthFor(file), withoutEnlargement: true }
      : null;

    let pipeline = image;
    if (resize) pipeline = pipeline.resize(resize);
    if (ext === '.png') pipeline = pipeline.png({ compressionLevel: 9, palette: true });
    else pipeline = pipeline.jpeg({ quality: 78, progressive: true, mozjpeg: true });

    const buffer = await pipeline.toBuffer();
    if (buffer.length < before) {
      const temp = `${file}.tmp`;
      fs.writeFileSync(temp, buffer);
      fs.renameSync(temp, file);
      changed += 1;
    }

    const after = fs.statSync(file).size;
    totalAfter += after;
    console.log(`${path.relative(root, file)} ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`);
  }

  const saved = totalBefore - totalAfter;
  console.log(`optimized ${changed}/${files.length} images, saved ${Math.round(saved / 1024)}KB`);
})();
