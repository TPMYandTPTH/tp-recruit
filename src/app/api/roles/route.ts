import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureStaffTables } from "@/lib/ensure-staff-tables";

// GET /api/roles — list all roles
export async function GET() {
  try {
    await ensureStaffTables();
    const roles = await prisma.role.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ roles });
  } catch (e: any) {
    console.error("[API /roles] Error:", e);
    return NextResponse.json({ 
      error: e.message, 
      name: e.constructor?.name,
      dbUrl: process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.substring(0, 30) + "...)" : "NOT SET"
    }, { status: 500 });
  }
}

// POST /api/roles — create a new role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const role = await prisma.role.create({ data: body });
    return NextResponse.json({ role });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, name: e.constructor?.name }, { status: 500 });
  }
}
