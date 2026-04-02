import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generatePortalToken } from "@/lib/utils";

// GET /api/candidates — list candidates with optional filters
export async function GET(request: NextRequest) {
  const stage = request.nextUrl.searchParams.get("stage");
  const roleId = request.nextUrl.searchParams.get("roleId");

  const candidates = await prisma.candidate.findMany({
    where: {
      ...(stage ? { stage: stage as any } : {}),
      ...(roleId ? { roleId } : {}),
    },
    include: {
      role: true,
      offers: { orderBy: { createdAt: "desc" }, include: { approvals: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ candidates });
}

// POST /api/candidates — create a new candidate
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    firstName,
    lastName,
    email,
    phone,
    roleId,
    source,
    notes,
  } = body as {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    roleId: string;
    source?: string;
    notes?: string;
  };

  // Resolve role — if "auto", pick the first available role
  let resolvedRoleId = roleId;
  if (!roleId || roleId === "auto") {
    const firstRole = await prisma.role.findFirst({ orderBy: { title: "asc" } });
    if (!firstRole) {
      return NextResponse.json({ error: "No roles configured" }, { status: 500 });
    }
    resolvedRoleId = firstRole.id;
  }

  // Validate role exists
  const role = await prisma.role.findUnique({ where: { id: resolvedRoleId } });
  if (!role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  // Generate unique portal token
  const portalToken = generatePortalToken();

  const candidate = await prisma.candidate.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
      roleId: resolvedRoleId,
      portalToken,
      source: (source as any) || "PORTAL",
      stage: "SCREENING",
      interviewNotes: notes || undefined,
    },
    include: { role: true },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Candidate",
      entityId: candidate.id,
      action: "CANDIDATE_CREATED",
      details: JSON.stringify({
        roleName: role.title,
        source: candidate.source,
        additionalData: notes ? JSON.parse(notes) : undefined,
      }),
      performedBy: "SYSTEM",
    },
  });

  const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/portal/${portalToken}`;

  return NextResponse.json({
    candidate,
    portalUrl,
    portalToken,
    message: `Candidate created. Portal link: ${portalUrl}`,
  });
}
