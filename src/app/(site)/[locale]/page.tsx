import { getLocale } from 'next-intl/server'
import Hero from '@/components/home/Hero'
import TrustBar from '@/components/home/TrustBar'
import WhatWeOffer from '@/components/home/WhatWeOffer'
import Awards from '@/components/home/Awards'
import ContactCTA from '@/components/home/ContactCTA'
import { OrganizationJsonLd, FinancialServiceJsonLd } from '@/components/seo/JsonLd'
import { fetchSiteSettings, getHeroImage } from '@/lib/sanity/fetch'
import { localized } from '@/lib/i18n-utils'

export default async function Home() {
  const locale = await getLocale()
  // Fetch site settings from Sanity — components fall back to hardcoded if null
  const settings = await fetchSiteSettings()

  // Pick the correct locale version of CMS fields (_zh for Chinese, fallback to English)
  const heading = localized(settings, 'heroHeading', locale) || undefined
  const subtext = localized(settings, 'heroSubtext', locale) || undefined
  const missionStatement = localized(settings, 'missionStatement', locale) || undefined
  const heroImage = getHeroImage(settings, 'home')

  return (
    <>
      <OrganizationJsonLd />
      <FinancialServiceJsonLd />
      <main>
        <Hero
          heading={heading}
          subtext={subtext}
          missionStatement={missionStatement}
          heroImage={heroImage}
          showCtfsSubsidiary={settings?.showCtfsSubsidiary !== false}
        />
        <TrustBar cmsStats={settings?.trustBarStats} />
        <WhatWeOffer />
        <Awards />
        <ContactCTA />
      </main>
    </>
  )
}
