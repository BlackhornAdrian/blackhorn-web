import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Lazy-init so the constructor doesn't throw at build time when env var is absent
let resend: Resend | null = null
function getResend(): Resend {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY)
  return resend
}

// Limits each IP to MAX_REQUESTS per WINDOW_MS.
// Note: serverless instances have separate memory, so this is a per-instance
// guard rather than a global one. For stricter limits use Upstash Redis.
const WINDOW_MS = 60_000
const MAX_REQUESTS = 5
const ipMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = ipMap.get(ip)
  if (!entry || now > entry.resetAt) {
    // Evict stale entry to prevent unbounded map growth
    if (entry) ipMap.delete(ip)
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (entry.count >= MAX_REQUESTS) return true
  entry.count++
  return false
}

// Prevent HTML injection in the email body via user-supplied form fields.
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

interface ContactPayload {
  firstName: string
  lastName: string
  email: string
  phone?: string
  message: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: 'Too many requests. Please try again later.' },
      { status: 429 }
    )
  }

  const contentLength = request.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > 20_000) {
    return NextResponse.json({ message: 'Payload too large.' }, { status: 413 })
  }

  try {
    const body: ContactPayload = await request.json()
    const { firstName, lastName, email, phone, message } = body

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const safeFirst = escapeHtml(firstName.trim())
    const safeLast = escapeHtml(lastName.trim())
    const safeName = `${safeFirst} ${safeLast}`
    const safeEmail = escapeHtml(email.trim())
    const safePhone = phone?.trim() ? escapeHtml(phone.trim()) : null
    const safeMessage = escapeHtml(message.trim()).replace(/\n/g, '<br>')

    await getResend().emails.send({
      from: 'Blackhorn Website <noreply@blackhorngrp.com>',
      to: 'info@blackhorngrp.com',
      replyTo: safeEmail,
      subject: `Website Enquiry from ${safeFirst} ${safeLast}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #1a1a1a; border-bottom: 2px solid #C9A96E; padding-bottom: 12px;">
            New Website Enquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666; width: 140px;">Name</td>
              <td style="padding: 8px 12px;">${safeName}</td>
            </tr>
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Email</td>
              <td style="padding: 8px 12px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
            ${safePhone ? `
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">Phone</td>
              <td style="padding: 8px 12px;">${safePhone}</td>
            </tr>
            ` : ''}
            <tr style="background: #f9f9f9;">
              <td style="padding: 8px 12px; font-weight: bold; color: #666; vertical-align: top;">Message</td>
              <td style="padding: 8px 12px; white-space: pre-wrap;">${safeMessage}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Sent from the Blackhorn Wealth Management website contact form.
          </p>
        </div>
      `,
    })

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    )
  } catch {
    return NextResponse.json(
      { message: 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}
