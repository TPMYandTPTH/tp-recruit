import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json(
      { error: "Email is required" },
      { status: 400 }
    );
  }

  const candidate = await prisma.candidate.findFirst({
    where: { email: email.toLowerCase().trim() },
    select: { portalToken: true, firstName: true, stage: true },
    orderBy: { createdAt: "desc" },
  });

  if (!candidate) {
    return NextResponse.json(
      { error: "No application found with this email" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    found: true,
    portalToken: candidate.portalToken,
    firstName: candidate.firstName,
    stage: candidate.stage,
  });
}
