import sharp from "sharp";
import path from "path";
import fs from "fs";

const images: string[] = ["src/assets/og.svg"];

async function convertSvgToPng(svgPath: string): Promise<void> {
  const ext = path.extname(svgPath);
  if (ext.toLowerCase() !== ".svg") {
    console.warn(`Skipping non-SVG file: ${svgPath}`);
    return;
  }
  const pngPath = svgPath.replace(/\.svg$/i, ".png");
  try {
    const svgBuffer = fs.readFileSync(svgPath);
    await sharp(svgBuffer).png().toFile(pngPath);
    console.log(`Converted: ${svgPath} -> ${pngPath}`);
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    console.error(`Error converting ${svgPath}:`, error);
  }
}

(async (): Promise<void> => {
  for (const img of images) {
    await convertSvgToPng(img);
  }
})();
