import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processCounterOffer } from "@/lib/offer-engine";

// POST /api/offers/respond — candidate responds to an offer
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { offerId, action, reason, counterAmount } = body as {
    offerId: string;
    action: "ACCEPT" | "DECLINE" | "COUNTER";
    reason?: string;
    counterAmount?: number;
  };

  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      candidate: { include: { role: true } },
    },
  });

  if (!offer) {
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  }

  if (offer.status !== "SENT") {
    return NextResponse.json(
      { error: "Offer is not in a state that can be responded to" },
      { status: 400 }
    );
  }

  const candidate = offer.candidate;
  const role = candidate.role;

  // ===== ACCEPT =====
  if (action === "ACCEPT") {
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: "ACCEPTED",
        respondedAt: new Date(),
      },
    });

    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        stage: "OFFER_ACCEPTED",
        stageUpdatedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: "Offer",
        entityId: offerId,
        action: "OFFER_ACCEPTED",
        details: JSON.stringify({
          offeredSalary: offer.offeredSalary,
          round: offer.round,
        }),
        performedBy: candidate.email,
      },
    });

    // TODO: Trigger onboarding flow
    // TODO: Update iCIMS status
    // TODO: Send confirmation to candidate + TA team

    return NextResponse.json({
      success: true,
      nextStage: "ONBOARDING",
      message: "Offer accepted! Onboarding process will begin.",
    });
  }

  // ===== DECLINE =====
  if (action === "DECLINE") {
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: "DECLINED",
        respondedAt: new Date(),
        declineReason: reason || "No reason provided",
        declineCategory: categorizeDeclineReason(reason),
      },
    });

    // Check if we've hit max rounds
    if (offer.round >= 3) {
      await prisma.candidate.update({
        where: { id: candidate.id },
        data: { stage: "CLOSED", stageUpdatedAt: new Date() },
      });

      return NextResponse.json({
        success: true,
        nextStage: "CLOSED",
        message:
          "Maximum negotiation rounds reached. Candidate has been closed.",
      });
    }

    // Non-salary decline = close the candidate
    const category = categorizeDeclineReason(reason);
    if (category !== "SALARY") {
      await prisma.candidate.update({
        where: { id: candidate.id },
        data: { stage: "CLOSED", stageUpdatedAt: new Date() },
      });

      await prisma.auditLog.create({
        data: {
          entityType: "Offer",
          entityId: offerId,
          action: "OFFER_DECLINED_NON_SALARY",
          details: JSON.stringify({ reason, category }),
          performedBy: candidate.email,
        },
      });

      return NextResponse.json({
        success: true,
        nextStage: "CLOSED",
        message: `Offer declined for non-salary reason (${category}). Candidate closed.`,
      });
    }

    // Salary-related decline without counter = mark as declined, notify recruiter
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { stage: "OFFER_DECLINED", stageUpdatedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      nextStage: "OFFER_DECLINED",
      message:
        "Offer declined for salary reasons. Recruiter will be notified to negotiate.",
    });
  }

  // ===== COUNTER =====
  if (action === "COUNTER" && counterAmount) {
    // Run counter-offer engine
    const counterResult = processCounterOffer({
      counterAmount,
      currentOffer: offer.offeredSalary,
      round: offer.round,
      salaryBand: {
        min: role.salaryMin,
        mid: role.salaryMid,
        max: role.salaryMax,
        currency: role.currency,
      },
    });

    // Update current offer as countered
    await prisma.offer.update({
      where: { id: offerId },
      data: {
        status: "COUNTERED",
        respondedAt: new Date(),
        counterAmount,
        declineReason: reason,
      },
    });

    await prisma.auditLog.create({
      data: {
        entityType: "Offer",
        entityId: offerId,
        action: "OFFER_COUNTERED",
        details: JSON.stringify({
          counterAmount,
          currentOffer: offer.offeredSalary,
          engineResult: counterResult,
        }),
        performedBy: candidate.email,
      },
    });

    if (counterResult.action === "CLOSE") {
      await prisma.candidate.update({
        where: { id: candidate.id },
        data: { stage: "CLOSED", stageUpdatedAt: new Date() },
      });
      return NextResponse.json({
        success: true,
        nextStage: "CLOSED",
        message: counterResult.explanation,
      });
    }

    if (counterResult.action === "ESCALATE") {
      await prisma.candidate.update({
        where: { id: candidate.id },
        data: { stage: "RENEGOTIATING", stageUpdatedAt: new Date() },
      });
      // TODO: Notify recruiter + DD for exceptional case
      return NextResponse.json({
        success: true,
        nextStage: "RENEGOTIATING",
        message: counterResult.explanation,
        requiresHumanIntervention: true,
      });
    }

    // AUTO_ACCEPT or REVISED_OFFER — create a new offer at the next round
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: {
        stage: "OFFER_COUNTERED",
        expectedSalary: counterAmount, // Update expected to their counter
        stageUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      nextStage: "OFFER_COUNTERED",
      counterResult,
      message: counterResult.explanation,
      // The frontend or a background job should now call POST /api/offers
      // to create the next round offer with the updated expected salary
    });
  }

  return NextResponse.json(
    { error: "Invalid action or missing counter amount" },
    { status: 400 }
  );
}

// ============================================================
// Decline Reason Categorization
// ============================================================

function categorizeDeclineReason(reason?: string): string {
  if (!reason) return "OTHER";
  const lower = reason.toLowerCase();

  if (
    lower.includes("salary") ||
    lower.includes("pay") ||
    lower.includes("compensation") ||
    lower.includes("money") ||
    lower.includes("offer") ||
    lower.includes("higher") ||
    lower.includes("more") ||
    lower.includes("low") ||
    lower.includes("budget")
  ) {
    return "SALARY";
  }

  if (
    lower.includes("location") ||
    lower.includes("remote") ||
    lower.includes("commute") ||
    lower.includes("relocat") ||
    lower.includes("travel")
  ) {
    return "LOCATION";
  }

  if (
    lower.includes("timing") ||
    lower.includes("start date") ||
    lower.includes("available") ||
    lower.includes("notice period") ||
    lower.includes("soon")
  ) {
    return "TIMING";
  }

  if (
    lower.includes("another offer") ||
    lower.includes("other offer") ||
    lower.includes("accepted") ||
    lower.includes("somewhere else")
  ) {
    return "COMPETING_OFFER";
  }

  return "OTHER";
}
