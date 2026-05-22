import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableTextBlock } from '@portabletext/react'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import Accordion from '@/components/ui/Accordion'
import ServicePortableText from '@/components/services/ServicePortableText'
import ServiceSectionNav from '@/components/services/ServiceSectionNav'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { getTranslations, getLocale } from 'next-intl/server'
import { fetchSiteSettings, fetchServiceBySlug, getHeroImage } from '@/lib/sanity/fetch'
import { localized, localizedBlocks } from '@/lib/i18n-utils'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('servicesTitle'),
    description:
      'Strategic partnerships with major international private banks. Institutional-grade research and portfolio management from Blackhorn in Hong Kong.',
  }
}
// Fallback content sections (used when Sanity has no data)
const fallbackSections = [
  {
    titleKey: 'wmPortfolioManagement',
    descKey: 'wmPortfolioManagementDesc',
    icon: '›',
  },
]

export default async function FamilyOfficePage() {
  const t = await getTranslations('servicesHub')
  const tc = await getTranslations('common')

  const locale = await getLocale()
  const settings = await fetchSiteSettings()
  const heroImage = getHeroImage(settings, 'services-family-office')
  const service = await fetchServiceBySlug('family-office-advisory')

  // Priority: Full Page Content (rich text) > Key Features > hardcoded fallback
  const richContent = localizedBlocks(service, 'content', locale) as
    | PortableTextBlock[]
    | undefined

  // Use CMS title/subtitle if available, otherwise fall back to i18n
  const heroHeading = localized(service, 'title', locale) || t('wmHeroHeading')
  const heroSubtext = localized(service, 'shortDescription', locale) || t('wmHeroSubtext')

  // Use CMS features if available, otherwise fallback to i18n
  const cmsFeatures =
    locale === 'zh-hant' && service?.features_zh?.length
      ? service.features_zh
      : service?.features?.length
        ? service.features
        : null

  // Infographic size
  const infographicSizeClass: Record<string, string> = {
    small: 'max-w-[400px]',
    medium: 'max-w-[600px]',
    large: 'max-w-[800px]',
    full: 'w-full',
  }
  const imgSizeClass = infographicSizeClass[service?.infographicSize || 'full'] || 'w-full'

  const bodyFontSizeClass: Record<string, string> = { small: 'text-sm', medium: 'text-base', large: 'text-lg' }
  const bodySize = bodyFontSizeClass[service?.bodyFontSize || 'medium'] || 'text-base'

  // Build accordion items from CMS features or i18n fallback
  const accordionItems = cmsFeatures
    ? cmsFeatures.map((f: { title: string; description: string }) => ({ title: f.title, content: f.description }))
    : fallbackSections.map((s) => ({ title: t(s.titleKey), content: t(s.descKey) }))

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tc('home'), href: '/' },
          { name: t('overline'), href: '/services' },
          { name: t('sectionWM'), href: '/services/wealth-management' },
        ]}
      />
      <main className="min-h-screen bg-dark">
        {/* Hero */}
        <section className="relative border-b border-gold/6 pb-20 pt-32">
          <Image
            src={heroImage?.src ?? "/images/redesign/service-wealth-management.png"}
            alt=""
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-peach text-shadow-hero">
                {t('overline')}
              </p>
              <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light text-light text-shadow-hero md:text-5xl lg:text-6xl">
                {heroHeading}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-white text-shadow-hero">
                {heroSubtext}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ─── Section Menu Bar ──────────────────────────────────────── */}
        <ServiceSectionNav />

        {/* Full Page Content (rich text from Sanity) */}
        {richContent && (
          <section className="bg-brand-offwhite pb-0 pt-24">
            <div className="mx-auto max-w-7xl px-6">
              <FadeIn delay={0.1}>
                <div className={`max-w-[800px] space-y-6 font-sans leading-[1.85] text-light-text-secondary ${bodySize}`}>
                  <ServicePortableText value={richContent} />
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* Key Features accordion */}
        <section className="bg-brand-offwhite py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <div className="max-w-3xl">
                <Accordion items={accordionItems} defaultOpen={0} variant="light" />
              </div>
            </FadeIn>

            {/* Infographic (from Sanity) */}
            {service?.infographicUrl && (
              <FadeIn delay={0.2}>
                <div className="mt-16">
                  <h2 className="font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                    {(locale === 'zh-hant' && service?.infographicLabel_zh) || service?.infographicLabel || 'Platform Overview'}
                  </h2>
                  <div className="mt-6">
                    <Image
                      src={service.infographicUrl}
                      alt={service?.infographicAlt || 'Wealth Management platform overview'}
                      width={1440}
                      height={800}
                      className={imgSizeClass}
                      quality={90}
                    />
                  </div>
                </div>
              </FadeIn>
            )}
          </div>
        </section>

        <ContactCTA />
      </main>
    </>
  )
}
