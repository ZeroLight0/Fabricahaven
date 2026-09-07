import "dotenv/config";
import { PrismaClient, GarmentCategory, Gender, Occasion } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Keyed by filename (minus extension) so the later Cloudinary upload pass
// (scripts/upload-style-images.ts) can match files in /assets/styles to
// these rows programmatically. Update `imageUrl` values here once real
// Cloudinary links are available.
export const STYLE_TEMPLATES: Record<
  string,
  {
    name: string;
    garment: GarmentCategory;
    gender: Gender;
    occasions: Occasion[];
    imageUrl: string;
  }
> = {
  "A-line_dress": {
    name: "A-line Dress",
    garment: GarmentCategory.DRESS,
    gender: Gender.FEMALE,
    occasions: [Occasion.OFFICIAL, Occasion.PARTY],
    imageUrl: "PENDING_UPLOAD",
  },
  jumpsuit: {
    name: "Jumpsuit",
    garment: GarmentCategory.JUMPSUIT,
    gender: Gender.FEMALE,
    occasions: [Occasion.CASUAL, Occasion.PARTY],
    imageUrl: "PENDING_UPLOAD",
  },
  evening_gown: {
    name: "Evening Gown",
    garment: GarmentCategory.GOWN,
    gender: Gender.FEMALE,
    occasions: [Occasion.WEDDING, Occasion.PARTY],
    imageUrl: "PENDING_UPLOAD",
  },
  blouse_and_skirt: {
    name: "Blouse and Skirt",
    garment: GarmentCategory.SET,
    gender: Gender.FEMALE,
    occasions: [Occasion.OFFICIAL, Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  native_set: {
    name: "Native Set",
    garment: GarmentCategory.SET,
    gender: Gender.FEMALE,
    occasions: [Occasion.TRADITIONAL, Occasion.WEDDING],
    imageUrl: "PENDING_UPLOAD",
  },
  long_sleeve_shirt: {
    name: "Long Sleeve Shirt",
    garment: GarmentCategory.TOP,
    gender: Gender.MALE,
    occasions: [Occasion.CASUAL, Occasion.OFFICIAL],
    imageUrl: "PENDING_UPLOAD",
  },
  kaftan: {
    name: "Kaftan",
    garment: GarmentCategory.KAFTAN,
    gender: Gender.FEMALE,
    occasions: [Occasion.TRADITIONAL, Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  agbada: {
    name: "Agbada",
    garment: GarmentCategory.AGBADA,
    gender: Gender.MALE,
    occasions: [Occasion.TRADITIONAL, Occasion.WEDDING],
    imageUrl: "PENDING_UPLOAD",
  },
  "two-piece_suit": {
    name: "Two-Piece Suit",
    garment: GarmentCategory.SUIT,
    gender: Gender.MALE,
    occasions: [Occasion.OFFICIAL, Occasion.WEDDING],
    imageUrl: "PENDING_UPLOAD",
  },
  ball_gown: {
    name: "Ball Gown",
    garment: GarmentCategory.GOWN,
    gender: Gender.FEMALE,
    occasions: [Occasion.WEDDING, Occasion.PARTY],
    imageUrl: "PENDING_UPLOAD",
  },
  cargo_pants: {
    name: "Cargo Pants",
    garment: GarmentCategory.TROUSERS,
    gender: Gender.MALE,
    occasions: [Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  wide_leg_jeans: {
    name: "Wide Leg Jeans",
    garment: GarmentCategory.TROUSERS,
    gender: Gender.FEMALE,
    occasions: [Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  wide_leg_trousers: {
    name: "Wide Leg Trousers",
    garment: GarmentCategory.TROUSERS,
    gender: Gender.FEMALE,
    occasions: [Occasion.OFFICIAL, Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  polo_top_male: {
    name: "Polo Top (Men)",
    garment: GarmentCategory.TOP,
    gender: Gender.MALE,
    occasions: [Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  polo_top_female: {
    name: "Polo Top (Women)",
    garment: GarmentCategory.TOP,
    gender: Gender.FEMALE,
    occasions: [Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  jorts: {
    name: "Jorts",
    garment: GarmentCategory.SHORTS,
    gender: Gender.MALE,
    occasions: [Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  "off-shoulder_gown": {
    name: "Off-Shoulder Gown",
    garment: GarmentCategory.GOWN,
    gender: Gender.FEMALE,
    occasions: [Occasion.PARTY, Occasion.WEDDING],
    imageUrl: "PENDING_UPLOAD",
  },
  "off-shoulder_jumpsuit": {
    name: "Off-Shoulder Jumpsuit",
    garment: GarmentCategory.JUMPSUIT,
    gender: Gender.FEMALE,
    occasions: [Occasion.PARTY, Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  wrap_dress: {
    name: "Wrap Dress",
    garment: GarmentCategory.DRESS,
    gender: Gender.FEMALE,
    occasions: [Occasion.OFFICIAL, Occasion.CASUAL],
    imageUrl: "PENDING_UPLOAD",
  },
  peplum_top: {
    name: "Peplum Top",
    garment: GarmentCategory.TOP,
    gender: Gender.FEMALE,
    occasions: [Occasion.OFFICIAL, Occasion.PARTY],
    imageUrl: "PENDING_UPLOAD",
  },
  senator_wear: {
    name: "Senator Wear (Two-Piece)",
    garment: GarmentCategory.SET,
    gender: Gender.MALE,
    occasions: [Occasion.TRADITIONAL, Occasion.OFFICIAL],
    imageUrl: "PENDING_UPLOAD",
  },
};

async function main() {
  for (const [filenameKey, template] of Object.entries(STYLE_TEMPLATES)) {
    await prisma.styleTemplate.upsert({
      where: { id: filenameKey },
      update: {
        name: template.name,
        garment: template.garment,
        gender: template.gender,
        occasions: template.occasions,
      },
      create: {
        id: filenameKey,
        name: template.name,
        garment: template.garment,
        gender: template.gender,
        occasions: template.occasions,
        imageUrl: template.imageUrl,
      },
    });
  }
  console.log(`Seeded ${Object.keys(STYLE_TEMPLATES).length} style templates.`);
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
