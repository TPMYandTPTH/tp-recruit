import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureStaffTables } from "@/lib/ensure-staff-tables";

export async function POST(request: NextRequest) {
  const { email, otp } = await request.json();
  if (!email || !otp) return NextResponse.json({ error: "Email and OTP required" }, { status: 400 });

  await ensureStaffTables();
  const normalizedEmail = email.toLowerCase().trim();

  // Use raw SQL since StaffOtp model may not be in generated Prisma client yet
  const otpRows: any[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM StaffOtp WHERE email = ? AND verified = 0 ORDER BY createdAt DESC LIMIT 1`,
    normalizedEmail
  );

  if (!otpRows.length) {
    return NextResponse.json({ error: "No OTP found. Please request a new one." }, { status: 404 });
  }

  const otpRecord = otpRows[0];

  if (new Date() > new Date(otpRecord.expiresAt)) {
    return NextResponse.json({ error: "OTP expired. Request a new one." }, { status: 400 });
  }

  if (otpRecord.attempts >= 3) {
    return NextResponse.json({ error: "Too many attempts. Request a new OTP." }, { status: 429 });
  }

  if (otpRecord.code !== otp) {
    await prisma.$queryRawUnsafe(
      `UPDATE StaffOtp SET attempts = attempts + 1 WHERE id = ?`,
      otpRecord.id
    );
    return NextResponse.json(
      { error: `Invalid OTP. ${2 - otpRecord.attempts} attempts remaining.` },
      { status: 400 }
    );
  }

  // Mark OTP as verified
  await prisma.$queryRawUnsafe(
    `UPDATE StaffOtp SET verified = 1 WHERE id = ?`,
    otpRecord.id
  );

  // Get staff user
  const staffRows: any[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM StaffUser WHERE email = ? LIMIT 1`,
    normalizedEmail
  );

  if (!staffRows.length) {
    return NextResponse.json({ error: "Staff not found" }, { status: 404 });
  }

  const staff = staffRows[0];

  // Update last login
  await prisma.$queryRawUnsafe(
    `UPDATE StaffUser SET lastLoginAt = ?, updatedAt = ? WHERE id = ?`,
    new Date().toISOString(), new Date().toISOString(), staff.id
  );

  return NextResponse.json({
    success: true,
    user: {
      id: staff.id,
      name: staff.name,
      email: staff.email,
      role: staff.role,
      department: staff.department,
    },
  });
}
