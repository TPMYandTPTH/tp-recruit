import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyLineSignature, getLineProfile, sendLineText } from "@/lib/line";

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature") || "";

  if (!verifyLineSignature(rawBody, signature)) {
    console.error("[LINE Webhook] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const body = JSON.parse(rawBody);
  const events = body?.events || [];

  for (const event of events) {
    const userId = event.source?.userId;
    if (!userId) continue;

    switch (event.type) {
      case "follow": {
        console.log(`[LINE] New friend: ${userId}`);
        const profile = await getLineProfile(userId);
        const displayName = profile?.displayName || "";

        const candidates = await prisma.candidate.findMany({
          where: { country: "TH", lineUserId: null },
          orderBy: { createdAt: "desc" },
          take: 5,
        });

        if (candidates.length > 0) {
          const nameMatch = candidates.find(
            (c) =>
              displayName &&
              (c.firstName.toLowerCase().includes(displayName.toLowerCase()) ||
                displayName
                  .toLowerCase()
                  .includes(c.firstName.toLowerCase()))
          );
          const target = nameMatch || candidates[0];
          await prisma.candidate.update({
            where: { id: target.id },
            data: { lineUserId: userId, preferredChannel: "line" },
          });
          console.log(
            `[LINE] Linked ${userId} → candidate ${target.id} (${target.firstName})`
          );
        }

        await sendLineText(
          userId,
          `สวัสดีค่ะ! Welcome to Teleperformance Thailand 🇹🇭\n\nWe'll send you updates about your application here on LINE.\n\nขอบคุณที่สนใจร่วมงานกับเรา!`
        );
        break;
      }

      case "message": {
        const text = event.message?.text?.toLowerCase() || "";

        if (text === "status" || text === "สถานะ") {
          const candidate = await prisma.candidate.findFirst({
            where: { lineUserId: userId },
          });
          if (candidate) {
            const labels: Record<string, string> = {
              SCREENING: "Received — under review",
              ASSESSMENT: "Assessment in progress",
              INTERVIEW: "Interview stage",
              OFFER: "Offer extended!",
              ONBOARDING: "Welcome to TP!",
              HIRED: "Welcome to TP!",
              REJECTED: "Not selected for this role",
            };
            await sendLineText(
              userId,
              `Hi ${candidate.firstName}!\n\nYour application status: ${labels[candidate.stage] || candidate.stage}`
            );
          } else {
            await sendLineText(
              userId,
              `We couldn't find your application. Please apply at our careers page first!`
            );
          }
        } else if (
          text === "yes" ||
          text === "confirm" ||
          text === "ยืนยัน"
        ) {
          await sendLineText(userId, "Thank you for confirming! ✓");
        } else {
          await sendLineText(
            userId,
            `Thanks for your message! Type "status" to check your application.\n\nพิมพ์ "สถานะ" เพื่อตรวจสอบสถานะการสมัคร`
          );
        }
        break;
      }

      case "postback": {
        console.log(`[LINE] Postback from ${userId}: ${event.postback?.data}`);
        break;
      }
    }
  }

  return NextResponse.json({ ok: true });
}
