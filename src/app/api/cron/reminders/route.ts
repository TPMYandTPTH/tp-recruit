import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendNotification } from "@/lib/notify";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const results = {
    interviewReminders: 0,
    assessmentReminders: 0,
    errors: 0,
  };

  try {
    // ── Interview reminders (scheduled tomorrow) ──────────
    const tomorrowStart = new Date(tomorrow);
    tomorrowStart.setHours(0, 0, 0, 0);
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(23, 59, 59, 999);

    const interviewCandidates = await prisma.candidate.findMany({
      where: {
        stage: "INTERVIEW",
        interviewScheduledAt: { gte: tomorrowStart, lte: tomorrowEnd },
      },
      include: { role: true },
    });

    for (const c of interviewCandidates) {
      // Dedup check
      const existing = await prisma.notification.count({
        where: {
          candidateId: c.id,
          template: "interview_reminder_24h",
          createdAt: {
            gte: new Date(now.getTime() - 24 * 60 * 60 * 1000),
          },
        },
      });
      if (existing > 0) continue;

      const dt = c.interviewScheduledAt!;
      const r = await sendNotification({
        candidateId: c.id,
        templateName: "interview_reminder_24h",
        variables: {
          role: c.role?.title || "the role",
          date: dt.toLocaleDateString("en-MY", {
            weekday: "long",
            day: "numeric",
            month: "long",
          }),
          time: dt.toLocaleTimeString("en-MY", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        triggeredBy: "cron",
        triggeredFrom: "system",
      });
      if (r.ok) results.interviewReminders++;
      else results.errors++;
    }

    // ── Assessment reminders (candidates in ASSESSMENT stage >48h) ──
    const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const assessmentCandidates = await prisma.candidate.findMany({
      where: {
        stage: "ASSESSMENT",
        assessmentPassedAt: null,
        stageUpdatedAt: { lte: twoDaysAgo },
      },
      include: { role: true },
    });

    for (const c of assessmentCandidates) {
      const existing = await prisma.notification.count({
        where: {
          candidateId: c.id,
          template: "assessment_reminder",
          createdAt: {
            gte: new Date(now.getTime() - 48 * 60 * 60 * 1000),
          },
        },
      });
      if (existing > 0) continue;

      const r = await sendNotification({
        candidateId: c.id,
        templateName: "assessment_reminder",
        variables: {
          role: c.role?.title || "the role",
          link: c.assessmentLink || "",
        },
        triggeredBy: "cron",
        triggeredFrom: "system",
      });
      if (r.ok) results.assessmentReminders++;
      else results.errors++;
    }
  } catch (err) {
    console.error("[CRON] Error:", err);
    results.errors++;
  }

  console.log("[CRON] Reminder results:", results);
  return NextResponse.json({
    ok: true,
    ...results,
    timestamp: now.toISOString(),
  });
}
