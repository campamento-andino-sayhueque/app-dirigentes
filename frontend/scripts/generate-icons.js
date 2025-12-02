import sharp from "sharp";
import path from "path";

const input = path.join(__dirname, "..", "public", "logo.svg");
const out192 = path.join(__dirname, "..", "public", "logo-192.png");
const out512 = path.join(__dirname, "..", "public", "logo-512.png");

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

    console.log("Generated:", out192, out512);
  } catch (err) {
    console.error("Failed to generate icons:", err?.message || err);
    process.exit(1);
  }
})();
