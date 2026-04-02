// ════════════════════════════════════════════════════════════
// src/lib/notify.ts — Notification Router
//
// Uses the existing Prisma singleton from @/lib/db
//
// Country → channel routing:
//   MY → WhatsApp (phone)
//   TH → LINE (userId) → fallback WhatsApp → fallback email
//
// Every notification is logged to the notifications table
// ════════════════════════════════════════════════════════════

import { prisma } from "@/lib/db";
import { sendWhatsAppTemplate, sendWhatsAppText } from "@/lib/whatsapp";
import { sendLineNotification } from "@/lib/line";

export interface NotifyPayload {
  candidateId: string;
  jobId?: string;
  templateName: string;
  variables: Record<string, string>;
  triggeredBy?: "auto" | "manual" | "cron";
  triggeredFrom?: "system" | "api" | "dashboard";
}

export interface NotifyResult {
  ok: boolean;
  channel: string;
  messageId?: string;
  error?: string;
}

export async function sendNotification(
  payload: NotifyPayload
): Promise<NotifyResult> {
  // ── Look up candidate ───────────────────────────────────
  const candidate = await prisma.candidate.findUnique({
    where: { id: payload.candidateId },
  });

  if (!candidate) {
    return {
      ok: false,
      channel: "none",
      error: `Candidate ${payload.candidateId} not found`,
    };
  }

  // ── Look up notification template ───────────────────────
  let template: any = null;
  try {
    template = await prisma.notificationTemplate.findFirst({
      where: { name: payload.templateName, active: true },
    });
  } catch {
    // Template table might not be seeded yet
  }

  // ── Resolve channel ─────────────────────────────────────
  const country = (candidate.country || "MY").toUpperCase();
  const preferred = candidate.preferredChannel;
  const lineId = candidate.lineUserId;
  const phone =
    candidate.whatsappPhone || candidate.phone;

  let channel: string;
  if (preferred === "line" && lineId) channel = "line";
  else if (preferred === "whatsapp" && phone) channel = "whatsapp";
  else if (preferred === "email") channel = "email";
  else if (country === "TH") {
    channel = lineId ? "line" : phone ? "whatsapp" : "email";
  } else {
    channel = phone ? "whatsapp" : lineId ? "line" : "email";
  }

  // ── Build message text ──────────────────────────────────
  const vars: Record<string, string> = {
    name: candidate.firstName + " " + candidate.lastName,
    ...payload.variables,
  };

  let messageText =
    template?.messageBody || payload.variables.message || "";
  Object.entries(vars).forEach(([key, val]) => {
    messageText = messageText.replace(
      new RegExp(`\\{\\{${key}\\}\\}`, "g"),
      val
    );
  });

  // ── Get recipient ───────────────────────────────────────
  let recipient: string;
  switch (channel) {
    case "whatsapp":
      recipient = (candidate.whatsappPhone || candidate.phone || "") as string;
      break;
    case "line":
      recipient = (candidate.lineUserId || "") as string;
      break;
    case "email":
      recipient = candidate.email;
      break;
    default:
      recipient = "";
  }

  // ── Send via resolved channel ───────────────────────────
  let result: NotifyResult;

  switch (channel) {
    case "whatsapp":
      if (template?.whatsappTemplateName) {
        const wa = await sendWhatsAppTemplate(
          recipient,
          template.whatsappTemplateName,
          template.whatsappTemplateLang || "en",
          vars
        );
        result = {
          ok: wa.ok,
          channel: "whatsapp",
          messageId: wa.messageId,
          error: wa.error,
        };
      } else {
        const wa = await sendWhatsAppText(recipient, messageText);
        result = {
          ok: wa.ok,
          channel: "whatsapp",
          messageId: wa.messageId,
          error: wa.error,
        };
      }
      break;

    case "line": {
      const actionUrl = vars.link || vars.url || undefined;
      const line = await sendLineNotification(
        recipient,
        payload.templateName.replace(/_/g, " "),
        messageText,
        actionUrl ? "Open" : undefined,
        actionUrl
      );
      result = {
        ok: line.ok,
        channel: "line",
        messageId: line.messageId,
        error: line.error,
      };
      break;
    }

    case "email":
      console.log(
        `[EMAIL] To: ${recipient}, Message: ${messageText.slice(0, 100)}`
      );
      result = {
        ok: true,
        channel: "email",
        messageId: `email_${Date.now()}`,
      };
      break;

    default:
      result = {
        ok: false,
        channel: "none",
        error: "No valid channel for candidate",
      };
  }

  // ── Log notification ────────────────────────────────────
  try {
    await prisma.notification.create({
      data: {
        candidateId: payload.candidateId,
        jobId: payload.jobId || null,
        channel,
        recipient,
        template: payload.templateName,
        templateVars: vars,
        messagePreview: messageText.slice(0, 200),
        status: result.ok ? "sent" : "failed",
        statusUpdated: new Date(),
        externalId: result.messageId || null,
        error: result.error || null,
        triggeredBy: payload.triggeredBy || "manual",
        triggeredFrom: payload.triggeredFrom || "api",
      },
    });
  } catch (err) {
    console.error("[Notify] Failed to log notification:", err);
  }

  return result;
}

// ── Bulk send ─────────────────────────────────────────────
export async function sendBulkNotification(
  candidateIds: string[],
  templateName: string,
  variables: Record<string, string>,
  jobId?: string
): Promise<{
  total: number;
  sent: number;
  failed: number;
  results: NotifyResult[];
}> {
  const results: NotifyResult[] = [];

  for (const id of candidateIds) {
    const r = await sendNotification({
      candidateId: id,
      jobId,
      templateName,
      variables,
      triggeredBy: "manual",
      triggeredFrom: "dashboard",
    });
    results.push(r);
    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return {
    total: candidateIds.length,
    sent: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  };
}
