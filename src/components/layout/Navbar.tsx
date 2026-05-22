'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

// ── Dropdown item configs ────────────────────────────────────────────────────

const aboutItems = [
  { href: '/about/our-vision', labelKey: 'ourVision', icon: '›' },
  { href: '/about/leadership', labelKey: 'ourTeam', icon: '›' },
  { href: '/awards', labelKey: 'ourAwards', icon: '›' },
  { href: '/about/our-location', labelKey: 'ourLocation', icon: '›' },
]

const serviceItems = [
  { href: '/services/wealth-management', labelKey: 'wealthManagement', icon: '›' },
  { href: '/services/family-office', labelKey: 'familyOfficeAdvisory', icon: '›' },
  { href: '/services/estate-legacy', labelKey: 'legacyPlanning', icon: '›' },
  { href: '/services/ctfs-ecosystem', labelKey: 'ctfsEcosystem', icon: '›' },
]

const insightsItems = [
  { href: '/insights/news', labelKey: 'newsInsights', icon: '›' },
  { href: '/insights/events', labelKey: 'events', icon: '›' },
  { href: '/insights/press', labelKey: 'pressCoverage', icon: '›' },
]

// Map dropdown key → items + footer link
const dropdownConfigs = {
  about: { items: aboutItems, footerHref: '/about', footerKey: 'viewAbout' },
  services: { items: serviceItems, footerHref: '/services', footerKey: 'viewAllServices' },
  insights: { items: insightsItems, footerHref: '/insights', footerKey: 'newsInsights' },
} as const

type DropdownKey = keyof typeof dropdownConfigs

export default function Navbar({ bannerVisible = false }: { bannerVisible?: boolean }) {
  const t = useTranslations('nav')
  const tc = useTranslations('common')

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()

  // Strip locale prefix for matching (e.g. /en/about → /about)
  const cleanPath = pathname.replace(/^\/(en|zh-hant)/, '') || '/'

  const navLinks: { href: string; label: string; hasDropdown?: DropdownKey }[] = [
    { href: '/about', label: t('about'), hasDropdown: 'about' },
    { href: '/services', label: t('services'), hasDropdown: 'services' },
    { href: '/insights', label: t('insightsMedia'), hasDropdown: 'insights' },
    { href: '/careers', label: t('careers') },
  ]

  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return cleanPath === '/'
      return cleanPath.startsWith(href)
    },
    [cleanPath]
  )

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown + mobile menu on route change
  useEffect(() => {
    setOpenDropdown(null)
    setMobileOpen(false)
  }, [pathname])

  // Lock body scroll when mobile menu is open; reset expanded state on close
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    if (!mobileOpen) setMobileExpanded(null)
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdown on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleDropdownEnter = (key: string) => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current)
    setOpenDropdown(key)
  }

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setOpenDropdown(null), 150)
  }

  // Render a dropdown panel for a given key
  function renderDropdown(key: DropdownKey) {
    const config = dropdownConfigs[key]
    return (
      <>
        <div className="p-2">
          {config.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-4 py-3 transition-colors duration-200 hover:bg-gold/[0.06] ${
                isActive(item.href) ? 'text-gold' : ''
              }`}
              role="menuitem"
            >
              <span className={`text-sm transition-colors duration-200 group-hover:text-gold ${
                isActive(item.href) ? 'text-gold' : 'text-gold/50'
              }`}>
                {item.icon}
              </span>
              <span className={`block font-sans text-xs font-medium transition-colors duration-200 group-hover:text-light ${
                isActive(item.href) ? 'text-gold' : 'text-light/80'
              }`}>
                {t(item.labelKey)}
              </span>
            </Link>
          ))}
        </div>
        <div className="border-t border-gold/8 p-2">
          <Link
            href={config.footerHref}
            className="flex items-center justify-center gap-2 px-4 py-2.5 font-sans text-[10px] uppercase tracking-widest text-gold transition-colors duration-200 hover:text-gold-light"
            role="menuitem"
          >
            {t(config.footerKey)} ›
          </Link>
        </div>
      </>
    )
  }

  // Render mobile sub-links for a given dropdown key
  function renderMobileSubLinks(key: DropdownKey) {
    const config = dropdownConfigs[key]
    return config.items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`font-sans text-sm transition-colors duration-300 hover:text-gold ${
          isActive(item.href) ? 'text-gold' : 'text-white/70'
        }`}
        role="menuitem"
      >
        {t(item.labelKey)}
      </Link>
    ))
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{ top: bannerVisible ? '36px' : '0px' }}
        className={`fixed z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'border-b border-gold/10 bg-dark-900'
            : 'border-b border-transparent bg-dark-900/80 backdrop-blur-md'
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 ${
            scrolled ? 'py-4' : 'py-7'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo/blackhorn-logo-dark-en-transparent.png"
              alt="Blackhorn Wealth Management"
              width={250}
              height={57}
              className="h-8 w-auto object-contain lg:h-10"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) =>
              link.hasDropdown ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(link.hasDropdown!)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={link.href}
                    className={`inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest transition-colors duration-300 hover:text-gold ${
                      isActive(link.href) ? 'text-gold' : 'text-white'
                    }`}
                    aria-haspopup="true"
                    aria-expanded={openDropdown === link.hasDropdown}
                  >
                    {link.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-300 ${
                        openDropdown === link.hasDropdown ? 'rotate-180' : ''
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </Link>

                  <AnimatePresence>
                    {openDropdown === link.hasDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-4"
                        role="menu"
                      >
                        <div className="border border-gold/10 bg-dark/95 backdrop-blur-xl">
                          {renderDropdown(link.hasDropdown)}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-sans text-xs uppercase tracking-widest transition-colors duration-300 hover:text-gold ${
                    isActive(link.href) ? 'text-gold' : 'text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            <div className="ml-2 mr-2">
              <LanguageSwitcher />
            </div>
            <Link
              href="/contact"
              className="bg-gold px-6 py-2.5 font-sans text-xs uppercase tracking-widest text-dark transition-all duration-300 hover:bg-gold-light"
            >
              {tc('bookConsultation')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
            aria-label={t('toggleMenu')}
          >
            <span
              className={`h-[1.5px] w-6 bg-gold transition-all duration-300 ${
                mobileOpen ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-gold transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`h-[1.5px] w-6 bg-gold transition-all duration-300 ${
                mobileOpen ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[55] overflow-y-auto bg-[#0A0A0F] lg:hidden"
          >
            <nav className="flex min-h-full flex-col items-center justify-center gap-6 px-6 py-16 sm:py-28">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.1 + i * 0.05,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="flex flex-col items-center"
                >
                  {link.hasDropdown ? (
                    <>
                      {/* Tappable header with chevron */}
                      <button
                        onClick={() =>
                          setMobileExpanded(
                            mobileExpanded === link.hasDropdown
                              ? null
                              : link.hasDropdown!
                          )
                        }
                        className={`inline-flex items-center gap-2 font-serif text-2xl font-light transition-colors duration-300 hover:text-gold ${
                          isActive(link.href) ? 'text-gold' : 'text-light'
                        }`}
                        aria-haspopup="true"
                        aria-expanded={mobileExpanded === link.hasDropdown}
                      >
                        {link.label}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`text-gold/50 transition-transform duration-300 ${
                            mobileExpanded === link.hasDropdown
                              ? 'rotate-180'
                              : ''
                          }`}
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>

                      {/* Expandable sub-links */}
                      <AnimatePresence>
                        {mobileExpanded === link.hasDropdown && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            className="overflow-hidden"
                            role="menu"
                          >
                            <div className="mt-3 flex flex-col items-center gap-2.5 pb-1">
                              {renderMobileSubLinks(link.hasDropdown)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`font-serif text-2xl font-light transition-colors duration-300 hover:text-gold ${
                        isActive(link.href) ? 'text-gold' : 'text-light'
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + navLinks.length * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 inline-block bg-gold px-8 py-3 font-sans text-xs uppercase tracking-widest text-dark transition-all duration-300 hover:bg-gold-light"
                >
                  {tc('bookConsultation')}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + (navLinks.length + 1) * 0.05,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4"
              >
                <LanguageSwitcher />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
