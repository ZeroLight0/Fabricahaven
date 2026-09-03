import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tailors = await prisma.tailor.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ tailors });
}
