import "dotenv/config";
import { readdirSync } from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { STYLE_TEMPLATES } from "../prisma/seed-styles";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ASSETS_DIR = path.join(__dirname, "..", "assets", "styles");
const CLOUDINARY_FOLDER = "fabrica/styles";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Filenames on disk may use spaces instead of underscores (e.g. "A-line
// dress.jpg"); normalize to match the STYLE_TEMPLATES keys in seed-styles.ts,
// which are also the StyleTemplate row ids.
function keyForFile(filename: string): string {
  return path.parse(filename).name.replace(/\s+/g, "_");
}

async function main() {
  const files = readdirSync(ASSETS_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  const matched: string[] = [];
  const unmatched: string[] = [];

  for (const file of files) {
    const key = keyForFile(file);
    const template = STYLE_TEMPLATES[key];

    if (!template) {
      unmatched.push(file);
      continue;
    }

    const filePath = path.join(ASSETS_DIR, file);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: CLOUDINARY_FOLDER,
      public_id: key,
      overwrite: true,
    });

    await prisma.styleTemplate.update({
      where: { id: key },
      data: { imageUrl: result.secure_url },
    });

    matched.push(`${file} -> ${key} (${result.secure_url})`);
    console.log(`Uploaded ${file} -> ${template.name}: ${result.secure_url}`);
  }

  const missingKeys = Object.keys(STYLE_TEMPLATES).filter(
    (key) => !files.some((f) => keyForFile(f) === key)
  );

  console.log(`\nUpdated ${matched.length} style templates.`);
  if (unmatched.length > 0) {
    console.log(`\nFiles with no matching style template (not uploaded/linked):`);
    unmatched.forEach((f) => console.log(`  - ${f}`));
  }
  if (missingKeys.length > 0) {
    console.log(`\nStyle templates still missing an image:`);
    missingKeys.forEach((k) => console.log(`  - ${k} (${STYLE_TEMPLATES[k].name})`));
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
