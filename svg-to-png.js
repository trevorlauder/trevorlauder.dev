import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const images = [
  'src/assets/og.svg',
  'public/adjustable-bed-api.svg',
  'public/dbeaver-rds-iam.svg',
  'public/doh-avoidance.svg',
  'public/dotfiles.svg',
];

async function convertSvgToPng(svgPath) {
  const ext = path.extname(svgPath);
  if (ext.toLowerCase() !== '.svg') {
    console.warn(`Skipping non-SVG file: ${svgPath}`);
    return;
  }
  const pngPath = svgPath.replace(/\.svg$/i, '.png');
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    await sharp(svgBuffer)
      .png()
      .toFile(pngPath);
    console.log(`Converted: ${svgPath} -> ${pngPath}`);
  } catch (err) {
    console.error(`Error converting ${svgPath}:`, err.message);
  }
}

(async () => {
  for (const img of images) {
    await convertSvgToPng(img);
  }
})();
