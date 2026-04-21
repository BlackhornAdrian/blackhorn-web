import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { getTranslations, getLocale } from 'next-intl/server'
import { fetchSiteSettings, getHeroImage, fetchPressArticles } from '@/lib/sanity/fetch'
import { localized } from '@/lib/i18n-utils'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('pressTitle'),
    description: t('pressDescription'),
  }
}

// Hardcoded fallback articles (used only when Sanity has no press articles)
const fallbackArticles = [
  {
    title: 'Pressing On Toward the Goal — Blackhorn Founder Yugi Lee',
    publication: 'Capital CEO',
    date: 'February 2023',
    image: '/images/press/capital-ceo-interview-2022.webp',
    summary:
      'Capital CEO profiled Yugi Lee as CEO of the Year, covering her journey from founding member of Bank of Shanghai\'s Hong Kong branch to co-founding Blackhorn at age 30.',
    externalUrl: undefined as string | undefined,
  },
  {
    title: 'Blackhorn Family Office — Interview with Mary Chiu & Yugi Lee',
    publication: 'Capital CEO',
    date: 'December 2022',
    image: '/images/press/capital-ceo-family-office-2022.webp',
    summary:
      'Capital CEO interviewed the co-founders on how Blackhorn Family Office serves prominent Hong Kong families with holistic wealth management solutions.',
    externalUrl: undefined as string | undefined,
  },
  {
    title: 'WealthBriefingAsia EAM Awards 2022 — Blackhorn Feature',
    publication: 'Acclaim Magazine (WealthBriefingAsia)',
    date: 'October 2022',
    image: '/images/press/acclaim-cover-2022.webp',
    summary:
      'Acclaim magazine featured Blackhorn following its double win at the WealthBriefingAsia EAM Awards — Newcomer and EAM Based in Hong Kong.',
    externalUrl: undefined as string | undefined,
  },
  {
    title: 'Structured Products Insight — Blackhorn Interview',
    publication: 'SRP Insight',
    date: 'September 2022',
    image: '/images/press/srp-insight-2022.webp',
    summary:
      'SRP Insight interviewed Blackhorn on their approach to structured products and how they leverage multi-bank relationships to deliver institutional-quality solutions.',
    externalUrl: undefined as string | undefined,
  },
  {
    title: 'Yugi Lee — Founders Magazine Cover Story',
    publication: 'Founders Magazine',
    date: 'September 2022',
    image: '/images/press/founders-cover-2022.webp',
    summary:
      'Founders Magazine featured Yugi Lee on its cover, profiling her entrepreneurial journey and vision for building an independent wealth management firm in Hong Kong.',
    externalUrl: undefined as string | undefined,
  },
  {
    title: 'US$1B Hong Kong IAM Eyes Recruiting 20 RMs from Top-Tier PBs by Late 2023',
    publication: 'Asian Private Banker',
    date: 'June 2022',
    image: '/images/press/asian-private-banker-2022.webp',
    summary:
      'Asian Private Banker reported on Blackhorn\'s rapid growth to US$1 billion in AUM and its ambitious plan to recruit 20 relationship managers from top private banks.',
    externalUrl: undefined as string | undefined,
  },
  {
    title: 'Ex-UBS Bankers\u2019 Boutique Aims to Double Assets to $2bn in a Year',
    publication: 'Citywire Asia',
    date: 'June 2022',
    image: '/images/press/citywire-2022.webp',
    summary:
      'Citywire Asia covered Blackhorn\'s launch by former UBS wealth managers and their target to double assets under management within the first year.',
    externalUrl: undefined as string | undefined,
  },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

export default async function PressPage() {
  const t = await getTranslations('pressPage')
  const ti = await getTranslations('insights')
  const locale = await getLocale()
  const settings = await fetchSiteSettings()
  const heroImage = getHeroImage(settings, 'insights-press')

  const cmsArticles = await fetchPressArticles()
  const hasCmsArticles = cmsArticles.length > 0

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Insights', href: '/insights' },
          { name: ti('sectionPress'), href: '/insights/press' },
        ]}
      />
      <main className="min-h-screen bg-dark">
        {/* Hero */}
        <section className="relative border-b border-gold/6 pb-20 pt-32">
          {heroImage?.src && (
            <Image
              src={heroImage.src}
              alt={ti('sectionPress')}
              fill
              className="object-cover"
              priority
              quality={85}
              sizes="100vw"
            />
          )}
          {!heroImage?.src && <div className="absolute inset-0 bg-dark-section" />}
          <div className="relative z-10 mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs uppercase tracking-widest text-gold text-shadow-hero">
                {ti('sectionPress')}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-light text-light text-shadow-hero md:text-5xl lg:text-6xl">
                {ti('pressHero')}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-white text-shadow-hero">
                {ti('pressSubtext')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="bg-light-bg py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {hasCmsArticles
                ? cmsArticles.map((article, i) => {
                    const title = localized(article, 'title', locale)
                    const summary = localized(article, 'summary', locale)
                    const href = article.externalUrl
                      ? article.externalUrl
                      : `/insights/press/${article.slug.current}`
                    const isExternal = !!article.externalUrl

                    const inner = (
                      <div className="group flex h-full flex-col border border-light-border bg-white shadow-sm transition-all duration-[450ms] hover:border-gold/30 hover:shadow-md">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          {article.thumbnailUrl || article.heroImageUrl ? (
                            <Image
                              src={(article.thumbnailUrl || article.heroImageUrl)!}
                              alt={title}
                              fill
                              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-light-bg">
                              <span className="text-2xl text-gold-dark/20">BH</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center gap-3">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-gold-dark">
                              {article.publication}
                            </span>
                            <span className="text-light-text-secondary/20">&middot;</span>
                            <span className="font-sans text-[10px] uppercase tracking-widest text-light-text-secondary">
                              {formatDate(article.publishDate)}
                            </span>
                          </div>
                          <h2 className="mt-3 font-serif text-lg font-light leading-snug text-light-text">
                            {title}
                          </h2>
                          <p className="mt-3 flex-1 font-sans text-xs font-light leading-relaxed text-light-text-secondary line-clamp-3">
                            {summary}
                          </p>
                          <span className="mt-4 inline-block font-sans text-[10px] uppercase tracking-widest text-gold-dark transition-colors duration-300 group-hover:text-gold">
                            {isExternal ? t('viewArticleArrow') : t('readMoreArrow')}
                          </span>
                        </div>
                      </div>
                    )

                    return (
                      <FadeIn key={article._id} delay={i * 0.08}>
                        {isExternal ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block h-full"
                          >
                            {inner}
                          </a>
                        ) : (
                          <Link href={href} className="block h-full">
                            {inner}
                          </Link>
                        )}
                      </FadeIn>
                    )
                  })
                : fallbackArticles.map((article, i) => (
                    <FadeIn key={article.title} delay={i * 0.08}>
                      <div className="flex h-full flex-col border border-light-border bg-white shadow-sm">
                        <div className="relative aspect-[4/3] w-full overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <div className="flex items-center gap-3">
                            <span className="font-sans text-[10px] uppercase tracking-widest text-gold-dark">
                              {article.publication}
                            </span>
                            <span className="text-light-text-secondary/20">&middot;</span>
                            <span className="font-sans text-[10px] uppercase tracking-widest text-light-text-secondary">
                              {article.date}
                            </span>
                          </div>
                          <h2 className="mt-3 font-serif text-lg font-light leading-snug text-light-text">
                            {article.title}
                          </h2>
                          <p className="mt-3 flex-1 font-sans text-xs font-light leading-relaxed text-light-text-secondary line-clamp-3">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
            </div>
          </div>
        </section>

        <ContactCTA />
      </main>
    </>
  )
}
