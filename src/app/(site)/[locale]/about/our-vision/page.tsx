import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations, getLocale } from 'next-intl/server'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import AboutSectionNav from '@/components/about/AboutSectionNav'
import { fetchSiteSettings, getHeroImage, fetchOurVision } from '@/lib/sanity/fetch'
import { localized, localizedBlocks } from '@/lib/i18n-utils'
import { PortableTextBlock } from 'sanity'
import { PortableText, } from 'next-sanity'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('visionPage')
  return {
    title: `${t('title')} | Blackhorn Wealth Management`,
    description: t('heroHeading'),
  }
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p>
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-medium text-light-text">{children}</strong>
    ),
  },
}

export default async function OurVisionPage() {
  const t = await getTranslations('visionPage')
  const ta = await getTranslations('about')
  const tc = await getTranslations('common')
  const locale = await getLocale()
  const settings = await fetchSiteSettings()
  const heroImage = getHeroImage(settings, 'about-our-vision')
  const ourVision = await fetchOurVision()

  const herolabel = localized(ourVision, 'heroLabel', locale)
  const heroHeading = localized(ourVision, 'heroMessage', locale)
  const heroSubtext = localized(ourVision, 'heroSubText', locale)
  const richContent = localizedBlocks(ourVision, 'content', locale) as
    | PortableTextBlock[]
  const visionImage = ourVision?.image_url

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: tc('home'), href: '/' },
          { name: ta('heroLabel'), href: '/about' },
          { name: t('title'), href: '/about/our-vision' },
        ]}
      />
      <main className="min-h-screen bg-white">
        {/* Hero — dark with photo overlay */}
        <section className="relative border-b border-gold/6 pb-20 pt-32">
          <Image
            src={heroImage?.src ?? "/images/redesign/about-our-vision.png"}
            alt="Victoria Harbour, Hong Kong"
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs font-bold uppercase tracking-widest text-brand-peach text-shadow-hero">
                {herolabel}
              </p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h1 className="mt-6 max-w-3xl font-serif text-3xl font-light leading-tight text-light text-shadow-hero md:text-4xl lg:text-5xl">
                {heroHeading}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-white/80 text-shadow-hero">
                {heroSubtext}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* ─── Section Menu Bar ──────────────────────────────────────── */}
        <AboutSectionNav />

        {/* Content — two-column: text + placeholder photo */}
        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[3fr_2fr]">
            {/* Text column */}
            <FadeIn>
              <div className="space-y-6 font-sans text-base font-light leading-[1.85] text-light-text-secondary">
                <PortableText
                  value={richContent?.length > 0 ? richContent : []}
                  components={portableTextComponents}
                />
              </div>
            </FadeIn>

            {/* Photo */}
            <FadeIn delay={0.2} className="hidden lg:block">
              <div className="sticky top-32 aspect-[3/4] w-full overflow-hidden border border-light-border bg-white">
                <Image
                  src={visionImage? visionImage : ""}
                  alt="Crystal ball reflecting Hong Kong's Victoria Harbour skyline at dusk"
                  fill
                  className="object-cover"
                  quality={85}
                  sizes="(max-width: 1024px) 0px, 40vw"
                />
              </div>
            </FadeIn>
          </div>
        </section>

        <ContactCTA />
      </main>
    </>
  )
}
