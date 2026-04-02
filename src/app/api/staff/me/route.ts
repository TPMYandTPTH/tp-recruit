import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const email = request.headers.get("x-staff-email");
  if (!email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM StaffUser WHERE email = ? LIMIT 1`, email);
  const staff = rows[0];
  if (!staff) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user: staff });
}
