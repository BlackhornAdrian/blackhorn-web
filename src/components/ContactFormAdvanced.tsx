'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface AdvancedFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  existingClient: string
  investorType: string
  servicesOfInterest: string[]
  investmentAmount: string
  referralSource: string
  message: string
}

const initialData: AdvancedFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  existingClient: '',
  investorType: '',
  servicesOfInterest: [],
  investmentAmount: '',
  referralSource: '',
  message: '',
}

export default function ContactFormAdvanced() {
  const t = useTranslations('contact')
  const tc = useTranslations('common')

  const [form, setForm] = useState<AdvancedFormData>(initialData)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const investorTypes = [
    { value: 'Individual', label: t('investorTypeOptions.individual') },
    { value: 'Family Office', label: t('investorTypeOptions.familyOffice') },
    { value: 'Institutional', label: t('investorTypeOptions.institutional') },
    { value: 'Financial Advisor', label: t('investorTypeOptions.financialAdvisor') },
    { value: 'Other', label: t('investorTypeOptions.other') },
  ]

  const serviceOptions = [
    { value: 'Portfolio Management', label: t('servicePortfolioManagement') },
    { value: 'Family Office', label: t('serviceFamilyOffice') },
    { value: 'Deal Sourcing', label: t('serviceDealSourcing') },
    { value: 'Legacy Planning', label: t('serviceLegacyPlanning') },
    { value: 'Real Estate & Financing', label: t('serviceRealEstateFinancing') },
    { value: 'Other', label: t('serviceOther') },
  ]

  const investmentAmounts = [
    { value: 'Below USD 1M', label: t('investmentAmountOptions.below1m') },
    { value: 'USD 1M – 5M', label: t('investmentAmountOptions.1mTo5m') },
    { value: 'USD 5M – 20M', label: t('investmentAmountOptions.5mTo20m') },
    { value: 'USD 20M – 50M', label: t('investmentAmountOptions.20mTo50m') },
    { value: 'Above USD 50M', label: t('investmentAmountOptions.above50m') },
    { value: 'Prefer not to say', label: t('investmentAmountOptions.preferNotToSay') },
  ]

  const referralSources = [
    { value: 'Referral', label: t('referralSourceOptions.referral') },
    { value: 'Search Engine', label: t('referralSourceOptions.searchEngine') },
    { value: 'Press / Media', label: t('referralSourceOptions.pressMedia') },
    { value: 'Event', label: t('referralSourceOptions.event') },
    { value: 'Social Media', label: t('referralSourceOptions.socialMedia') },
    { value: 'Other', label: t('referralSourceOptions.other') },
  ]

  function validate(): string | null {
    if (!form.firstName.trim()) return t('validation.firstNameRequired')
    if (!form.lastName.trim()) return t('validation.lastNameRequired')
    if (!form.email.trim()) return t('validation.emailRequired')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return t('validation.emailInvalid')
    if (!form.existingClient) return t('validation.existingClientRequired')
    if (!form.message.trim()) return t('validation.messageRequired')
    if (form.message.trim().length < 20)
      return t('validation.messageMinLength')
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    const validationError = validate()
    if (validationError) {
      setErrorMsg(validationError)
      return
    }

    setStatus('loading')

    // Build structured message body
    const parts: string[] = []
    parts.push(`--- Contact Form Submission ---`)
    parts.push(`Name: ${form.firstName} ${form.lastName}`)
    parts.push(`Email: ${form.email}`)
    if (form.phone) parts.push(`Phone: ${form.phone}`)
    if (form.company) parts.push(`Company: ${form.company}`)
    parts.push(`Existing Client: ${form.existingClient}`)
    if (form.investorType) parts.push(`Investor Type: ${form.investorType}`)
    if (form.servicesOfInterest.length > 0)
      parts.push(`Services of Interest: ${form.servicesOfInterest.join(', ')}`)
    if (form.investmentAmount)
      parts.push(`Investment Amount: ${form.investmentAmount}`)
    if (form.referralSource)
      parts.push(`Referral Source: ${form.referralSource}`)
    parts.push(``)
    parts.push(`--- Message ---`)
    parts.push(form.message)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          message: parts.join('\n'),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.message || t('validation.somethingWentWrong'))
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg(t('networkError'))
      setStatus('error')
    }
  }

  function update<K extends keyof AdvancedFormData>(
    field: K,
    value: AdvancedFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleService(service: string) {
    setForm((prev) => ({
      ...prev,
      servicesOfInterest: prev.servicesOfInterest.includes(service)
        ? prev.servicesOfInterest.filter((s) => s !== service)
        : [...prev.servicesOfInterest, service],
    }))
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <span className="text-xl text-emerald-500">&#10003;</span>
        </div>
        <h3 className="font-serif text-2xl font-light text-light-text">
          {t('thankYou')}
        </h3>
        <p className="mt-3 max-w-sm font-sans text-sm font-light text-light-text-secondary">
          {t('successFollowUp')}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Section 1 — About You */}
      <div>
        <h3 className="font-serif text-xl font-light text-light-text">
          {t('aboutYou')}
        </h3>
        <p className="mt-1 font-sans text-sm text-light-text-secondary">
          {t('aboutYouDesc')}
        </p>
        <Separator />

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label={t('firstName')}
              value={form.firstName}
              onChange={(v) => update('firstName', v)}
              required
            />
            <InputField
              label={t('lastName')}
              value={form.lastName}
              onChange={(v) => update('lastName', v)}
              required
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <InputField
              label={t('email')}
              type="email"
              value={form.email}
              onChange={(v) => update('email', v)}
              required
            />
            <InputField
              label={t('phone')}
              type="tel"
              value={form.phone}
              onChange={(v) => update('phone', v)}
            />
          </div>
          <InputField
            label={t('companyOrg')}
            value={form.company}
            onChange={(v) => update('company', v)}
          />
        </div>
      </div>

      {/* Section 2 — Your Interest */}
      <div>
        <h3 className="font-serif text-xl font-light text-light-text">
          {t('yourInterest')}
        </h3>
        <p className="mt-1 font-sans text-sm text-light-text-secondary">
          {t('yourInterestDesc')}
        </p>
        <Separator />

        <div className="space-y-6">
          {/* Existing client */}
          <div>
            <label className="font-sans text-xs uppercase tracking-wide text-gold-dark">
              {t('existingClient')}
              <span className="ml-0.5 text-gold-dark/50">*</span>
            </label>
            <div className="mt-3 flex gap-4">
              {[{ value: 'Yes', label: t('existingClientYes') }, { value: 'No', label: t('existingClientNo') }].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('existingClient', opt.value)}
                  className={`border px-6 py-2.5 font-sans text-sm transition-all duration-300 ${
                    form.existingClient === opt.value
                      ? 'border-gold bg-gold/10 text-gold-dark'
                      : 'border-light-border text-light-text-secondary hover:border-gold/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Investor type */}
          <SelectField
            label={t('investorType')}
            value={form.investorType}
            onChange={(v) => update('investorType', v)}
            options={investorTypes}
            placeholder={tc('select')}
          />

          {/* Services of interest */}
          <div>
            <label className="font-sans text-xs uppercase tracking-wide text-gold-dark">
              {t('servicesOfInterest')}
            </label>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {serviceOptions.map((service) => (
                <button
                  key={service.value}
                  type="button"
                  onClick={() => toggleService(service.value)}
                  className={`border px-4 py-2.5 text-left font-sans text-sm transition-all duration-300 ${
                    form.servicesOfInterest.includes(service.value)
                      ? 'border-gold bg-gold/10 text-gold-dark'
                      : 'border-light-border text-light-text-secondary hover:border-gold/40'
                  }`}
                >
                  {service.label}
                </button>
              ))}
            </div>
          </div>

          {/* Investment amount */}
          <SelectField
            label={t('investmentAmount')}
            value={form.investmentAmount}
            onChange={(v) => update('investmentAmount', v)}
            options={investmentAmounts}
            placeholder={tc('select')}
          />
        </div>
      </div>

      {/* Section 3 — Your Message */}
      <div>
        <h3 className="font-serif text-xl font-light text-light-text">
          {t('yourMessage')}
        </h3>
        <p className="mt-1 font-sans text-sm text-light-text-secondary">
          {t('yourMessageDesc')}
        </p>
        <Separator />

        <div className="space-y-5">
          <SelectField
            label={t('referralSource')}
            value={form.referralSource}
            onChange={(v) => update('referralSource', v)}
            options={referralSources}
            placeholder={tc('select')}
          />

          <div>
            <label className="font-sans text-xs uppercase tracking-wide text-gold-dark">
              {t('message')}
              <span className="ml-0.5 text-gold-dark/50">*</span>
            </label>
            <textarea
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              rows={5}
              className="mt-2 w-full resize-none border border-light-border bg-white px-4 py-3 font-sans text-sm font-light text-light-text outline-none transition-colors duration-300 placeholder:text-light-text-secondary/40 focus:border-gold focus:ring-1 focus:ring-gold/20"
              placeholder={t('messagePlaceholder')}
            />
          </div>
        </div>
      </div>

      {/* Section 4 — Submit */}
      <div>
        {errorMsg && (
          <p className="mb-4 font-sans text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center bg-gold px-10 py-3.5 font-sans text-xs uppercase tracking-widest text-dark transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {status === 'loading' ? t('sending') : t('submitEnquiry')}
        </button>

        <p className="mt-4 font-sans text-xs leading-relaxed text-light-text-secondary/60">
          {t('submitDisclaimerPrefix')}{' '}
          <Link
            href="/terms-and-conditions"
            className="text-gold-dark/60 underline transition-colors hover:text-gold-dark"
          >
            {t('termsAndConditions')}
          </Link>{' '}
          {t('and')}{' '}
          <Link
            href="/privacy-policy"
            className="text-gold-dark/60 underline transition-colors hover:text-gold-dark"
          >
            {t('privacyPolicy')}
          </Link>
          .
        </p>
      </div>
    </form>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Separator() {
  return (
    <div className="my-5 flex items-center justify-start">
      <div className="h-[0.5px] w-8 bg-gold-dark/30" />
    </div>
  )
}

function InputField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="font-sans text-xs uppercase tracking-wide text-gold-dark">
        {label}
        {required && <span className="ml-0.5 text-gold-dark/50">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-light-border bg-white px-4 py-3 font-sans text-sm font-light text-light-text outline-none transition-colors duration-300 placeholder:text-light-text-secondary/40 focus:border-gold focus:ring-1 focus:ring-gold/20"
      />
    </div>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <div>
      <label className="font-sans text-xs uppercase tracking-wide text-gold-dark">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border border-light-border bg-white px-4 py-3 font-sans text-sm font-light text-light-text outline-none transition-colors duration-300 focus:border-gold focus:ring-1 focus:ring-gold/20"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
