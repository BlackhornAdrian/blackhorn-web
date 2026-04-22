import { defineField, defineType, defineArrayMember } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'scamNotice',
      title: 'Scam / Fraud Notice',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'showScamBanner',
      title: 'Show Scam Banner',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'careersMessage',
      title: 'Careers — No Positions Message',
      description: 'Shown on the Careers page when there are no open positions',
      type: 'string',
    }),
    defineField({
      name: 'careersMessage_zh',
      title: 'Careers — No Positions Message (Chinese)',
      type: 'string',
    }),
    // ── Investor Gate Bottom Sheet ──────────────────────────────────
    defineField({
      name: 'investorGateTitle',
      title: 'Investor Gate — Title',
      description: 'Heading shown on the investor disclaimer bottom sheet (e.g. "Important Notice")',
      type: 'string',
    }),
    defineField({
      name: 'investorGateTitle_zh',
      title: 'Investor Gate — Title (Chinese)',
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
      name: 'investorGateBody_zh',
      title: 'Investor Gate — Disclaimer Text (Chinese)',
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
      name: 'investorGateRegulatory_zh',
      title: 'Investor Gate — Regulatory Text (Chinese)',
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
    defineField({
      name: 'investorGateScamAlert_zh',
      title: 'Investor Gate — Scam Alert Text (Chinese)',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'investorGateEnabled',
      title: 'Investor Gate — Enabled',
      description: 'Toggle the investor disclaimer bottom sheet on/off',
      type: 'boolean',
      initialValue: true,
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
            prepare({ title, key }) {
              return { title: title || key || 'Service Card' }
            },
          },
        }),
      ],
    }),
    // ── Page Hero Images ─────────────────────────────────────────
    defineField({
      name: 'heroImages',
      title: 'Page Hero Images',
      description: 'Upload hero/banner images for each page.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'pageKey',
              type: 'string',
              title: 'Page',
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
                  { title: 'Careers', value: 'careers' },
                  { title: 'Insights & Media', value: 'insights' },
                  { title: 'Contact', value: 'contact' },
                ],
              },
            }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Hero Image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
            }),
          ],
          preview: {
            select: { pageKey: 'pageKey', media: 'image' },
            prepare({ pageKey, media }) {
              return { title: pageKey ?? 'Unknown page', media }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Site Settings' }),
  },
})
