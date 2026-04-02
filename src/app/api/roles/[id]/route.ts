import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/roles/[id] — get single role with candidates
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const role = await prisma.role.findUnique({
    where: { id },
    include: {
      candidates: {
        orderBy: { updatedAt: "desc" },
        include: { offers: { orderBy: { createdAt: "desc" }, take: 1 } },
      },
    },
  });

  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  return NextResponse.json({ role });
}

// PUT /api/roles/[id] — update role fields
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const allowedFields: Record<string, any> = {};
  const editableKeys = [
    "title", "client", "campaign", "department",
    "salaryMin", "salaryMid", "salaryMax", "currency",
    "marketMedian", "criticality", "interviewMode",
    "totalPositions", "filledPositions",
  ];

  for (const key of editableKeys) {
    if (body[key] !== undefined) {
      allowedFields[key] = body[key];
    }
  }

  const role = await prisma.role.update({
    where: { id },
    data: allowedFields,
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Role",
      entityId: id,
      action: "ROLE_UPDATED",
      details: JSON.stringify({ updatedFields: Object.keys(allowedFields) }),
      performedBy: "ADMIN",
    },
  });

  return NextResponse.json({ role });
}

// DELETE /api/roles/[id] — delete a role (only if no candidates)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const candidateCount = await prisma.candidate.count({ where: { roleId: id } });
  if (candidateCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete role with ${candidateCount} active candidates. Reassign or remove them first.` },
      { status: 400 }
    );
  }

  await prisma.role.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      entityType: "Role",
      entityId: id,
      action: "ROLE_DELETED",
      performedBy: "ADMIN",
    },
  });

  return NextResponse.json({ success: true });
}
