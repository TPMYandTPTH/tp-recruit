import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/approvals?email=xxx — get pending approvals for an approver
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const approvals = await prisma.approval.findMany({
    where: {
      approverEmail: email,
      status: "PENDING",
    },
    include: {
      offer: {
        include: {
          candidate: {
            include: { role: true },
          },
        },
      },
    },
    orderBy: { sentAt: "asc" },
  });

  return NextResponse.json({ approvals });
}

// POST /api/approvals — submit an approval decision
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { approvalId, decision, notes } = body as {
    approvalId: string;
    decision: "APPROVED" | "DECLINED";
    notes?: string;
  };

  const approval = await prisma.approval.findUnique({
    where: { id: approvalId },
    include: {
      offer: {
        include: {
          approvals: true,
          candidate: { include: { role: true } },
        },
      },
    },
  });

  if (!approval) {
    return NextResponse.json({ error: "Approval not found" }, { status: 404 });
  }

  if (approval.status !== "PENDING") {
    return NextResponse.json(
      { error: "Approval already decided" },
      { status: 400 }
    );
  }

  // Record the decision
  await prisma.approval.update({
    where: { id: approvalId },
    data: {
      status: decision,
      decidedAt: new Date(),
      notes,
    },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Approval",
      entityId: approvalId,
      action: `APPROVAL_${decision}`,
      details: JSON.stringify({
        approverName: approval.approverName,
        approverRole: approval.approverRole,
        offerId: approval.offerId,
        notes,
      }),
      performedBy: approval.approverEmail,
    },
  });

  const offer = approval.offer;
  const allApprovals = offer.approvals;

  // If this approval was DECLINED, decline the whole offer
  if (decision === "DECLINED") {
    await prisma.offer.update({
      where: { id: offer.id },
      data: { approvalStatus: "DECLINED", status: "WITHDRAWN" },
    });

    await prisma.candidate.update({
      where: { id: offer.candidateId },
      data: { stage: "OFFER_DECLINED", stageUpdatedAt: new Date() },
    });

    // TODO: Notify recruiter about declined approval
    // TODO: Flag as investigation/error if it shouldn't have been declined

    return NextResponse.json({
      result: "DECLINED",
      message: `Approval declined by ${approval.approverName}. Recruiter will be notified.`,
    });
  }

  // If APPROVED, check if ALL required approvals are now done
  // Update our local copy with the new decision
  const updatedApprovals = allApprovals.map((a) =>
    a.id === approvalId ? { ...a, status: "APPROVED" as const } : a
  );

  const allParallelApproved = updatedApprovals
    .filter((a) => a.approverRole !== "COO") // COO is sequential (RED only)
    .every((a) => a.status === "APPROVED");

  const coaApproval = updatedApprovals.find((a) => a.approverRole === "COO");

  // For AMBER: just need parallel approvals (TA_LEAD + DIRECTOR)
  // For RED: need parallel + COO
  if (offer.tier === "AMBER" && allParallelApproved) {
    // AMBER fully approved
    await finalizeApproval(offer.id, offer.candidateId);
    return NextResponse.json({
      result: "FULLY_APPROVED",
      message: "All approvals received. Offer will be sent to candidate.",
    });
  }

  if (offer.tier === "RED") {
    if (allParallelApproved && !coaApproval) {
      // Shouldn't happen (RED should have COO), but handle gracefully
      await finalizeApproval(offer.id, offer.candidateId);
      return NextResponse.json({
        result: "FULLY_APPROVED",
        message: "All approvals received. Offer will be sent to candidate.",
      });
    }

    if (allParallelApproved && coaApproval?.status === "PENDING") {
      // Parallel done, now COO's turn
      // TODO: Send notification to COO
      return NextResponse.json({
        result: "PARTIAL",
        message: `Parallel approvals complete. Awaiting COO (${coaApproval.approverName}) approval.`,
      });
    }

    if (allParallelApproved && coaApproval?.status === "APPROVED") {
      // All done including COO
      await finalizeApproval(offer.id, offer.candidateId);
      return NextResponse.json({
        result: "FULLY_APPROVED",
        message: "All approvals received (including COO). Offer will be sent.",
      });
    }
  }

  // Still waiting for more approvals
  const pending = updatedApprovals.filter((a) => a.status === "PENDING");
  return NextResponse.json({
    result: "PARTIAL",
    message: `Approved by ${approval.approverName}. Still waiting for: ${pending.map((p) => p.approverName).join(", ")}`,
  });
}

// ============================================================
// Finalize an approval — mark offer as approved & send to candidate
// ============================================================

async function finalizeApproval(offerId: string, candidateId: string) {
  await prisma.offer.update({
    where: { id: offerId },
    data: {
      approvalStatus: "APPROVED",
      status: "SENT",
      sentAt: new Date(),
    },
  });

  await prisma.candidate.update({
    where: { id: candidateId },
    data: {
      stage: "OFFER_SENT",
      stageUpdatedAt: new Date(),
    },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "Offer",
      entityId: offerId,
      action: "OFFER_APPROVED_AND_SENT",
      performedBy: "SYSTEM",
    },
  });

  // TODO: Generate offer letter PDF
  // TODO: Send notification to candidate (WhatsApp + email with portal link)
}
