import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/sourcing — list all sourcing channels with candidate stats
export async function GET() {
  const channels = await prisma.sourcingChannel.findMany({
    orderBy: [{ isActive: "desc" }, { totalCandidates: "desc" }],
  });

  // Get candidate counts per source type for analytics
  const candidatesBySource = await prisma.candidate.groupBy({
    by: ["source"],
    _count: { id: true },
  });

  // Get hired counts (OFFER_ACCEPTED or ONBOARDING)
  const hiredBySource = await prisma.candidate.groupBy({
    by: ["source"],
    where: { stage: { in: ["OFFER_ACCEPTED", "ONBOARDING"] } },
    _count: { id: true },
  });

  // Get recent candidates per source (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentBySource = await prisma.candidate.groupBy({
    by: ["source"],
    where: { createdAt: { gte: thirtyDaysAgo } },
    _count: { id: true },
  });

  return NextResponse.json({
    channels,
    analytics: {
      candidatesBySource: Object.fromEntries(candidatesBySource.map(s => [s.source, s._count.id])),
      hiredBySource: Object.fromEntries(hiredBySource.map(s => [s.source, s._count.id])),
      recentBySource: Object.fromEntries(recentBySource.map(s => [s.source, s._count.id])),
    },
  });
}

// POST /api/sourcing — create a new sourcing channel
export async function POST(request: NextRequest) {
  const body = await request.json();

  const channel = await prisma.sourcingChannel.create({
    data: {
      name: body.name,
      type: body.type,
      platform: body.platform || null,
      isActive: body.isActive ?? true,
      autoImport: body.autoImport ?? false,
      importUrl: body.importUrl || null,
      apiKey: body.apiKey || null,
      config: body.config ? JSON.stringify(body.config) : null,
      costPerHire: body.costPerHire ? parseFloat(body.costPerHire) : null,
      monthlyBudget: body.monthlyBudget ? parseFloat(body.monthlyBudget) : null,
      notes: body.notes || null,
      contactPerson: body.contactPerson || null,
      contactEmail: body.contactEmail || null,
    },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "SourcingChannel",
      entityId: channel.id,
      action: "CHANNEL_CREATED",
      details: JSON.stringify({ name: channel.name, type: channel.type }),
      performedBy: "ADMIN",
    },
  });

  return NextResponse.json({ channel });
}
