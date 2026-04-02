import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("[WA Webhook] Verified");
    return new Response(challenge || "", { status: 200 });
  }
  return NextResponse.json({ error: "Verification failed" }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const entries = body?.entry || [];
    for (const entry of entries) {
      const changes = entry?.changes || [];
      for (const change of changes) {
        const statuses = change?.value?.statuses || [];
        for (const status of statuses) {
          if (!status.id) continue;
          const newStatus =
            status.status === "sent"
              ? "sent"
              : status.status === "delivered"
              ? "delivered"
              : status.status === "read"
              ? "read"
              : status.status === "failed"
              ? "failed"
              : status.status;
          try {
            await prisma.notification.updateMany({
              where: { externalId: status.id },
              data: {
                status: newStatus,
                statusUpdated: new Date(parseInt(status.timestamp) * 1000),
                error: status.errors?.[0]?.title || null,
              },
            });
            console.log(`[WA Webhook] ${status.id} → ${newStatus}`);
          } catch (err) {
            console.error("[WA Webhook] DB update error:", err);
          }
        }
      }
    }
  } catch (err) {
    console.error("[WA Webhook] Error processing:", err);
  }
  return NextResponse.json({ ok: true });
}
