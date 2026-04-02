import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/candidates/advance — manually advance a candidate to a target stage
// Used by dashboard to skip stages (e.g., skip assessment/interview for demo)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { candidateId, targetStage } = body as {
    candidateId: string;
    targetStage: string;
  };

  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  const now = new Date();
  const updateData: Record<string, any> = {
    stage: targetStage,
    stageUpdatedAt: now,
  };

  // Auto-fill timestamps based on target stage
  if (targetStage === "ASSESSMENT_PENDING" || targetStage === "SELECTED") {
    updateData.screeningPassedAt = updateData.screeningPassedAt || now;
  }
  if (targetStage === "INTERVIEW_PENDING" || targetStage === "SELECTED") {
    updateData.assessmentPassedAt = updateData.assessmentPassedAt || now;
    updateData.assessmentScore = candidate.assessmentScore || 85;
  }
  if (targetStage === "SELECTED") {
    updateData.interviewPassedAt = updateData.interviewPassedAt || now;
    updateData.interviewScore = candidate.interviewScore || 80;
  }

  await prisma.candidate.update({
    where: { id: candidateId },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Candidate",
      entityId: candidateId,
      action: "STAGE_ADVANCED",
      details: JSON.stringify({
        from: candidate.stage,
        to: targetStage,
        manual: true,
      }),
      performedBy: "DASHBOARD",
    },
  });

  return NextResponse.json({
    success: true,
    message: `Candidate advanced to ${targetStage}`,
  });
}
