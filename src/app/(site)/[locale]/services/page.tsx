import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import ServiceSectionNav from '@/components/services/ServiceSectionNav'
import { getTranslations, getLocale } from 'next-intl/server'
import { fetchSiteSettings, getHeroImage, getHeroText } from '@/lib/sanity/fetch'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('servicesTitle'),
    description: t('servicesDescription'),
  }
}

const serviceCards = [
  {
    titleKey: 'sectionWM',
    descKey: 'wmHeroSubtext',
    href: '/services/wealth-management',
    icon: '›',
  },
  {
    titleKey: 'sectionFO',
    descKey: 'foHeroSubtext',
    href: '/services/family-office',
    icon: '›',
  },
  {
    titleKey: 'sectionLP',
    descKey: 'legacyPlanningDesc',
    href: '/services/estate-legacy',
    icon: '›',
  },
  {
    titleKey: 'sectionCTFS',
    descKey: 'ctfsHeroSubtext',
    href: '/services/ctfs-ecosystem',
    icon: '›',
  },
]

export default async function ServicesPage() {
  const tHub = await getTranslations('servicesHub')
  const tc = await getTranslations('common')
  const locale = await getLocale()
  const settings = await fetchSiteSettings()
  const heroImage = getHeroImage(settings, 'services')
  const heroText = getHeroText(settings, 'services', locale)


  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tc('home'), href: '/' },
          { name: tHub('overline'), href: '/services' },
        ]}
      />
      <main className="min-h-screen bg-dark">
        {/* Hero */}
        <section className="relative border-b border-gold/6 pb-20 pt-32">
          <Image
            src={heroImage?.src ?? "/images/redesign/services.png"}
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
                {tHub('overline')}
              </p>
              <h1 className="mt-4 max-w-3xl font-serif text-4xl font-light text-light text-shadow-hero md:text-5xl lg:text-6xl">
                {heroText?.heading ?? tHub('heroHeading')}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-white text-shadow-hero">
                {heroText?.subtext ?? tHub('heroSubtext')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ─── Section Menu Bar ──────────────────────────────────────── */}
        <ServiceSectionNav />

        {/* 2-card overview */}
        <section className="bg-brand-offwhite py-20">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2">
            {serviceCards.map((card, i) => (
              <FadeIn key={card.href} delay={i * 0.12}>
                <Link href={card.href} className="group block h-full">
                  <div className="flex h-full flex-col border border-light-border bg-white p-10 shadow-sm transition-all duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:border-gold/30 hover:shadow-md">
                    <span className="text-3xl text-gold-dark">{card.icon}</span>
                    <h2 className="mt-6 font-serif text-2xl font-light text-light-text transition-colors duration-300 group-hover:text-gold">
                      {tHub(card.titleKey)}
                    </h2>
                    <p className="mt-4 flex-1 font-sans text-sm font-light leading-relaxed text-light-text-secondary">
                      {tHub(card.descKey)}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold-dark/60 transition-colors duration-300 group-hover:text-gold-dark">
                      {tc('learnMore')} ›
                    </span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </section>

        <ContactCTA />
      </main>
    </>
  )
}
