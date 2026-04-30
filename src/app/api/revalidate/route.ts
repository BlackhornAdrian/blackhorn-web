import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

/**
 * On-demand revalidation webhook for Sanity CMS.
 *
 * Setup in Sanity → Manage → API → Webhooks:
 *   URL:       https://blackhorn-web.vercel.app/api/revalidate?secret=YOUR_SECRET
 *   Trigger:   Create, Update, Delete
 *   Filter:    (leave blank for all document types)
 *   Projection: {_type}
 *   Method:    POST
 */
export async function POST(req: NextRequest) {
  // ── Fail-closed auth ──────────────────────────────────────────────
  // The webhook MUST have a secret configured; otherwise refuse to run.
  // (Previous behaviour silently allowed every POST when the env var was
  // unset, which let any third party trigger a full-site revalidation.)
  const expected = process.env.SANITY_REVALIDATE_SECRET
  if (!expected) {
    console.error(
      '[revalidate] SANITY_REVALIDATE_SECRET is not configured. Refusing request.'
    )
    return NextResponse.json(
      { message: 'Webhook not configured' },
      { status: 503 }
    )
  }

  // Prefer Authorization header; fall back to ?secret= query param for
  // backwards compatibility with the existing Sanity webhook setup.
  const authHeader = req.headers.get('authorization') ?? ''
  const bearerSecret = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null
  const secret = bearerSecret ?? req.nextUrl.searchParams.get('secret')

  if (secret !== expected) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const type = body._type as string | undefined

    if (!type) {
      // No type info — revalidate everything
      revalidatePath('/', 'layout')
      return NextResponse.json({ revalidated: true, scope: 'all' })
    }

    // Tag-based revalidation (matches tags passed in safeFetch)
    revalidateTag(type)

    // Also revalidate specific paths based on document type
    switch (type) {
      case 'siteSettings':
        // Settings affect every page (hero, footer, etc.)
        revalidatePath('/', 'layout')
        break
      case 'teamMember':
        revalidatePath('/en/about', 'layout')
        revalidatePath('/zh-hant/about', 'layout')
        break
      case 'service':
        revalidatePath('/en/services', 'layout')
        revalidatePath('/zh-hant/services', 'layout')
        // Also revalidate all individual service pages
        revalidatePath('/en/services/wealth-management', 'page')
        revalidatePath('/zh-hant/services/wealth-management', 'page')
        revalidatePath('/en/services/family-office', 'page')
        revalidatePath('/zh-hant/services/family-office', 'page')
        revalidatePath('/en/services/ctfs-ecosystem', 'page')
        revalidatePath('/zh-hant/services/ctfs-ecosystem', 'page')
        revalidatePath('/en/services/investment-advisory', 'page')
        revalidatePath('/zh-hant/services/investment-advisory', 'page')
        revalidatePath('/en/services/estate-legacy', 'page')
        revalidatePath('/zh-hant/services/estate-legacy', 'page')
        revalidatePath('/en/services/real-estate-financing', 'page')
        revalidatePath('/zh-hant/services/real-estate-financing', 'page')
        revalidatePath('/en', 'page')
        revalidatePath('/zh-hant', 'page')
        break
      case 'pressArticle':
        revalidatePath('/en/insights/press', 'page')
        revalidatePath('/zh-hant/insights/press', 'page')
        revalidatePath('/en/insights', 'page')
        revalidatePath('/zh-hant/insights', 'page')
        revalidatePath('/en', 'page')
        revalidatePath('/zh-hant', 'page')
        break
      case 'blogPost':
        revalidatePath('/en/insights/news', 'layout')
        revalidatePath('/zh-hant/insights/news', 'layout')
        revalidatePath('/en/insights', 'page')
        revalidatePath('/zh-hant/insights', 'page')
        revalidatePath('/en', 'page')
        revalidatePath('/zh-hant', 'page')
        break
      case 'award':
        revalidatePath('/en/awards', 'page')
        revalidatePath('/zh-hant/awards', 'page')
        revalidatePath('/en', 'page')
        revalidatePath('/zh-hant', 'page')
        break
      case 'event':
        revalidatePath('/en/insights/events', 'layout')
        revalidatePath('/zh-hant/insights/events', 'layout')
        revalidatePath('/en/insights', 'page')
        revalidatePath('/zh-hant/insights', 'page')
        revalidatePath('/en', 'page')
        revalidatePath('/zh-hant', 'page')
        break
      case 'careerPosting':
        revalidatePath('/en/careers', 'layout')
        revalidatePath('/zh-hant/careers', 'layout')
        break
      case 'legalPage':
        revalidatePath('/en', 'layout')
        revalidatePath('/zh-hant', 'layout')
        break
      default:
        // Unknown type — revalidate everything
        revalidatePath('/', 'layout')
    }

    return NextResponse.json({ revalidated: true, type })
  } catch {
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 }
    )
  }
}
