import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ourVision',
  title: 'Our Vision',
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
      name: 'heroLabel',
      title: 'Hero Label',
      type: 'text',
      rows: 1,
    }),
    defineField({
      name: 'heroMessage',
      title: 'Hero Message',
      type: 'text',
      rows: 1,
    }),
    defineField({
      name: 'heroSubText',
      title: 'Hero Sub Text',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'content',
      title: 'Page Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      description: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    // ── Chinese translations ──────────────────────────────────────────
    defineField({
      name: 'heroLabel_zh',
      title: 'Hero Label (Chinese)',
      type: 'text',
      fieldset: 'chinese',
      rows: 1,
    }),
    defineField({
      name: 'heroMessage_zh',
      title: 'Hero Message (Chinese)',
      type: 'text',
      fieldset: 'chinese',
      rows: 1,
    }),
    defineField({
      name: 'heroSubText_zh',
      title: 'Hero Sub Text (Chinese)',
      type: 'text',
      fieldset: 'chinese',
      rows: 4,
    }), 
    defineField({
      name: 'content_zh',
      title: 'Page Content',
      type: 'array',
      of: [{ type: 'block' }],
      fieldset: 'chinese',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Our Vision' }
    },
  },
})
