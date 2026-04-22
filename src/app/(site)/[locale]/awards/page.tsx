import type { Metadata } from 'next'
import Image from 'next/image'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import AboutSectionNav from '@/components/about/AboutSectionNav'
import AwardRow from '@/components/awards/AwardRow'
import { getTranslations, getLocale } from 'next-intl/server'
import { fetchAwards, fetchSiteSettings, getHeroImage, getHeroText } from '@/lib/sanity/fetch'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('awardsTitle'),
    description: t('awardsDescription'),
  }
}

interface Award {
  year: string
  org: string
  title: string
  context: string
  images?: { src: string; alt: string }[]
}

// Hardcoded fallback — used when CMS is empty
const fallbackAwards: Award[] = [
  {
    year: '2024',
    org: 'LGT Private Banking',
    title: 'Top Valued Business Partner',
    context:
      'LGT Private Banking, one of the world\u2019s largest family-owned private banking groups, recognises its most valued external asset management partners annually.',
    images: [
      { src: '/images/awards/lgt-trophy-2024.webp', alt: 'LGT Top Valued Business Partner 2024 trophy at Blackhorn office' },
    ],
  },
  {
    year: '2024',
    org: 'Asian Fund Distributors',
    title: 'Gold Award \u2014 Outstanding Wealth Management',
    context:
      'Asian Fund Distributors recognises excellence among independent asset managers and wealth advisory firms across the Asia-Pacific region.',
  },
  {
    year: '2023',
    org: 'UBS GFIM HK',
    title: 'Outstanding Business Partner',
    context:
      'UBS Global Financial Intermediaries Management (GFIM) recognises its top-performing external asset management partners in Hong Kong.',
    images: [
      { src: '/images/awards/ubs-gfim-2023.webp', alt: 'UBS GFIM Outstanding Business Partner 2023 plaque at Blackhorn office' },
    ],
  },
  {
    year: '2023',
    org: 'WealthBriefingAsia',
    title: 'Best Independent Wealth Manager \u2014 Hong Kong',
    context:
      'The WealthBriefingAsia Awards programme is one of the most prestigious in the Asian wealth management industry, recognising outstanding firms across the region.',
    images: [
      { src: '/images/awards/wba-banner-2022.webp', alt: 'WealthBriefingAsia award announcement banner' },
    ],
  },
  {
    year: '2022',
    org: 'WealthBriefingAsia EAM Awards',
    title: 'Newcomer (Winner)',
    context:
      'Blackhorn was recognised as the top newcomer in the external asset management space at the WealthBriefingAsia EAM Awards.',
  },
  {
    year: '2022',
    org: 'WealthBriefingAsia EAM Awards',
    title: 'EAM Based in Hong Kong (Winner)',
    context:
      'Blackhorn also won the category for best external asset manager based in Hong Kong at the same ceremony.',
  },
  {
    year: '2022',
    org: 'Capital CEO',
    title: 'Outstanding CEO Award (Yugi Lee)',
    context:
      'Capital CEO magazine honours leading businesses and executives in Hong Kong. Co-Founder Yugi Lee received the Outstanding CEO Award at the 35th anniversary gala.',
    images: [
      { src: '/images/awards/capital-ceo-yugi-2022.webp', alt: 'Yugi Lee receiving Capital CEO Outstanding CEO Award 2022' },
      { src: '/images/awards/capital-ceo-team-2022.webp', alt: 'Blackhorn team at Capital CEO Awards 2022 gala' },
    ],
  },
  {
    year: '2022',
    org: 'Capital CEO',
    title: 'Merits of Achievement in Banking and Finance',
    context:
      'Capital CEO\u2019s Entrepreneur Nite 2022 recognised Blackhorn\u2019s co-founders Mary Chiu and Yugi Lee for their outstanding contributions to the banking and finance sector.',
    images: [
      { src: '/images/awards/capital-ceo-nite-2022.webp', alt: 'Capital CEO Entrepreneur Nite 2022 award poster' },
    ],
  },
  {
    year: '2022',
    org: 'Asian Private Banker',
    title: 'Independent Asset Manager Award',
    context:
      'Asian Private Banker is the premier publication for the Asia private banking industry. Their IAM awards recognise the most impactful independent firms in the region.',
  },
]

const galleryImages = [
  {
    src: '/images/awards/lgt-trophy-2024.webp',
    alt: 'LGT Top Valued Business Partner 2024 crystal trophy',
  },
  {
    src: '/images/awards/ubs-gfim-2023.webp',
    alt: 'UBS GFIM Outstanding Business Partner 2023 plaque',
  },
  {
    src: '/images/awards/capital-ceo-team-2022.webp',
    alt: 'Blackhorn team at Capital CEO Awards 2022',
  },
  {
    src: '/images/awards/capital-ceo-yugi-2022.webp',
    alt: 'Yugi Lee receiving Capital CEO Outstanding CEO Award 2022',
  },
  {
    src: '/images/awards/capital-ceo-event-poster-2022.webp',
    alt: 'Capital CEO 35th anniversary awards poster',
  },
  {
    src: '/images/awards/wba-banner-2022.webp',
    alt: 'WealthBriefingAsia Awards 2022 announcement banner',
  },
]

export default async function AwardsPage() {
  const t = await getTranslations('awardsPage')
  const settings = await fetchSiteSettings()
  const heroImage = getHeroImage(settings, 'awards')
  const locale = await getLocale()
  const heroText = getHeroText(settings, 'awards', locale)

  // Fetch from CMS; fall back to hardcoded if empty
  const isZh = locale.startsWith('zh')
  const cmsAwards = await fetchAwards()
  const awards: Award[] = cmsAwards.length > 0
    ? cmsAwards.map((a) => ({
        year: String(a.year),
        org: (isZh && a.organization_zh) || a.organization,
        title: (isZh && a.title_zh) || a.title,
        context: (isZh && a.description_zh) || a.description || '',
        ...(a.imageUrl ? { images: [{ src: a.imageUrl, alt: `${a.title} — ${a.organization}` }] } : {}),
      }))
    : fallbackAwards

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Awards & Recognition', href: '/awards' },
        ]}
      />
      <main className="min-h-screen bg-dark">
        {/* Hero */}
        <section className="relative border-b border-gold/6 pb-20 pt-32">
          <Image
            src={heroImage?.src ?? "/images/redesign/service-our-award.png"}
            alt={t('title')}
            fill
            className="object-cover"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs uppercase tracking-widest text-gold text-shadow-hero">
                {t('overline')}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-light text-light text-shadow-hero md:text-5xl lg:text-6xl">
                {heroText?.heading ?? (<>{t('title')}{' '}<span className="italic text-gold">{t('titleHighlight')}</span></>)}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-white text-shadow-hero">
                {heroText?.subtext ?? t('description')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Section Menu Bar */}
        <AboutSectionNav />

        {/* Awards Grid */}
        <section className="bg-light-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="space-y-4">
              {awards.map((award, i) => (
                <FadeIn key={`${award.year}-${award.title}`} delay={i * 0.05}>
                  <AwardRow
                    year={award.year}
                    org={award.org}
                    title={award.title}
                    context={award.context}
                    images={award.images}
                  />
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="border-t border-gold/6 bg-dark-section py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs uppercase tracking-widest text-gold">
                {t('galleryOverline')}
              </p>
              <h2 className="mt-4 font-serif text-3xl font-light text-light">
                {t('galleryTitle')}
              </h2>
              <div className="mt-4 h-[0.5px] w-10 bg-gold" />
            </FadeIn>

            <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3">
              {galleryImages.map((img, i) => (
                <FadeIn key={img.src} delay={i * 0.08}>
                  <div className="group relative aspect-square overflow-hidden border-[0.5px] border-gold/8 bg-dark-card">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <ContactCTA />
      </main>
    </>
  )
}
