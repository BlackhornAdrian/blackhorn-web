import { createClient } from '@sanity/client'
import { sanityConfig } from './config'

// useCdn: true for published content — faster cold TTFB via Sanity's CDN.
// ISR revalidation tags in fetch.ts handle cache invalidation on publish.
export const sanityClient = createClient({
  ...sanityConfig,
  useCdn: true,
})

// Write client for migration only — never expose token to frontend
export const sanityWriteClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
