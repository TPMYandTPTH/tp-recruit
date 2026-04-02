import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureStaffTables } from "@/lib/ensure-staff-tables";

function cuid() {
  return "cl" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

  await ensureStaffTables();
  const normalizedEmail = email.toLowerCase().trim();

  // Use raw SQL since StaffUser model may not be in generated Prisma client yet
  const staffRows: any[] = await prisma.$queryRawUnsafe(
    `SELECT * FROM StaffUser WHERE email = ? AND isActive = 1 LIMIT 1`,
    normalizedEmail
  );

  if (!staffRows.length) {
    return NextResponse.json({ error: "No staff account found with this email." }, { status: 404 });
  }

  const staff = staffRows[0];
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

  // Delete old unverified OTPs
  await prisma.$queryRawUnsafe(
    `DELETE FROM StaffOtp WHERE email = ? AND verified = 0`,
    normalizedEmail
  );

  // Create new OTP
  await prisma.$queryRawUnsafe(
    `INSERT INTO StaffOtp (id, email, code, expiresAt, verified, attempts, createdAt) VALUES (?, ?, ?, ?, 0, 0, ?)`,
    cuid(), normalizedEmail, code, expiresAt, new Date().toISOString()
  );

  console.log(`[DEV] Staff OTP for ${email}: ${code}`);

  return NextResponse.json({
    success: true,
    staffName: staff.name,
    staffRole: staff.role,
    otp: code, // DEV ONLY
  });
}
