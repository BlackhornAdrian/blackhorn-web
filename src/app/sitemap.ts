import type { MetadataRoute } from 'next'
import { fetchBlogPosts, fetchPressArticles, fetchEvents } from '@/lib/sanity/fetch'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blackhorngrp.com'
const LOCALES = ['en', 'zh-hant'] as const

// Pages that exist under the locale prefix
const staticPages = [
  { path: '/',                                  changeFrequency: 'weekly'  as const, priority: 1.0 },
  { path: '/about',                             changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/about/our-vision',                  changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about/our-expertise',               changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about/our-philosophy',              changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about/commitment-to-results',       changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about/partnerships',                changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about/leadership',                  changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about/advisors',                    changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/about/our-location',                changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/services',                          changeFrequency: 'monthly' as const, priority: 0.9 },
  { path: '/services/wealth-management',        changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/services/family-office',            changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/services/ctfs-ecosystem',           changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/services/investment-advisory',      changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/services/estate-legacy',            changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/services/real-estate-financing',    changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/contact',                           changeFrequency: 'monthly' as const, priority: 0.8 },
  { path: '/awards',                            changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/insights',                          changeFrequency: 'weekly'  as const, priority: 0.7 },
  { path: '/insights/news',                     changeFrequency: 'weekly'  as const, priority: 0.7 },
  { path: '/insights/events',                   changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/insights/press',                    changeFrequency: 'monthly' as const, priority: 0.7 },
  { path: '/careers',                           changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/disclaimer',                        changeFrequency: 'yearly'  as const, priority: 0.3 },
  { path: '/terms-and-conditions',              changeFrequency: 'yearly'  as const, priority: 0.3 },
  { path: '/complaint-handling',                changeFrequency: 'yearly'  as const, priority: 0.3 },
  { path: '/privacy-policy',                    changeFrequency: 'yearly'  as const, priority: 0.3 },
  { path: '/important-notice',                  changeFrequency: 'yearly'  as const, priority: 0.3 },
]

/** Build a full URL for a given locale + path.
 *  English default locale has no prefix (localePrefix: 'as-needed').
 */
function buildUrl(locale: string, path: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`
  return `${BASE_URL}${prefix}${path}`
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // ── Static pages (both locales) ────────────────────────────────────────────
  const staticEntries: MetadataRoute.Sitemap = staticPages.flatMap(
    ({ path, changeFrequency, priority }) =>
      LOCALES.map((locale) => ({
        url: buildUrl(locale, path),
        lastModified: now,
        changeFrequency,
        priority,
      }))
  )

  // ── Dynamic routes from Sanity ─────────────────────────────────────────────
  const [blogPosts, pressArticles, events] = await Promise.all([
    fetchBlogPosts(),
    fetchPressArticles(),
    fetchEvents(),
  ])

  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((post) =>
    LOCALES.map((locale) => ({
      url: buildUrl(locale, `/insights/news/${post.slug.current}`),
      lastModified: new Date(post.publishDate),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  const pressEntries: MetadataRoute.Sitemap = pressArticles.flatMap((article) =>
    LOCALES.map((locale) => ({
      url: buildUrl(locale, `/insights/press/${article.slug.current}`),
      lastModified: new Date(article.publishDate),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  const eventEntries: MetadataRoute.Sitemap = events.flatMap((event) =>
    LOCALES.map((locale) => ({
      url: buildUrl(locale, `/insights/events/${event.slug.current}`),
      lastModified: new Date(event.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...staticEntries, ...blogEntries, ...pressEntries, ...eventEntries]
}
