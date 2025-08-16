#!/usr/bin/env node
/*
  OG Image Rasterizer
  -------------------
  Converts assets/images/og.svg into PNG and WebP (1200x630) for social sharing.

  Usage:
    npm run render:og            # standard 1200x630 outputs
    WIDTH=1200x630 npm run render:og  # custom WxH (e.g. 1600x900)

  Environment Variables:
    WIDTH   Single WxH (e.g. 1200x630). Defaults to 1200x630
    QUALITY_WEBP  WebP quality (default 85)
    FORCE   If set (truthy), re-render even if outputs look newer
*/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const svgPath = path.join(root, 'assets', 'images', 'og.svg');
const outDir = path.join(root, 'assets', 'images');

if(!fs.existsSync(svgPath)){
  console.error('Missing og.svg at', path.relative(process.cwd(), svgPath));
  process.exit(1);
}

const dimStr = process.env.WIDTH || '1200x630';
const m = dimStr.match(/^(\d+)x(\d+)$/);
if(!m){
  console.error('Invalid WIDTH format. Use WIDTH=1200x630');
  process.exit(1);
}
const W = parseInt(m[1], 10);
const H = parseInt(m[2], 10);
const force = !!process.env.FORCE;
const qualityWebp = parseInt(process.env.QUALITY_WEBP || '85', 10);

function isNewer(src, dest){
  if (!fs.existsSync(dest)) return true;
  return fs.statSync(src).mtimeMs > fs.statSync(dest).mtimeMs;
}

async function main(){
  const svgBuf = fs.readFileSync(svgPath);
  const pngOut = path.join(outDir, 'og.png');
  const webpOut = path.join(outDir, 'og.webp');

  if(force || isNewer(svgPath, pngOut)){
    await sharp(svgBuf)
      .resize(W, H, { fit: 'cover' })
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(pngOut);
    console.log('✔ Wrote', path.relative(process.cwd(), pngOut));
  } else {
    console.log('↷ Skipped (up-to-date)', path.relative(process.cwd(), pngOut));
  }

  if(force || isNewer(svgPath, webpOut)){
    await sharp(svgBuf)
      .resize(W, H, { fit: 'cover' })
      .webp({ quality: qualityWebp })
      .toFile(webpOut);
    console.log('✔ Wrote', path.relative(process.cwd(), webpOut));
  } else {
    console.log('↷ Skipped (up-to-date)', path.relative(process.cwd(), webpOut));
  }

  console.log('\nDone. Ensure _config.yml og_image points to /assets/images/og.webp');
}

main().catch(e=>{ console.error(e); process.exit(1); });
