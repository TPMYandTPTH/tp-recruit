import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNotification, sendBulkNotification } from "@/lib/notify";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.candidateIds && Array.isArray(body.candidateIds)) {
    const result = await sendBulkNotification(
      body.candidateIds,
      body.templateName,
      body.variables || {},
      body.jobId
    );
    return NextResponse.json(result);
  }

  if (!body.candidateId || !body.templateName) {
    return NextResponse.json(
      { error: "Missing required fields: candidateId, templateName" },
      { status: 400 }
    );
  }

  const result = await sendNotification({
    candidateId: body.candidateId,
    jobId: body.jobId,
    templateName: body.templateName,
    variables: body.variables || {},
    triggeredBy: body.triggeredBy || "manual",
    triggeredFrom: body.triggeredFrom || "api",
  });

  return NextResponse.json(result);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const candidateId = searchParams.get("candidateId");
  const channel = searchParams.get("channel");
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "50");

  const where: Record<string, unknown> = {};
  if (candidateId) where.candidateId = candidateId;
  if (channel) where.channel = channel;
  if (status) where.status = status;

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: Math.min(limit, 200),
  });

  return NextResponse.json({ notifications, count: notifications.length });
}
