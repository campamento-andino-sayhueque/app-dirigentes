import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import pngToIco from "png-to-ico";

const input = path.join(path.resolve(), "public", "logo.svg");
const out192 = path.join(path.resolve(), "public", "logo-192.png");
const out512 = path.join(path.resolve(), "public", "logo-512.png");

(async () => {
  try {
    await sharp(input)
      .resize(192, 192, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(out192);

    await sharp(input)
      .resize(512, 512, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toFile(out512);

    // Generate favicon.ico from the 512 PNG
    const pngBuffer = await fs.readFile(out512);
    const icoBuffer = await pngToIco(pngBuffer);
    const outIco = path.join(path.resolve(), "public", "favicon.ico");
    await fs.writeFile(outIco, icoBuffer);

    console.log("Generated:", out192, out512, outIco);
  } catch (err) {
    console.error("Failed to generate icons:", err?.message || err);
    process.exit(1);
  }
})();
