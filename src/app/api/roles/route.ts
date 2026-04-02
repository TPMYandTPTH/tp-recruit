import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/roles — list all roles
export async function GET() {
  const roles = await prisma.role.findMany({
    orderBy: { title: "asc" },
  });
  return NextResponse.json({ roles });
}

// POST /api/roles — create a new role
export async function POST(request: NextRequest) {
  const body = await request.json();
  const role = await prisma.role.create({ data: body });
  return NextResponse.json({ role });
}
