import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// PUT /api/sourcing/[id] — update a sourcing channel
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const allowedFields: Record<string, any> = {};
  const editableKeys = [
    "name", "type", "platform", "isActive", "autoImport",
    "importUrl", "apiKey", "config", "costPerHire", "monthlyBudget",
    "notes", "contactPerson", "contactEmail",
    "totalCandidates", "totalHired", "lastImportAt", "lastImportCount",
  ];

  for (const key of editableKeys) {
    if (body[key] !== undefined) {
      allowedFields[key] = body[key];
    }
  }

  if (allowedFields.config && typeof allowedFields.config === "object") {
    allowedFields.config = JSON.stringify(allowedFields.config);
  }

  const channel = await prisma.sourcingChannel.update({
    where: { id },
    data: allowedFields,
  });

  await prisma.auditLog.create({
    data: {
      entityType: "SourcingChannel",
      entityId: id,
      action: "CHANNEL_UPDATED",
      details: JSON.stringify({ updatedFields: Object.keys(allowedFields) }),
      performedBy: "ADMIN",
    },
  });

  return NextResponse.json({ channel });
}

// DELETE /api/sourcing/[id] — delete a sourcing channel
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.sourcingChannel.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      entityType: "SourcingChannel",
      entityId: id,
      action: "CHANNEL_DELETED",
      performedBy: "ADMIN",
    },
  });

  return NextResponse.json({ success: true });
}
