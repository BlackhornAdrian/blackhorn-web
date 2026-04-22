import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    {
      name: 'chinese',
      title: '中文 Chinese Translation',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Legal Name',
      type: 'string',
      initialValue: 'Blackhorn Wealth Management Limited',
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      initialValue: '+852 2709 1388',
    }),
    defineField({
      name: 'email',
      title: 'General Email',
      type: 'string',
      initialValue: 'info@blackhorngrp.com',
    }),
    defineField({
      name: 'careersEmail',
      title: 'Careers Email',
      type: 'string',
      initialValue: 'careers@blackhorngrp.com',
    }),
    defineField({
      name: 'complianceEmail',
      title: 'Compliance Email',
      type: 'string',
      initialValue: 'compliance@blackhorngrp.com',
    }),
    defineField({
      name: 'compliancePhone',
      title: 'Compliance Hotline',
      type: 'string',
      initialValue: '+852 2709 1568',
    }),
    defineField({
      name: 'address',
      title: 'Office Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'address_zh',
      title: 'Office Address (Chinese)',
      type: 'text',
      rows: 3,
      fieldset: 'chinese',
    }),
    defineField({
      name: 'sfcLicense',
      title: 'SFC License Number',
      type: 'string',
      initialValue: 'BNM924',
    }),
    defineField({
      name: 'sfcTypes',
      title: 'SFC License Types',
      type: 'string',
      initialValue: 'Type 4 & Type 9',
    }),
    defineField({
      name: 'showCtfsSubsidiary',
      title: 'Show "Subsidiary of CTFS" label',
      description: 'Toggle to show or hide the "Subsidiary of CTFS (HKEX stock code: 00659)" text on the homepage and footer',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Homepage Hero Heading',
      type: 'string',
      initialValue: 'Intelligent Solutions Beyond Simple Wealth Management',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Homepage Hero Subtext',
      type: 'string',
      initialValue: 'Independent Wealth Management',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'trustBarStats',
      title: 'Trust Bar Statistics',
      description: 'Homepage stats row. Values starting with a number (e.g. "200+", "$4Bn+") will animate; text values (e.g. "Type 4 & 9") display as-is.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              description: 'e.g. "200+", "$4Bn+", "Type 4 & 9"',
            },
            {
              name: 'label',
              type: 'string',
              title: 'Label (English)',
              description: 'e.g. "Years of Experience"',
            },
            {
              name: 'label_zh',
              type: 'string',
              title: 'Label (Chinese)',
              description: 'e.g. "豐富經驗"',
            },
          ],
          preview: {
            select: { value: 'value', label: 'label' },
            prepare({ value, label }: { value?: string; label?: string }) {
              return { title: `${value ?? '?'} — ${label ?? ''}` }
            },
          },
        },
      ],
    }),
    // ── Page Hero Images ─────────────────────────────────────────
    defineField({
      name: 'heroImages',
      title: 'Page Hero Images',
      description: 'Upload hero/banner images for each page. Rachel can swap these anytime without a code deploy.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'pageKey',
              type: 'string',
              title: 'Page',
              description: 'Which page this hero image belongs to',
              options: {
                list: [
                  { title: 'Homepage', value: 'home' },
                  { title: 'About', value: 'about' },
                  { title: 'About — Our Vision', value: 'about-our-vision' },
                  { title: 'About — Leadership / Our Team', value: 'about-leadership' },
                  { title: 'About — Our Location', value: 'about-our-location' },
                  { title: 'Awards', value: 'awards' },
                  { title: 'Services', value: 'services' },
                  { title: 'Services — Wealth Management', value: 'services-wealth-management' },
                  { title: 'Services — Family Office', value: 'services-family-office' },
                  { title: 'Services — Legacy Planning', value: 'services-estate-legacy' },
                  { title: 'Services — Deal Sourcing', value: 'services-deal-sourcing' },
                  { title: 'Services — Real Estate & Financing', value: 'services-real-estate' },
                  { title: 'Services — CTFS Ecosystem', value: 'services-ctfs-ecosystem' },
                  { title: 'Careers', value: 'careers' },
                  { title: 'Insights & Media', value: 'insights' },
                  { title: 'Insights — News', value: 'insights-news' },
                  { title: 'Insights — Events', value: 'insights-events' },
                  { title: 'Insights — Press & Coverage', value: 'insights-press' },
                  { title: 'Contact', value: 'contact' },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Hero Image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Brief description of the image for accessibility',
            }),
            defineField({
              name: 'heading',
              type: 'string',
              title: 'Hero Heading',
              description: 'Page hero heading (leave blank to use default)',
            }),
            defineField({
              name: 'heading_zh',
              type: 'string',
              title: 'Hero Heading (Chinese)',
            }),
            defineField({
              name: 'subtext',
              type: 'string',
              title: 'Hero Subtext',
              description: 'Page hero subheading / description (leave blank to use default)',
            }),
            defineField({
              name: 'subtext_zh',
              type: 'string',
              title: 'Hero Subtext (Chinese)',
            }),
          ],
          preview: {
            select: { pageKey: 'pageKey', media: 'image' },
            prepare({ pageKey, media }) {
              const labels: Record<string, string> = {
                home: 'Homepage',
                about: 'About',
                'about-our-vision': 'About — Our Vision',
                'about-leadership': 'About — Leadership',
                'about-our-location': 'About — Our Location',
                awards: 'Awards',
                services: 'Services',
                'services-wealth-management': 'Services — Wealth Mgmt',
                'services-family-office': 'Services — Family Office',
                'services-estate-legacy': 'Services — Legacy Planning',
                'services-deal-sourcing': 'Services — Deal Sourcing',
                'services-real-estate': 'Services — Real Estate',
                'services-ctfs-ecosystem': 'Services — CTFS Ecosystem',
                careers: 'Careers',
                insights: 'Insights & Media',
                'insights-news': 'Insights — News',
                'insights-events': 'Insights — Events',
                'insights-press': 'Insights — Press',
                contact: 'Contact',
              }
              return {
                title: labels[pageKey ?? ''] ?? pageKey ?? 'Unknown page',
                media,
              }
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'disclaimerText',
      title: 'Top Bar Disclaimer Text',
      type: 'string',
    }),
    defineField({
      name: 'fraudNoticeText',
      title: 'Fraud Notice Full Text',
      type: 'text',
      rows: 10,
    }),
    defineField({
      name: 'careersMessage',
      title: 'Careers — No Positions Message',
      description: 'Shown on the Careers page when there are no open job postings',
      type: 'string',
      initialValue: "We're hiring! We're always interested in hearing from exceptional talent.",
    }),

    // ── Investor Gate Bottom Sheet ──────────────────────────────────
    defineField({
      name: 'investorGateEnabled',
      title: 'Investor Gate — Enabled',
      description: 'Toggle the investor disclaimer bottom sheet on/off',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'investorGateTitle',
      title: 'Investor Gate — Title',
      description: 'Heading shown on the investor disclaimer bottom sheet (e.g. "Important Notice")',
      type: 'string',
    }),
    defineField({
      name: 'investorGateBody',
      title: 'Investor Gate — Disclaimer Text',
      description: 'Main disclaimer paragraph (e.g. "This website is intended for professional investors…")',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'investorGateRegulatory',
      title: 'Investor Gate — Regulatory Text',
      description: 'SFC licensing information shown below the disclaimer',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'investorGateScamAlert',
      title: 'Investor Gate — Scam Alert Text',
      description: 'Fraud warning text shown on the right side of the bottom sheet',
      type: 'text',
      rows: 3,
    }),

    // ── What We Offer Cards (Homepage) ────────────────────────────
    defineField({
      name: 'whatWeOfferCards',
      title: 'What We Offer — Service Cards',
      description: 'The 4 service cards shown on the homepage under "What We Offer". Edit titles and descriptions here.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              type: 'string',
              title: 'Card Key',
              description: 'Internal identifier (do not change)',
              options: {
                list: [
                  { title: 'Wealth Management', value: 'wealthManagement' },
                  { title: 'Family Office Advisory', value: 'familyOffice' },
                  { title: 'Legacy Planning', value: 'legacyPlanning' },
                  { title: 'CTFS Ecosystem', value: 'ctfsEcosystem' },
                ],
              },
            }),
            defineField({
              name: 'title',
              type: 'string',
              title: 'Card Title',
            }),
            defineField({
              name: 'title_zh',
              type: 'string',
              title: 'Card Title (Chinese)',
            }),
            defineField({
              name: 'description',
              type: 'text',
              title: 'Card Description',
              rows: 3,
            }),
            defineField({
              name: 'description_zh',
              type: 'text',
              title: 'Card Description (Chinese)',
              rows: 3,
            }),
          ],
          preview: {
            select: { title: 'title', key: 'key' },
            prepare({ title, key }: { title?: string; key?: string }) {
              return { title: title || key || 'Service Card' }
            },
          },
        }),
      ],
    }),

    // ── Chinese translations ──────────────────────────────────────────
    defineField({
      name: 'companyName_zh',
      title: 'Company Name (Chinese)',
      type: 'string',
      initialValue: '晉羚財富管理有限公司',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'heroHeading_zh',
      title: 'Homepage Hero Heading (Chinese)',
      type: 'string',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'heroSubtext_zh',
      title: 'Homepage Hero Subtext (Chinese)',
      type: 'string',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'missionStatement_zh',
      title: 'Mission Statement (Chinese)',
      type: 'text',
      rows: 4,
      fieldset: 'chinese',
    }),
    defineField({
      name: 'disclaimerText_zh',
      title: 'Top Bar Disclaimer Text (Chinese)',
      type: 'string',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'fraudNoticeText_zh',
      title: 'Fraud Notice Full Text (Chinese)',
      type: 'text',
      rows: 10,
      fieldset: 'chinese',
    }),
    defineField({
      name: 'careersMessage_zh',
      title: 'Careers — No Positions Message (Chinese)',
      type: 'string',
      initialValue: '我們正在招聘！我們一直歡迎優秀人才與我們聯繫。',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'investorGateTitle_zh',
      title: 'Investor Gate — Title (Chinese)',
      type: 'string',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'investorGateBody_zh',
      title: 'Investor Gate — Disclaimer Text (Chinese)',
      type: 'text',
      rows: 4,
      fieldset: 'chinese',
    }),
    defineField({
      name: 'investorGateRegulatory_zh',
      title: 'Investor Gate — Regulatory Text (Chinese)',
      type: 'text',
      rows: 3,
      fieldset: 'chinese',
    }),
    defineField({
      name: 'investorGateScamAlert_zh',
      title: 'Investor Gate — Scam Alert Text (Chinese)',
      type: 'text',
      rows: 3,
      fieldset: 'chinese',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
