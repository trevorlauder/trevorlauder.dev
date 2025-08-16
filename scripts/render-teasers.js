#!/usr/bin/env node
/*
  Teaser Asset Pipeline
  ---------------------
  For every SVG in assets/images/teasers:
    * Generate responsive raster variants (PNG, WebP, AVIF) at configured widths.
    * Maintain original aspect ratio (default target reference 1200x630 ~ 1.904:1).
    * Generate square thumbnail variants (center cropped) in PNG+WebP+AVIF.
    * Skip work when outputs are newer than source (incremental builds).
    * Produce a JSON manifest (teasers-manifest.json) with srcset strings per format.

  Usage:
    npm run render:teasers          (current default widths)
    WIDTHS=320,640,960,1200 THUMBS=128 node scripts/render-teasers.js

  Environment Overrides:
    WIDTHS    Comma-separated list of widths (integers) e.g. 400,600,800,1200
    THUMBS    Thumbnail square dimension (single int). Default 300
    BACKGROUND Hex (e.g. #0b0d0f) or rgba() used when padding SVG into target box
    FULL_CONTENT If set (truthy) forces reprocess even if outputs are newer

  Output Naming:
    {name}-{w}.(png|webp|avif)
    thumbnails/{name}-thumb-(size).(png|webp|avif)

  Manifest (teasers-manifest.json):
    {
      "adjustable-bed-api": {
        "aspect": 0.525,
        "png": { "files": ["adjustable-bed-api-400.png", ...], "srcset": "adjustable-bed-api-400.png 400w, ..." },
        "webp": { ... },
        "avif": { ... },
        "thumbnail": { "size": 300, "files": ["thumbnails/adjustable-bed-api-thumb-300.webp", ...] }
      }
    }
*/
const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

const teaserDir = path.resolve(__dirname, '..', 'assets', 'images', 'teasers');
const thumbDir = path.join(teaserDir, 'thumbnails');

const DEFAULT_WIDTHS = [400, 600, 800, 1200];
const widths = (process.env.WIDTHS ? process.env.WIDTHS.split(',') : DEFAULT_WIDTHS).map(w => parseInt(w, 10)).filter(Boolean).sort((a,b)=>a-b);
const thumbSize = parseInt(process.env.THUMBS || '300', 10);
const force = !!process.env.FULL_CONTENT;
const background = parseColor(process.env.BACKGROUND || '#0b0d0f');

function parseColor(input) {
  if (/^#?[0-9a-fA-F]{6}$/.test(input)) {
    const hex = input.replace('#', '');
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
      alpha: 1
    };
  }
  // fallback
  return { r: 11, g: 13, b: 15, alpha: 1 };
}

function isNewer(src, dest){
  if (!fs.existsSync(dest)) return true;
  const s = fs.statSync(src).mtimeMs;
  const d = fs.statSync(dest).mtimeMs;
  return s > d; // regenerate if source newer
}

async function ensureDir(dirPath){ await fs.promises.mkdir(dirPath,{recursive:true}); }

async function renderVariant(svgBuf, baseOut, width, format, aspect){
  const height = Math.round(width * aspect); // maintain aspect
  let pipeline = sharp(svgBuf).resize(width, height, { fit: 'contain', background });
  switch(format){
    case 'png': pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }); break;
    case 'webp': pipeline = pipeline.webp({ quality: 82 }); break;
    case 'avif': pipeline = pipeline.avif({ quality: 50 }); break; // AVIF efficient
  }
  await pipeline.toFile(baseOut + `-${width}.${format}`);
  return `${path.basename(baseOut)}-${width}.${format}`;
}

async function renderThumbnail(svgBuf, baseName, format){
  await ensureDir(thumbDir);
  const outFile = path.join(thumbDir, `${baseName}-thumb-${thumbSize}.${format}`);
  let pipeline = sharp(svgBuf)
    .resize(thumbSize, thumbSize, { fit: 'cover', position: 'attention' });
  switch(format){
    case 'png': pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true }); break;
    case 'webp': pipeline = pipeline.webp({ quality: 80 }); break;
    case 'avif': pipeline = pipeline.avif({ quality: 48 }); break;
  }
  await pipeline.toFile(outFile);
  return path.relative(teaserDir, outFile);
}

async function processSvg(svgPath, manifest){
  const baseName = path.basename(svgPath, '.svg');
  const baseOut = path.join(teaserDir, baseName);
  const svgBuf = fs.readFileSync(svgPath);

  // Reference aspect ratio from canonical 1200x630
  const aspect = 630/1200; // height/width

  const entry = { aspect, png: { files: [] }, webp: { files: [] }, avif: { files: [] }, thumbnail: { size: thumbSize, files: [] } };

  for(const format of ['png','webp','avif']){
    for(const w of widths){
      const outFile = `${baseOut}-${w}.${format}`;
      if(force || isNewer(svgPath, outFile)){
        try{
          await renderVariant(svgBuf, baseOut, w, format, aspect);
          console.log('✔', baseName, `${w}.${format}`);
        }catch(e){
          console.error('✖ failed', baseName, `${w}.${format}`, e.message);
        }
      } else {
        // optional log: skipped
      }
      entry[format].files.push(path.basename(outFile));
    }
    entry[format].srcset = entry[format].files
      .map(f => {
        const m = f.match(/-(\d+)\./);
        if (m && m[1]) {
          return `${f} ${m[1]}w`;
        } else {
          console.warn(`Warning: Could not extract width from filename "${f}"`);
          return null;
        }
      })
      .filter(Boolean)
      .join(', ');
  }

  for(const format of ['png','webp','avif']){
    const thumbRel = path.join('thumbnails', `${baseName}-thumb-${thumbSize}.${format}`);
    const thumbAbs = path.join(teaserDir, thumbRel);
    if(force || isNewer(svgPath, thumbAbs)){
      try {
        const rel = await renderThumbnail(svgBuf, baseName, format);
        console.log('✔', baseName, `thumb-${thumbSize}.${format}`);
        entry.thumbnail.files.push(rel);
      } catch(e){
        console.error('✖ failed', baseName, `thumb-${thumbSize}.${format}`, e.message);
      }
    } else {
      entry.thumbnail.files.push(thumbRel);
    }
  }

  manifest[baseName] = entry;
}

async function main(){
  const svgs = glob.sync(path.join(teaserDir, '*.svg'));
  if(!svgs.length){
    console.error('No SVG teasers found.');
    process.exit(1);
  }
  const manifest = {};
  for(const svg of svgs){
    await processSvg(svg, manifest);
  }
  const manifestPath = path.join(teaserDir, 'teasers-manifest.json');
  await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  // Also copy into _data for Liquid access
  try {
    const dataDir = path.resolve(__dirname, '..', '_data');
    await fs.promises.mkdir(dataDir, { recursive: true });
    const dataManifest = path.join(dataDir, 'teasers.json');
    await fs.promises.writeFile(dataManifest, JSON.stringify(manifest, null, 2));
    console.log('Data manifest written:', path.relative(process.cwd(), dataManifest));
  } catch (e) {
    console.warn('Could not write _data/teasers.json:', e.message);
  }
  console.log('\nManifest written:', path.relative(process.cwd(), manifestPath));
  console.log('\nExample usage (Liquid):');
  console.log('{% assign t = site.static_files | where: "path", "/assets/images/teasers/teasers-manifest.json" | first %}');
  console.log('Load and parse via plugin or pre-build step to inject srcset (GitHub Pages safe option: bake HTML manually).');
}

main().catch(e=>{ console.error(e); process.exit(1); });
