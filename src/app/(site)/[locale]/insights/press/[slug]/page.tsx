import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations, getLocale } from 'next-intl/server'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { fetchPressArticleBySlug } from '@/lib/sanity/fetch'
import { localized } from '@/lib/i18n-utils'

interface Props {
  params: { slug: string; locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await fetchPressArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: `${article.title} | Blackhorn Wealth Management`,
    description: article.summary,
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function PressArticlePage({ params }: Props) {
  const article = await fetchPressArticleBySlug(params.slug)

  // If article has an externalUrl, it shouldn't have an internal page
  // If not found at all, show 404
  if (!article || article.externalUrl) {
    notFound()
  }

  const locale = await getLocale()
  const t = await getTranslations('insights')

  const title = localized(article, 'title', locale)
  const summary = localized(article, 'summary', locale)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Insights', href: '/insights' },
          { name: 'Press & Coverage', href: '/insights/press' },
          { name: title, href: `/insights/press/${params.slug}` },
        ]}
      />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative border-b border-gold/6 bg-dark-section pb-20 pt-32">
          {article.heroImageUrl && (
            <Image
              src={article.heroImageUrl}
              alt={title}
              fill
              className="object-cover opacity-40"
              priority
              quality={85}
              sizes="100vw"
            />
          )}
          <div className="relative z-10 mx-auto max-w-4xl px-6">
            <FadeIn>
              <Link
                href="/insights/press"
                className="mb-8 inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-widest text-gold/70 transition-colors hover:text-gold"
              >
                ← {t('sectionPress')}
              </Link>
              <p className="font-sans text-xs uppercase tracking-widest text-gold">
                {article.publication}
              </p>
              <h1 className="mt-4 font-serif text-3xl font-light text-light md:text-4xl lg:text-5xl">
                {title}
              </h1>
              <div className="mt-6 flex items-center gap-4 font-sans text-xs text-muted">
                {article.author && <span>{article.author}</span>}
                {article.author && <span className="h-[0.5px] w-4 bg-gold/30" />}
                <span>{formatDate(article.publishDate)}</span>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Article Body */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-3xl px-6">
            <FadeIn>
              {article.thumbnailUrl && (
                <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden border border-light-border">
                  <Image
                    src={article.thumbnailUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}
              <p className="font-sans text-base leading-[1.85] text-light-text-secondary">
                {summary}
              </p>
            </FadeIn>
          </div>
        </section>

        <ContactCTA />
      </main>
    </>
  )
}
