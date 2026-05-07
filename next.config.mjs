import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Stop browsers sniffing MIME types
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Only send referrer to same origin
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable sensitive browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HSTS — force HTTPS for 1 year once live on production
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          // Content Security Policy
          // 'unsafe-inline' required for Tailwind + Next.js inline styles/scripts
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://cdn.sanity.io",
              "connect-src 'self' https://cdn.sanity.io https://*.sanity.io https://api.resend.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  async redirects() {
    return [
      // Thin placeholder page — redirect to the real service page
      {
        source: '/family-office',
        destination: '/services/family-office',
        permanent: true,
      },
      {
        source: '/en/family-office',
        destination: '/en/services/family-office',
        permanent: true,
      },
      {
        source: '/zh-hant/family-office',
        destination: '/zh-hant/services/family-office',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/insights/news',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/insights/news/:slug',
        permanent: true,
      },
      {
        source: '/events',
        destination: '/insights/events',
        permanent: true,
      },
      {
        source: '/press',
        destination: '/insights/press',
        permanent: true,
      },
      {
        source: '/press/:slug',
        destination: '/insights/press/:slug',
        permanent: true,
      },
      // Old Wix site blog URLs
      {
        source: '/post/:slug',
        destination: '/insights/news/:slug',
        permanent: true,
      },
      {
        source: '/news',
        destination: '/insights/news',
        permanent: true,
      },
    ]
  },
}

export default withNextIntl(nextConfig)
