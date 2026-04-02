// ════════════════════════════════════════════════════════════
// lib/line.ts — LINE Messaging API adapter (Thailand)
//
// DROP-IN FILE — no changes needed from tp-recruit
//
// Env vars needed:
//   LINE_CHANNEL_TOKEN     — Channel access token (long-lived)
//   LINE_CHANNEL_SECRET    — For webhook signature verification
// ════════════════════════════════════════════════════════════

import crypto from 'crypto'

const API_BASE = 'https://api.line.me/v2/bot'

export interface SendResult {
  ok: boolean
  messageId?: string
  error?: string
}

// ── Push a text message to a specific user ──────────────────
export async function sendLineText(
  userId: string,
  text: string
): Promise<SendResult> {
  return sendLinePush(userId, [{ type: 'text', text }])
}

// ── Push a rich Flex Message (card-style) ───────────────────
export async function sendLineFlex(
  userId: string,
  altText: string,
  flexContent: Record<string, unknown>
): Promise<SendResult> {
  return sendLinePush(userId, [{
    type: 'flex',
    altText,
    contents: flexContent,
  }])
}

// ── Send a notification-style message with action button ────
export async function sendLineNotification(
  userId: string,
  title: string,
  body: string,
  actionLabel?: string,
  actionUrl?: string
): Promise<SendResult> {
  const bubble: Record<string, unknown> = {
    type: 'bubble',
    size: 'kilo',
    header: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: 'Teleperformance', size: 'xxs', color: '#4B4C6A', weight: 'bold' },
        { type: 'text', text: title, size: 'md', weight: 'bold', margin: 'xs' },
      ],
      paddingBottom: 'sm',
    },
    body: {
      type: 'box',
      layout: 'vertical',
      contents: [
        { type: 'text', text: body, size: 'sm', color: '#555555', wrap: true },
      ],
    },
  }

  if (actionLabel && actionUrl) {
    (bubble as Record<string, unknown>).footer = {
      type: 'box',
      layout: 'vertical',
      contents: [{
        type: 'button',
        action: { type: 'uri', label: actionLabel, uri: actionUrl },
        style: 'primary',
        color: '#4B4C6A',
        height: 'sm',
      }],
    }
  }

  return sendLineFlex(userId, title + ': ' + body.slice(0, 60), bubble)
}

// ── Core push message function ──────────────────────────────
async function sendLinePush(
  userId: string,
  messages: Array<Record<string, unknown>>
): Promise<SendResult> {
  const token = process.env.LINE_CHANNEL_TOKEN
  if (!token) return { ok: false, error: 'Missing LINE_CHANNEL_TOKEN' }

  try {
    const res = await fetch(`${API_BASE}/message/push`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: userId,
        messages,
      }),
    })

    if (res.ok) {
      return { ok: true, messageId: `line_${Date.now()}` }
    }

    const data = await res.json().catch(() => ({}))
    return {
      ok: false,
      error: (data as Record<string, string>).message || `HTTP ${res.status}`,
    }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}

// ── Verify LINE webhook signature ───────────────────────────
export function verifyLineSignature(
  body: string,
  signature: string
): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET
  if (!secret) return false
  const hash = crypto
    .createHmac('SHA256', secret)
    .update(body)
    .digest('base64')
  return hash === signature
}

// ── Get user profile (to grab display name) ─────────────────
export async function getLineProfile(
  userId: string
): Promise<{ displayName: string; pictureUrl?: string } | null> {
  const token = process.env.LINE_CHANNEL_TOKEN
  if (!token) return null

  try {
    const res = await fetch(`${API_BASE}/profile/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!res.ok) return null
    return await res.json() as { displayName: string; pictureUrl?: string }
  } catch {
    return null
  }
}
