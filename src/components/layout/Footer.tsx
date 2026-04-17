import Link from 'next/link'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { SITE_CONFIG } from '@/lib/constants'
import { fetchSiteSettings } from '@/lib/sanity/fetch'

export default async function Footer() {
  const t = await getTranslations('footer')
  const tc = await getTranslations('common')
  const settings = await fetchSiteSettings()
  const showCtfsSubsidiary = settings?.showCtfsSubsidiary !== false

  const legalLinks = [
    { href: '/disclaimer', label: t('disclaimer') },
    { href: '/terms-and-conditions', label: t('termsAndConditions') },
    { href: '/complaint-handling', label: t('complaintHandling') },
    { href: '/privacy-policy', label: t('privacyPolicy') },
    { href: '/important-notice', label: t('importantNotice') },
  ]

  return (
    <footer className="border-t border-gold/8 bg-dark-section px-6 py-12 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row md:items-start">
        <div>
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo/blackhorn-logo-dark-en-transparent.png"
              alt="Blackhorn Wealth Management"
              width={250}
              height={57}
              className="h-10 w-auto object-contain"
            />
          </div>
          <p className="mt-3 font-sans text-[11px] text-white/20">
            {SITE_CONFIG.license}
          </p>
          {showCtfsSubsidiary && (
            <p className="mt-1 font-sans text-[11px] font-medium text-gold">
              {t('ctfsSubsidiary')}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-3 md:items-end">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 md:justify-end">
            {legalLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-4">
                {i > 0 && <span className="text-white/40">&middot;</span>}
                <Link
                  href={link.href}
                  className="font-sans text-xs text-white transition-colors duration-300 hover:text-gold"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
          <p className="font-sans text-[11px] text-white/20">
            &copy; {new Date().getFullYear()} {tc('companyName')}
            {' '}Limited. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  )
}
