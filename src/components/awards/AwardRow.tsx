'use client'

import { useState } from 'react'
import Image from 'next/image'

interface AwardRowProps {
  year: string
  org: string
  title: string
  context: string
  images?: { src: string; alt: string }[]
}

export default function AwardRow({ year, org, title, context, images }: AwardRowProps) {
  const [open, setOpen] = useState(false)

  const hasDetails = org || context || (images && images.length > 0)

  return (
    <div
      className={`border bg-white shadow-sm transition-all duration-[450ms] ${
        open ? 'border-gold/30 shadow-md' : 'border-light-border hover:border-gold/20 hover:shadow-md'
      }`}
    >
      {/* Always-visible row — clickable if there are details */}
      <button
        onClick={() => hasDetails && setOpen((v) => !v)}
        className={`grid w-full gap-6 p-8 text-left md:grid-cols-[auto_1fr_auto] md:p-10 ${
          hasDetails ? 'cursor-pointer' : 'cursor-default'
        }`}
        aria-expanded={open}
      >
        {/* Year */}
        <div className="flex flex-col items-start justify-start md:items-center">
          <span className="font-serif text-5xl font-light text-gold-dark">
            {year}
          </span>
          <div className="mt-2 h-[0.5px] w-8 bg-gold-dark/30" />
        </div>

        {/* Title + org preview */}
        <div className="text-left">
          {org && (
            <p className="font-sans text-xs uppercase tracking-widest text-gold-dark/70">
              {org}
            </p>
          )}
          <h2 className={`font-serif text-2xl font-light text-light-text md:text-3xl ${org ? 'mt-3' : ''}`}>
            {title}
          </h2>
          {!open && context && (
            <p className="mt-2 font-sans text-xs font-light text-light-text-secondary/60 line-clamp-1">
              {context}
            </p>
          )}
        </div>

        {/* Expand chevron */}
        {hasDetails && (
          <div className="flex items-center self-start pt-1 md:self-center md:pt-0">
            <span
              className={`text-gold-dark/50 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        )}
      </button>

      {/* Expanded details */}
      {open && (
        <div className="border-t border-light-border/60 px-8 pb-8 pt-6 md:px-10 md:pb-10">
          {org && (
            <div className="mb-4">
              <span className="font-sans text-[10px] uppercase tracking-widest text-gold-dark/50">
                Awarding Organisation
              </span>
              <p className="mt-1 font-sans text-sm font-medium text-light-text">
                {org}
              </p>
            </div>
          )}
          {context && (
            <p className="font-sans text-sm font-light leading-relaxed text-light-text-secondary">
              {context}
            </p>
          )}
          {images && images.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {images.map((img) => (
                <div
                  key={img.src}
                  className="overflow-hidden rounded border border-light-border"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={400}
                    height={300}
                    className="h-auto max-h-80 w-full object-contain sm:w-80"
                    sizes="(max-width: 640px) 100vw, 320px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
