import { SITE_CONFIG } from '@/lib/constants'

const BASE_URL = SITE_CONFIG.url

/**
 * Serialize a JSON-LD schema for safe embedding inside a <script> tag.
 *
 * Without this, a CMS-driven string containing `</script>` (or U+2028 / U+2029)
 * could break out of the JSON-LD block and inject arbitrary HTML/JS.
 * We escape the four characters that can terminate or alter a JSON string
 * once it lands inside an HTML <script> context.
 */
function safeJsonLd(schema: object): string {
  return JSON.stringify(schema)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function OrganizationJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Blackhorn Wealth Management',
    legalName: 'Blackhorn Wealth Management Limited',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.jpg`,
    image: `${BASE_URL}/og-image.jpg`,
    description: SITE_CONFIG.tagline,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Room 705-708, 7/F, Bank of America Tower, 12 Harcourt Road',
      addressLocality: 'Central',
      addressRegion: 'Hong Kong',
      addressCountry: 'HK',
    },
    sameAs: [SITE_CONFIG.linkedin],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}

export function FinancialServiceJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    name: 'Blackhorn Wealth Management',
    url: BASE_URL,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    description:
      'An independent wealth management firm based in Hong Kong, providing best-in-class solutions for discerning families and institutions.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Room 705-708, 7/F, Bank of America Tower, 12 Harcourt Road',
      addressLocality: 'Central',
      addressRegion: 'Hong Kong',
      addressCountry: 'HK',
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    currenciesAccepted: 'HKD, USD',
    priceRange: '$$$$',
    areaServed: {
      '@type': 'Place',
      name: 'Hong Kong',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}

interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(schema) }}
    />
  )
}
