import { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import Accordion from '@/components/ui/Accordion'
import { services } from '@/lib/services'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import ServiceSectionNav from '@/components/services/ServiceSectionNav'

interface ServicePageLayoutProps {
  title: string
  overline: string
  subtitle: string
  currentSlug: string
  heroImageSrc?: string
  /** Use object-contain instead of object-cover (for logos rather than photos) */
  heroImageContain?: boolean
  children: ReactNode
  /** Accordion items from CMS features — rendered below children */
  accordionItems?: { title: string; content: string }[]
  /** Infographic image URL from Sanity */
  infographicUrl?: string
  /** Infographic heading label */
  infographicLabel?: string
  /** Infographic alt text */
  infographicAlt?: string
  /** Body text font size */
  bodyFontSize?: 'small' | 'medium' | 'large'
  /** Infographic display size */
  infographicSize?: 'small' | 'medium' | 'large' | 'full'
  /** Ecosystem partner logos with links */
  ecosystemPartners?: Array<{ name: string; url?: string; logoUrl?: string }>
  /** Heading above the partner logos grid */
  ecosystemPartnersLabel?: string
}

export default function ServicePageLayout({
  title,
  overline,
  subtitle,
  currentSlug,
  heroImageSrc,
  heroImageContain = false,
  children,
  accordionItems,
  bodyFontSize = 'medium',
  infographicUrl,
  infographicLabel,
  infographicAlt,
  infographicSize = 'full',
  ecosystemPartners,
  ecosystemPartnersLabel,
}: ServicePageLayoutProps) {
  const otherServices = services.filter((s) => s.slug !== currentSlug)

  const bodyFontSizeClass: Record<string, string> = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }

  const infographicSizeClass: Record<string, string> = {
    small: 'w-full sm:max-w-[400px]',
    medium: 'w-full sm:max-w-[600px]',
    large: 'w-full sm:max-w-[800px]',
    full: 'w-full',
  }

  return (
    <>
    <BreadcrumbJsonLd
      items={[
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/services' },
        { name: title, href: `/services/${currentSlug}` },
      ]}
    />
    <main className="min-h-screen bg-dark">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/6 bg-dark-section">
        {/* Mobile: when heroImageContain is true (logo image), stack image as
            a banner above the text instead of cramming it into a narrow
            section where object-contain renders as a thin horizontal strip.
            Photos (object-cover) keep the full-bleed background everywhere. */}
        {heroImageSrc && heroImageContain && (
          <div className="md:hidden">
            {/* Spacer clears the fixed navbar; smaller aspect keeps banner
                visually balanced with the text section below. */}
            <div className="h-16 bg-dark" />
            <div className="relative aspect-[2/1] w-full bg-dark">
              <Image
                src={heroImageSrc}
                alt=""
                fill
                className="object-contain object-center"
                priority
                quality={85}
                sizes="100vw"
              />
            </div>
          </div>
        )}

        {/* Desktop (md+) — full-bleed background image as before. For
            cover-mode (photos), this also serves mobile. */}
        {heroImageSrc && (
          <Image
            src={heroImageSrc}
            alt=""
            fill
            className={
              heroImageContain
                ? 'hidden object-contain object-center md:block'
                : 'object-cover'
            }
            priority
            quality={85}
            sizes="100vw"
          />
        )}

        {/* Inner content. Cover-mode pages need full pt-32 navbar clearance
            on mobile (text overlays photo). Contain-mode mobile gets less
            top padding because the banner above already provides the gap. */}
        <div
          className={`relative z-10 mx-auto max-w-7xl px-6 pb-16 ${
            heroImageContain ? 'pt-6 md:pt-32' : 'pt-32'
          }`}
        >
          <FadeIn>
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-muted">
              <Link
                href="/"
                className="transition-colors duration-300 hover:text-gold"
              >
                Home
              </Link>
              <span className="text-gold/30">/</span>
              <Link
                href="/services"
                className="transition-colors duration-300 hover:text-gold"
              >
                Services
              </Link>
              <span className="text-gold/30">/</span>
              <span className="text-white/50">{title}</span>
            </nav>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="font-sans text-xs uppercase tracking-widest text-gold text-shadow-hero">
              {overline}
            </p>
            <h1 className="mt-4 font-serif text-4xl font-light text-light text-shadow-hero md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-white text-shadow-hero">
              {subtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ─── Section Menu Bar ──────────────────────────────────────── */}
      <ServiceSectionNav />

      {/* Content + Sidebar */}
      <section className="bg-light-bg py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_300px]">
          {/* Main content */}
          <FadeIn delay={0.15}>
            <div className={`max-w-[800px] space-y-6 font-sans leading-[1.85] text-light-text-secondary ${bodyFontSizeClass[bodyFontSize]}`}>
              {children}

              {/* Accordion (from CMS Key Features) */}
              {accordionItems && accordionItems.length > 0 && (
                <div className="pt-4">
                  <Accordion items={accordionItems} defaultOpen={0} variant="light" />
                </div>
              )}

              {/* Infographic (from Sanity) */}
              {infographicUrl && (
                <div className="pt-8">
                  {infographicLabel && (
                    <h3 className="mb-4 font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                      {infographicLabel}
                    </h3>
                  )}
                  <Image
                    src={infographicUrl}
                    alt={infographicAlt || 'Service overview'}
                    width={1440}
                    height={800}
                    className={`h-auto ${infographicSizeClass[infographicSize] || 'w-full'}`}
                    quality={90}
                  />
                </div>
              )}

              {/* Ecosystem Partner Logos */}
              {ecosystemPartners && ecosystemPartners.length > 0 && (
                <div className="pt-10">
                  {ecosystemPartnersLabel && (
                    <h3 className="mb-6 font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                      {ecosystemPartnersLabel}
                    </h3>
                  )}
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {ecosystemPartners.map((partner) => {
                      const inner = (
                        <div className="flex aspect-[3/2] items-center justify-center border border-light-border bg-white p-3 shadow-sm transition-all duration-300 hover:border-gold/30 hover:shadow-md">
                          {partner.logoUrl ? (
                            <Image
                              src={partner.logoUrl}
                              alt={partner.name}
                              width={120}
                              height={60}
                              className="max-h-10 w-auto object-contain"
                            />
                          ) : (
                            <span className="font-sans text-[10px] font-medium text-light-text-secondary">
                              {partner.name}
                            </span>
                          )}
                        </div>
                      )
                      return partner.url ? (
                        <a
                          key={partner.name}
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={partner.name}
                        >
                          {inner}
                        </a>
                      ) : (
                        <div key={partner.name} title={partner.name}>
                          {inner}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Sidebar */}
          <FadeIn delay={0.25} direction="left">
            <aside className="space-y-8">
              {/* Other Services nav */}
              <div className="border border-light-border bg-white p-6 shadow-sm">
                <h3 className="font-sans text-[11px] uppercase tracking-widest text-gold-dark">
                  Other Services
                </h3>
                <ul className="mt-5 space-y-4">
                  {otherServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={s.href}
                        className="group flex items-center gap-3 font-sans text-sm text-light-text-secondary transition-colors duration-300 hover:text-light-text"
                      >
                        <span className="text-gold-dark/40 transition-colors duration-300 group-hover:text-gold-dark">
                          {s.icon}
                        </span>
                        {s.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA card */}
              <div className="border border-light-border bg-white p-6 shadow-sm">
                <h3 className="font-serif text-lg font-light text-light-text">
                  Ready to get started?
                </h3>
                <p className="mt-3 font-sans text-xs leading-relaxed text-light-text-secondary">
                  Speak with our team to explore how we can tailor our services
                  to your needs.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex items-center justify-center bg-gold px-6 py-2.5 font-sans text-xs uppercase tracking-widest text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
                >
                  Contact Us
                </Link>
              </div>
            </aside>
          </FadeIn>
        </div>
      </section>

      {/* Contact CTA */}
      <ContactCTA />
    </main>
    </>
  )
}
