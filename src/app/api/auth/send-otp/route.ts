import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Find candidate by email
  const candidate = await prisma.candidate.findFirst({
    where: { email: email.toLowerCase().trim() },
    include: { role: true },
  });

  if (!candidate) {
    return NextResponse.json(
      { error: "No application found with this email address. Please check your email or apply first." },
      { status: 404 }
    );
  }

  // Generate 6-digit OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Delete any existing unused OTPs for this email
  await prisma.otpCode.deleteMany({
    where: { email: email.toLowerCase().trim(), verified: false },
  });

  // Create new OTP (expires in 5 minutes)
  await prisma.otpCode.create({
    data: {
      email: email.toLowerCase().trim(),
      code,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  // In production: send OTP via WhatsApp/SMS/email
  // For now: return it in the response for testing
  console.log(`[DEV] OTP for ${email}: ${code}`);

  return NextResponse.json({
    success: true,
    message: "OTP sent to your email/phone",
    candidateName: `${candidate.firstName} ${candidate.lastName}`,
    roleName: candidate.role.title,
    // DEV ONLY - remove in production
    otp: code,
  });
}
