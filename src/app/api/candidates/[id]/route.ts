import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/candidates/[id] — get single candidate with full details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      role: true,
      offers: {
        orderBy: { createdAt: "desc" },
        include: { approvals: true },
      },
    },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  return NextResponse.json({ candidate });
}

// PUT /api/candidates/[id] — update candidate fields
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  // Only allow updating safe fields
  const allowedFields: Record<string, any> = {};
  const editableKeys = [
    "firstName", "lastName", "email", "phone",
    "roleId", "source", "expectedSalary",
    "stage", "interviewNotes", "interviewScore",
    "assessmentScore", "assessmentLink",
    "bgvStatus", "documentsUploaded",
  ];

  for (const key of editableKeys) {
    if (body[key] !== undefined) {
      allowedFields[key] = body[key];
    }
  }

  // If stage is being changed, update stageUpdatedAt
  if (allowedFields.stage) {
    allowedFields.stageUpdatedAt = new Date();
  }

  const candidate = await prisma.candidate.update({
    where: { id },
    data: allowedFields,
    include: { role: true, offers: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Candidate",
      entityId: id,
      action: "CANDIDATE_UPDATED",
      details: JSON.stringify({ updatedFields: Object.keys(allowedFields) }),
      performedBy: "ADMIN",
    },
  });

  return NextResponse.json({ candidate });
}

// DELETE /api/candidates/[id] — delete a candidate
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Delete related records first
  await prisma.approval.deleteMany({
    where: { offer: { candidateId: id } },
  });
  await prisma.offer.deleteMany({ where: { candidateId: id } });
  await prisma.candidate.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      entityType: "Candidate",
      entityId: id,
      action: "CANDIDATE_DELETED",
      performedBy: "ADMIN",
    },
  });

  return NextResponse.json({ success: true });
}
