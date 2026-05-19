import Image from 'next/image'
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import { PortableText, PortableTextBlock } from '@portabletext/react'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import AboutSectionNav from '@/components/about/AboutSectionNav'
import { fetchSiteSettings, fetchOurLocation, fetchAboutPillarBySlug, getHeroImage, getHeroText } from '@/lib/sanity/fetch'
import { localizedBlocks } from '@/lib/i18n-utils'

/* Portable Text components for location page CMS content */
const portableTextComponents = {
  block: {
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="font-sans text-[11px] uppercase tracking-widest text-gold-dark">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="font-serif text-xl font-light text-light-text pt-2">
        {children}
      </h3>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="font-sans text-sm font-light leading-relaxed text-light-text-secondary">
        {children}
      </p>
    ),
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about')
  return {
    title: `${t('locationTitle')} | Blackhorn Wealth Management`,
    description: t('locationAddress'),
  }
}

export default async function OurLocationPage() {
  const t = await getTranslations('about')
  const tc = await getTranslations('common')
  const locale = await getLocale()
  const settings = await fetchSiteSettings()
  const ourLocation = await fetchOurLocation()
  const heroImage = getHeroImage(settings, 'about-our-location')
  const heroText = getHeroText(settings, 'about-our-location', locale)

  // Fetch CMS rich text content for this page
  const pillar = await fetchAboutPillarBySlug('our-location')
  const cmsContent = pillar
    ? (localizedBlocks(pillar, 'content', locale) as PortableTextBlock[] | undefined)
    : undefined

  // Use siteSettings values with i18n/hardcoded fallbacks
  const phone = ourLocation?.phone || '(852) 2709 1388'
  const email = ourLocation?.email || 'info@blackhorngrp.com'
  const address =
    locale === 'zh-hant'
      ? settings?.address_zh || t('locationAddress')
      : settings?.address || t('locationAddress')

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tc('home'), href: '/' },
          { name: t('heroLabel'), href: '/about' },
          { name: t('locationTitle'), href: '/about/our-location' },
        ]}
      />
      <main className="min-h-screen bg-dark">
        {/* Hero */}
        <section className="relative border-b border-gold/6 pb-16 pt-32">
          <Image
            src={heroImage?.src ?? "/images/redesign/about-our-location-contact.png"}
            alt={t('locationTitle')}
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-peach text-shadow-hero">
                {t('heroLabel')}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-light text-light text-shadow-hero md:text-5xl lg:text-6xl">
                {heroText?.heading ?? t('locationTitle')}
              </h1>
              {heroText?.subtext && (
                <p className="mt-6 max-w-2xl font-sans text-base font-light leading-relaxed text-white text-shadow-hero">
                  {heroText.subtext}
                </p>
              )}
              {!heroText?.subtext && <div className="mt-6 h-[0.5px] w-10 bg-gold" />}
            </FadeIn>
          </div>
        </section>

        {/* ─── Section Menu Bar ──────────────────────────────────────── */}
        <AboutSectionNav />

        {/* Location content */}
        <section className="bg-brand-offwhite py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
            {/* Map */}
            <FadeIn>
              <div className="aspect-[4/3] overflow-hidden border border-light-border bg-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.9273867480492!2d114.1630206!3d22.2807403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3404010f3aa8ec23%3A0x5895f139cb62a354!2sBank%20of%20America%20Tower!5e0!3m2!1sen!2shk!4v1773826467966!5m2!1sen!2shk"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(20%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('locationTitle')}
                />
              </div>
            </FadeIn>

            {/* Contact details */}
            <FadeIn delay={0.15}>
              {cmsContent && cmsContent.length > 0 ? (
                <div className="space-y-6">
                  <PortableText
                    value={cmsContent}
                    components={portableTextComponents}
                  />
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Address */}
                  <div>
                    <h2 className="font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                      {tc('address')}
                    </h2>
                    <p className="mt-3 font-serif text-lg font-light text-light-text">
                      {settings?.companyName || 'Blackhorn Wealth Management Limited'}
                    </p>
                    <p className="mt-2 font-sans text-sm font-light leading-relaxed text-light-text-secondary">
                      {address}
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <h2 className="font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                      {tc('phone')}
                    </h2>
                    <a
                      href={`tel:${phone.replace(/[\s()-]/g, '')}`}
                      className="mt-3 block font-sans text-sm text-light-text transition-colors hover:text-gold-dark"
                    >
                      {phone}
                    </a>
                  </div>

                  {/* Email */}
                  <div>
                    <h2 className="font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                      {tc('email')}
                    </h2>
                    <a
                      href={`mailto:${email}`}
                      className="mt-3 block font-sans text-sm text-light-text transition-colors hover:text-gold-dark"
                    >
                      {email}
                    </a>
                  </div>

                  {/* Office hours */}
                  <div>
                    <h2 className="font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                      {tc('office')}
                    </h2>
                    <p className="mt-3 font-sans text-sm font-light text-light-text-secondary">
                      {t('locationOfficeHours')}
                    </p>
                  </div>
                </div>
              )}
            </FadeIn>
          </div>
        </section>

        <ContactCTA />
      </main>
    </>
  )
}
