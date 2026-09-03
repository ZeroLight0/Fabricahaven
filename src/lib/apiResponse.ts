import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function zodErrorResponse(error: ZodError) {
  return NextResponse.json(
    { error: "Invalid input", fieldErrors: error.flatten().fieldErrors },
    { status: 400 }
  );
}
