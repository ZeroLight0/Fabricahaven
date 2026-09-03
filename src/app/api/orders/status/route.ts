import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const submissionId = req.nextUrl.searchParams.get("submissionId");
  if (!submissionId) {
    return NextResponse.json({ error: "submissionId is required" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { submissionId } });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ status: order.status });
}
