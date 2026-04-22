import type { Metadata } from 'next'
import Link from 'next/link'
import { getLocale, getTranslations } from 'next-intl/server'
import { PortableTextBlock } from '@portabletext/react'
import ServicePageLayout from '@/components/services/ServicePageLayout'
import ServicePortableText from '@/components/services/ServicePortableText'
import { fetchSiteSettings, fetchServiceBySlug, getHeroImage } from '@/lib/sanity/fetch'
import { localized, localizedBlocks } from '@/lib/i18n-utils'

export const metadata: Metadata = {
  title: 'CTFS Ecosystem | Blackhorn Wealth Management',
  description:
    'Blackhorn is an integral member of the CTF Group ecosystem, leveraging the Group\'s diversified business platform to deliver differentiated and integrated wealth management solutions.',
}

export default async function CTFSEcosystemPage() {
  const locale = await getLocale()
  const tHub = await getTranslations('servicesHub')
  const tHome = await getTranslations('homepage')
  const settings = await fetchSiteSettings()
  const heroImage = getHeroImage(settings, 'services-ctfs-ecosystem')
  const service = await fetchServiceBySlug('ctfs-ecosystem')

  // Use Full Page Content (Portable Text) from Sanity
  const richContent = localizedBlocks(service, 'content', locale) as
    | PortableTextBlock[]
    | undefined

  // Build accordion items from CMS features
  const cmsFeatures =
    locale === 'zh-hant' && service?.features_zh?.length
      ? service.features_zh
      : service?.features?.length
        ? service.features
        : null

  const accordionItems = cmsFeatures
    ? cmsFeatures.map((f: { title: string; description: string }) => ({ title: f.title, content: f.description }))
    : undefined

  // Ecosystem partners
  const ecosystemPartnersLabel =
    locale === 'zh-hant' && service?.ecosystemPartnersLabel_zh
      ? service.ecosystemPartnersLabel_zh
      : service?.ecosystemPartnersLabel || 'Our Ecosystem Partners'
  const ecosystemPartners = service?.ecosystemPartners

  // Infographic
  const infographicUrl =
    service?.infographicUrl || '/images/services/ctfs-ecosystem.jpg'
  const infographicAlt =
    service?.infographicAlt ||
    'CTFS Ecosystem — CTF Group business platform overview'
  const infographicLabel =
    locale === 'zh-hant' && service?.infographicLabel_zh
      ? service.infographicLabel_zh
      : service?.infographicLabel || 'CTF Platform Overview'

  return (
    <ServicePageLayout
      title={localized(service, 'title', locale) || tHome('ctfsEcosystemTitle')}
      overline={tHub('overline')}
      subtitle={localized(service, 'shortDescription', locale) || tHome('ctfsEcosystemDesc')}
      currentSlug="ctfs-ecosystem"
      heroImageSrc={heroImage?.src}
      heroImageContain={true}
      accordionItems={accordionItems}
      infographicUrl={infographicUrl}
      infographicLabel={infographicLabel}
      infographicAlt={infographicAlt}
      infographicSize={service?.infographicSize}
      bodyFontSize={service?.bodyFontSize}
      ecosystemPartners={ecosystemPartners}
      ecosystemPartnersLabel={ecosystemPartnersLabel}
    >
      {richContent ? (
        <ServicePortableText value={richContent} />
      ) : (
        <>
          <p>
            Blackhorn is an integral member of the CTF Group ecosystem, leveraging
            the Group&apos;s diversified business platform to deliver differentiated
            and integrated wealth management solutions.
          </p>

          <p>
            By tapping into CTF Group&apos;s extensive network, Blackhorn actively
            explores cross-selling and referral opportunities across the ecosystem
            to enhance customer value and broaden service offerings.
          </p>

          <h2 className="pt-4 font-serif text-2xl font-light text-light-text">
            CTF Life CIRCLE Membership Programme
          </h2>
          <p>
            In alignment with the Group&apos;s customer-centric strategy, CTF Life
            has launched the &ldquo;CTF Life CIRCLE&rdquo; Membership Programme,
            which provides customers with a wide range of curated experiences,
            lifestyle privileges, and access to membership alliances through
            partnerships with other CTF Group businesses. This initiative
            strengthens customer engagement and reinforces the ecosystem-driven
            value proposition of the CTF Group.
          </p>

          <div className="my-8 border border-gold-dark/20 bg-gold/[0.04] p-8 text-center">
            <p className="font-serif text-lg font-light text-light-text">
              Discover the CTF Group ecosystem advantage.
            </p>
            <p className="mt-3 font-sans text-sm text-light-text-secondary">
              Contact us to learn how Blackhorn&apos;s position within the CTF Group
              can benefit your wealth management needs.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center justify-center bg-gold px-8 py-3 font-sans text-xs uppercase tracking-widest text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
            >
              Get in Touch
            </Link>
          </div>
        </>
      )}
    </ServicePageLayout>
  )
}
