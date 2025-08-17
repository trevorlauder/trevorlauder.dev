const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targets = [
  {
    inputDir: path.join(__dirname, '../assets/photos'),
    outputDir: path.join(__dirname, '../assets/photos/optimized'),
  },
  {
    inputDir: path.join(__dirname, '../assets/images/teasers'),
    outputDir: path.join(__dirname, '../assets/images/teasers/optimized'),
  },
];

const sizes = [200, 400, 800, 1200, 1920]; // px widths for responsive images
const exts = ['.jpg', '.jpeg', '.png', '.webp'];

targets.forEach(({ inputDir, outputDir }) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.readdirSync(inputDir).forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (!exts.includes(ext)) return;

    const base = path.basename(file, ext);
    const inputPath = path.join(inputDir, file);

    sizes.forEach(size => {
      const outputPath = path.join(outputDir, `${base}-${size}.webp`);

      let quality = 80;
      if (size <= 400) quality = 65;
      else if (size <= 800) quality = 75;

      sharp(inputPath)
        .resize(size)
        .webp({ quality, effort: 6 })
        .toFile(outputPath)
        .then(() => console.log(`Optimized: ${file} -> ${outputPath} (${size}px, q=${quality})`))
        .catch(err => console.error(`Error processing ${file} (${size}px):`, err));
    });
  });
});
