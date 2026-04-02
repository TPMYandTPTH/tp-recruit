import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json();

  if (!email || !otp) {
    return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Find the latest OTP for this email
  const otpRecord = await prisma.otpCode.findFirst({
    where: {
      email: normalizedEmail,
      verified: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    return NextResponse.json(
      { error: "No OTP found. Please request a new one." },
      { status: 404 }
    );
  }

  // Check expiry
  if (new Date() > otpRecord.expiresAt) {
    return NextResponse.json(
      { error: "OTP has expired. Please request a new one." },
      { status: 400 }
    );
  }

  // Check attempts
  if (otpRecord.attempts >= 3) {
    return NextResponse.json(
      { error: "Too many failed attempts. Please request a new OTP." },
      { status: 429 }
    );
  }

  // Verify OTP
  if (otpRecord.code !== otp) {
    // Increment attempts
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { attempts: otpRecord.attempts + 1 },
    });

    return NextResponse.json(
      { error: `Invalid OTP. ${2 - otpRecord.attempts} attempts remaining.` },
      { status: 400 }
    );
  }

  // OTP is valid — mark as verified
  await prisma.otpCode.update({
    where: { id: otpRecord.id },
    data: { verified: true },
  });

  // Find the candidate
  const candidate = await prisma.candidate.findFirst({
    where: { email: normalizedEmail },
    include: { role: true },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  // Log the login
  await prisma.auditLog.create({
    data: {
      entityType: "Candidate",
      entityId: candidate.id,
      action: "CANDIDATE_LOGIN",
      details: JSON.stringify({ method: "OTP", email: normalizedEmail }),
      performedBy: normalizedEmail,
    },
  });

  return NextResponse.json({
    success: true,
    portalToken: candidate.portalToken,
    candidateName: `${candidate.firstName} ${candidate.lastName}`,
    roleName: candidate.role.title,
    stage: candidate.stage,
  });
}
