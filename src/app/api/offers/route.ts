import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  calculateOffer,
  calculateSLADeadline,
  generateApprovalSummary,
} from "@/lib/offer-engine";

// POST /api/offers — create an offer for a candidate
// This is triggered when a candidate reaches SELECTED stage
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { candidateId } = body as { candidateId: string };

  // Fetch candidate with role data
  const candidate = await prisma.candidate.findUnique({
    where: { id: candidateId },
    include: { role: true, offers: true },
  });

  if (!candidate) {
    return NextResponse.json({ error: "Candidate not found" }, { status: 404 });
  }

  if (!candidate.expectedSalary) {
    return NextResponse.json(
      { error: "Candidate has no expected salary recorded" },
      { status: 400 }
    );
  }

  // Determine the round (based on existing offers)
  const round = candidate.offers.length + 1;

  if (round > 3) {
    return NextResponse.json(
      { error: "Maximum negotiation rounds (3) exceeded" },
      { status: 400 }
    );
  }

  const role = candidate.role;

  // Calculate fill rate
  const fillRate =
    role.totalPositions > 0
      ? role.filledPositions / role.totalPositions
      : 0.5; // Default to 50% if no data

  // Run the offer engine
  const result = calculateOffer({
    expectedSalary: candidate.expectedSalary,
    salaryBand: {
      min: role.salaryMin,
      mid: role.salaryMid,
      max: role.salaryMax,
      currency: role.currency,
    },
    roleCriticality: role.criticality as "STANDARD" | "PRIORITY" | "CRITICAL",
    fillRate,
    marketMedian: role.marketMedian || undefined,
  });

  // Generate approval summary for AMBER/RED
  const aiSummary = result.requiresApproval
    ? generateApprovalSummary({
        candidateName: `${candidate.firstName} ${candidate.lastName}`,
        roleName: role.title,
        client: role.client,
        expectedSalary: candidate.expectedSalary,
        offeredSalary: result.finalOffer,
        salaryBand: { min: role.salaryMin, mid: role.salaryMid, max: role.salaryMax },
        tier: result.tier,
        explanation: result.explanation,
        round,
        marketMedian: role.marketMedian || undefined,
      })
    : null;

  // Create the offer record
  const offer = await prisma.offer.create({
    data: {
      candidateId,
      round,
      offeredSalary: result.finalOffer,
      tier: result.tier,
      baseSalary: result.baseSalary,
      criticalityAdj: result.adjustments.criticality,
      fillRateAdj: result.adjustments.fillRate,
      marketAdj: result.adjustments.market,
      calculationNotes: result.explanation,
      aiSummary,
      approvalStatus: result.tier === "GREEN" ? "AUTO_APPROVED" : "PENDING",
      status: result.tier === "GREEN" ? "APPROVED" : "PENDING_APPROVAL",
    },
  });

  // GREEN path: auto-approve, skip to offer sent
  if (result.tier === "GREEN") {
    await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        stage: "OFFER_SENT",
        stageUpdatedAt: new Date(),
      },
    });

    // Update offer as sent
    await prisma.offer.update({
      where: { id: offer.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: "Offer",
        entityId: offer.id,
        action: "AUTO_APPROVED_AND_SENT",
        details: JSON.stringify({
          tier: "GREEN",
          offeredSalary: result.finalOffer,
          round,
        }),
        performedBy: "SYSTEM",
      },
    });

    // TODO: Trigger notification to candidate (WhatsApp + email)

    return NextResponse.json({
      offer,
      tier: result.tier,
      autoApproved: true,
      message: "GREEN path: offer auto-approved and sent to candidate.",
    });
  }

  // AMBER/RED path: create approval records
  for (const approver of result.approvalChain) {
    await prisma.approval.create({
      data: {
        offerId: offer.id,
        approverEmail: approver.email,
        approverName: approver.name,
        approverRole: approver.role,
        slaDeadline: calculateSLADeadline(result.tier),
      },
    });
  }

  // Update candidate stage
  await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      stage: "OFFER_PENDING_APPROVAL",
      stageUpdatedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Offer",
      entityId: offer.id,
      action: "OFFER_CREATED_PENDING_APPROVAL",
      details: JSON.stringify({
        tier: result.tier,
        offeredSalary: result.finalOffer,
        approvers: result.approvalChain.map((a) => a.name),
        round,
      }),
      performedBy: "SYSTEM",
    },
  });

  // TODO: Send approval notifications (Teams, email, etc.)

  return NextResponse.json({
    offer,
    tier: result.tier,
    autoApproved: false,
    approvalChain: result.approvalChain.map((a) => a.name),
    message: `${result.tier} path: sent to ${result.approvalChain.map((a) => a.name).join(", ")} for approval.`,
  });
}
