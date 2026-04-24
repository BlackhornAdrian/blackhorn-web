import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import FadeIn from '@/components/ui/FadeIn'
import ContactCTA from '@/components/home/ContactCTA'
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd'
import { getTranslations, getLocale } from 'next-intl/server'
import { fetchEvents, fetchSiteSettings, getHeroImage } from '@/lib/sanity/fetch'
import { localized } from '@/lib/i18n-utils'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('eventsTitle'),
    description: t('eventsDescription'),
  }
}

/* ── Hardcoded fallback (used when CMS is empty) ────────────────────── */

interface FallbackEvent {
  slug: string
  title: string
  date: string
  location: string
  image: string
  description: string
  status: 'past' | 'upcoming'
  featured: boolean
}

function getFallbackEvents(
  t: Awaited<ReturnType<typeof getTranslations<'eventsPage'>>>
): FallbackEvent[] {
  return [
    {
      slug: 'investment-summit-2024',
      title: t('event1Title'),
      date: 'November 2024',
      location: 'Hong Kong',
      image: '/images/events/event-photo-1.webp',
      description: t('event1Desc'),
      status: 'past',
      featured: true,
    },
    {
      slug: 'family-office-summit-2023',
      title: t('event2Title'),
      date: '2023',
      location: 'Hong Kong',
      image: '/images/events/group-event-1.webp',
      description: t('event2Desc'),
      status: 'past',
      featured: false,
    },
  ]
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function formatEventDate(dateString: string) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return dateString
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}

function isPastEvent(dateString: string) {
  const d = new Date(dateString)
  if (isNaN(d.getTime())) return true
  return d < new Date()
}

/* ── Normalised shape used by the template ───────────────────────────── */

interface NormalisedEvent {
  slug: string
  title: string
  date: string
  location: string
  image: string | null
  description: string
  status: 'past' | 'upcoming'
  featured: boolean
}

export default async function EventsPage() {
  const t = await getTranslations('eventsPage')
  const ti = await getTranslations('insights')
  const locale = await getLocale()
  const settings = await fetchSiteSettings()
  const heroImage = getHeroImage(settings, 'insights-events')
  const cmsEvents = await fetchEvents()

  /* Map CMS events → normalised shape, or fall back to hardcoded */
  const events: NormalisedEvent[] =
    cmsEvents.length > 0
      ? cmsEvents.map((e, i) => ({
          slug: e.slug?.current ?? '',
          title: localized(e, 'title', locale),
          date: e.date ? formatEventDate(e.date) : '',
          location: e.location ?? '',
          image: e.heroImageUrl ?? null,
          description: '', // listing only — detail page has full description
          status: e.date ? (isPastEvent(e.date) ? 'past' : 'upcoming') : 'past',
          featured: i === 0, // first (most recent) event is featured
        }))
      : getFallbackEvents(t)

  const featuredEvent = events.find((e) => e.featured)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Insights', href: '/insights' },
          { name: ti('sectionEvents'), href: '/insights/events' },
        ]}
      />
      <main className="min-h-screen bg-dark">
        {/* Hero */}
        <section className="relative border-b border-gold/6 pb-20 pt-32">
          {heroImage?.src && (
            <Image
              src={heroImage.src}
              alt={ti('sectionEvents')}
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
                {ti('sectionEvents')}
              </p>
              <h1 className="mt-4 font-serif text-4xl font-light text-light text-shadow-hero md:text-5xl lg:text-6xl">
                {ti('eventsHero')}
              </h1>
            </FadeIn>
            <FadeIn delay={0.15}>
              <p className="mt-8 max-w-2xl font-sans text-base font-light leading-relaxed text-white text-shadow-hero">
                {ti('eventsSubtext')}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Featured Event */}
        {featuredEvent && (
          <section className="border-b border-light-border bg-light-bg py-20">
            <div className="mx-auto max-w-7xl px-6">
              <FadeIn>
                <div className="grid gap-10 md:grid-cols-2 md:items-center">
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden border border-light-border">
                    {featuredEvent.image ? (
                      <Image
                        src={featuredEvent.image}
                        alt={featuredEvent.title}
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-dark-card">
                        <span className="font-serif text-2xl text-muted">
                          {featuredEvent.title}
                        </span>
                      </div>
                    )}
                    {/* Status badge */}
                    <div className="absolute left-4 top-4">
                      <span className="bg-white/90 border border-light-border px-3 py-1.5 font-sans text-[10px] uppercase tracking-widest text-gold-dark backdrop-blur-sm">
                        {featuredEvent.status === 'past'
                          ? t('pastEvent')
                          : t('upcoming')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-gold-dark">
                      {t('featuredEvent')}
                    </span>
                    <h2 className="mt-3 font-serif text-3xl font-light text-light-text md:text-4xl">
                      {featuredEvent.title}
                    </h2>
                    <div className="mt-4 flex items-center gap-4 font-sans text-xs text-light-text-secondary">
                      <span>{featuredEvent.date}</span>
                      {featuredEvent.location && (
                        <>
                          <span className="h-[0.5px] w-4 bg-gold-dark/30" />
                          <span>{featuredEvent.location}</span>
                        </>
                      )}
                    </div>
                    {featuredEvent.description && (
                      <p className="mt-6 font-sans text-sm font-light leading-relaxed text-light-text-secondary">
                        {featuredEvent.description}
                      </p>
                    )}
                    {featuredEvent.slug && (
                      <div className="mt-8">
                        <Link
                          href={`/insights/events/${featuredEvent.slug}`}
                          className="inline-flex items-center gap-2 border border-light-text/20 px-6 py-3 font-sans text-xs uppercase tracking-widest text-light-text transition-all duration-300 hover:border-gold hover:text-gold"
                        >
                          {t('viewEventDetails')}
                          <span className="text-gold-dark/50">›</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>
        )}

        {/* All Events — horizontal card list, white background */}
        <section className="border-t border-light-border bg-white py-24">
          <div className="mx-auto max-w-7xl px-6">
            <FadeIn>
              <p className="font-sans text-xs uppercase tracking-widest text-gold-dark">
                {t('allEventsOverline')}
              </p>
              <h2 className="mt-4 font-serif text-3xl font-light text-light-text">
                {t('allEventsTitle')}
              </h2>
              <div className="mt-4 h-[0.5px] w-10 bg-gold-dark" />
            </FadeIn>

            <div className="mt-12 space-y-4">
              {events.map((event, i) => (
                <FadeIn key={event.slug || i} delay={i * 0.08}>
                  <Link
                    href={`/insights/events/${event.slug}`}
                    className="group flex min-h-[160px] border border-light-border bg-white shadow-sm transition-all duration-[450ms] hover:border-gold/30 hover:shadow-md sm:min-h-[180px]"
                  >
                    {/* Image — fixed width column */}
                    <div className="relative w-40 shrink-0 overflow-hidden sm:w-56 md:w-72">
                      {event.image ? (
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover object-top transition-transform duration-700 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 160px, (max-width: 768px) 224px, 288px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-light-bg">
                          <span className="font-serif text-base text-light-text-secondary">
                            {event.title}
                          </span>
                        </div>
                      )}
                      {/* Status badge */}
                      <div className="absolute left-3 top-3">
                        <span className="border border-light-border bg-white/90 px-2 py-1 font-sans text-[9px] uppercase tracking-widest text-gold-dark backdrop-blur-sm">
                          {event.status === 'past'
                            ? t('pastEvent')
                            : t('upcoming')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-center p-5 sm:p-7 md:p-10">
                      <div className="flex flex-wrap items-center gap-3 font-sans text-xs text-light-text-secondary">
                        <span>{event.date}</span>
                        {event.location && (
                          <>
                            <span className="h-[0.5px] w-3 bg-gold-dark/30" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                      <h3 className="mt-2 font-serif text-xl font-light text-light-text transition-colors duration-300 group-hover:text-gold-dark md:text-2xl">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-2 font-sans text-sm font-light leading-relaxed text-light-text-secondary line-clamp-2">
                          {event.description}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-2 font-sans text-xs uppercase tracking-widest text-gold-dark transition-all duration-300 group-hover:gap-3">
                        {t('viewDetails')}
                        <span>›</span>
                      </span>
                    </div>
                  </Link>
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
