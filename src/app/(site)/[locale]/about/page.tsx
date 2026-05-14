import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import AboutSectionNav from '@/components/about/AboutSectionNav'
import { fetchAboutPillars, fetchSiteSettings, getHeroImage, getHeroText } from '@/lib/sanity/fetch'
import { localized } from '@/lib/i18n-utils'

/* Hardcoded fallback if Sanity is empty */
const fallbackCards = [
  { titleKey: 'sectionVision', descKey: 'navVisionDesc', href: '/about/our-vision' },
  { titleKey: 'sectionTeam', descKey: 'navTeamDesc', href: '/about/leadership' },
  { titleKey: 'sectionAwards', descKey: 'navAwardsDesc', href: '/awards' },
  { titleKey: 'sectionLocation', descKey: 'navLocationDesc', href: '/about/our-location' },
]

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    openGraph: {
      title: t('aboutTitle'),
      description: t('aboutDescription'),
    },
  }
}

export default async function AboutPage() {
  const t = await getTranslations('about')
  const tc = await getTranslations('common')
  const locale = await getLocale()
  const [cmsPillars, settings] = await Promise.all([
    fetchAboutPillars(),
    fetchSiteSettings(),
  ])
  const heroImage = getHeroImage(settings, 'about')
  const heroText = getHeroText(settings, 'about', locale)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tc('home'), href: '/' },
          { name: t('heroLabel'), href: '/about' },
        ]}
      />
      <main className="min-h-screen bg-white">
        {/* ─── Hero ──────────────────────────────────────────────────── */}
        <section className="relative border-b border-gold/6 pb-20 pt-32">
          <Image
            src={heroImage?.src ?? "/images/redesign/about-main.png"}
            alt="Victoria Harbour, Hong Kong"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-peach text-shadow-hero">
                {t('heroLabel')}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-6 max-w-3xl font-serif text-4xl font-light leading-tight text-light text-shadow-hero md:text-5xl lg:text-6xl">
                {heroText?.heading ?? t('heroHeading')}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-8 max-w-2xl font-sans text-lg font-light leading-relaxed text-white text-shadow-hero">
                {heroText?.subtext ?? t('heroSubtext')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ─── Section Menu Bar ──────────────────────────────────────── */}
        <AboutSectionNav />

        {/* ─── Navigation Cards ─────────────────────────────────────── */}
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {cmsPillars.length > 0
                ? cmsPillars.map((pillar, i) => (
                    <FadeIn key={pillar._id} delay={0.1 + i * 0.08}>
                      <Link
                        href={pillar.href || '#'}
                        className="group block border border-light-border bg-white p-8 shadow-sm transition-all duration-[450ms] hover:border-gold/30 hover:shadow-md"
                      >
                        <h2 className="font-serif text-xl font-light text-light-text transition-colors duration-300 group-hover:text-gold-dark">
                          {localized(pillar, 'title', locale)}
                        </h2>
                        <p className="mt-3 font-sans text-sm font-light leading-relaxed text-light-text-secondary">
                          {localized(pillar, 'description', locale)}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold-dark/60 transition-all duration-300 group-hover:gap-3 group-hover:text-gold-dark">
                          {tc('learnMore')} ›
                        </span>
                      </Link>
                    </FadeIn>
                  ))
                : fallbackCards.map((card, i) => (
                    <FadeIn key={card.titleKey} delay={0.1 + i * 0.08}>
                      <Link
                        href={card.href}
                        className="group block border border-light-border bg-white p-8 shadow-sm transition-all duration-[450ms] hover:border-gold/30 hover:shadow-md"
                      >
                        <h2 className="font-serif text-xl font-light text-light-text transition-colors duration-300 group-hover:text-gold-dark">
                          {t(card.titleKey)}
                        </h2>
                        <p className="mt-3 font-sans text-sm font-light leading-relaxed text-light-text-secondary">
                          {t(card.descKey)}
                        </p>
                        <span className="mt-5 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold-dark/60 transition-all duration-300 group-hover:gap-3 group-hover:text-gold-dark">
                          {tc('learnMore')} ›
                        </span>
                      </Link>
                    </FadeIn>
                  ))}
            </div>
          </div>
        </section>

        {/* ─── Contact CTA ──────────────────────────────────────────── */}
        <ContactCTA />
      </main>
    </>
  )
}
