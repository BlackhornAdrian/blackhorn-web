import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'service',
  title: 'Service',
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
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'For homepage cards and previews',
    }),
    defineField({
      name: 'icon',
      title: 'Icon Character',
      type: 'string',
      description: 'Unicode character used as icon, e.g. "›"',
    }),
    defineField({
      name: 'content',
      title: 'Full Page Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'features',
      title: 'Key Features / Bullet Points',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
          ],
        },
      ],
    }),
    // ── Advisory Team (Family Office) ──────────────────────────────
    defineField({
      name: 'advisoryTeamName',
      title: 'Advisory Team — Name',
      description: 'e.g. "Peter Tsang" (shown on Family Office page)',
      type: 'string',
    }),
    defineField({
      name: 'advisoryTeamBio',
      title: 'Advisory Team — Bio',
      type: 'text',
      rows: 4,
    }),
    // ── Infographic / Platform Image ────────────────────────────────
    defineField({
      name: 'infographicImage',
      title: 'Infographic / Platform Overview Image',
      description: 'E.g. Family Office structure diagram or CTFS Ecosystem platform overview',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'infographicAlt',
      title: 'Infographic Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'infographicLabel',
      title: 'Infographic Section Label',
      description: 'Heading above the infographic (e.g. "CTF Platform Overview")',
      type: 'string',
    }),
    defineField({
      name: 'infographicLabel_zh',
      title: 'Infographic Section Label (Chinese)',
      type: 'string',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'bodyFontSize',
      title: 'Body Text Size',
      description: 'Controls the font size of the main page content',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium (Default)', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'infographicSize',
      title: 'Infographic Display Size',
      description: 'Controls how large the infographic appears on the page',
      type: 'string',
      options: {
        list: [
          { title: 'Small (400px)', value: 'small' },
          { title: 'Medium (600px)', value: 'medium' },
          { title: 'Large (800px)', value: 'large' },
          { title: 'Full Width', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
    // ── Ecosystem Partner Logos (CTFS Ecosystem page) ──────────────
    defineField({
      name: 'ecosystemPartners',
      title: 'Ecosystem Partner Logos',
      description: 'Logos with links for the CTFS Ecosystem page partner grid',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              type: 'string',
              title: 'Partner Name',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'logo',
              type: 'image',
              title: 'Logo',
              options: { hotspot: true },
            }),
            defineField({
              name: 'url',
              type: 'url',
              title: 'Website URL',
              description: 'External link to partner website',
            }),
          ],
          preview: {
            select: { title: 'name', media: 'logo' },
          },
        }),
      ],
    }),
    defineField({
      name: 'ecosystemPartnersLabel',
      title: 'Ecosystem Partners Section Label',
      description: 'Heading above the partner logos grid (e.g. "Our Ecosystem Partners")',
      type: 'string',
    }),
    defineField({
      name: 'ecosystemPartnersLabel_zh',
      title: 'Ecosystem Partners Section Label (Chinese)',
      type: 'string',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),

    // ── Chinese translations ──────────────────────────────────────────
    defineField({
      name: 'title_zh',
      title: 'Title (Chinese)',
      type: 'string',
      fieldset: 'chinese',
    }),
    defineField({
      name: 'shortDescription_zh',
      title: 'Short Description (Chinese)',
      type: 'text',
      rows: 3,
      fieldset: 'chinese',
    }),
    defineField({
      name: 'content_zh',
      title: 'Full Page Content (Chinese)',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
      fieldset: 'chinese',
    }),
    defineField({
      name: 'features_zh',
      title: 'Key Features (Chinese)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', type: 'string', title: 'Title' },
            { name: 'description', type: 'text', title: 'Description', rows: 2 },
          ],
        },
      ],
      fieldset: 'chinese',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
})
