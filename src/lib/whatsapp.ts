// ════════════════════════════════════════════════════════════
// lib/whatsapp.ts — WhatsApp Cloud API adapter
//
// DROP-IN FILE — no changes needed from tp-recruit
// Works with both Supabase and Prisma backends
//
// Env vars needed:
//   WHATSAPP_TOKEN         — Permanent access token from Meta
//   WHATSAPP_PHONE_ID      — Phone Number ID (not the phone number)
//   WHATSAPP_VERIFY_TOKEN  — For webhook verification
// ════════════════════════════════════════════════════════════

const API_BASE = 'https://graph.facebook.com/v21.0'

interface TemplateComponent {
  type: 'body' | 'header' | 'button'
  parameters: Array<{ type: 'text'; text: string }>
}

export interface SendResult {
  ok: boolean
  messageId?: string
  error?: string
}

// ── Send a template message (pre-approved by Meta) ─────────
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  variables: Record<string, string>
): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  if (!token || !phoneId) return { ok: false, error: 'Missing WhatsApp credentials' }

  const phone = normalizePhone(to)

  const paramValues = Object.values(variables)
  const bodyParams: TemplateComponent = {
    type: 'body',
    parameters: paramValues.map(v => ({ type: 'text', text: v })),
  }

  try {
    const res = await fetch(`${API_BASE}/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'template',
        template: {
          name: templateName,
          language: { code: languageCode },
          components: paramValues.length > 0 ? [bodyParams] : [],
        },
      }),
    })

    const data = await res.json()

    if (res.ok && data.messages?.[0]?.id) {
      return { ok: true, messageId: data.messages[0].id }
    }

    return {
      ok: false,
      error: data.error?.message || JSON.stringify(data.error || data),
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── Send a free-form text message (only within 24h window) ──
export async function sendWhatsAppText(
  to: string,
  text: string
): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  if (!token || !phoneId) return { ok: false, error: 'Missing WhatsApp credentials' }

  const phone = normalizePhone(to)

  try {
    const res = await fetch(`${API_BASE}/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: phone,
        type: 'text',
        text: { body: text },
      }),
    })

    const data = await res.json()

    if (res.ok && data.messages?.[0]?.id) {
      return { ok: true, messageId: data.messages[0].id }
    }

    return {
      ok: false,
      error: data.error?.message || JSON.stringify(data.error || data),
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── Normalize phone number ──────────────────────────────────
function normalizePhone(raw: string): string {
  let phone = raw.replace(/[\s\-()]/g, '')
  if (!phone.startsWith('+')) {
    if (phone.startsWith('0')) phone = '60' + phone.slice(1)
    else if (phone.length === 9 && /^[6-9]/.test(phone)) phone = '66' + phone
  } else {
    phone = phone.slice(1)
  }
  return phone
}

// ── Webhook verification (for receiving status updates) ─────
export function verifyWebhook(
  mode: string | undefined,
  token: string | undefined,
  challenge: string | undefined,
  verifyToken: string
): string | null {
  if (mode === 'subscribe' && token === verifyToken) {
    return challenge || ''
  }
  return null
}
