'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'blackhorn_investor_accepted'
const ACCEPT_DURATION_MS = 1 * 60 * 60 * 1000 // 1 hour

export interface InvestorGateCMSData {
  enabled?: boolean
  title?: string
  body?: string
  regulatory?: string
  scamAlert?: string
}

export default function InvestorGateBottomSheet({
  cms,
}: {
  cms?: InvestorGateCMSData
}) {
  const t = useTranslations('investorDisclaimer')
  const [show, setShow] = useState(false)

  // CMS can disable the gate entirely
  const enabled = cms?.enabled ?? true

  // CMS content with i18n fallbacks
  const title = cms?.title || t('title')
  const body = cms?.body || t('body')
  const regulatory = cms?.regulatory || t('regulatory')
  const scamAlert = cms?.scamAlert || t('scamAlertBody')

  useEffect(() => {
    if (!enabled) return
    const accepted = localStorage.getItem(STORAGE_KEY)
    if (accepted) {
      const acceptedAt = parseInt(accepted, 10)
      if (Date.now() - acceptedAt < ACCEPT_DURATION_MS) return
    }
    setShow(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [enabled])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, Date.now().toString())
    document.body.style.overflow = ''
    setShow(false)
  }

  const handleDecline = () => {
    window.location.href = 'https://www.google.com'
  }

  if (!enabled) return null

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[99] bg-dark/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[100]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="investor-gate-title"
          >
            <div className="flex max-h-[90vh] flex-col overflow-hidden border-t border-gold/20 bg-dark-900 shadow-[0_-20px_60px_rgba(0,0,0,0.6)]">
              {/* Header */}
              <div className="flex-shrink-0 border-b border-gold/10 px-6 py-5 sm:px-10">
                <div className="mx-auto flex max-w-4xl items-center gap-3">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 40 40"
                    fill="none"
                    className="flex-shrink-0 text-gold"
                  >
                    <circle
                      cx="20"
                      cy="20"
                      r="18"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                    />
                    <path
                      d="M20 8c0 0-8 6-8 16c0 2 0.5 4 1.5 5.5C15 31 17.5 32 20 32s5-1 6.5-2.5C27.5 28 28 26 28 24c0-10-8-16-8-16z"
                      fill="currentColor"
                      opacity="0.85"
                    />
                  </svg>
                  <div>
                    <h2
                      id="investor-gate-title"
                      className="font-serif text-lg font-light text-light"
                    >
                      {title}
                    </h2>
                    <p className="font-sans text-[10px] uppercase tracking-widest text-gold/60">
                      {t('subtitle')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body — scrollable on short screens */}
              <div className="overflow-y-auto px-6 py-6 sm:px-10">
                <div className="mx-auto max-w-4xl">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Disclaimer column */}
                    <div>
                      <p className="font-sans text-sm leading-relaxed text-white/70">
                        {body}
                      </p>
                      <div className="mt-4 border-l-2 border-gold/20 pl-4">
                        <p className="font-sans text-xs leading-relaxed text-white/50">
                          {regulatory}
                        </p>
                      </div>
                    </div>

                    {/* Scam alert column */}
                    <div className="border-t border-gold/10 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
                      <div className="mb-3 flex items-center gap-2">
                        <svg
                          className="h-4 w-4 flex-shrink-0 text-gold"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p className="font-sans text-xs font-medium uppercase tracking-widest text-gold">
                          {t('scamAlertTitle')}
                        </p>
                      </div>
                      <p className="font-sans text-sm leading-relaxed text-white/70">
                        {scamAlert}
                      </p>
                      <p className="mt-3 font-sans text-xs leading-relaxed text-white/50">
                        {t('scamAlertVerify')}{' '}
                        <a
                          href="tel:+85227091388"
                          className="text-gold/60 transition-colors hover:text-gold"
                        >
                          (852) 2709 1388
                        </a>{' '}
                        {t('scamAlertOr')}{' '}
                        <a
                          href="mailto:info@blackhorngrp.com"
                          className="text-gold/60 transition-colors hover:text-gold"
                        >
                          info@blackhorngrp.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col items-center gap-4 border-t border-gold/10 pt-6 sm:flex-row sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        onClick={handleAccept}
                        className="bg-gold px-8 py-3 font-sans text-xs uppercase tracking-widest text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
                      >
                        {t('accept')}
                      </button>
                      <button
                        onClick={handleDecline}
                        className="border border-white/15 px-8 py-3 font-sans text-xs uppercase tracking-widest text-white/50 transition-all duration-300 hover:border-white/30 hover:text-white/70"
                      >
                        {t('decline')}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-[11px] text-white/30">
                      <Link
                        href="/disclaimer"
                        className="transition-colors hover:text-gold/60"
                      >
                        {t('linkDisclaimer')}
                      </Link>
                      <Link
                        href="/privacy-policy"
                        className="transition-colors hover:text-gold/60"
                      >
                        {t('privacyPolicy')}
                      </Link>
                      <Link
                        href="/important-notice"
                        className="transition-colors hover:text-gold/60"
                      >
                        {t('linkImportantNotice')}
                      </Link>
                    </div>
                  </div>

                  {/* Cookie + copyright footer */}
                  <p className="mt-4 font-sans text-[10px] leading-relaxed text-white/20">
                    {t('cookieNotice')}{' '}
                    <Link
                      href="/privacy-policy"
                      className="text-gold/30 underline underline-offset-2 transition-colors hover:text-gold/50"
                    >
                      {t('privacyPolicy')}
                    </Link>
                    . {t('footer')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
