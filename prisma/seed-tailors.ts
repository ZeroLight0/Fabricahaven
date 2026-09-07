import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Placeholder demo data. Real tailor profiles to be supplied by the client
// later — edit this single array to update.
export const TAILORS: Array<{
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  specialtyTags: string;
  location: string;
}> = [
  {
    id: "tailor-adaeze",
    name: "Adaeze Okafor",
    email: "adaeze.tailor@example.com",
    photoUrl: "/tailors/adaeze-okafor.jpg",
    specialtyTags: "native wear, aso-oke, bridal",
    location: "Lekki, Lagos",
  },
  {
    id: "tailor-chidinma",
    name: "Chidinma Eze",
    email: "chidinma.tailor@example.com",
    photoUrl: "/tailors/chidinma-eze.jpg",
    specialtyTags: "corporate wear, suits, structured tailoring",
    location: "Ikeja, Lagos",
  },
  {
    id: "tailor-babatunde",
    name: "Babatunde Adewale",
    email: "babatunde.tailor@example.com",
    photoUrl: "/tailors/babatunde-adewale.jpg",
    specialtyTags: "agbada, senator wear, kaftan",
    location: "Surulere, Lagos",
  },
  {
    id: "tailor-funmilayo",
    name: "Funmilayo Bello",
    email: "funmilayo.tailor@example.com",
    photoUrl: "/tailors/funmilayo-bello.jpg",
    specialtyTags: "evening gowns, party wear, jumpsuits",
    location: "Yaba, Lagos",
  },
];

async function main() {
  for (const tailor of TAILORS) {
    await prisma.tailor.upsert({
      where: { id: tailor.id },
      update: tailor,
      create: tailor,
    });
  }
  console.log(`Seeded ${TAILORS.length} tailors.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
